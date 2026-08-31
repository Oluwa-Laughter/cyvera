import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeilPrize | Confidential No-Loss Prize Savings Protocol",
  description: "A production-ready confidential version of PoolTogether powered by Zama FHE on Ethereum Sepolia. Save tokens with zero loss, keep balances strictly encrypted, and win yield-backed prize draws.",
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
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
