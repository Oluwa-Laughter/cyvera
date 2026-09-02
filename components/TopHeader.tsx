"use client";

import React from "react";
import { Menu, Wallet, Droplets, RefreshCw, LogOut, Sun, Moon, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/AuraLogo";

interface TopHeaderProps {
  pageTitle: string;
  pageSubtitle: string;
  onOpenMobileNav: () => void;
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  onOpenFaucet: () => void;
  walletBalance: string;
  nativeEthBalance?: string;
  isWrongNetwork?: boolean;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  pageTitle,
  pageSubtitle,
  onOpenMobileNav,
  account,
  onConnect,
  onDisconnect,
  isConnecting,
  onOpenFaucet,
  walletBalance,
  nativeEthBalance,
  isWrongNetwork = false,
  theme = "dark",
  onToggleTheme,
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="w-full bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--card-border)] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm transition-colors duration-200">
      {/* Left: Mobile Trigger & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white border border-[var(--card-border)] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <AuraLogo size="sm" showText={false} />
        </div>

        <div className="hidden sm:block">
          <h1 className="text-xl font-black text-foreground tracking-tight">{pageTitle}</h1>
          <p className="text-xs text-[var(--muted)] font-medium">{pageSubtitle}</p>
        </div>
      </div>

      {/* Right: Network, Balance, Theme Toggle, Wallet / Disconnect */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
        {/* Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)] text-[var(--muted)] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-foreground">Sepolia</span>
        </div>

        {/* Testnet Faucet Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenFaucet}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-bold transition-all shadow-sm"
        >
          <Droplets className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Get Tokens</span>
          <span className="sm:hidden">Faucet</span>
        </motion.button>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-[var(--card-border)] text-slate-700 dark:text-amber-400 transition-colors"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </motion.button>
        )}

        {/* Wallet Connection */}
        {account ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-slate-100 dark:bg-slate-800/90 border border-[var(--card-border)] rounded-2xl">
              <span className="text-[10px] text-[var(--muted)] font-mono">Balance:</span>
              <span className="text-xs font-mono font-black text-foreground">
                ${walletBalance} <span className="text-[10px] font-normal text-[var(--muted)]">cUSDT</span>
              </span>
            </div>

            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 border border-[var(--card-border)] text-foreground font-mono transition-colors group"
              title="Click to disconnect"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{formatAddress(account)}</span>
              <LogOut className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500" />
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold shadow-cyvera-glow transition-all disabled:opacity-50"
          >
            {isConnecting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Wallet className="w-4 h-4 text-black" />
            )}
            <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
          </motion.button>
        )}
      </div>
    </header>
  );
};
