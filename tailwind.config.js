export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"], // adjust to your project
  theme: {
    extend: {
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(5px)' },
        },
        fall: {
          '0%': { transform: 'translateY(-5px)', opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' },
        },
        snowfall: {
          '0%': { transform: 'translateY(-5px)', opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' },
        },
        flash: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        fade: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 20s linear infinite',
        float: 'float 3s ease-in-out infinite',
        drift: 'drift 4s ease-in-out infinite',
        fall: 'fall 1s linear infinite',
        snowfall: 'snowfall 2s linear infinite',
        flash: 'flash 2s ease-in-out infinite',
        fade: 'fade 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
