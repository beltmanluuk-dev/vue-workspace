/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#F2F2F7',
        background: '#FFFFFF',
        'gray-subtle': '#8E8E93',
        'system-blue': '#007AFF',
      },
    },
  },
  plugins: [],
}

