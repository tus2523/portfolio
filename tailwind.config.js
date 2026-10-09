/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0C0C0C",
        lightText: "#D7E2EA",
        accent: {
          purple: "#7621B0",
          pink: "#B600A8",
          orange: "#BE4C00",
        }
      },
      fontFamily: {
        display: ["Syne", "Kanit", "sans-serif"],
        editorial: ["'Playfair Display'", "serif"],
        sans: ["'Plus Jakarta Sans'", "Kanit", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
