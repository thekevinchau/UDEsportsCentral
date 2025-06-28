/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}', // Adjust paths based on your project structure
    './src/**/*.{scss,css}' // Include SCSS and CSS files for processing
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'], // Custom font
      },
      colors: {
        // Add custom colors if needed
        primary: '#0f77ff', // Matching your active class background
      },
    },
  },
  plugins: [],
}


