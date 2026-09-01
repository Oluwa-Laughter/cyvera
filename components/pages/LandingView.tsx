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
  Cpu,
  Video,
  ExternalLink,
  Twitter,
  Dices,
  RefreshCw
} from "lucide-react";

interface LandingViewProps {
  onEnterApp: (tab?: "dashboard" | "vault" | "draws" | "rewards" | "yield" | "how-it-works", initialAmount?: string) => void;
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

  // Live Draw Simulator on Landing
  const [simDrawRunning, setSimDrawRunning] = useState<boolean>(false);
  const [simWinnerResult, setSimWinnerResult] = useState<string | null>(null);

  const handleSimulateDraw = async () => {
    setSimDrawRunning(true);
    setSimWinnerResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    setSimWinnerResult("0x7f...82a (Encrypted Ticket #382 Selected)");
    setSimDrawRunning(false);
  };

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is a 'No-Loss' Prize Savings protocol?",
      a: "Unlike traditional lotteries where your ticket purchase is spent forever, AuraPool works like a high-yield savings vault. Your deposit is pooled with other savers to earn DeFi yield (8.50% APY). The accrued interest is awarded in daily prize draws. You can withdraw 100% of your deposit at any time — you never lose a single cent of your principal.",
    },
    {
      q: "Why does privacy matter for PoolTogether?",
      a: "On standard transparent chains, everyone can see your wallet balance, how much money you have saved, and your odds of winning. Whales and large winners become targets for phishing and exploits. Powered by Zama, AuraPool keeps your balance and winner selections 100% confidential while remaining provably fair.",
    },
    {
      q: "How are winners picked fairly if balances are secret?",
      a: "Winner selection runs entirely onchain using Zama's Fully Homomorphic Encryption randomness (FHE.randEuint64). The protocol calculates winners weighted by how much each user saved without ever revealing individual account balances to the public.",
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
            <span>Faucet</span>
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
          <span>Zama Mainnet Season 4 Bounty Track</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-black leading-[1.08] mb-6">
          Save Money with <span className="bg-aura-yellow px-3 py-0.5 rounded-2xl inline-block text-black shadow-aura-yellow">Zero Loss.</span>
          <br />
          Win Daily Prizes in <span className="underline decoration-aura-yellow decoration-wavy underline-offset-8">Private.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mb-10">
          The next-generation confidential prize savings protocol. Powered by Zama Fully Homomorphic Encryption and PoolTogether yield architecture on Ethereum Sepolia.
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

        {/* Stats Grid */}
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

      {/* 3. Transparent PoolTogether vs AuraPool Matrix */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-black tracking-tight">
            Why Privacy is Crucial for Prize Savings
          </h2>
          <p className="text-sm text-slate-600">
            Comparing traditional transparent lotteries with Zama FHE confidential savings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
          {/* Left: Traditional Transparent PoolTogether */}
          <div className="aura-card p-8 border-rose-200 bg-rose-50/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <span className="text-sm font-black text-rose-900">Transparent PoolTogether</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                Leaks Data
              </span>
            </div>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Exposed Net Worth:</strong> Every deposit and savings balance is publicly visible on Etherscan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Whale Target:</strong> Large depositors are targeted by phishing, scammers, and social engineering.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Public Odds:</strong> Everyone can calculate exactly who holds the most tickets.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-bold">✕</span>
                <span><strong>Broadcast Payouts:</strong> Winners and jackpot amounts are broadcast across the chain.</span>
              </li>
            </ul>
          </div>

          {/* Right: AuraPool on Zama FHE */}
          <div className="aura-card p-8 border-amber-300 bg-gradient-to-br from-white to-amber-50/40 shadow-aura-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <span className="text-sm font-black text-black">AuraPool (Zama FHE)</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-aura-yellow text-black">
                100% Confidential
              </span>
            </div>
            <ul className="space-y-3 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Encrypted Balances:</strong> Deposit sizes and pool shares are encrypted onchain as euint64 handles.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Zero Whale Tracking:</strong> Nobody can see how much money any specific wallet has saved.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Deposit-Weighted Draws:</strong> Provably fair onchain winner selection runs over encrypted balances.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Winner-Only Decrypt:</strong> Only the winner holds the EIP-712 key to reveal and claim their prize.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Interactive Savings Calculator */}
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
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow active:scale-95"
              >
                Deposit & Save Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Interactive Draw Sandbox on Landing */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="aura-card p-8 sm:p-10 space-y-6 bg-gradient-to-br from-white to-slate-50 border border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-mono font-bold">
              <Dices className="w-3.5 h-3.5" />
              <span>Interactive Protocol Simulator</span>
            </div>
            <h3 className="text-xl font-black text-black">Test the Onchain FHE Random Draw Engine</h3>
            <p className="text-xs text-slate-600">
              Experience how Zama&apos;s <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-black">FHE.randEuint64()</code> selects winners proportionally to deposit size without decrypting balances.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-1 text-xs">
              <div className="font-bold text-black text-sm">Simulate Active Pool Draw</div>
              <p className="text-slate-500">4 Savers &bull; 1,250 Total Tickets &bull; 85 cUSDT Jackpot</p>
            </div>

            <button
              onClick={handleSimulateDraw}
              disabled={simDrawRunning}
              className="px-6 py-3 rounded-xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {simDrawRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Computing FHE Winner...</span>
                </>
              ) : (
                <>
                  <Dices className="w-4 h-4 text-black" />
                  <span>Simulate FHE Draw</span>
                </>
              )}
            </button>
          </div>

          {simWinnerResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-950 flex items-center justify-between"
            >
              <span>🏆 <strong>Winner Selected:</strong> {simWinnerResult}</span>
              <span className="text-emerald-700 font-bold">+85.00 cUSDT</span>
            </motion.div>
          )}
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
            <span>Powered by Zama fhEVM</span>
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
