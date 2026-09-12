/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stayora: {
          red: "#E5342B",
          black: "#000000",
          white: "#FFFFFF",
          grey: "#F5F5F5"
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"]
      },
      borderRadius: {
        card: "16px",
        control: "12px"
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)"
      }
    },
  },
  plugins: [],
}
