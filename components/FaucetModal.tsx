"use client";

import React from "react";
import { X, Droplets, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="zama-card p-6 sm:p-8 max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-zama-yellow/30 shadow-zama-glow">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-zama-yellow/10 border border-zama-yellow/30 text-zama-yellow">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Testnet cUSDT Faucet</h3>
            <p className="text-xs text-zinc-400 font-mono">Free tokens for testing VeilPrize on Sepolia</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-2xl bg-zama-dark border border-white/5 mb-6 flex items-center justify-between font-mono text-xs">
          <span className="text-zinc-400">Current Wallet Balance:</span>
          <span className="font-bold text-zama-yellow">
            {walletBalance} cUSDT
          </span>
        </div>

        {/* Info */}
        <div className="p-4 rounded-2xl bg-zama-yellow/5 border border-zama-yellow/20 mb-6 text-xs text-zinc-300 space-y-2 font-mono">
          <div className="flex items-center gap-2 font-bold text-zama-yellow">
            <Sparkles className="w-4 h-4" />
            <span>1,000 cUSDT per request</span>
          </div>
          <p className="text-zinc-400 leading-relaxed text-[11px]">
            Mint mock tokens directly to your connected wallet to test confidential deposits, draw participation, and zero-loss withdrawals.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 font-mono text-xs">
          <button
            onClick={onClaimFaucet}
            disabled={isClaiming || !account}
            className="w-full py-4 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-extrabold tracking-tight transition-all shadow-zama-glow flex items-center justify-center gap-2 disabled:opacity-50"
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
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            Close
          </button>
        </div>

        {/* Contract Address */}
        <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>Mock Token:</span>
          <span className="text-zinc-400">{CONTRACT_ADDRESSES.sepolia.depositToken.slice(0, 10)}...</span>
        </div>
      </div>
    </div>
  );
};
