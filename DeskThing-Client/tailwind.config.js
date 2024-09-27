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
      keyframes: {
              float: {
                '0%': { transform: 'translate(0%, 10%)' },
                '50%': { transform: 'translate(10%, 0%)' },
                '100%': { transform: 'translate(0%, 10%)' },
              },
            },
      animation: {
        float: 'float 15s ease infinite;',
      }
      
    },
  },
  plugins: [],
}

