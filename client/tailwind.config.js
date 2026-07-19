/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f4f6fa',
          100: '#e7f0fa',
          200: '#c5daf3',
          600: '#2a5a9e',
          700: '#224a82',
          800: '#1d3f6f',
          900: '#1b3a6b', // School Primary Navy
        },
        schoolGreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
          800: '#2e7d32', // School Secondary Green
          900: '#14532d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '8px',
        'card': '10px'
      },
      boxShadow: {
        'flat': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)',
        'premium': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [],
}
