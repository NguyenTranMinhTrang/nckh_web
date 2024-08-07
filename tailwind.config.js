/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#45d279',
        'basic': '#3D75FA',
        'error': '#EF4444'
      },
    },
  },
  plugins: [],
}

