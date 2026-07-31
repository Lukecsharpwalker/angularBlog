/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  darkMode: 'class',
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
        surface: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        },
        text: {
          primary: '#1e293b',
          secondary: '#475569',
          tertiary: '#64748b',
          inverse: '#ffffff',
        },
        border: {
          primary: '#e2e8f0',
          secondary: '#cbd5e1',
          accent: '#12372A',
        },
      },
      animation: {
        'fade-in': 'fade-in var(--duration-slow, 0.5s) var(--easing-out, ease-out)',
        'scale-in': 'scale-in var(--duration-normal, 0.3s) var(--easing-out, ease-out)',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
      },
      keyframes: {
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
      },
    },
  },
  plugins: [],
};
