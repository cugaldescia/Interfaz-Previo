/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
      extend: {
        colors: {
          'custom-blue': '#208fff', // Definir el color azul personalizado
        },
      },
    },
    plugins: [],
  }
