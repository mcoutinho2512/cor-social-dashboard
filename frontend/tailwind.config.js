/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cor-blue': '#003DA5',
        'cor-light-blue': '#0066CC',
        'cor-dark': '#001F3F',
      }
    },
  },
  plugins: [],
}
