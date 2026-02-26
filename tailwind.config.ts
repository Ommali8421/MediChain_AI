import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
        },
        dark: {
          50: "#f0fafa",
          100: "#1a1a2e",
          200: "#16213e",
          300: "#0f3460",
          400: "#0a0a1a",
          500: "#06060f",
          900: "#030308",
        },
        glass: "rgba(255,255,255,0.05)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-dark": "radial-gradient(at 40% 20%, hsla(180,100%,14%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%)",
      },
      backdropBlur: {
        xs: "2px",
        xl: "20px",
        "2xl": "40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          from: { boxShadow: "0 0 10px #14b8a6, 0 0 20px #14b8a6" },
          to: { boxShadow: "0 0 20px #14b8a6, 0 0 40px #14b8a6, 0 0 60px #14b8a6" },
        },
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "teal-glow": "0 0 20px rgba(20, 184, 166, 0.4)",
        "teal-glow-lg": "0 0 40px rgba(20, 184, 166, 0.5)",
        "inner-glass": "inset 0 0 20px rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
