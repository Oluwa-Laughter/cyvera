"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowDownToLine, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  Coins, 
  TrendingUp, 
  Droplets, 
  PlusCircle, 
  Check, 
  AlertCircle,
  Repeat,
  Lock,
  Unlock,
  Shield,
  Layers,
  ChevronRight
} from "lucide-react";
import { addTokenToWallet } from "@/lib/wallet";
import { ActiveMarketId, CONTRACT_ADDRESSES, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";

interface VaultViewProps {
  account: string | null;
  activeMarket: ActiveMarketId;
  onChangeMarket: (m: ActiveMarketId) => void;
  walletBalance: string;
  publicWalletBalance?: string;
  shieldedBalance?: string;
  decryptedBalance: string | null;
  isDecryptingBalance: boolean;
  onDecryptBalance: () => void;
  onDeposit: (amount: string) => Promise<void>;
  onWithdraw: (amount: string) => Promise<void>;
  onWithdrawAll: () => Promise<void>;
  onShield?: (amount: string) => Promise<void>;
  onUnshield?: (amount: string) => Promise<void>;
  onOpenFaucet: () => void;
  onConnect: () => void;
  isLoadingAction: boolean;
  initialDepositAmount?: string;
  totalDeposits: string;
  totalPrizeReserve: string;
}

export const VaultView: React.FC<VaultViewProps> = ({
  account,
  activeMarket,
  onChangeMarket,
  walletBalance,
  publicWalletBalance = "1000.00",
  shieldedBalance = "0.00",
  decryptedBalance,
  isDecryptingBalance,
  onDecryptBalance,
  onDeposit,
  onWithdraw,
  onWithdrawAll,
  onShield,
  onUnshield,
  onOpenFaucet,
  onConnect,
  isLoadingAction,
  initialDepositAmount = "",
  totalDeposits,
  totalPrizeReserve,
}) => {
  const [activeSection, setActiveSection] = useState<"save" | "shield">("save");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [shieldTab, setShieldTab] = useState<"shield" | "unshield">("shield");
  const [amount, setAmount] = useState<string>(initialDepositAmount || "50");
  const [shieldAmount, setShieldAmount] = useState<string>("100");
  const [isTokenAdded, setIsTokenAdded] = useState(false);

  const marketCfg = ZAMA_SEPOLIA_CONFIG.markets[activeMarket];
  const parsedWallet = parseFloat(walletBalance.replace(/,/g, "") || "0");
  const parsedSaved = parseFloat((decryptedBalance || "0").replace(/,/g, "") || "0");
  const parsedPublic = parseFloat(publicWalletBalance.replace(/,/g, "") || "0");

  const handleQuickPreset = (val: number) => {
    if (activeSection === "save") {
      if (activeTab === "deposit") {
        setAmount(val.toString());
      } else {
        setAmount(Math.min(parsedSaved, val).toString());
      }
    } else {
      setShieldAmount(val.toString());
    }
  };

  const handleMax = () => {
    if (activeSection === "save") {
      if (activeTab === "deposit") {
        setAmount(parsedWallet > 0 ? parsedWallet.toString() : "0");
      } else {
        setAmount(parsedSaved > 0 ? parsedSaved.toString() : "0");
      }
    } else {
      if (shieldTab === "shield") {
        setShieldAmount(parsedPublic > 0 ? parsedPublic.toString() : "0");
      } else {
        setShieldAmount(parsedWallet > 0 ? parsedWallet.toString() : "0");
      }
    }
  };

  const handleAddToken = async () => {
    const success = await addTokenToWallet(marketCfg.underlying, marketCfg.symbol, marketCfg.decimals);
    if (success) {
      setIsTokenAdded(true);
      setTimeout(() => setIsTokenAdded(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSection === "save") {
      if (!amount || parseFloat(amount) <= 0) return;
      if (activeTab === "deposit") {
        await onDeposit(amount);
      } else {
        await onWithdraw(amount);
      }
    } else {
      if (!shieldAmount || parseFloat(shieldAmount) <= 0) return;
      if (shieldTab === "shield" && onShield) {
        await onShield(shieldAmount);
      } else if (shieldTab === "unshield" && onUnshield) {
        await onUnshield(shieldAmount);
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* 1. Market Switcher (High-End Island Tabs) */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#0B0E17]/80 backdrop-blur-xl border border-white/[0.08] shadow-lg">
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => onChangeMarket("cUSDT")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeMarket === "cUSDT" 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.35)]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeMarket === "cUSDT" ? "bg-slate-950 animate-pulse" : "bg-cyan-500/50"}`} />
            <span>cUSDT Vault (8.50% APY)</span>
          </button>
          <button
            onClick={() => onChangeMarket("cUSDC")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeMarket === "cUSDC" 
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.35)]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeMarket === "cUSDC" ? "bg-slate-950 animate-pulse" : "bg-cyan-500/50"}`} />
            <span>cUSDC Vault (12.00% APY)</span>
          </button>
        </div>

        <button
          onClick={handleAddToken}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111624] hover:bg-[#182032] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          {isTokenAdded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />}
          <span>Add {marketCfg.symbol} to MetaMask</span>
        </button>
      </div>

      {/* 2. Main Vault Card (Double-Bezel Architecture) */}
      <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-5 sm:p-7 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-6">
          
          {/* Vault Header Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  Shielded Vault • {activeMarket}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {marketCfg.apy} APY Stream
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{marketCfg.name}</h2>
              <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-xl">
                Deposit {marketCfg.symbol} tokens to generate private draw tickets. 100% of your principal is always protected with zero loss.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111624] border border-white/[0.08] text-right min-w-[140px] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Prize Pot</span>
              <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                ${totalPrizeReserve} <span className="text-xs font-normal text-slate-400 font-sans">{marketCfg.symbol}</span>
              </div>
            </div>
          </div>

          {/* Section Selector: [ Save / Withdraw ] vs [ Shield / Unshield Converter ] */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#0E1322] border border-white/[0.06] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSection("save")}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeSection === "save"
                  ? "bg-[#172033] text-white font-bold border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PiggyBank className="w-4 h-4 text-cyan-400" />
              <span>Deposit & Withdraw</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("shield")}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeSection === "shield"
                  ? "bg-[#172033] text-white font-bold border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Shielding Converter</span>
            </button>
          </div>

          {/* Section 1: Save / Withdraw */}
          {activeSection === "save" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Action Sub-Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0E1322] border border-white/[0.05] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("deposit")}
                  className={`py-2.5 rounded-lg transition-all ${
                    activeTab === "deposit" 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Deposit (Enter Draws)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("withdraw")}
                  className={`py-2.5 rounded-lg transition-all ${
                    activeTab === "withdraw" 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Withdraw (100% Zero-Loss)
                </button>
              </div>

              {/* Balances Display */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#101524] border border-white/[0.06] text-xs shadow-inner">
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Wallet Balance:</span>
                  <strong className="text-white font-mono font-bold text-sm sm:text-base">${walletBalance} {marketCfg.symbol}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Saved in Vault:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-emerald-400 font-mono font-bold text-sm sm:text-base">
                      {decryptedBalance !== null ? `$${decryptedBalance}` : "••••••••"} {marketCfg.symbol}
                    </strong>
                    {account && (
                      <button
                        type="button"
                        onClick={onDecryptBalance}
                        className="text-slate-400 hover:text-white p-1 transition-colors"
                      >
                        {decryptedBalance !== null ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Form */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label className="text-slate-300">
                    {activeTab === "deposit" ? "Amount to Deposit:" : "Amount to Withdraw:"}
                  </label>
                  <button
                    type="button"
                    onClick={handleMax}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold hover:underline"
                  >
                    Use Max
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#101524] border border-white/[0.08] font-mono text-base font-bold text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 font-mono">
                    {marketCfg.symbol}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1">
                  {[25, 50, 100, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickPreset(val)}
                      className="flex-1 py-1.5 rounded-xl bg-[#111624] hover:bg-[#182032] border border-white/[0.06] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    >
                      +${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              {!account ? (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={onConnect}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                >
                  Connect Wallet
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoadingAction}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isLoadingAction && <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />}
                  <span>
                    {activeTab === "deposit" ? `Confirm Deposit of $${amount} ${marketCfg.symbol}` : `Withdraw $${amount} ${marketCfg.symbol}`}
                  </span>
                </motion.button>
              )}
            </form>
          )}

          {/* Section 2: Shield / Unshield Converter */}
          {activeSection === "shield" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0E1322] border border-white/[0.05] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShieldTab("shield")}
                  className={`py-2.5 rounded-lg transition-all ${
                    shieldTab === "shield" 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Shield ({marketCfg.publicSymbol} → {marketCfg.symbol})
                </button>
                <button
                  type="button"
                  onClick={() => setShieldTab("unshield")}
                  className={`py-2.5 rounded-lg transition-all ${
                    shieldTab === "unshield" 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Unshield ({marketCfg.symbol} → {marketCfg.publicSymbol})
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Private Token Shielding</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-normal">
                  Shielding wraps public tokens into confidential assets. Balances and transaction amounts remain encrypted and hidden from public block explorers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label className="text-slate-300">Amount to Convert:</label>
                  <button
                    type="button"
                    onClick={handleMax}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold hover:underline"
                  >
                    Use Max
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    value={shieldAmount}
                    onChange={(e) => setShieldAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#101524] border border-white/[0.08] font-mono text-base font-bold text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 font-mono">
                    {shieldTab === "shield" ? marketCfg.publicSymbol : marketCfg.symbol}
                  </span>
                </div>
              </div>

              {!account ? (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={onConnect}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                >
                  Connect Wallet
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoadingAction}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isLoadingAction && <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />}
                  <span>
                    {shieldTab === "shield"
                      ? `Shield $${shieldAmount} ${marketCfg.publicSymbol} → ${marketCfg.symbol}`
                      : `Unshield $${shieldAmount} ${marketCfg.symbol} → ${marketCfg.publicSymbol}`}
                  </span>
                </motion.button>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
