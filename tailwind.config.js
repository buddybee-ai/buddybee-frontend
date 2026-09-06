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
          950: '#12124f',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f7f7fd',
          subtle: '#f1f1fb',
        },
        ink: {
          900: '#0f0f1e',
          800: '#181830',
          700: '#2b2b45',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        // Warmer, rounder font used only inside the AI Chat interface —
        // see index.html for the Google Fonts import.
        chat:    ['Fredoka', 'sans-serif'],
      },
      backgroundImage: {
        'grid-slate': 'linear-gradient(to right, rgb(226 232 240 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(226 232 240 / 0.6) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'pulse-soft':   'pulse-soft 3s ease-in-out infinite',
        'slide-up':     'slideUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-down':   'slideDown 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':      'fadeIn 0.7s ease-out forwards',
        'scale-in':     'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'aurora':       'aurora 18s ease-in-out infinite',
        'aurora-slow':  'aurora 26s ease-in-out infinite reverse',
        'shimmer':      'shimmer 2.2s linear infinite',
        'gradient-x':   'gradientX 6s ease infinite',
        'spin-slow':    'spin 12s linear infinite',
        'bounce-soft':  'bounceSoft 1.6s ease-in-out infinite',
        'marquee':      'marquee 30s linear infinite',
        'ping-slow':    'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wiggle':       'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)'   },
          '50%':      { transform: 'translateY(-14px) rotate(1deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.6' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)'     },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)'    },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%':      { transform: 'translate(8%, -10%) scale(1.15)' },
          '66%':      { transform: 'translate(-6%, 8%) scale(0.95)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-4deg)' },
          '75%':      { transform: 'rotate(4deg)' },
        },
      },
      boxShadow: {
        'card':       '0 4px 24px rgba(92, 92, 232, 0.08)',
        'card-hover': '0 12px 40px rgba(92, 92, 232, 0.16)',
        'card-hover-warm': '0 14px 40px -6px rgba(92,92,232,0.16), 0 8px 24px -8px rgba(245,158,11,0.12)',
        'primary':    '0 4px 20px rgba(92, 92, 232, 0.35)',
        'glow':       '0 0 0 1px rgba(92,92,232,0.08), 0 8px 30px rgba(92,92,232,0.18)',
        'glow-lg':    '0 0 60px -12px rgba(92,92,232,0.45)',
        'soft':       '0 2px 12px rgba(15,15,30,0.05)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
