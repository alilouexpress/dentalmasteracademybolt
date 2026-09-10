/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'SF Pro Display', '-apple-system', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fdf9ec',
          100: '#faf0cc',
          200: '#f5df94',
          300: '#f0cb5c',
          400: '#e8b630',
          500: '#c9941a',
          600: '#a97312',
          700: '#875510',
          800: '#6e4313',
          900: '#5c3813',
          950: '#341d06',
        },
        medical: {
          50: '#edfcff',
          100: '#d6f7ff',
          200: '#b5f1ff',
          300: '#83eaff',
          400: '#48d9fc',
          500: '#1ebef9',
          600: '#069fdf',
          700: '#0782b5',
          800: '#0c6893',
          900: '#0f587a',
          950: '#093852',
        },
      },
      animation: {
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'counter': 'counterUp 2s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, -1%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 148, 26, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 148, 26, 0.8), 0 0 80px rgba(201, 148, 26, 0.3)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(34, 197, 94, 0.5), 0 0 30px rgba(34, 197, 94, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
