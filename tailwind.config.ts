import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f8fafc",
        void: {
          950: "#02040a",
          900: "#030712",
          850: "#060d1f",
          800: "#0a142e",
        },
        zama: {
          cyan: "#38bdf8",
          emerald: "#05f19c",
          violet: "#a855f7",
          purple: "#7c3aed",
          amber: "#fbbf24",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 35px -5px rgba(56, 189, 248, 0.35)",
        "glow-emerald": "0 0 35px -5px rgba(5, 241, 156, 0.35)",
        "glow-purple": "0 0 35px -5px rgba(168, 85, 247, 0.35)",
        "glow-amber": "0 0 35px -5px rgba(251, 191, 36, 0.35)",
        "inner-bezel": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)",
      },
      transitionTimingFunction: {
        fluid: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
