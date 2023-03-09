/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {

      },
      fontFamily: {
        header: ['BEBAS NEUE', 'Oswald', 'sans serif'],
        text: ['Montserrat', 'Roboto', 'Open Sans', 'sans serif'],
    },
    },
  },
  extend: {
    
  }
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
