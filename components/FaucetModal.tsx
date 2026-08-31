"use client";

import React from "react";
import { X, Droplets, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimFaucet: () => Promise<void>;
  isClaiming: boolean;
  walletBalance: string;
  account: string | null;
  onConnect: () => void;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  onClaimFaucet,
  isClaiming,
  walletBalance,
  account,
  onConnect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-aura-lg border border-slate-200 text-black">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-black transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-aura-yellow text-black shadow-aura-yellow">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-black">Get Free Test Tokens</h3>
            <p className="text-xs text-slate-500 font-medium">1,000 cUSDT to test savings on Sepolia</p>
          </div>
        </div>

        {/* Current Balance */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between text-xs font-medium">
          <span className="text-slate-500">Current Wallet Balance:</span>
          <span className="font-extrabold text-black text-sm">
            {account ? `${walletBalance} cUSDT` : "Not Connected"}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Instant +1,000 cUSDT per claim</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            Mint mock tokens directly to your wallet to test deposits, daily prize draw entries, and instant zero-loss withdrawals.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 text-xs">
          {!account ? (
            <button
              onClick={() => {
                onClose();
                onConnect();
              }}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold shadow-aura-yellow active:scale-95 transition-all"
            >
              Connect Wallet to Mint
            </button>
          ) : (
            <button
              onClick={onClaimFaucet}
              disabled={isClaiming}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold tracking-tight transition-all shadow-aura-yellow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isClaiming ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Minting 1,000 cUSDT Tokens...</span>
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4 text-black" />
                  <span>Mint 1,000 cUSDT Now</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
