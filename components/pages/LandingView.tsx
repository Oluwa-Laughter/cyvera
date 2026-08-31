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
  ChevronDown, 
  TrendingUp, 
  Users, 
  HelpCircle,
  Zap,
  Coins
} from "lucide-react";

interface LandingViewProps {
  onEnterApp: (tab?: "dashboard" | "vault" | "draws" | "rewards" | "yield") => void;
  onOpenFaucet: () => void;
  onOpenHowItWorks: () => void;
  totalDeposits: string;
  totalPrizeReserve: string;
  totalPrizesAwarded: string;
  depositorsCount: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  onOpenFaucet,
  onOpenHowItWorks,
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
      q: "What is a 'No-Loss' Prize Savings protocol?",
      a: "Unlike traditional lotteries where your ticket purchase is gone forever, AuraPool works like a high-yield savings account. Your deposit is pooled with other savers to earn DeFi yield (8.5% APY). The accrued interest is awarded in daily prize draws. You can withdraw 100% of your deposit at any time — you never lose a single cent of your principal.",
    },
    {
      q: "Why does privacy matter for PoolTogether?",
      a: "On standard transparent chains, everyone can see your wallet balance, how much money you have saved, and your odds of winning. Whales and large winners become targets for phishing and exploits. Powered by Zama, AuraPool keeps your balance and winner selections 100% confidential while remaining provably fair.",
    },
    {
      q: "How are winners picked fairly if balances are secret?",
      a: "Winner selection runs entirely onchain using Zama's Fully Homomorphic Encryption randomness. The protocol calculates winners weighted by how much each user saved without ever revealing individual account balances to the public.",
    },
    {
      q: "Can I withdraw my money at any time?",
      a: "Yes! There are no lockups, no withdrawal penalties, and no exit fees. You have full instant access to withdraw your deposited principal whenever you wish.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-black">
      {/* 1. Top Navbar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <AuraLogo size="md" />

        <div className="flex items-center gap-3 font-medium text-xs">
          <button
            onClick={onOpenHowItWorks}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>How It Works</span>
          </button>

          <button
            onClick={onOpenFaucet}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all"
          >
            <Droplets className="w-4 h-4 text-amber-600" />
            <span>Faucet</span>
          </button>

          <button
            onClick={() => onEnterApp("dashboard")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold shadow-aura-yellow transition-all hover:scale-105"
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
          <span>PoolTogether + Zama Confidentiality</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-[1.08] mb-6">
          Save Money with <span className="bg-aura-yellow px-3 py-0.5 rounded-2xl inline-block text-black shadow-aura-yellow">Zero Loss.</span>
          <br />
          Win Daily Prizes in <span className="underline decoration-aura-yellow decoration-wavy underline-offset-8">Private.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mb-10">
          The next-generation prize savings protocol. Earn yield, enter daily jackpot draws, and keep your personal net worth 100% confidential.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={() => onEnterApp("vault")}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow hover:scale-105"
          >
            <span>Start Saving with $0 Risk</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold shadow-aura-sm transition-all"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>How Does No-Loss Work?</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-left">
          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">Current Prize Pot</span>
            <div className="text-2xl font-black text-black mt-1">
              ${totalPrizeReserve} <span className="text-xs text-amber-600 font-bold">cUSDT</span>
            </div>
          </div>

          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">Total Shielded TVL</span>
            <div className="text-2xl font-black text-black mt-1">
              ${totalDeposits} <span className="text-xs text-slate-500 font-bold">cUSDT</span>
            </div>
          </div>

          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">DeFi APY Stream</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              8.50% <span className="text-xs text-emerald-600 font-bold">APY</span>
            </div>
          </div>

          <div className="aura-card p-5">
            <span className="text-xs font-semibold text-slate-500">Prizes Paid Out</span>
            <div className="text-2xl font-black text-black mt-1">
              ${totalPrizesAwarded} <span className="text-xs text-slate-500 font-bold">cUSDT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Savings Calculator */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="aura-card p-8 sm:p-10 relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Interactive Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                See How Much You Can Win
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
                  <span>Your Deposit:</span>
                  <span className="text-black text-sm">${calcDeposit} cUSDT</span>
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
                  <span>Daily Prize Tickets:</span>
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
                onClick={() => onEnterApp("vault")}
                className="w-full py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow"
              >
                Deposit & Save Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Cards */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-black tracking-tight">
            Why AuraPool Changes Everything
          </h2>
          <p className="text-sm text-slate-600">
            PoolTogether gave the world No-Loss savings. AuraPool adds essential privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="aura-card p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 w-max">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-black">Your Wealth Stays Private</h3>
            <p className="text-slate-600 leading-relaxed">
              On public blockchains, everyone sees your savings. On AuraPool, your deposit is encrypted — no one can track your net worth or target your wallet.
            </p>
          </div>

          <div className="aura-card p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-900 w-max">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-black">Provably Fair Draws</h3>
            <p className="text-slate-600 leading-relaxed">
              Winner selection runs onchain with mathematical randomness. Your chance to win scales with how much you save, without revealing balances.
            </p>
          </div>

          <div className="aura-card p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 w-max">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-black">100% Principal Protection</h3>
            <p className="text-slate-600 leading-relaxed">
              Your money is never wagered or spent. You can withdraw every cent of your original deposit at any time with instant onchain settlement.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
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

      {/* 6. Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <AuraLogo size="sm" />
          <div className="flex items-center gap-6">
            <span>Powered by Zama</span>
            <span>Ethereum Sepolia</span>
            <button onClick={onOpenHowItWorks} className="hover:text-black transition-colors font-medium">
              How It Works
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
