/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111111',
        foreground: '#EDEDED',
        secondary: '#A0A0A0',
        accent: '#FFFFFF',
        border: 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};