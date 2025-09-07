/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  daisyui: {
    themes: ['light'],
  },
  theme: {
    extend: {
      colors: {
        primary: '#12372A',
        secondary: '#436850',
        tertiary: '#ADBC9F',
        quaternary: '#FBFADA',
        accent: {
          neon: '#FF6B35',
          purple: '#8B5FBF',
          lime: '#39FF14',
        },
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.10)',
          200: 'rgba(255, 255, 255, 0.15)',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        shine: 'shine 0.6s ease-out',
        ripple: 'ripple 0.3s ease-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        ripple: {
          '0%': { 'box-shadow': '0 0 0 0 rgba(18, 55, 42, 0.4)' },
          '100%': { 'box-shadow': '0 0 0 20px rgba(18, 55, 42, 0)' },
        },
      },
      perspective: {
        1000: '1000px',
      },
      backgroundSize: {
        '400%': '400%',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [require('daisyui')],
};
