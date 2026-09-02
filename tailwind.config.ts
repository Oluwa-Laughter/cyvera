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
          gold: "#FFD200",
          goldHover: "#F5C800",
          goldLight: "#FFFBEA",
          cyan: "#06B6D4",
          emerald: "#10B981",
          dark: "#080B11",
          darkCard: "#0F172A",
          darkCardHover: "#1E293B",
          darkBorder: "rgba(255, 255, 255, 0.08)",
          lightCard: "#FFFFFF",
          lightBorder: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "cyvera-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "cyvera-md": "0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        "cyvera-lg": "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.06)",
        "cyvera-glow": "0 0 35px -5px rgba(255, 210, 0, 0.35)",
        "cyvera-cyan": "0 0 35px -5px rgba(6, 182, 212, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
