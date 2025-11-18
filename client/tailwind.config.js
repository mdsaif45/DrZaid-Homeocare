/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00897B',
          dark: '#00695C',
          light: '#4DB6AC',
        },
        accent: {
          gold: '#FFB300',
          orange: '#FF7043',
          green: '#81C784',
          purple: '#7E57C2',
        },
      },
    },
  },
  plugins: [],
}
