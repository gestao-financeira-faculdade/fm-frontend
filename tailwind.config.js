/**
 * Paleta da marca. Mantenha em sincronia com src/app/theme/colors.ts
 * (usado pelo TypeScript, ex.: gráficos do Chart.js e preset do PrimeNG).
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        marca: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdaff',
          300: '#8ec3ff',
          400: '#59a2ff',
          500: '#337dfc',
          600: '#1d5ef1',
          700: '#1549de',
          800: '#183db4',
          900: '#1a378e',
          950: '#152356',
        },
        receita: '#059669',
        despesa: '#dc2626',
        alerta: '#d97706',
      },
    },
  },
  plugins: [],
};
