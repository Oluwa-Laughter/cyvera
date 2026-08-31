"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  ArrowDownRight, 
  ArrowUpRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  Droplets, 
  Sparkles, 
  AlertCircle 
} from "lucide-react";

interface VaultViewProps {
  account: string | null;
  walletBalance: string;
  decryptedBalance: string | null;
  isDecryptingBalance: boolean;
  onDecryptBalance: () => void;
  onDeposit: (amount: string) => Promise<void>;
  onWithdraw: (amount: string) => Promise<void>;
  onWithdrawAll: () => Promise<void>;
  onOpenFaucet: () => void;
  isLoadingAction: boolean;
  actionStatus: string;
}

export const VaultView: React.FC<VaultViewProps> = ({
  account,
  walletBalance,
  decryptedBalance,
  isDecryptingBalance,
  onDecryptBalance,
  onDeposit,
  onWithdraw,
  onWithdrawAll,
  onOpenFaucet,
  isLoadingAction,
  actionStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState<string>("");

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    await onDeposit(amount);
    setAmount("");
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    await onWithdraw(amount);
    setAmount("");
  };

  const handleSetPercent = (pct: number) => {
    if (activeTab === "deposit") {
      const bal = parseFloat(walletBalance.replace(/,/g, "")) || 0;
      setAmount((bal * pct).toFixed(2));
    } else {
      const bal = parseFloat((decryptedBalance || "250.00").replace(/,/g, "")) || 0;
      setAmount((bal * pct).toFixed(2));
    }
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* 1. Header Shielded Portfolio Card */}
      <div className="zama-card p-8 bg-gradient-to-br from-zama-card to-zama-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Shielded Savings Balance</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zama-yellow/10 text-zama-yellow border border-zama-yellow/30 font-bold">
                100% Principal Safe
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-2">
              <div className="text-4xl font-black font-mono text-white">
                {decryptedBalance !== null ? (
                  <span className="text-zama-yellow glow-text-yellow">
                    {decryptedBalance} <span className="text-base text-zama-yellow">cUSDT</span>
                  </span>
                ) : (
                  <span className="text-zinc-500 tracking-widest">
                    •••••••• <span className="text-base text-zinc-600">cUSDT</span>
                  </span>
                )}
              </div>

              {account && (
                <button
                  onClick={onDecryptBalance}
                  disabled={isDecryptingBalance}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-200 transition-all shadow-sm"
                >
                  {isDecryptingBalance ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : decryptedBalance !== null ? (
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
            <div>Your Odds Weight:</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {decryptedBalance !== null ? `${Math.floor(parseFloat(decryptedBalance))} Tickets` : "Confidential Tickets"}
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-2">
          <span>Encrypted Onchain &bull; No Balance Leakage</span>
          <span>Zero Loss Guaranteed</span>
        </div>
      </div>

      {/* 2. Interactive Action Box (Deposit / Withdraw) */}
      <div className="zama-card p-8">
        {/* Tab Selector */}
        <div className="flex p-1 bg-black rounded-xl border border-white/5 w-max mb-8 font-mono text-xs">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === "deposit"
                ? "bg-zama-yellow text-black shadow-zama-glow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Deposit & Save
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
              activeTab === "withdraw"
                ? "bg-zama-yellow text-black shadow-zama-glow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Withdraw Principal
          </button>
        </div>

        {/* Form */}
        <form onSubmit={activeTab === "deposit" ? handleDepositSubmit : handleWithdrawSubmit} className="space-y-6">
          {/* Label & Balances */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>{activeTab === "deposit" ? "Deposit Amount:" : "Withdraw Amount:"}</span>
            <div className="flex items-center gap-2">
              <span>
                {activeTab === "deposit"
                  ? `Wallet Balance: ${walletBalance} cUSDT`
                  : `Saved: ${decryptedBalance !== null ? decryptedBalance : "••••"} cUSDT`}
              </span>
              {activeTab === "deposit" && (
                <button
                  type="button"
                  onClick={onOpenFaucet}
                  className="text-zama-yellow hover:underline font-bold"
                >
                  +Faucet
                </button>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="p-4 rounded-2xl bg-zama-dark border border-white/10 flex items-center justify-between">
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoadingAction || !account}
              className="w-full bg-transparent text-2xl sm:text-3xl font-black font-mono text-white focus:outline-none placeholder:text-zinc-700"
            />
            <span className="px-3 py-1 rounded-xl bg-black border border-white/10 text-xs font-mono font-bold text-zama-yellow">
              cUSDT
            </span>
          </div>

          {/* Percentage Presets */}
          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleSetPercent(pct)}
                className="py-2.5 rounded-xl bg-zama-dark hover:bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-all"
              >
                {pct * 100}%
              </button>
            ))}
          </div>

          {/* Action Status Notice */}
          {actionStatus && (
            <div className="p-4 rounded-xl bg-zama-yellow/10 border border-zama-yellow/30 text-xs font-mono text-zama-yellow flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{actionStatus}</span>
            </div>
          )}

          {/* Submit Action */}
          {activeTab === "deposit" ? (
            <button
              type="submit"
              disabled={isLoadingAction || !account || !amount}
              className="w-full py-4 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-black text-sm font-mono tracking-tight transition-all shadow-zama-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoadingAction ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Onchain Transaction...</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Deposit Tokens into Confidential Vault</span>
                </>
              )}
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <button
                type="submit"
                disabled={isLoadingAction || !account || !amount}
                className="py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw Amount</span>
              </button>

              <button
                type="button"
                onClick={onWithdrawAll}
                disabled={isLoadingAction || !account}
                className="py-4 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-bold text-xs transition-all shadow-zama-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Instant 100% Exit</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
