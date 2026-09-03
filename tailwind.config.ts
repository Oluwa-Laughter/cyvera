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
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyvera: {
          accent: "#06B6D4",
          accentHover: "#0891B2",
          accentLight: "#ECFEFF",
          cyan: "#00F2FE",
          indigo: "#6366F1",
          emerald: "#10B981",
          violet: "#8B5CF6",
          dark: "#06080E",
          darkCard: "#0B0E17",
          darkCardHover: "#121824",
          darkBorder: "rgba(255, 255, 255, 0.08)",
          lightCard: "#FFFFFF",
          lightBorder: "#E2E8F0",
          // Remap legacy gold to cyan accent to instantly eradicate yellow slop
          gold: "#06B6D4",
          goldHover: "#0891B2",
          goldLight: "#ECFEFF",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "cyvera-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "cyvera-md": "0 12px 24px -6px rgba(0, 0, 0, 0.2), 0 4px 12px -2px rgba(0, 0, 0, 0.1)",
        "cyvera-lg": "0 20px 40px -12px rgba(0, 0, 0, 0.35), 0 8px 16px -4px rgba(0, 0, 0, 0.15)",
        "cyvera-glow": "0 0 35px -5px rgba(6, 182, 212, 0.4)",
        "cyvera-cyan": "0 0 35px -5px rgba(6, 182, 212, 0.4)",
        "cyvera-indigo": "0 0 35px -5px rgba(99, 102, 241, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
