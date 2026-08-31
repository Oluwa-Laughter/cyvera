"use client";

import React from "react";
import { Trophy, Gift, ArrowDownToLine, Repeat, Sparkles, RefreshCw, KeyRound, EyeOff, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface MyWinningsCardProps {
  account: string | null;
  decryptedWinnings: string | null;
  isDecryptingWinnings: boolean;
  onDecryptWinnings: () => void;
  onClaimPrize: () => Promise<void>;
  onCompoundPrize: () => Promise<void>;
  isLoadingAction: boolean;
  actionStatus: string;
}

export const MyWinningsCard: React.FC<MyWinningsCardProps> = ({
  account,
  decryptedWinnings,
  isDecryptingWinnings,
  onDecryptWinnings,
  onClaimPrize,
  onCompoundPrize,
  isLoadingAction,
  actionStatus,
}) => {
  const hasWinnings = parseFloat(decryptedWinnings || "0") > 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
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
    <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-emerald-500/30">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>My Prize Rewards</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Winner-Only Decrypt
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Prize awards are encrypted end-to-end. Only the winner can decrypt and claim winnings.
              </p>
            </div>
          </div>
        </div>

        {/* Winnings Display Box */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <span>Unclaimed Confidential Winnings</span>
              <span className="text-[10px] text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                FHE State
              </span>
            </div>

            <div className="text-3xl font-extrabold font-mono tracking-tight text-slate-100 mt-1 flex items-baseline gap-2">
              {decryptedWinnings !== null ? (
                <span className="text-emerald-300 glow-text-emerald">
                  {decryptedWinnings} <span className="text-xs text-emerald-400">cUSDT</span>
                </span>
              ) : (
                <span className="tracking-widest text-slate-400">
                  •••••••• <span className="text-xs text-slate-500">cUSDT</span>
                </span>
              )}
            </div>
          </div>

          {/* Decryption Action */}
          {account ? (
            <button
              onClick={onDecryptWinnings}
              disabled={isDecryptingWinnings}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-300 transition-all shadow-glowEmerald disabled:opacity-50"
            >
              {isDecryptingWinnings ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing EIP-712...</span>
                </>
              ) : decryptedWinnings !== null ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hide Winnings</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Decrypt Winnings (EIP-712)</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs font-mono text-slate-500">Connect wallet to view</span>
          )}
        </div>

        {/* Claim / Compound Actions */}
        {hasWinnings ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Congratulations! You have won onchain prize savings. Claim or compound below.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleClaim}
                disabled={isLoadingAction}
                className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs font-mono tracking-wide transition-all shadow-glowEmerald flex items-center justify-center gap-2"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Claim Prize to Wallet</span>
              </button>

              <button
                onClick={handleCompound}
                disabled={isLoadingAction}
                className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-300 font-bold text-xs font-mono tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <Repeat className="w-4 h-4 text-emerald-400" />
                <span>Auto-Compound to Principal</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono text-slate-400">
            <p>Decrypt above to verify if your wallet won any past draws!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>EIP-712 User-Decryption</span>
        <span>Confidential Settlement</span>
      </div>
    </div>
  );
};
