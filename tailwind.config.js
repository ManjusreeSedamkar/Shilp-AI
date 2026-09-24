/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8eb',
          100: '#feedc7',
          200: '#fed789',
          300: '#febb4b',
          400: '#fd9f1c',
          500: '#f57f07',
          600: '#d95f03',
          700: '#b44305',
          800: '#90340b',
          900: '#752b0d',
        },
        navy: {
          800: '#1a2744',
          900: '#0f172a',
          950: '#090d18',
        },
        craft: {
          cream: '#FAF7F2',
          sand: '#F4EFE6',
          terracotta: '#c85a32',
          terracottaHover: '#b84e28',
          terracottaDark: '#963717',
          terracottaLight: '#fdf5ef',
          terracottaBorder: '#edd5c8',
          turmeric: '#e59a1e',
          turmericLight: '#fef7ea',
          indigo: '#1a2744',
          zari: '#dda73a',
          brass: '#c29b38',
          silk: '#b33951',
          charcoal: '#241e1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
