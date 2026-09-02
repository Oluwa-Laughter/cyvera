import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyvera | Confidential No-Loss Prize Savings Protocol",
  description: "Production-ready confidential prize savings protocol powered by Zama FHEVM on Ethereum Sepolia. Save tokens with zero loss, keep balances strictly encrypted, and win yield-backed onchain draws.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
