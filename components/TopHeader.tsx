"use client";

import React from "react";
import { Menu, Wallet, Droplets, RefreshCw, LogOut, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/AuraLogo";
import { ActiveMarketId } from "@/lib/contracts";

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
  activeMarket?: ActiveMarketId;
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
  activeMarket = "cUSDT",
  isWrongNetwork = false,
  theme = "dark",
  onToggleTheme,
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="w-full bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--card-border)] sticky top-0 z-30 px-3 sm:px-8 py-3.5 flex items-center justify-between shadow-sm transition-colors duration-200">
      {/* Left: Mobile Trigger & Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white border border-[var(--card-border)] transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden shrink-0">
          <AuraLogo size="sm" showText={false} />
        </div>

        <div className="hidden sm:block min-w-0">
          <h1 className="text-xl font-black text-foreground tracking-tight truncate">{pageTitle}</h1>
          <p className="text-xs text-[var(--muted)] font-medium truncate">{pageSubtitle}</p>
        </div>
      </div>

      {/* Right: Network, Balance, Theme Toggle, Wallet / Disconnect */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold shrink-0">
        {/* Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)] text-[var(--muted)] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-foreground">Sepolia</span>
        </div>

        {/* Testnet Faucet Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenFaucet}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0"
        >
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Get Tokens</span>
          <span className="sm:hidden text-[11px]">Faucet</span>
        </motion.button>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-[#121826] border border-white/[0.08] text-slate-700 dark:text-cyan-400 transition-colors shrink-0"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-cyan-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </motion.button>
        )}

        {/* Wallet Connection & Balance */}
        {account ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Always Visible Wallet Balance Box */}
            <div className="flex flex-col items-end px-3 py-1 bg-slate-100 dark:bg-[#101524] border border-cyan-500/20 rounded-xl sm:rounded-2xl shadow-sm">
              <span className="text-[9px] sm:text-[10px] text-[var(--muted)] font-mono flex items-center gap-1">
                <Wallet className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                <span>Wallet:</span>
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-foreground">
                ${walletBalance || "0.00"}{" "}
                <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 font-semibold">{activeMarket}</span>
              </span>
            </div>

            <button
              onClick={onDisconnect}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-slate-100 dark:bg-[#101524] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 border border-[var(--card-border)] text-foreground font-mono transition-colors group"
              title="Click to disconnect"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px] sm:text-xs">{formatAddress(account)}</span>
              <LogOut className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 hidden sm:inline" />
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all disabled:opacity-50 shrink-0"
          >
            {isConnecting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Wallet className="w-4 h-4 text-slate-950" />
            )}
            <span className="text-[11px] sm:text-xs">{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
          </motion.button>
        )}
      </div>
    </header>
  );
};
