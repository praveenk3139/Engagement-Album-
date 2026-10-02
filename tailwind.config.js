/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#f7f1e5',
          200: '#eddcc1',
          300: '#dfc296',
          400: '#cea267',
          500: '#bc8644',
          600: '#a36c36',
          700: '#82512c',
          800: '#6b4129',
          900: '#583624',
        },
        ivory: {
          50: '#fdfdfc',
          100: '#faf8f5',
          200: '#f4efe8',
          300: '#ece3d6',
          400: '#dfd2bd',
          500: '#cbbaa1',
        },
        velvet: {
          900: '#181211',
          950: '#0e0b0a',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        script: ['"Great Vibes"', '"Alex Brush"', 'cursive'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'book-lg': '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 35px rgba(188, 134, 68, 0.15)',
        'book-deep': '0 30px 90px rgba(15, 10, 8, 0.6), 0 0 40px rgba(0,0,0,0.3)',
        'gold-glow': '0 0 25px rgba(218, 165, 32, 0.35)',
        'gold-glow-sm': '0 0 10px rgba(218, 165, 32, 0.25)',
        'inner-crease': 'inset 0 0 30px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
