/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          900: '#0B3D5E',
          800: '#0F4C75',
          700: '#1B6B93',
          600: '#3A8FB7',
          500: '#5AACE0',
        },
        earth: {
          900: '#7A5C00',
          800: '#C07F00',
          700: '#D4A843',
          600: '#E8C564',
          500: '#F2D98B',
          400: '#F9ECC0',
          100: '#FDF8E8',
        },
        crop: {
          900: '#1B4332',
          800: '#2D6A4F',
          700: '#40916C',
          600: '#52B788',
          500: '#74C69D',
          400: '#95D5B2',
          300: '#B7E4C7',
          100: '#D8F3DC',
        },
        surface: {
          50: '#FAFAF7',
          100: '#F8F6F0',
          200: '#EFECE3',
          300: '#E5E1D8',
          400: '#D1CCC0',
          500: '#9E9889',
        },
        ink: {
          900: '#1A1A2E',
          800: '#2D2D44',
          700: '#45455E',
          600: '#5E5E78',
          500: '#7E7E96',
          400: '#A0A0B4',
          300: '#C4C4D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
