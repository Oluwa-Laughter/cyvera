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
        background: "#F8FAFC",
        foreground: "#0A0A0A",
        aura: {
          yellow: "#FFD200",
          yellowHover: "#F5C800",
          yellowLight: "#FFFBEA",
          black: "#0A0A0A",
          dark: "#18181B",
          card: "#FFFFFF",
          cardHover: "#FAFAFA",
          border: "#E2E8F0",
          borderHover: "#CBD5E1",
          muted: "#64748B",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "aura-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "aura-md": "0 12px 24px -6px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "aura-lg": "0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.04)",
        "aura-yellow": "0 8px 24px -4px rgba(255, 210, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
