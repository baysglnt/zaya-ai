import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: "#f0eaff",
          100: "#e0d5ff",
          200: "#c4b0ff",
          300: "#a385ff",
          400: "#8257fe",
          500: "#6d3ff5",
          600: "#5a27e0",
          700: "#4a1dbd",
          800: "#3d1a99",
          900: "#1a0a47",
          950: "#0d0520",
        },
        aurora: {
          purple: "#7c3aed",
          blue: "#2563eb",
          pink: "#db2777",
          gold: "#d97706",
        },
      },
      backgroundImage: {
        "galaxy": "radial-gradient(ellipse at top, #1a0a47 0%, #0d0520 50%, #000 100%)",
        "cosmic-card": "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.1) 100%)",
        "glow-purple": "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "stars": "stars 20s linear infinite",
        "reveal": "reveal 0.8s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out",
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.6)" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
