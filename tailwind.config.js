/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        blue:   { DEFAULT: '#2563eb', dark: '#1d4ed8', light: '#eff6ff' },
        green:  { DEFAULT: '#059669', dark: '#047857', light: '#ecfdf5' },
      },
    },
  },
  plugins: [],
};
