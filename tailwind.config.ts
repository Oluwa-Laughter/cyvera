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
        background: "#080808",
        foreground: "#FFFFFF",
        zama: {
          yellow: "#FFE600",
          yellowHover: "#F5DC00",
          yellowMuted: "rgba(255, 230, 0, 0.12)",
          black: "#050505",
          dark: "#0C0C0C",
          card: "#121212",
          cardHover: "#181818",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 230, 0, 0.35)",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "zama-glow": "0 0 30px -5px rgba(255, 230, 0, 0.35)",
        "zama-glow-sm": "0 0 15px -3px rgba(255, 230, 0, 0.25)",
        "card-soft": "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};
export default config;
