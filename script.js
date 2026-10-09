document.documentElement.classList.add('js');

const scrollTicker = document.querySelector('.ticker-track');
const tickerCycle = scrollTicker?.querySelector('.ticker-group');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let tickerFrame = 0;
let tickerCycleWidth = 0;

function syncScrollTicker() {
  tickerFrame = 0;
  if (!scrollTicker || !tickerCycle || reduceMotion.matches) return;
  tickerCycleWidth = tickerCycle.getBoundingClientRect().width;
  if (!tickerCycleWidth) return;
  const offset = (window.scrollY * 0.24) % tickerCycleWidth;
  scrollTicker.style.transform = `translate3d(-${offset}px, 0, 0)`;
}

function queueTickerSync() {
  if (!tickerFrame) tickerFrame = window.requestAnimationFrame(syncScrollTicker);
}

window.addEventListener('scroll', queueTickerSync, { passive: true });
window.addEventListener('resize', queueTickerSync, { passive: true });
syncScrollTicker();

const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open navigation');
  navLinks?.classList.remove('is-open');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navLinks?.classList.toggle('is-open', !isOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.querySelectorAll('.filter-chip').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
    document.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const contactForm = document.querySelector('#contactForm');
const contactFormStatus = document.querySelector('#contactFormStatus');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.innerHTML;
  const formFields = Object.fromEntries(new FormData(contactForm).entries());
  formFields._replyto = formFields.email;
  if (contactFormStatus) {
    contactFormStatus.hidden = true;
    contactFormStatus.textContent = '';
  }
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  }

  fetch(contactForm.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(formFields),
  })
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error(result.message || 'The message could not be sent.');
      }
      contactForm.reset();
      if (contactFormStatus) {
        contactFormStatus.textContent = 'Congrats! Your message was sent successfully. I’ll get back to you soon.';
        contactFormStatus.hidden = false;
      }
    })
    .catch((error) => {
      const details = error instanceof Error ? error.message : 'Please try again.';
      window.alert(`Your message could not be sent. Please try again or email abirahmedrahat18@gmail.com directly. ${details}`);
    })
    .finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText || 'Send a message';
      }
    });
});

const testimonialCards = [...document.querySelectorAll('.quote-card')];
const indexLabel = document.querySelector('#carouselIndex');
const totalLabel = document.querySelector('#carouselTotal');
let activeTestimonial = 0;

function showTestimonial(nextIndex) {
  if (!testimonialCards.length) return;
  activeTestimonial = (nextIndex + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, index) => {
    let offset = index - activeTestimonial;
    if (offset > testimonialCards.length / 2) offset -= testimonialCards.length;
    if (offset < -testimonialCards.length / 2) offset += testimonialCards.length;
    card.dataset.position = String(offset);
    const isActive = offset === 0;
    card.classList.toggle('is-active', isActive);
    card.setAttribute('aria-hidden', String(!isActive));
    card.inert = !isActive;
  });
  if (indexLabel) indexLabel.textContent = String(activeTestimonial + 1).padStart(2, '0');
  if (totalLabel) totalLabel.textContent = String(testimonialCards.length).padStart(2, '0');
}

document.querySelector('#testimonialPrev')?.addEventListener('click', () => showTestimonial(activeTestimonial - 1));
document.querySelector('#testimonialNext')?.addEventListener('click', () => showTestimonial(activeTestimonial + 1));
showTestimonial(0);

const testimonialRegion = document.querySelector('#testimonials');
let carouselTimer;

function startCarousel() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => showTestimonial(activeTestimonial + 1), 6500);
}

function stopCarousel() {
  window.clearInterval(carouselTimer);
}

testimonialRegion?.addEventListener('mouseenter', stopCarousel);
testimonialRegion?.addEventListener('mouseleave', startCarousel);
testimonialRegion?.addEventListener('focusin', stopCarousel);
testimonialRegion?.addEventListener('focusout', startCarousel);
startCarousel();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
