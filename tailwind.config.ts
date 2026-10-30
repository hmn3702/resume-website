import type { Config } from "tailwindcss";

const action = {
  50: "#f5f5f7",
  100: "#e8f2ff",
  200: "#cce4ff",
  300: "#80bdff",
  400: "#2997ff",
  500: "#0066cc",
  600: "#0066cc",
  700: "#005bb5",
  800: "#004080",
  900: "#16324f",
  950: "#152536",
};

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
      },
      colors: {
        accent: action,
        // Keep existing admin utilities on the same action palette.
        teal: action,
        slate: {
          50: "#fafafc",
          100: "#f5f5f7",
          200: "#e0e0e0",
          300: "#d2d2d7",
          400: "#a1a1a6",
          500: "#6e6e73",
          600: "#515154",
          700: "#424245",
          800: "#333336",
          900: "#272729",
          950: "#1d1d1f",
        },
      },
      borderRadius: { xl: "18px", "2xl": "18px" },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
