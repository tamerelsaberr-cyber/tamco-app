/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/admin/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/admin/config/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: "#e7c27d",
          DEFAULT: "#caa455",
          dark: "#997531",
        }
      }
    },
  },
  plugins: [],
}