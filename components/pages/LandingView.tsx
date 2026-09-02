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
  EyeOff,
  Layers,
  Repeat,
  Flame,
  ShieldAlert,
  Zap
} from "lucide-react";
import { HiTrophy } from "react-icons/hi2";
import { FaShieldAlt } from "react-icons/fa";
import { ActiveMarketId, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";

interface LandingViewProps {
  onEnterApp: (tab?: "dashboard" | "vault" | "draws" | "earn" | "rewards" | "activity" | "how-it-works", initialAmount?: string) => void;
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
  const [selectedMarket, setSelectedMarket] = useState<ActiveMarketId>("cUSDT");
  const [calcDeposit, setCalcDeposit] = useState<string>("100");
  const parsedDeposit = parseFloat(calcDeposit || "0");
  const apyRate = selectedMarket === "cUSDT" ? 0.085 : 0.12;
  const estimatedYield = (parsedDeposit * apyRate).toFixed(2);
  const estimatedTickets = Math.floor(parsedDeposit);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes VeilPool different from transparent PoolTogether?",
      a: "On public blockchains, traditional prize savings protocols leak everything: how much you saved, your exact odds of winning, and whether you won. VeilPool encrypts your deposits into euint64 ciphertexts onchain using Zama FHE. Draws remain provably fair and deposit-weighted, but only you can decrypt your balances and winnings.",
    },
    {
      q: "What is the difference between 'Value Privacy' and 'Invisible Wallets'?",
      a: "VeilPool provides strict value privacy: your token amounts, deposit sizes, draw weights, odds, winner identity, and prize values are encrypted. What remains public are transparent blockchain fundamentals: wallet addresses, transaction timing, participant count, deadlines, and draw phase progression.",
    },
    {
      q: "How does the 4-Phase Verifiable Draw work?",
      a: "Draws progress permissionlessly through 4 public stages: (1) Open / Accumulation → (2) Close / Snapshot → (3) FHE Randomness Selection → (4) Private Reveal Claim Window. No centralized keeper or admin needs to inspect private balances to keep the system moving.",
    },
    {
      q: "Is my principal safe? Can I withdraw anytime?",
      a: "Yes! 100% of your principal is guaranteed safe and withdrawable at any second. All prize pots are funded exclusively by external DeFi lending yield and liquidity reserves. You never wager or lose your principal.",
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
            onClick={() => onEnterApp("earn")}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all active:scale-95"
          >
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Liquidity Hunt</span>
          </button>

          <button
            onClick={() => onEnterApp("vault")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold transition-all active:scale-95"
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
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
              <FaShieldAlt className="w-3.5 h-3.5 text-amber-600" />
              <span>Private Savings. Verifiable Prizes. Powered by Zama FHEVM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-black">
              Confidential <br />
              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Prize Savings.
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
              Keep access to 100% of your principal while encrypted balances power verifiable, deposit-weighted onchain draws. No observer, keeper, or bot can see how much you saved or what you won.
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
                <span>View 4-Phase Draws</span>
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
                <span className="text-slate-400 block text-[11px]">RNG Engine:</span>
                <strong className="text-amber-800 font-black text-sm">FHE.randEuint64()</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Live Multi-Market Simulator */}
          <div className="lg:col-span-5">
            <div className="aura-card p-6 sm:p-8 bg-white border border-amber-300 shadow-xl space-y-6">
              {/* Market Selector Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setSelectedMarket("cUSDT")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedMarket === "cUSDT" ? "bg-white text-black shadow-sm font-black" : "text-slate-500"
                    }`}
                  >
                    cUSDT Pool
                  </button>
                  <button
                    onClick={() => setSelectedMarket("cUSDC")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedMarket === "cUSDC" ? "bg-white text-black shadow-sm font-black" : "text-slate-500"
                    }`}
                  >
                    cUSDC Pool
                  </button>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-200">
                  {selectedMarket === "cUSDT" ? "8.50% APY" : "12.00% APY"}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-black">{ZAMA_SEPOLIA_CONFIG.markets[selectedMarket].name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Deposit tokens to earn draw tickets without risking a single cent of principal.
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between font-bold">
                  <label className="text-slate-700">Simulate Deposit Amount:</label>
                  <span className="text-amber-800 font-mono font-black">${parsedDeposit.toFixed(2)} {selectedMarket}</span>
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
                  <strong className="text-black">{estimatedTickets} Tickets (Encrypted)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Draw Weight Privacy:</span>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold">Encrypted euint64</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Principal Withdrawable:</span>
                  <span className="text-emerald-700 font-extrabold">100% Anytime (Zero Loss)</span>
                </div>
              </div>

              <button
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Deposit into {selectedMarket} Vault</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 6-Step Confidential Workflow */}
      <section className="py-16 px-4 sm:px-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-black">
              The Confidential Prize Savings Lifecycle
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              How funds move from public stablecoins into verifiable encrypted prize draws.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aura-card p-6 bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-bold text-black text-sm">Public Token Faucet</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Obtain public testnet USDT/USDC directly to your connected Sepolia wallet via the 1-click faucet.
              </p>
            </div>

            <div className="aura-card p-6 bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-bold text-black text-sm">Shield into Confidential Tokens</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wrap public stablecoins into encrypted ERC-7984 confidential tokens (`cUSDT` / `cUSDC`).
              </p>
            </div>

            <div className="aura-card p-6 bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-bold text-black text-sm">Confidential Deposit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deposit shielded tokens into the prize pool. Your deposit amount and ticket count become an encrypted integer onchain.
              </p>
            </div>

            <div className="aura-card p-6 bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="font-bold text-black text-sm">4-Phase Verifiable Draw</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permissionless draw progression: Close → Encrypted Weight Snapshot → FHE.randEuint64() Selection → Claim Window.
              </p>
            </div>

            <div className="aura-card p-6 bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                5
              </div>
              <h4 className="font-bold text-black text-sm">Private Prize Reveal (EIP-712)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorize a private decryption session with your wallet to inspect your result: prize profit — or zero.
              </p>
            </div>

            <div className="aura-card p-6 bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs">
                6
              </div>
              <h4 className="font-bold text-black text-sm">100% Zero-Loss Exit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Withdraw 100% of your deposited principal at any time back to your wallet with zero penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Explicit Privacy Boundary Table */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-black">Value Privacy vs. Transparent Chains</h2>
          <p className="text-xs text-slate-500 font-medium">
            We prefer stating our privacy boundaries explicitly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-200 text-emerald-950 font-black text-sm">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>Strictly Private (Encrypted with Zama FHE)</span>
            </div>
            <ul className="space-y-2.5 text-emerald-900 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Individual deposit sizes and pool shares</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Draw ticket counts and winning probabilities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted snapshot weights during draw execution</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Winner prize value (only winner can decrypt via EIP-712)</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-slate-900 font-black text-sm">
              <Unlock className="w-4 h-4 text-slate-600" />
              <span>Verifiably Public (Transparent Onchain State)</span>
            </div>
            <ul className="space-y-2.5 text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Wallet addresses and transaction execution timing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Total participant count and active draw ID</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>4-phase draw progression deadlines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Aggregate prize reserve pool total (solvency proof)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-black">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 font-medium">Everything you need to know about VeilPool and Zama FHE.</p>
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

      {/* 6. Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-slate-200 bg-white text-xs text-slate-500 text-center space-y-2">
        <AuraLogo size="sm" />
        <p>VeilPool Protocol — Confidential No-Loss Prize Savings Powered by Zama FHEVM.</p>
        <p className="text-[11px] text-slate-400">Deployed on Ethereum Sepolia Testnet</p>
      </footer>
    </div>
  );
};
