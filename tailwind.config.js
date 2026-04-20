/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#f7f7fb',
          100: '#eef0f7',
          200: '#e3e6ef',
          300: '#c9cddd',
          400: '#8f95b0',
          500: '#6b7194',
          600: '#474d72',
          700: '#2f3457',
          800: '#1c2042',
          900: '#0e1230',
          950: '#060920',
        },
        brand: {
          50:  '#edefff',
          100: '#dde1ff',
          200: '#b8bfff',
          300: '#8b95ff',
          400: '#5b66ff',
          500: '#3b45e6',
          600: '#2a31c2',
          700: '#1f2596',
          800: '#161a70',
          900: '#0b1138',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 18, 48, 0.04), 0 0 0 1px rgba(15, 18, 48, 0.04)',
        pop:  '0 12px 32px -8px rgba(15, 18, 48, 0.18), 0 2px 8px rgba(15, 18, 48, 0.06)',
        modal:'0 24px 60px -12px rgba(15, 18, 48, 0.28), 0 4px 12px rgba(15, 18, 48, 0.08)',
      },
    },
  },
  plugins: [],
}
