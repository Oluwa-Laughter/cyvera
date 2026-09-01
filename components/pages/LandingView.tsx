"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  EyeOff,
  AlertTriangle
} from "lucide-react";

interface LandingViewProps {
  onEnterApp: (tab?: "dashboard" | "vault" | "draws" | "rewards" | "how-it-works", initialAmount?: string) => void;
  onOpenFaucet: () => void;
  totalDeposits: string;
  totalPrizeReserve: string;
  totalPrizesAwarded: string;
  depositorsCount: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  onOpenFaucet,
  totalDeposits,
  totalPrizeReserve,
  totalPrizesAwarded,
  depositorsCount,
}) => {
  // Savings Calculator
  const [calcDeposit, setCalcDeposit] = useState<string>("500");
  const parsedDeposit = parseFloat(calcDeposit || "0");
  const estimatedYield = (parsedDeposit * 0.085).toFixed(2);
  const estimatedTickets = Math.floor(parsedDeposit);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is a 'No-Loss' Prize Savings vault?",
      a: "Unlike traditional lotteries where your ticket purchase is spent forever, AuraPool works like a high-yield savings account. Your deposit is pooled with other savers to earn DeFi lending yield (8.50% APY). That interest is awarded in daily prize draws. You can withdraw 100% of your deposit at any time — you never lose your principal.",
    },
    {
      q: "Why is financial privacy important?",
      a: "On standard public blockchains, anyone can see your wallet balance, how much money you have saved, and who won the jackpot. Large savers become immediate targets for scammers and phishing. AuraPool keeps your balance and winning status completely confidential.",
    },
    {
      q: "How are winners picked fairly?",
      a: "Draws execute automatically onchain every 24 hours using decentralized verifiable randomness. Winner chances are strictly proportional to how much you saved without exposing your balance to the public.",
    },
    {
      q: "Can I withdraw my money at any time?",
      a: "Yes! There are no lockups, no withdrawal penalties, and no exit fees. You have instant access to withdraw 100% of your deposited funds whenever you wish.",
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
            onClick={onOpenFaucet}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all active:scale-95"
          >
            <Droplets className="w-4 h-4 text-amber-600" />
            <span>Get Test Tokens</span>
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
      <section className="relative px-4 sm:px-8 pt-16 pb-20 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Confidential Prize Savings Protocol</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-[1.08] mb-6">
          Save Money with <span className="bg-aura-yellow px-3 py-0.5 rounded-2xl inline-block text-black shadow-aura-yellow">Zero Loss.</span>
          <br />
          Win Daily Prizes in <span className="underline decoration-aura-yellow decoration-wavy underline-offset-8">Private.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mb-10">
          Deposit tokens to earn daily prize draw tickets. 100% of your deposit stays yours to withdraw anytime while earning chances at big jackpot prizes.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={() => onEnterApp("vault")}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow hover:scale-105 active:scale-95"
          >
            <span>Start Saving with $0 Risk</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEnterApp("how-it-works")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold shadow-aura-sm transition-all active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>How Does No-Loss Work?</span>
          </button>
        </div>

        {/* Stats Grid (100% Live Real Data) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-left">
          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">Current Prize Pot</span>
            <div className="text-2xl font-black text-black mt-1">
              ${totalPrizeReserve} <span className="text-xs text-amber-700 font-bold">cUSDT</span>
            </div>
          </div>

          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">Total Shielded TVL</span>
            <div className="text-2xl font-black text-black mt-1">
              ${totalDeposits} <span className="text-xs text-slate-500 font-bold">cUSDT</span>
            </div>
          </div>

          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">DeFi APY Yield</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              8.50% <span className="text-xs text-emerald-600 font-bold">APY</span>
            </div>
          </div>

          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">Prizes Awarded</span>
            <div className="text-2xl font-black text-black mt-1">
              ${totalPrizesAwarded} <span className="text-xs text-slate-500 font-bold">cUSDT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4-Step Visual Flow */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-black tracking-tight">
            How You Save & Win on AuraPool
          </h2>
          <p className="text-sm text-slate-600">
            A simple, non-custodial savings loop where your principal is always protected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
          <div className="aura-card p-6 border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center font-black text-amber-900 text-sm">
              01
            </div>
            <h3 className="text-base font-black text-black">Deposit Tokens</h3>
            <p className="text-slate-600 leading-relaxed">
              Deposit cUSDT tokens into the pool. You get 1 prize ticket per dollar saved. Your balance is 100% private.
            </p>
          </div>

          <div className="aura-card p-6 border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center font-black text-emerald-900 text-sm">
              02
            </div>
            <h3 className="text-base font-black text-black">Lending Yield</h3>
            <p className="text-slate-600 leading-relaxed">
              Deposited funds generate 8.50% lending APY. That interest continuously streams into the prize pot.
            </p>
          </div>

          <div className="aura-card p-6 border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center font-black text-purple-900 text-sm">
              03
            </div>
            <h3 className="text-base font-black text-black">Win in Secret</h3>
            <p className="text-slate-600 leading-relaxed">
              Daily draws award the prize pot to a random saver without exposing who won to the public.
            </p>
          </div>

          <div className="aura-card p-6 border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center font-black text-amber-900 text-sm">
              04
            </div>
            <h3 className="text-base font-black text-black">Withdraw 100%</h3>
            <p className="text-slate-600 leading-relaxed">
              Withdraw all your deposited principal at any time with zero penalties or lockup fees.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Live Active Savings Vault Card */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="aura-card p-8 sm:p-10 border border-amber-300 bg-white shadow-aura-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-aura-yellow text-black">
                  Active Live Vault
                </span>
                <span className="text-xs font-bold text-slate-500">Ethereum Sepolia</span>
              </div>
              <h3 className="text-2xl font-black text-black">USD High-Yield Prize Vault</h3>
              <p className="text-xs text-slate-600">
                Deposit USD stablecoins (cUSDT) with zero risk and participate in automated daily prize draws.
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-emerald-700">8.50%</span>
              <span className="text-xs text-slate-500 block font-medium">APY Lending Yield</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Current Grand Prize:</span>
              <strong className="text-black text-sm font-black">${totalPrizeReserve} cUSDT</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Total Shielded TVL:</span>
              <strong className="text-black text-sm font-black">${totalDeposits}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-slate-500 text-[11px] block">Savers Participating:</span>
              <strong className="text-black text-sm font-black">{depositorsCount} Savers</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onEnterApp("vault")}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
            >
              <PiggyBank className="w-4 h-4" />
              <span>Deposit & Save in Vault</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Interactive Savings Calculator */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="aura-card p-8 sm:p-10 relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Savings Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Calculate Your Draw Tickets
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Deposit tokens into the pool to receive 1 ticket per dollar. Your principal stays safe forever while participating in every daily draw.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Principal Safe &bull; Withdraw Any Time</span>
              </div>
            </div>

            {/* Interactive Slider Box */}
            <div className="w-full md:w-80 bg-white p-6 rounded-3xl border border-slate-200 shadow-aura-md space-y-5 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 font-bold mb-2">
                  <span>Your Savings Deposit:</span>
                  <span className="text-black text-sm font-black">${calcDeposit} cUSDT</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={calcDeposit}
                  onChange={(e) => setCalcDeposit(e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Daily Draw Tickets:</span>
                  <span className="font-extrabold text-black">{estimatedTickets} Tickets</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Annual Yield Pool:</span>
                  <span className="font-extrabold text-emerald-600">+${estimatedYield} cUSDT</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Risk of Principal Loss:</span>
                  <span className="font-extrabold text-black">0.00%</span>
                </div>
              </div>

              <button
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow active:scale-95"
              >
                Deposit & Save Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-12 px-4 sm:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Simple answers to how prize savings works on AuraPool.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="aura-card p-5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm font-bold text-black flex items-center gap-2">
                    <span className="text-amber-600">Q:</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-black" : ""}`} />
                </button>

                {isOpen && (
                  <p className="mt-3 pt-3 border-t border-slate-100 text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <AuraLogo size="sm" />
          <div className="flex items-center gap-6">
            <span>Confidential Prize Savings</span>
            <span>Ethereum Sepolia</span>
            <button onClick={() => onEnterApp("how-it-works")} className="hover:text-black transition-colors font-medium">
              How It Works
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
