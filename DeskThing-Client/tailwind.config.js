/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '400px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        Wingding: ['Wingding', 'monospace'],
        geistMono: ['GeistMono', 'monospace'],
        THEBOLDFONT: ['THEBOLDFONT', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

