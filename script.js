document.documentElement.classList.add('js');

const siteHeader = document.querySelector('.site-header');
const updateHeaderTransparency = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
};

window.addEventListener('scroll', updateHeaderTransparency, { passive: true });
updateHeaderTransparency();

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

const filterButtons = [...document.querySelectorAll('.filter-chip')];
const projectCards = [...document.querySelectorAll('.project-card')];
const projectGrid = document.querySelector('#projectGrid');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    projectGrid?.classList.toggle('is-filtered', filter !== 'all');

    filterButtons.forEach((chip) => {
      const selected = chip === button;
      chip.classList.toggle('active', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });

    projectCards.forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.hidden = !shouldShow;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

const contactForm = document.querySelector('#contactForm');
const contactFormStatus = document.querySelector('#contactFormStatus');

function showFormStatus(message, state) {
  if (!contactFormStatus) return;
  contactFormStatus.textContent = message;
  contactFormStatus.dataset.state = state;
  contactFormStatus.hidden = false;
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const honeypot = contactForm.querySelector('[name="_honey"]');
  if (honeypot?.value) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.innerHTML;
  const fields = Object.fromEntries(new FormData(contactForm).entries());
  fields._replyto = fields.email;

  if (contactFormStatus) {
    contactFormStatus.hidden = true;
    contactFormStatus.textContent = '';
    delete contactFormStatus.dataset.state;
  }
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
  }

  try {
    const response = await fetch(contactForm.dataset.ajaxAction || contactForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(fields),
    });
    const result = await response.json().catch(() => ({}));
    const wasAccepted = result.success === true || result.success === 'true';

    if (!response.ok || !wasAccepted) {
      throw new Error(result.message || 'The message could not be sent.');
    }

    contactForm.reset();
    showFormStatus('FormSubmit accepted your message. If this is the first submission, check your Gmail Inbox and Spam for a form activation email, then confirm it to receive messages.', 'success');
  } catch (error) {
    const reason = error instanceof Error && error.message
      ? ` (${error.message})`
      : '';
    showFormStatus(`Your message could not be sent${reason}. Please email abirahmedrahat18@gmail.com directly.`, 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText || 'Send a message';
    }
  }
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

    const isActive = offset === 0;
    card.dataset.position = String(offset);
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
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopCarousel();
  else startCarousel();
});
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
