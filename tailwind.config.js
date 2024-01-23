/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grafit': '#032539',
        'grafit-light': '#053b5b',
        'milk': '#cfcdcd',
        'turquoise': '#1C768F',
        'orange': '#FA991C',
        'orange-light': '#fbbe70'
      },
    },
  },
  plugins: [],
}

