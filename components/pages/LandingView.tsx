"use client";

import React, { useState } from "react";
import { AuraLogo } from "@/components/AuraLogo";
import { 
  PiggyBank, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Droplets, 
  Lock, 
  Unlock,
  ChevronDown, 
  TrendingUp, 
  Users, 
  HelpCircle,
  Dices,
  Coins,
  ChevronRight,
  EyeOff
} from "lucide-react";
import { HiTrophy } from "react-icons/hi2";
import { FaShieldAlt } from "react-icons/fa";

interface LandingViewProps {
  onEnterApp: (tab?: "dashboard" | "vault" | "draws" | "rewards" | "activity" | "how-it-works", initialAmount?: string) => void;
  onOpenHowItWorks?: () => void;
  account?: string | null;
  onConnect?: () => void;
  isConnecting?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  onOpenHowItWorks,
  account,
  onConnect,
  isConnecting,
}) => {
  // Savings Calculator
  const [calcDeposit, setCalcDeposit] = useState<string>("50");
  const parsedDeposit = parseFloat(calcDeposit || "0");
  const estimatedYield = (parsedDeposit * 0.085).toFixed(2);
  const estimatedTickets = Math.floor(parsedDeposit);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is a 'No-Loss' Prize Savings Vault?",
      a: "Unlike traditional lotteries where ticket money is lost forever, AuraPool works like a high-yield prize savings protocol (inspired by PoolTogether). Deposited funds generate DeFi yield (8.50% APY). That interest is awarded in recurring prize draws. You can withdraw 100% of your principal at any time with zero loss.",
    },
    {
      q: "Why is FHE privacy essential for prize savings?",
      a: "On public blockchains, transparent pools leak how much every saver has deposited and their winning odds. Whales become targets for phishing and physical attacks. With Zama FHE, your balances and ticket counts are stored as encrypted euint64 ciphertexts onchain. Nobody can see your wealth.",
    },
    {
      q: "How are winners selected onchain?",
      a: "Draws execute onchain using Zama's FHE.randEuint64() randomness engine. Winner selection is deposit-weighted over encrypted balances without ever exposing any user's balance to the public.",
    },
    {
      q: "How do I claim my winnings or withdraw?",
      a: "Winners can decrypt and claim prize winnings directly to their wallet via the EIP-712 user-decryption flow, or auto-compound prizes into additional savings tickets. You can withdraw 100% of your principal anytime with zero loss.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-black">
      {/* 1. Top Navbar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <AuraLogo size="md" />

        <div className="flex items-center gap-3 font-medium text-xs">
          <button
            onClick={() => onEnterApp("how-it-works")}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>How It Works</span>
          </button>

          <button
            onClick={() => onEnterApp("vault")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all active:scale-95"
          >
            <Droplets className="w-4 h-4 text-amber-600" />
            <span>Get Test cUSDT</span>
          </button>

          <button
            onClick={() => onEnterApp("dashboard")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold shadow-aura-yellow transition-all hover:scale-105 active:scale-95"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
              <FaShieldAlt className="w-3.5 h-3.5 text-amber-600" />
              <span>Confidential PoolTogether Powered by Zama FHE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-black">
              Save Confidentially. <br />
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Win Without Loss.
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
              Deposit tokens, keep 100% of your principal safe, and win recurring prize pots funded by DeFi yield. Your deposit amounts, savings tickets, and winnings remain encrypted end-to-end with the Zama Protocol.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <PiggyBank className="w-4 h-4" />
                <span>Start Saving (100% Safe)</span>
              </button>

              <button
                onClick={() => onEnterApp("draws")}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Dices className="w-4 h-4 text-amber-600" />
                <span>View 1-Min Prize Draws</span>
              </button>
            </div>

            {/* Live Trust Metrics */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-xs font-medium text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Principal Safety:</span>
                <strong className="text-emerald-700 font-black text-sm">100% Zero-Loss</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Confidentiality:</span>
                <strong className="text-black font-black text-sm">Zama euint64</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Draw RNG:</span>
                <strong className="text-amber-800 font-black text-sm">FHE.randEuint64()</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Savings Card */}
          <div className="lg:col-span-5">
            <div className="aura-card p-6 sm:p-8 bg-white border border-amber-300 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-black">Live Vault Simulator</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-aura-yellow text-black font-extrabold">
                  8.50% APY
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-black">USD Shielded Prize Vault</h3>
                <p className="text-xs text-slate-500 mt-1">Deposit tokens to earn draw tickets without risking a single penny.</p>
              </div>

              {/* Slider */}
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between font-bold">
                  <label className="text-slate-700">Simulate Deposit Amount:</label>
                  <span className="text-amber-800 font-mono font-black">${parsedDeposit.toFixed(2)} cUSDT</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calcDeposit}
                  onChange={(e) => setCalcDeposit(e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Stats Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Draw Tickets Earned:</span>
                  <strong className="text-black">{estimatedTickets} Tickets</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Balance Privacy:</span>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold">Encrypted euint64</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Principal Withdrawable:</span>
                  <span className="text-emerald-700 font-extrabold">100% Anytime</span>
                </div>
              </div>

              <button
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Deposit & Enter Prize Draws</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section className="py-16 px-4 sm:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              Why Confidential Prize Savings Beats Traditional Lotteries
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Zero loss for savers, mathematically fair randomness, and end-to-end privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aura-card p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-black">100% Principal Safe</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                You never lose your deposit. Your principal is pooled to generate DeFi interest, which funds recurring prize draws. Withdraw anytime.
              </p>
            </div>

            <div className="aura-card p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-black">Encrypted euint64 Balances</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Deposit amounts and ticket holdings are stored as encrypted integers onchain. Observers and MEV bots cannot see your wealth.
              </p>
            </div>

            <div className="aura-card p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-black">Onchain FHE Randomness</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Zama's FHE.randEuint64() samples verifiable randomness onchain. Winner selection is deposit-weighted without revealing individual balances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-black">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 font-medium">Everything you need to know about AuraPool and Zama FHE.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="aura-card p-5 bg-white border border-slate-200 cursor-pointer transition-all"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-black">{faq.q}</h4>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </div>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 font-medium mt-3 leading-relaxed pt-3 border-t border-slate-100">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-slate-200 bg-white text-xs text-slate-500 text-center space-y-2">
        <AuraLogo size="sm" />
        <p>AuraPool Protocol — Confidential No-Loss Prize Savings Powered by Zama fhEVM.</p>
        <p className="text-[11px] text-slate-400">Deployed on Ethereum Sepolia Testnet</p>
      </footer>
    </div>
  );
};
