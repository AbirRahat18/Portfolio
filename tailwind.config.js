/**
 * Theme reference for projects that later move from the CDN build to Tailwind CLI.
 * The current static page configures the same theme in index.html.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: '#0b1424',
        lime: '#c6f36a',
        paper: '#f3f6fb',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['DM Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Sans', 'sans-serif'],
      },
    },
  },
};
