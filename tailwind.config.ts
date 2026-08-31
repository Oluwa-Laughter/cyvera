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
        background: "#080c14",
        foreground: "#f3f4f6",
        card: "rgba(15, 23, 42, 0.75)",
        cardBorder: "rgba(56, 189, 248, 0.15)",
        zama: {
          cyan: "#00f0ff",
          emerald: "#10b981",
          purple: "#a855f7",
          gold: "#f59e0b",
          dark: "#050811",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 240, 255, 0.3)",
        glowEmerald: "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        glowPurple: "0 0 25px -5px rgba(168, 85, 247, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
