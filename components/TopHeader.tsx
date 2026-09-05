"use client";

import React from "react";
import { Wallet, Droplets, RefreshCw, LogOut, Sun, Moon } from "lucide-react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/AuraLogo";
import { ActiveMarketId } from "@/lib/contracts";

interface TopHeaderProps {
  pageTitle: string;
  pageSubtitle: string;
  onOpenMobileNav: () => void;
  isMobileNavOpen?: boolean;
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenAccountModal?: () => void;
  isConnecting: boolean;
  onOpenFaucet: () => void;
  walletBalance: string;
  nativeEthBalance?: string;
  activeMarket?: ActiveMarketId;
  isWrongNetwork?: boolean;
  onSwitchNetwork?: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  pageTitle,
  pageSubtitle,
  onOpenMobileNav,
  isMobileNavOpen = false,
  account,
  onConnect,
  onDisconnect,
  onOpenAccountModal,
  isConnecting,
  onOpenFaucet,
  walletBalance,
  nativeEthBalance,
  activeMarket = "cUSDT",
  isWrongNetwork = false,
  onSwitchNetwork,
  theme = "dark",
  onToggleTheme,
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="w-full bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--card-border)] sticky top-0 z-30 px-3 sm:px-8 py-3.5 flex items-center justify-between shadow-sm transition-colors duration-200">
      {/* Left: Mobile Trigger & Title */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white border border-[var(--card-border)] transition-colors shrink-0 cursor-pointer"
          aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
        >
          {isMobileNavOpen ? (
            <HiXMark className="w-5 h-5 text-amber-500" />
          ) : (
            <HiBars3 className="w-5 h-5 text-amber-500" />
          )}
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
        <div
          onClick={isWrongNetwork && onSwitchNetwork ? onSwitchNetwork : undefined}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono transition-all ${
            isWrongNetwork
              ? "bg-rose-500/15 border-rose-500/50 text-rose-500 dark:text-rose-400 hover:bg-rose-500/25 cursor-pointer animate-pulse"
              : "bg-slate-100 dark:bg-slate-800/80 border-[var(--card-border)] text-[var(--muted)]"
          }`}
          title={isWrongNetwork ? "Wrong network. Click to switch to Sepolia" : "Connected to Ethereum Sepolia"}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isWrongNetwork ? "bg-rose-500" : "bg-emerald-500 animate-pulse"
            }`}
          />
          <span className="text-[11px] font-bold text-foreground">
            {isWrongNetwork ? "Wrong Network" : "Sepolia"}
          </span>
        </div>

        {/* Testnet Faucet Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenFaucet}
          className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-bold transition-all shadow-sm shrink-0"
        >
          <Droplets className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Get Tokens</span>
          <span className="sm:hidden text-[11px]">Faucet</span>
        </motion.button>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-[var(--card-border)] text-slate-700 dark:text-amber-400 transition-colors shrink-0"
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

        {/* Wallet Connection & Balance */}
        {account ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Visible on sm+ screens */}
            <div className="hidden sm:flex flex-col items-end px-2.5 sm:px-3 py-1 bg-slate-100 dark:bg-slate-800/90 border border-amber-500/30 rounded-xl sm:rounded-2xl">
              <span className="text-[9px] sm:text-[10px] text-[var(--muted)] font-mono flex items-center gap-1">
                <Wallet className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
                <span>{nativeEthBalance && parseFloat(nativeEthBalance) > 0 ? `${nativeEthBalance} ETH` : "Wallet:"}</span>
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-black text-foreground">
                ${walletBalance || "0.00"}{" "}
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-500">{activeMarket}</span>
              </span>
            </div>

            <button
              onClick={onOpenAccountModal || onDisconnect}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-[var(--card-border)] text-foreground font-mono transition-colors group cursor-pointer"
              title="Click to view wallet details"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px] sm:text-xs">{formatAddress(account)}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onDisconnect();
                }}
                className="p-0.5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                title="Disconnect wallet"
              >
                <LogOut className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 rounded-full bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold shadow-cyvera-glow transition-all disabled:opacity-50 shrink-0"
          >
            {isConnecting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Wallet className="w-4 h-4 text-black" />
            )}
            <span className="text-[11px] sm:text-xs">{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
          </motion.button>
        )}
      </div>
    </header>
  );
};
