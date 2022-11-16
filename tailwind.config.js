/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      text: '#f2f2f2',
      'text-secondary': '#a6a6a6',
      primary: '#9333ea',
      secondary: '#D926A9',
      accent: '#1FB2A6',
      neutral: '#6b7280',
      background: '#000000',
      info: '#3ABFF8',
      success: '#36D399',
      warning: '#FBBD23',
      error: '#F87272',
      shadow: 'rgba(255, 255, 255, 0.2)',
    },
    extend: {
      animation: {
        floating: 'floating 3.3s ease-in-out infinite'
      },
      keyframes: {
        floating: {
          '0%': {
            'box-shadow': '0 5px 15px 0px shadow',
            transform: 'translatey(0px)',
          },
          '50%': {
            'box-shadow': '0 25px 15px 0px shadow',
            transform: 'translatey(-10px)',
          },
          '100%': {
            'box-shadow': '0 5px 15px 0px shadow',
            transform: 'translatey(0px)',
          },
        },
      },
    },
  },
  plugins: [],
};
