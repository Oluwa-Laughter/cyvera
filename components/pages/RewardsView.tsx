"use client";

import React from "react";
import { 
  Trophy, 
  Sparkles, 
  ArrowDownToLine, 
  Repeat, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  Gift,
  Lock,
  Unlock,
  Key,
  Flame,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { ActiveMarketId, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";

interface RewardsViewProps {
  account: string | null;
  activeMarket?: ActiveMarketId;
  onChangeMarket?: (m: ActiveMarketId) => void;
  decryptedWinnings: string | null;
  isDecryptingWinnings: boolean;
  onDecryptWinnings: () => void;
  onClaimPrize: () => Promise<void>;
  onCompoundPrize: () => Promise<void>;
  onConnect: () => void;
  isLoadingAction: boolean;
  actionStatus?: string;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  account,
  activeMarket = "cUSDT",
  onChangeMarket,
  decryptedWinnings,
  isDecryptingWinnings,
  onDecryptWinnings,
  onClaimPrize,
  onCompoundPrize,
  onConnect,
  isLoadingAction,
}) => {
  const hasWinnings = parseFloat(decryptedWinnings || "0") > 0;
  const marketCfg = ZAMA_SEPOLIA_CONFIG.markets[activeMarket];

  const triggerCelebration = () => {
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 },
    });
  };

  const handleClaim = async () => {
    triggerCelebration();
    await onClaimPrize();
  };

  const handleCompound = async () => {
    triggerCelebration();
    await onCompoundPrize();
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Market Switcher */}
      {onChangeMarket && (
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => onChangeMarket("cUSDT")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeMarket === "cUSDT" 
                  ? "bg-aura-yellow text-black font-black shadow-sm" 
                  : "text-slate-500 hover:text-black"
              }`}
            >
              cUSDT Winnings
            </button>
            <button
              onClick={() => onChangeMarket("cUSDC")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeMarket === "cUSDC" 
                  ? "bg-aura-yellow text-black font-black shadow-sm" 
                  : "text-slate-500 hover:text-black"
              }`}
            >
              cUSDC Winnings
            </button>
          </div>
          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
            EIP-712 User-Decryption Session
          </span>
        </div>
      )}

      {/* 2. Header Rewards Card */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Private Prize Reveal Session
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-200">
                Encrypted with Zama FHE
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Your Confidential Winnings
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              The result is not published to the chain as a readable prize amount. Authorize a session to inspect your permitted value.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-right min-w-[140px]">
            <span className="text-[10px] font-bold text-amber-900 uppercase">Status</span>
            <div className="text-sm font-black text-amber-950">
              {hasWinnings ? "🎉 Prize Won!" : "🔒 Encrypted Handle"}
            </div>
          </div>
        </div>

        {/* Big Reveal Display Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-aura-yellow text-black flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Decrypted Prize Value
            </span>
            <div className="text-4xl sm:text-5xl font-black text-black mt-1 font-mono">
              {account ? (
                decryptedWinnings !== null ? (
                  <span className={hasWinnings ? "text-emerald-800" : "text-slate-800"}>
                    {hasWinnings ? `+$${decryptedWinnings}` : "$0.00"}{" "}
                    <span className="text-lg text-slate-500 font-normal">{activeMarket}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-3xl">•••••••• {activeMarket}</span>
                )
              ) : (
                <span className="text-slate-400 text-2xl">Connect Wallet</span>
              )}
            </div>
          </div>

          {account && (
            <div className="pt-2">
              <button
                onClick={onDecryptWinnings}
                disabled={isDecryptingWinnings}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800 transition-all active:scale-95 shadow-sm"
              >
                {isDecryptingWinnings ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Key className="w-4 h-4 text-amber-600" />
                )}
                <span>
                  {isDecryptingWinnings ? "Decrypting via EIP-712..." : "Authorize Decryption Session"}
                </span>
              </button>
            </div>
          )}

          {hasWinnings && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Congratulations! You won the {activeMarket} Prize Pot!</span>
            </div>
          )}
        </div>

        {/* Claim & Auto-Compound Actions */}
        {hasWinnings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={handleClaim}
              disabled={isLoadingAction}
              className="py-4 px-6 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoadingAction ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
              <span>Claim Prize Profit to Wallet</span>
            </button>

            <button
              onClick={handleCompound}
              disabled={isLoadingAction}
              className="py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoadingAction ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Repeat className="w-4 h-4 text-amber-600" />}
              <span>Auto-Compound (+Tickets)</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Privacy & Decryption Mechanics */}
      <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Lock className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-black uppercase tracking-wide text-black">Private Reveal Security Architecture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 font-medium">
          <div className="space-y-2">
            <h4 className="font-bold text-black text-xs">How Decryption Works</h4>
            <p className="leading-relaxed">
              When a draw concludes, prize winnings are credited directly as an encrypted ciphertext handle `_encryptedWinnings[winner]` onchain. Neither miners, keepers, nor third-party analytics can view what you won.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-black text-xs">EIP-712 User Signature</h4>
            <p className="leading-relaxed">
              When you click "Authorize Decryption Session", your wallet signs an offchain EIP-712 permission request. The Zama relayer proves your identity and returns your decrypted plaintext balance exclusively to your screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
