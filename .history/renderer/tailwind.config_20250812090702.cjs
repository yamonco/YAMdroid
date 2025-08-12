module.exports = {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ['synthwave'],
  },
  safelist: [
    'btn', 'btn-primary', 'btn-secondary',
    'bg-primary', 'text-primary-content', 'rounded-box'
  ],
};
