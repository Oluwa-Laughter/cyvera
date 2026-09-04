import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080B11" },
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Cyvera | Confidential No-Loss Prize Savings Protocol",
    template: "%s | Cyvera",
  },
  description:
    "Production-ready confidential prize savings protocol powered by Zama FHEVM on Ethereum Sepolia. Save cUSDT and cUSDC with 100% zero-loss protection, keep deposit balances strictly confidential with end-to-end encryption, and win yield-backed verifiable onchain draws.",
  applicationName: "Cyvera",
  authors: [{ name: "Cyvera Protocol Team", url: "https://github.com/Oluwa-Laughter/cyvera" }],
  generator: "Next.js",
  keywords: [
    "Cyvera",
    "Zama",
    "FHEVM",
    "Fully Homomorphic Encryption",
    "Confidential DeFi",
    "No-Loss Lottery",
    "Prize Savings",
    "Ethereum Sepolia",
    "cUSDT",
    "cUSDC",
    "Zero-Loss Protocol",
    "Encrypted Balances",
    "Web3 Privacy",
    "ERC-7984",
  ],
  creator: "Cyvera Protocol Team",
  publisher: "Cyvera Protocol",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cyvera.protocol"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cyvera | Confidential No-Loss Prize Savings Protocol",
    description:
      "Save cUSDT and cUSDC with 100% zero loss, keep balances strictly encrypted using Zama FHE, and win recurring yield-backed jackpots on Ethereum Sepolia.",
    url: "https://cyvera.protocol",
    siteName: "Cyvera Protocol",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyvera | Confidential No-Loss Prize Savings Protocol",
    description:
      "Private wealth preservation and provable onchain jackpots powered by Zama FHEVM. Zero-loss principal, encrypted deposits.",
    creator: "@cyvera_protocol",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
  },
  manifest: "/site.webmanifest",
};

import { Web3Provider } from "@/components/providers/Web3Provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="antialiased min-h-screen font-sans bg-background text-foreground">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
