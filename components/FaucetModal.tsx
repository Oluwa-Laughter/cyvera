"use client";

import React, { useState } from "react";
import { X, Droplets, Sparkles, RefreshCw, PlusCircle, Check } from "lucide-react";
import { addTokenToWallet } from "@/lib/wallet";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

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
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen) return null;

  const handleAddToken = async () => {
    const success = await addTokenToWallet(CONTRACT_ADDRESSES.sepolia.depositToken, "cUSDT", 6);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    }
  };

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
            <p className="text-xs text-slate-500 font-medium">1,000 cUSDT on Ethereum Sepolia</p>
          </div>
        </div>

        {/* Current Balance & Add to MetaMask */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between text-xs font-medium">
          <div>
            <span className="text-slate-500 block text-[11px]">Wallet Token Balance:</span>
            <span className="font-extrabold text-black text-sm">
              {account ? `${walletBalance} cUSDT` : "Not Connected"}
            </span>
          </div>

          {account && (
            <button
              onClick={handleAddToken}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold transition-all shadow-sm active:scale-95"
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added to Wallet</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>+Add to MetaMask</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-6 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Instant +1,000 cUSDT per mint</span>
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            Calls the official Zama Sepolia token mint function (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0</code>).
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
