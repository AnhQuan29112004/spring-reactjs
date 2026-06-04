/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        be_vietnam_pro: ["Be Vietnam Pro", 'sans-serif'],
        roboto: ["Roboto", "sans-serif"],
        ibm: ["IBM Plex Sans", "sans-serif"],
        ibm_mono: ["IBM Plex Mono", "sans-serif"],
      },
    },
  },
  plugins: [],
}

