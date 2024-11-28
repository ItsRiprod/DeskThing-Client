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
              drop: {
                '0%': { transform: 'translateY(-25%)', opacity: '0' },
                '100%': { transform: 'translateY(0%)', opacity: '1' },
              },
              dropdelay: {
                '0%': { transform: 'translateY(-100%)', opacity: '0' },
                '50%': { transform: 'translateY(-100%)', opacity: '0' },
                '100%': { transform: 'translateY(0%)', opacity: '1' },
              }
            },
      animation: {
        float: 'float 15s ease infinite;',
        drop: 'drop 0.5s ease forwards;',
        dropdelay: 'dropdelay 1s ease forwards;',
      }
      
    },
  },
  plugins: [],
}

