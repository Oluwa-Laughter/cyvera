"use client";

import React from "react";
import { 
  Trophy, 
  Gift, 
  ArrowDownToLine, 
  Repeat, 
  Sparkles, 
  RefreshCw, 
  KeyRound, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";
import confetti from "canvas-confetti";

interface RewardsViewProps {
  account: string | null;
  decryptedWinnings: string | null;
  isDecryptingWinnings: boolean;
  onDecryptWinnings: () => void;
  onClaimPrize: () => Promise<void>;
  onCompoundPrize: () => Promise<void>;
  isLoadingAction: boolean;
  actionStatus: string;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
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
      particleCount: 120,
      spread: 80,
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
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* 1. Header Rewards Card */}
      <div className="zama-card p-8 bg-gradient-to-br from-zama-card to-zama-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Secret Prize Rewards</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zama-yellow text-black font-bold">
                Winner-Only Decrypt
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-2">
              <div className="text-4xl font-black font-mono text-white">
                {decryptedWinnings !== null ? (
                  <span className="text-zama-yellow glow-text-yellow">
                    {decryptedWinnings} <span className="text-base text-zama-yellow">cUSDT</span>
                  </span>
                ) : (
                  <span className="text-zinc-500 tracking-widest">
                    •••••••• <span className="text-base text-zinc-600">cUSDT</span>
                  </span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptWinnings}
                  disabled={isDecryptingWinnings}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-200 transition-all shadow-sm"
                >
                  {isDecryptingWinnings ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : decryptedWinnings !== null ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5 text-zama-yellow" />
                      <span>Decrypt (EIP-712)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400 hidden sm:block">
            <div>Settlement:</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">Instant Onchain</div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-2">
          <span>Only you hold the private key to decrypt your winnings</span>
          <span>Zero public payout broadcast</span>
        </div>
      </div>

      {/* 2. Claim / Compound Action Box */}
      <div className="zama-card p-8">
        {hasWinnings ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-zama-yellow/10 border border-zama-yellow/30 flex items-center gap-3 text-xs font-mono text-zama-yellow">
              <Sparkles className="w-5 h-5 text-zama-yellow shrink-0" />
              <span>
                <strong className="text-white">Congratulations!</strong> Your wallet was selected as the secret winner. Claim tokens to your wallet or auto-compound to boost your future tickets.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <button
                onClick={handleClaim}
                disabled={isLoadingAction}
                className="py-4 px-6 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-extrabold text-xs transition-all shadow-zama-glow flex items-center justify-center gap-2"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Claim Prize to Wallet</span>
              </button>

              <button
                onClick={handleCompound}
                disabled={isLoadingAction}
                className="py-4 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Repeat className="w-4 h-4 text-zama-yellow" />
                <span>Auto-Compound to Principal</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl bg-zama-dark border border-white/5 space-y-2 font-mono text-xs">
            <Trophy className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-white font-bold">No Unclaimed Winnings Detected</p>
            <p className="text-zinc-400">
              Click &quot;Decrypt (EIP-712)&quot; above to verify your secret winning status onchain!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
