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
  Layers
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
    <div className="space-y-8 w-full max-w-3xl mx-auto text-black">
      {/* 1. Market Switcher Banner */}
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
            cUSDT Prize Vault (8.50% APY)
          </button>
          <button
            onClick={() => onChangeMarket("cUSDC")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeMarket === "cUSDC" 
                ? "bg-aura-yellow text-black font-black shadow-sm" 
                : "text-slate-500 hover:text-black"
            }`}
          >
            cUSDC Prize Vault (12.00% APY)
          </button>
        </div>

        <button
          onClick={handleAddToken}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700"
        >
          {isTokenAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <PlusCircle className="w-3.5 h-3.5 text-slate-500" />}
          <span>Add {marketCfg.symbol} to MetaMask</span>
        </button>
      </div>

      {/* 2. Main Vault Card */}
      <div className="aura-card p-6 sm:p-10 bg-white border border-slate-200 shadow-aura-md space-y-6">
        {/* Vault Header Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Shielded Prize Vault</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-200">
                {marketCfg.apy} APY Stream
              </span>
            </div>
            <h2 className="text-2xl font-black text-black">{marketCfg.name}</h2>
            <p className="text-xs text-slate-500 font-medium">
              Deposit {marketCfg.symbol} tokens to enter recurring prize draws. 100% principal safe with zero loss.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-right min-w-[140px]">
            <span className="text-[10px] font-bold text-amber-900 uppercase">Prize Pot</span>
            <div className="text-lg font-black text-amber-950">${totalPrizeReserve} <span className="text-xs font-normal">{marketCfg.symbol}</span></div>
          </div>
        </div>

        {/* Section Selector: [ Save / Withdraw ] vs [ Shield / Unshield Converter ] */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSection("save")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSection === "save"
                ? "bg-white text-black font-black shadow-sm"
                : "text-slate-500 hover:text-black"
            }`}
          >
            <PiggyBank className="w-4 h-4 text-amber-600" />
            <span>Deposit / Withdraw</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("shield")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeSection === "shield"
                ? "bg-white text-black font-black shadow-sm"
                : "text-slate-500 hover:text-black"
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Token Shielding Converter</span>
          </button>
        </div>

        {/* Section 1: Save / Withdraw */}
        {activeSection === "save" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Action Sub-Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("deposit")}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === "deposit" ? "bg-aura-yellow text-black font-black" : "text-slate-500"
                }`}
              >
                Deposit (Enter Draws)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("withdraw")}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === "withdraw" ? "bg-aura-yellow text-black font-black" : "text-slate-500"
                }`}
              >
                Withdraw (100% Zero-Loss)
              </button>
            </div>

            {/* Balances Display */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Wallet Balance:</span>
                <strong className="text-black font-mono font-bold text-sm">${walletBalance} {marketCfg.symbol}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Saved in Vault:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-emerald-800 font-mono font-black text-sm">
                    {decryptedBalance !== null ? `$${decryptedBalance}` : "••••••••"} {marketCfg.symbol}
                  </strong>
                  {account && (
                    <button
                      type="button"
                      onClick={onDecryptBalance}
                      className="text-slate-400 hover:text-black p-1"
                    >
                      {decryptedBalance !== null ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <label className="text-slate-700">
                  {activeTab === "deposit" ? "Amount to Deposit:" : "Amount to Withdraw:"}
                </label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-amber-800 hover:underline text-[11px]"
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
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 font-mono text-lg font-black text-black focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
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
                    className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            {!account ? (
              <button
                type="button"
                onClick={onConnect}
                className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow active:scale-95"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoadingAction}
                className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isLoadingAction && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>
                  {activeTab === "deposit" ? `Confirm Deposit of $${amount} ${marketCfg.symbol}` : `Withdraw $${amount} ${marketCfg.symbol}`}
                </span>
              </button>
            )}
          </form>
        )}

        {/* Section 2: Shield / Unshield Converter */}
        {activeSection === "shield" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShieldTab("shield")}
                className={`py-2 rounded-lg transition-all ${
                  shieldTab === "shield" ? "bg-aura-yellow text-black font-black" : "text-slate-500"
                }`}
              >
                Shield ({marketCfg.publicSymbol} → {marketCfg.symbol})
              </button>
              <button
                type="button"
                onClick={() => setShieldTab("unshield")}
                className={`py-2 rounded-lg transition-all ${
                  shieldTab === "unshield" ? "bg-aura-yellow text-black font-black" : "text-slate-500"
                }`}
              >
                Unshield ({marketCfg.symbol} → {marketCfg.publicSymbol})
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>ERC-7984 Confidential Token Shielding</span>
              </div>
              <p className="text-indigo-900 leading-relaxed font-medium">
                Shielding converts public ERC-20 tokens into encrypted confidential integers. Nobody can view your balance or track transfers on public explorers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <label className="text-slate-700">Amount to Convert:</label>
                <button
                  type="button"
                  onClick={handleMax}
                  className="text-amber-800 hover:underline text-[11px]"
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
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 font-mono text-lg font-black text-black focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                  {shieldTab === "shield" ? marketCfg.publicSymbol : marketCfg.symbol}
                </span>
              </div>
            </div>

            {!account ? (
              <button
                type="button"
                onClick={onConnect}
                className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow active:scale-95"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoadingAction}
                className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isLoadingAction && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>
                  {shieldTab === "shield" ? `Shield $${shieldAmount} ${marketCfg.publicSymbol} → ${marketCfg.symbol}` : `Unshield $${shieldAmount} ${marketCfg.symbol} → ${marketCfg.publicSymbol}`}
                </span>
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
