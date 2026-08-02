/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f0ff',
          100: '#e4e4ff',
          200: '#ccccff',
          300: '#a8a8ff',
          400: '#8080ff',
          500: '#5c5ce8',
          600: '#4040d0',
          700: '#3333b8',
          800: '#2a2a96',
          900: '#1a1a78',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)'   },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.7' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      boxShadow: {
        'card':       '0 4px 24px rgba(92, 92, 232, 0.08)',
        'card-hover': '0 8px 40px rgba(92, 92, 232, 0.16)',
        'primary':    '0 4px 20px rgba(92, 92, 232, 0.35)',
      },
    },
  },
  plugins: [],
}
