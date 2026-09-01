"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  Coins,
  ChevronRight,
  TrendingUp,
  Droplets
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
  onConnect: () => void;
  isLoadingAction: boolean;
  actionStatus: string;
  initialDepositAmount?: string;
  totalDeposits: string;
  totalPrizeReserve: string;
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
  onConnect,
  isLoadingAction,
  actionStatus,
  initialDepositAmount = "",
  totalDeposits,
  totalPrizeReserve,
}) => {
  const [selectedVaultId, setSelectedVaultId] = useState<"usdt" | "weth" | "zama">("usdt");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState<string>(initialDepositAmount || "100");

  const vaults = [
    {
      id: "usdt" as const,
      name: "USD High-Yield Vault",
      token: "cUSDT",
      apy: "8.50%",
      frequency: "Daily",
      tvl: `$${totalDeposits}`,
      prizePot: `$${totalPrizeReserve}`,
      badge: "Active Main Vault",
      badgeColor: "bg-aura-yellow text-black",
      isLive: true,
    },
    {
      id: "weth" as const,
      name: "ETH Turbo Prize Vault",
      token: "WETH",
      apy: "5.40%",
      frequency: "Weekly",
      tvl: "$142,500",
      prizePot: "$2,850",
      badge: "Coming Soon",
      badgeColor: "bg-slate-100 text-slate-600",
      isLive: false,
    },
    {
      id: "zama" as const,
      name: "ZAMA Privacy Staking Vault",
      token: "ZAMA",
      apy: "12.00%",
      frequency: "Bi-Weekly",
      tvl: "$98,000",
      prizePot: "$1,960",
      badge: "Coming Soon",
      badgeColor: "bg-slate-100 text-slate-600",
      isLive: false,
    },
  ];

  const currentVault = vaults.find((v) => v.id === selectedVaultId) || vaults[0];

  const parsedAmount = parseFloat(amount || "0");
  const parsedWallet = parseFloat(walletBalance.replace(/,/g, "") || "0");
  const parsedSaved = parseFloat((decryptedBalance || "0").replace(/,/g, "") || "0");

  const handleQuickPreset = (val: number) => {
    if (activeTab === "deposit") {
      setAmount(Math.min(parsedWallet, val).toString());
    } else {
      setAmount(Math.min(parsedSaved, val).toString());
    }
  };

  const handleMax = () => {
    if (activeTab === "deposit") {
      setAmount(parsedWallet > 0 ? parsedWallet.toString() : "1000");
    } else {
      setAmount(parsedSaved > 0 ? parsedSaved.toString() : "250");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    if (activeTab === "deposit") {
      await onDeposit(amount);
    } else {
      await onWithdraw(amount);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Vault Selection Carousel / Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-black tracking-tight">Select a Prize Savings Vault</h2>
          <span className="text-xs text-slate-500 font-medium">100% Principal Protected</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {vaults.map((vault) => {
            const isSelected = selectedVaultId === vault.id;
            return (
              <button
                key={vault.id}
                onClick={() => setSelectedVaultId(vault.id)}
                className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-white border-amber-400 shadow-aura-md ring-2 ring-aura-yellow/50"
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black text-black">{vault.token}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${vault.badgeColor}`}>
                    {vault.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-black">{vault.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-black text-emerald-700">{vault.apy}</span>
                    <span className="text-xs text-slate-500 font-medium">APY Yield</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-600 font-medium w-full">
                  <span>Draws: <strong>{vault.frequency}</strong></span>
                  <span>Prize: <strong className="text-amber-700">{vault.prizePot}</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Vault Deposit / Withdraw Card */}
      <div className="aura-card p-6 sm:p-10 bg-white border border-slate-200 shadow-aura-md space-y-6">
        {/* Vault Header Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-black">{currentVault.name}</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                {currentVault.apy} APY
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Save {currentVault.token} tokens with zero loss and enter daily prize draws automatically.
            </p>
          </div>

          {/* User's Shielded Balance Pill */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div className="text-right">
              <span className="text-slate-500 text-[11px] block">Your Saved Balance:</span>
              <div className="font-black text-black text-sm">
                {account ? (
                  decryptedBalance !== null ? (
                    <span>${decryptedBalance} {currentVault.token}</span>
                  ) : (
                    <span className="tracking-widest text-slate-400">••••••</span>
                  )
                ) : (
                  <span className="text-slate-400">Not Connected</span>
                )}
              </div>
            </div>

            {account && (
              <button
                onClick={onDecryptBalance}
                disabled={isDecryptingBalance}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all shadow-sm active:scale-95"
                title={decryptedBalance !== null ? "Hide Balance" : "Reveal Private Balance"}
              >
                {isDecryptingBalance ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : decryptedBalance !== null ? (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tab Toggle: Deposit / Withdraw */}
        <div className="flex p-1.5 rounded-2xl bg-slate-100 max-w-sm mx-auto text-xs font-black">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "deposit"
                ? "bg-aura-yellow text-black shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Deposit & Win</span>
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "withdraw"
                ? "bg-white text-black shadow-sm"
                : "text-slate-600 hover:text-black"
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Withdraw Principal</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>{activeTab === "deposit" ? "Deposit Amount" : "Withdraw Amount"}</span>
              <div className="flex items-center gap-2">
                <span>
                  {activeTab === "deposit"
                    ? `Wallet: ${walletBalance} ${currentVault.token}`
                    : `Saved: ${decryptedBalance !== null ? `${decryptedBalance} ${currentVault.token}` : "••••••"}`}
                </span>
                {activeTab === "deposit" && (
                  <button
                    type="button"
                    onClick={onOpenFaucet}
                    className="text-amber-700 hover:underline font-bold"
                  >
                    +Get Test Tokens
                  </button>
                )}
              </div>
            </div>

            {/* Big Amount Input */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-3xl font-black text-slate-400">$</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-3xl sm:text-4xl font-black text-black focus:outline-none placeholder:text-slate-300"
                />
              </div>
              <span className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-800 shadow-sm">
                {currentVault.token}
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 pt-2 text-xs font-bold">
              {[50, 100, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickPreset(val)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all active:scale-95"
                >
                  +${val}
                </button>
              ))}
              <button
                type="button"
                onClick={handleMax}
                className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 transition-all active:scale-95"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Action Status Notice */}
          {actionStatus && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 animate-spin text-amber-700 shrink-0" />
              <span>{actionStatus}</span>
            </motion.div>
          )}

          {/* Action Button */}
          {!account ? (
            <button
              type="button"
              onClick={onConnect}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow active:scale-95"
            >
              Connect Wallet to Save
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoadingAction || !amount || parseFloat(amount) <= 0}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isLoadingAction ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Onchain Transaction...</span>
                </>
              ) : activeTab === "deposit" ? (
                <>
                  <PiggyBank className="w-4 h-4" />
                  <span>Deposit ${amount || "0"} & Enter Draws</span>
                </>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Withdraw ${amount || "0"} Instantly</span>
                </>
              )}
            </button>
          )}

          {/* Zero Loss Guarantee Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Principal Safe (No Risk of Loss)
            </span>
            <span>No lockups &bull; Instant Withdrawals</span>
          </div>
        </form>
      </div>
    </div>
  );
};
