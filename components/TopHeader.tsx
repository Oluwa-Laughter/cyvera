"use client";

import React, { useState } from "react";
import { Menu, Wallet, Droplets, RefreshCw, LogOut, PlusCircle, Check } from "lucide-react";
import { AuraLogo } from "@/components/AuraLogo";
import { addTokenToWallet } from "@/lib/wallet";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

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
  const [isTokenAdded, setIsTokenAdded] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleAddToken = async () => {
    const success = await addTokenToWallet(CONTRACT_ADDRESSES.sepolia.depositToken, "cUSDT", 6);
    if (success) {
      setIsTokenAdded(true);
      setTimeout(() => setIsTokenAdded(false), 3000);
    }
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

      {/* Right: Network, Balance, Add to Wallet, Wallet / Disconnect */}
      <div className="flex items-center gap-2.5 font-medium text-xs">
        {/* Network Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sepolia</span>
        </div>

        {/* Balance Capsule */}
        {account && (
          <button
            onClick={onOpenFaucet}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
            title="Click to get testnet tokens"
          >
            <span className="text-slate-500">Wallet:</span>
            <span className="font-extrabold text-black">{walletBalance} cUSDT</span>
          </button>
        )}

        {/* Add cUSDT to Wallet Button */}
        {account && (
          <button
            onClick={handleAddToken}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all shadow-sm active:scale-95"
            title="Add cUSDT test token to MetaMask"
          >
            {isTokenAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Added</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>+cUSDT to Wallet</span>
              </>
            )}
          </button>
        )}

        {/* Connected Wallet Pill + Explicit Disconnect Button */}
        {account ? (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200">
            <div className="flex items-center gap-2 px-3 py-1 text-slate-800 font-mono text-[11px] font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{formatAddress(account)}</span>
            </div>

            <button
              onClick={onDisconnect}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-all border border-slate-200 shadow-sm active:scale-95 font-bold"
              title="Disconnect Wallet"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Disconnect</span>
            </button>
          </div>
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
