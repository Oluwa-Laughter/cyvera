"use client";

import React from "react";
import { Menu, Wallet, Droplets, RefreshCw, CheckCircle2 } from "lucide-react";
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
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
      {/* Left: Mobile Trigger & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-700 hover:text-black border border-slate-200 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <AuraLogo size="sm" showText={false} />
        </div>

        <div className="hidden sm:block">
          <h1 className="text-xl font-black text-black tracking-tight">{pageTitle}</h1>
          <p className="text-xs text-slate-500 font-medium">{pageSubtitle}</p>
        </div>
      </div>

      {/* Right: Network, Balance, Wallet */}
      <div className="flex items-center gap-3 font-medium text-xs">
        {/* Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sepolia Live</span>
        </div>

        {/* Balance Capsule */}
        {account && (
          <button
            onClick={onOpenFaucet}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
          >
            <span className="text-slate-500">Wallet:</span>
            <span className="font-extrabold text-black">{walletBalance} cUSDT</span>
          </button>
        )}

        {/* Direct Wallet Connect Button */}
        {account ? (
          <button
            onClick={onDisconnect}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-red-50 hover:border-red-200 hover:text-red-600 border border-slate-200 text-slate-800 transition-all font-mono"
            title="Click to disconnect"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{formatAddress(account)}</span>
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold transition-all shadow-aura-yellow disabled:opacity-50 active:scale-95"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 text-black" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
