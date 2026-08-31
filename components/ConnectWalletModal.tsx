"use client";

import React from "react";
import { X, Wallet, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectInjected: () => void;
  onConnectDemo: () => void;
  isConnecting: boolean;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConnectInjected,
  onConnectDemo,
  isConnecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-aura-lg border border-slate-200">
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
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-black">Connect Your Wallet</h3>
            <p className="text-xs text-slate-500 font-medium">To deposit, view your private balance & win prizes</p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {/* Injected / MetaMask / Rabby */}
          <button
            onClick={() => {
              onConnectInjected();
              onClose();
            }}
            disabled={isConnecting}
            className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-aura-yellowLight border border-slate-200 hover:border-aura-yellow flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-sm group-hover:scale-105 transition-transform">
                🦊
              </div>
              <div>
                <div className="font-bold text-black text-sm">Browser Extension</div>
                <div className="text-xs text-slate-500">MetaMask, Rabby, Coinbase, Brave</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </button>

          {/* Instant 1-Click Demo Wallet */}
          <button
            onClick={() => {
              onConnectDemo();
              onClose();
            }}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-yellow-100 hover:to-amber-100 border border-amber-200 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-aura-yellow flex items-center justify-center font-bold text-black text-sm shadow-aura-yellow group-hover:scale-105 transition-transform">
                ✨
              </div>
              <div>
                <div className="font-extrabold text-black text-sm flex items-center gap-1.5">
                  <span>1-Click Demo Wallet</span>
                  <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded-full font-mono">PRE-FUNDED</span>
                </div>
                <div className="text-xs text-amber-800 font-medium">Test instantly without any extension!</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Security Assurance */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Non-custodial. Your funds always remain under your control.</span>
        </div>
      </div>
    </div>
  );
};
