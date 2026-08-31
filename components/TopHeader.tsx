"use client";

import React from "react";
import { Menu, Wallet, Droplets, RefreshCw, CheckCircle2, ChevronDown, ExternalLink } from "lucide-react";
import { ZamaLogo } from "@/components/ZamaLogo";

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
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="w-full bg-zama-black border-b border-zama-border sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
      {/* Left: Mobile Menu Trigger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <ZamaLogo size="sm" showText={false} />
        </div>

        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-white tracking-tight">{pageTitle}</h1>
          <p className="text-xs text-zinc-400 font-mono">{pageSubtitle}</p>
        </div>
      </div>

      {/* Right Actions: Network, Faucet, Wallet */}
      <div className="flex items-center gap-3">
        {/* Sepolia Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-xs font-mono text-zinc-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sepolia (Zama fhEVM)</span>
        </div>

        {/* Faucet Balance Capsule */}
        {account && (
          <button
            onClick={onOpenFaucet}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-xs font-mono text-zinc-200 transition-all"
          >
            <span className="text-zinc-400">Balance:</span>
            <span className="font-bold text-zama-yellow">{walletBalance} cUSDT</span>
          </button>
        )}

        {/* Wallet Connect Button */}
        {account ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-red-500/10 hover:border-red-500/30 border border-white/10 text-xs font-mono text-zinc-200 hover:text-red-400 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{formatAddress(account)}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-bold text-xs font-mono tracking-tight transition-all shadow-zama-glow disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
