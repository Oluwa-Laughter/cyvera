import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeilPool | Confidential No-Loss Prize Savings",
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
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#F8FAFC] text-black">
        {children}
      </body>
    </html>
  );
}
