"use client";

import React from "react";
import { X, Sparkles, Droplets, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimFaucet: () => Promise<void>;
  isClaiming: boolean;
  walletBalance: string;
  account: string | null;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  onClaimFaucet,
  isClaiming,
  walletBalance,
  account,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Testnet cUSDT Faucet</h3>
            <p className="text-xs text-slate-400 font-mono">Free tokens for testing VeilPrize on Sepolia</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Current Wallet Balance:</span>
          <span className="text-sm font-bold font-mono text-emerald-300">
            {walletBalance} cUSDT
          </span>
        </div>

        {/* Info */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-6 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>1,000 cUSDT per request</span>
          </div>
          <p className="text-slate-400 leading-relaxed font-mono text-[11px]">
            Mint mock tokens directly to your connected wallet to test confidential deposits, draw participation, and zero-loss withdrawals.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onClaimFaucet}
            disabled={isClaiming || !account}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-glowEmerald flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isClaiming ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Minting 1,000 cUSDT...</span>
              </>
            ) : (
              <>
                <Droplets className="w-4 h-4" />
                <span>Mint 1,000 cUSDT Now</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all"
          >
            Close
          </button>
        </div>

        {/* Contract Address */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Mock Token:</span>
          <span className="text-slate-400">{CONTRACT_ADDRESSES.sepolia.depositToken.slice(0, 10)}...</span>
        </div>
      </div>
    </div>
  );
};
