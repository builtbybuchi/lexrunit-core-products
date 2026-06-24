/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lex-dark-blue': '#021488',
        'lex-med-blue': '#0546B6',
        'lex-bright-blue': '#0A91F9',
        'lex-light-blue': '#C5ECF4',
        'lex-bg': '#F8F9FA',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'hand': ['Caveat', 'cursive'],
      }
    },
  },
  plugins: [],
}
