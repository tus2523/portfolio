/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earthy: {
          forest: "#01472e",
          sage: "#ccd5ae",
          olive: "#e9edc9",
          cream: "#fefae0",
          moss: "#a3b18a",
        },
        studio: {
          bg: "#ccd5ae",
          text: "#01472e",
          secondary: "#525252",
          muted: "#737373",
          border: "rgba(1, 71, 46, 0.15)",
          footer: "#01472e",
        }
      },
      fontFamily: {
        display: ["Anton", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'forest': '0 25px 50px -12px rgba(1, 71, 46, 0.2)',
        'forest-lg': '0 35px 60px -15px rgba(1, 71, 46, 0.25)',
      },
      transitionTimingFunction: {
        'earthy': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'studio': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        }
      }
    },
  },
  plugins: [],
}
