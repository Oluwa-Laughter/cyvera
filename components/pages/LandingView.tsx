"use client";

import React, { useState } from "react";
import { ZamaLogo } from "@/components/ZamaLogo";
import { 
  Shield, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Dices, 
  Trophy, 
  CheckCircle2, 
  Droplets, 
  ExternalLink, 
  ChevronDown, 
  TrendingUp, 
  Cpu, 
  Users 
} from "lucide-react";

interface LandingViewProps {
  onEnterApp: (tab?: "dashboard" | "vault" | "draws" | "rewards" | "yield") => void;
  onOpenFaucet: () => void;
  onOpenSpecs: () => void;
  totalDeposits: string;
  totalPrizeReserve: string;
  totalPrizesAwarded: string;
  depositorsCount: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  onOpenFaucet,
  onOpenSpecs,
  totalDeposits,
  totalPrizeReserve,
  totalPrizesAwarded,
  depositorsCount,
}) => {
  // Savings Calculator State
  const [calcDeposit, setCalcDeposit] = useState<string>("1000");
  const parsedDeposit = parseFloat(calcDeposit || "0");
  const estimatedYieldPerYear = (parsedDeposit * 0.085).toFixed(2);
  const estimatedTickets = Math.floor(parsedDeposit);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How is VeilPrize different from traditional PoolTogether?",
      a: "On traditional PoolTogether, every user's deposit amount, net worth, individual odds of winning, and prize payouts are public to everyone. VeilPrize uses Zama Fully Homomorphic Encryption (fhEVM) to keep all balances and draw evaluations encrypted end-to-end. Only the winner decrypts the outcome.",
    },
    {
      q: "How does the 'No-Loss' guarantee work?",
      a: "Your deposited principal is never spent on lottery tickets. Instead, the collective pool deposits earn DeFi yield (e.g. 8.5% APY from Aave/Compound). Only the generated yield is distributed in periodic prize draws. You can withdraw 100% of your deposit at any time.",
    },
    {
      q: "How are winners selected if balances are encrypted?",
      a: "Winner selection runs entirely onchain using Zama's FHE randomness (FHE.randEuint64). The smart contract performs mathematical comparisons over encrypted balances to select a winner weighted by deposit size without revealing any individual balance to observers.",
    },
    {
      q: "How do I claim my prize winnings?",
      a: "Prize allocations are encrypted. When you connect your wallet and sign an EIP-712 authorization token, your wallet securely decrypts your pending winnings. You can claim them directly to your wallet or auto-compound them into your principal to boost your future draw tickets.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zama-black text-white">
      {/* 1. Header Navigation */}
      <header className="w-full border-b border-zama-border bg-zama-black/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between">
        <ZamaLogo size="md" />

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={onOpenSpecs}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-zama-yellow" />
            <span>Architecture</span>
          </button>

          <button
            onClick={onOpenFaucet}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zama-yellow/10 hover:bg-zama-yellow/20 border border-zama-yellow/30 text-zama-yellow font-bold transition-all"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Faucet</span>
          </button>

          <button
            onClick={() => onEnterApp("dashboard")}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-bold tracking-tight transition-all shadow-zama-glow"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-8 pt-20 pb-24 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Glow Orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-zama-yellow/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zama-yellow/10 border border-zama-yellow/30 text-zama-yellow text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-zama-yellow animate-pulse" />
          <span>Zama Developer Program &bull; Season 4 Bounty Track</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6">
          Save with <span className="text-zama-yellow">Zero Loss.</span>
          <br />
          Win Yield in <span className="underline decoration-zama-yellow decoration-wavy underline-offset-8">Secret.</span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-10">
          The confidential prize savings protocol powered by the Zama Protocol on Ethereum Sepolia. Keep your savings balance, odds, and payouts completely private.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto font-mono mb-16">
          <button
            onClick={() => onEnterApp("vault")}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-extrabold text-sm tracking-tight transition-all shadow-zama-glow hover:scale-105"
          >
            <span>Enter Savings Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEnterApp("draws")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-sm font-semibold transition-all"
          >
            <Dices className="w-4 h-4 text-zama-yellow" />
            <span>Explore Live Draws</span>
          </button>
        </div>

        {/* Live Metrics Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left font-mono">
          <div className="zama-card p-5">
            <span className="text-xs text-zinc-400">Total Shielded TVL</span>
            <div className="text-2xl font-black text-white mt-1">{totalDeposits} <span className="text-xs text-zama-yellow">cUSDT</span></div>
          </div>

          <div className="zama-card p-5">
            <span className="text-xs text-zinc-400">Current Prize Pot</span>
            <div className="text-2xl font-black text-zama-yellow mt-1">{totalPrizeReserve} <span className="text-xs text-zama-yellow">cUSDT</span></div>
          </div>

          <div className="zama-card p-5">
            <span className="text-xs text-zinc-400">Dynamic APY</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">8.50% <span className="text-xs text-emerald-400">APY</span></div>
          </div>

          <div className="zama-card p-5">
            <span className="text-xs text-zinc-400">Prizes Distributed</span>
            <div className="text-2xl font-black text-white mt-1">{totalPrizesAwarded} <span className="text-xs text-zinc-400">cUSDT</span></div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Savings Calculator */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="zama-card p-8 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-md space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zama-yellow font-bold">
                Interactive Simulator
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Calculate Your Secret Winning Power
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Deposit tokens into the confidential pool. Your balance stays strictly encrypted while generating draw tickets.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Principal Safe & Instant Withdrawal</span>
              </div>
            </div>

            {/* Calculator Control Box */}
            <div className="w-full md:w-80 bg-zama-dark p-6 rounded-2xl border border-white/5 space-y-5 font-mono text-xs">
              <div>
                <div className="flex justify-between text-zinc-400 mb-2">
                  <span>Simulated Deposit:</span>
                  <span className="font-bold text-white">{calcDeposit} cUSDT</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={calcDeposit}
                  onChange={(e) => setCalcDeposit(e.target.value)}
                  className="w-full accent-zama-yellow cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Draw Tickets:</span>
                  <span className="font-bold text-zama-yellow">{estimatedTickets} Tickets</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Annual Yield Accrued:</span>
                  <span className="font-bold text-emerald-400">+{estimatedYieldPerYear} cUSDT</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Risk of Principal Loss:</span>
                  <span className="font-bold text-white">0.00%</span>
                </div>
              </div>

              <button
                onClick={() => onEnterApp("vault")}
                className="w-full py-3 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-extrabold text-xs transition-all shadow-zama-glow"
              >
                Deposit & Save Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Pillars Comparison Grid */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-zama-yellow font-bold">
            The Zama Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Confidential Savings Protects You
          </h2>
          <p className="text-sm text-zinc-400">
            Why traditional transparent lotteries fail and how FHE cryptography changes everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="zama-card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-zama-yellow/10 border border-zama-yellow/30 text-zama-yellow w-max">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Wealth Exposure</h3>
            <p className="text-zinc-400 leading-relaxed">
              No observer or bot on Etherscan can inspect how much capital you hold. Balances stay encrypted as euint64 ciphertexts.
            </p>
          </div>

          <div className="zama-card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-zama-yellow/10 border border-zama-yellow/30 text-zama-yellow w-max">
              <Dices className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Deposit-Weighted Draws</h3>
            <p className="text-zinc-400 leading-relaxed">
              Onchain FHE randomness calculates winner selection proportionally to encrypted deposit weights without revealing amounts.
            </p>
          </div>

          <div className="zama-card p-6 space-y-3">
            <div className="p-3 rounded-xl bg-zama-yellow/10 border border-zama-yellow/30 text-zama-yellow w-max">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Private Winner Claim</h3>
            <p className="text-zinc-400 leading-relaxed">
              Only the winning depositor can decrypt their prize using EIP-712 signatures. Zero public broadcasts of winner payouts.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about VeilPrize and Zama fhEVM.
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="zama-card p-5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-zama-yellow">Q:</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180 text-zama-yellow" : ""}`} />
                </button>

                {isOpen && (
                  <p className="mt-3 pt-3 border-t border-white/5 text-zinc-300 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="w-full border-t border-zama-border bg-zama-dark py-8 px-4 sm:px-8 font-mono text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <ZamaLogo size="sm" />
          <div className="flex items-center gap-6">
            <span>Powered by Zama fhEVM</span>
            <span>Ethereum Sepolia</span>
            <a
              href="https://docs.zama.org"
              target="_blank"
              rel="noreferrer"
              className="text-zama-yellow hover:underline flex items-center gap-1"
            >
              <span>Zama Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
