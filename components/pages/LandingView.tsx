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
  TrendingUp, 
  Users, 
  Dices, 
  Coins, 
  ChevronRight, 
  EyeOff, 
  Layers, 
  Repeat, 
  Flame, 
  ShieldAlert, 
  Zap,
  Sun,
  Moon,
  Cpu,
  Fingerprint,
  Scale,
  Shield,
  Key,
  HelpCircle,
  Clock,
  Award,
  Wallet
} from "lucide-react";
import { FaShieldAlt } from "react-icons/fa";
import { ActiveMarketId, ZAMA_SEPOLIA_CONFIG } from "@/lib/contracts";

interface LandingViewProps {
  onEnterApp: (tab?: "dashboard" | "vault" | "draws" | "earn" | "rewards" | "activity" | "how-it-works", initialAmount?: string) => void;
  onOpenHowItWorks?: () => void;
  account?: string | null;
  onConnect?: () => void;
  isConnecting?: boolean;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterApp,
  account,
  onConnect,
  isConnecting,
  theme = "dark",
  onToggleTheme,
}) => {
  const [selectedMarket, setSelectedMarket] = useState<ActiveMarketId>("cUSDT");
  const [calcDeposit, setCalcDeposit] = useState<string>("100");
  const parsedDeposit = parseFloat(calcDeposit || "0");
  const apyRate = selectedMarket === "cUSDT" ? 0.085 : 0.12;
  const estimatedYield = (parsedDeposit * apyRate).toFixed(2);
  const estimatedTickets = Math.floor(parsedDeposit);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-300">
      {/* 1. Top Header Navigation */}
      <header className="w-full bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--card-border)] sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="cursor-pointer">
          <AuraLogo size="md" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 font-medium text-xs">
          {/* Section Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-semibold text-[var(--muted)]">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="px-3.5 py-1.5 rounded-full hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("liquidity-hunt")}
              className="px-3.5 py-1.5 rounded-full hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Liquidity Hunt</span>
            </button>
            <button
              onClick={() => scrollToSection("privacy-solutions")}
              className="px-3.5 py-1.5 rounded-full hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => scrollToSection("zero-loss-security")}
              className="px-3.5 py-1.5 rounded-full hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Zero-Loss Security
            </button>
          </nav>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onToggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-[var(--card-border)] text-slate-700 dark:text-amber-400 transition-colors"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </motion.button>
          )}

          {/* Launch App Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onEnterApp("dashboard")}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs uppercase tracking-wider shadow-cyvera-glow transition-all"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </motion.button>
        </div>
      </header>

      {/* 2. Hero Section with Live Simulator Preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Column: Vision & Value Proposition */}
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-extrabold text-xs">
              <FaShieldAlt className="w-3.5 h-3.5 text-amber-500" />
              <span>Confidential No-Loss Prize Savings • Powered by Zama FHEVM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-foreground">
              Encrypted Wealth. <br />
              <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                Verifiable Jackpots.
              </span>
            </h1>

            <p className="text-[var(--muted)] text-sm sm:text-base font-medium leading-relaxed max-w-xl">
              Cyvera enables everyday savers to earn recurring onchain yield and compete for grand prize jackpots with zero risk to their principal — while keeping deposits, pool shares, odds, and winnings 100% encrypted end-to-end.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2 transition-all"
              >
                <PiggyBank className="w-4 h-4 text-black" />
                <span>Launch App to Save (100% Zero-Loss)</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onEnterApp("draws")}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Dices className="w-4 h-4 text-amber-500" />
                <span>Explore 4-Phase Draws</span>
              </motion.button>
            </div>

            {/* Invariant Trust Metrics */}
            <div className="pt-8 border-t border-[var(--card-border)] grid grid-cols-3 gap-6 text-xs font-medium text-[var(--muted)]">
              <div>
                <span className="text-[11px] block opacity-80">Principal Invariant:</span>
                <strong className="text-emerald-500 font-black text-sm">100% Protected</strong>
              </div>
              <div>
                <span className="text-[11px] block opacity-80">Privacy Standard:</span>
                <strong className="text-foreground font-black text-sm">Zama euint64</strong>
              </div>
              <div>
                <span className="text-[11px] block opacity-80">Randomness Engine:</span>
                <strong className="text-amber-500 font-black text-sm">FHE.randEuint64()</strong>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Multi-Market Calculator Preview */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <div className="cyvera-card p-6 sm:p-8 space-y-6">
              {/* Market Selector Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)]">
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[var(--card-border)] text-xs font-bold">
                  <button
                    onClick={() => setSelectedMarket("cUSDT")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedMarket === "cUSDT" 
                        ? "bg-white dark:bg-slate-900 text-foreground shadow-sm font-black" 
                        : "text-[var(--muted)]"
                    }`}
                  >
                    cUSDT Vault
                  </button>
                  <button
                    onClick={() => setSelectedMarket("cUSDC")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedMarket === "cUSDC" 
                        ? "bg-white dark:bg-slate-900 text-foreground shadow-sm font-black" 
                        : "text-[var(--muted)]"
                    }`}
                  >
                    cUSDC Vault
                  </button>
                </div>

                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/30">
                  {selectedMarket === "cUSDT" ? "8.50% APY" : "12.00% APY"}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-foreground">{ZAMA_SEPOLIA_CONFIG.markets[selectedMarket].name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[var(--muted)] font-mono">
                    Preview
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Simulate your deposit to preview draw tickets and yield generation before launching the app.
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between font-bold">
                  <label className="text-foreground">Simulate Deposit Amount:</label>
                  <span className="text-amber-500 font-mono font-black">${parsedDeposit.toFixed(2)} {selectedMarket}</span>
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
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[var(--card-border)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Draw Tickets Generated:</span>
                  <strong className="text-foreground font-mono">{estimatedTickets} Tickets (Encrypted)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Weight & Odds Privacy:</span>
                  <span className="font-mono text-[10px] text-emerald-500 font-bold">Encrypted euint64</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">Zero-Loss Guarantee:</span>
                  <span className="text-emerald-500 font-extrabold">100% Principal Safe</span>
                </div>
              </div>

              {/* CTA to Launch App */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2"
              >
                <span>Launch App to Deposit in {selectedMarket} Vault</span>
                <ChevronRight className="w-4 h-4 text-black" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Dedicated "How It Works" Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 bg-slate-50/70 dark:bg-slate-900/40 border-t border-[var(--card-border)] scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[11px] font-black border border-amber-500/20 uppercase tracking-wide">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Step-by-Step Overview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              How Cyvera Works
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-medium leading-relaxed">
              Cyvera makes prize savings zero-risk and completely confidential using Fully Homomorphic Encryption (fhEVM). Here is the complete journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <span className="text-3xl font-black text-slate-200 dark:text-slate-800 font-mono">01</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide block">Encrypted Principal</span>
                <h3 className="font-bold text-foreground text-sm">Deposit & Save</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Deposit public tokens into the confidential <strong className="text-foreground">cUSDT</strong> or <strong className="text-foreground">cUSDC</strong> vault. Your balance is instantly encrypted into an onchain <code className="text-amber-500 font-mono">euint64</code> ciphertext. Nobody can see your deposit size.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-3xl font-black text-slate-200 dark:text-slate-800 font-mono">02</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide block">DeFi Yield Stream</span>
                <h3 className="font-bold text-foreground text-sm">Yield Funds the Pot</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                While your funds remain safe in the vault, external lending APY (8.50% on cUSDT, 12.00% on cUSDC) streams continuously into the shared prize pot without risking a single cent of your deposit.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-3xl font-black text-slate-200 dark:text-slate-800 font-mono">03</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wide block">Zama FHE Randomness</span>
                <h3 className="font-bold text-foreground text-sm">Provably Fair Draws</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Draws run automatically onchain. Winner selection executes over encrypted balances using <code className="text-cyan-500 font-mono">FHE.randEuint64()</code>. Tickets are weighted by deposit without revealing individual weights.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-3xl font-black text-slate-200 dark:text-slate-800 font-mono">04</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wide block">Private Reveal & Exit</span>
                <h3 className="font-bold text-foreground text-sm">Reveal or Withdraw</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Authorize an offchain EIP-712 session to privately reveal and claim your prize winnings. You can also withdraw 100% of your deposited principal anytime with zero fees or lockups.
              </p>
            </motion.div>
          </div>

          {/* Interactive CTA Banner */}
          <div className="cyvera-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-transparent border border-amber-500/20">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-black text-foreground">Ready to explore the full app experience?</h4>
              <p className="text-xs text-[var(--muted)] font-medium">
                Connect your wallet to deposit, track recurring draws, and privately reveal your prizes in real-time.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnterApp("vault")}
              className="px-8 py-3.5 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs uppercase tracking-wider shadow-cyvera-glow shrink-0 flex items-center gap-2"
            >
              <span>Launch App to Save</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* 4. Dedicated "Confidential Liquidity Hunt" Section */}
      <section id="liquidity-hunt" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-12 scroll-mt-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[11px] font-black border border-amber-500/20 uppercase tracking-wide">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Time-Weighted Protocol Rewards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Confidential Liquidity Hunt
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-medium leading-relaxed">
            Boost your chances and earn season points on your encrypted deposits. Your tier multipliers are verifiable without leaking your portfolio balance.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-4 border-amber-900/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-600">Bronze Saver</span>
              <span className="font-mono text-xs font-black bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">1.0x Boost</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">$10 - $99</div>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
              Entry-tier liquidity rewards. Accrues 10 points per dollar saved per season epoch.
            </p>
            <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Standard Draw Weight</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-4 border-slate-400/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Silver Vault</span>
              <span className="font-mono text-xs font-black bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded-md">1.5x Boost</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">$100 - $499</div>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
              Enhanced savings tier. 15 points per dollar saved + unlocked confidential liquidity multipliers.
            </p>
            <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1.5x Ticket Multiplier</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-4 border-amber-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-0.5 bg-cyvera-gold text-black text-[9px] font-black rounded-bl-xl uppercase tracking-wider">
              Popular
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-500">Gold Treasury</span>
              <span className="font-mono text-xs font-black bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-md">2.0x Boost</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">$500 - $999</div>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
              Heavy yield accumulator. 20 points per dollar saved + double probability weight in weekly jackpots.
            </p>
            <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2.0x Ticket Multiplier</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-4 border-cyan-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-500">Diamond Citadel</span>
              <span className="font-mono text-xs font-black bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-md">3.0x Boost</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">$1,000+</div>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
              Max protocol tier. 30 points per dollar saved + VIP confidential pool governance allocation.
            </p>
            <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3.0x Ticket Multiplier</span>
            </div>
          </motion.div>
        </div>

        {/* Feature CTA to dedicated Earn page */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-foreground">Track Your Tier & Multipliers Inside the App</h4>
              <p className="text-xs text-[var(--muted)] font-medium">
                Save in cUSDT or cUSDC to start accumulating points and unlocking confidential draw boosts.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onEnterApp("earn")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2 shrink-0"
          >
            <Flame className="w-4 h-4 text-black" />
            <span>Launch App to Join Liquidity Hunt</span>
          </motion.button>
        </div>
      </section>

      {/* 5. The 4 Fundamental Privacy Crises Solved by Cyvera */}
      <section id="privacy-solutions" className="py-20 px-4 sm:px-8 bg-slate-50/70 dark:bg-slate-900/40 border-t border-[var(--card-border)] scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 text-[11px] font-black border border-rose-500/20 uppercase tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>The Public Blockchain Surveillance Problem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              What Cyvera Solves in Decentralized Finance
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] font-medium">
              Transparent blockchains expose sensitive financial positions to bots, drainers, and predatory analytics. Cyvera enforces confidential boundaries onchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">1. Balance Surveillance & Wealth Profiling</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                On transparent ledgers, anyone can track how much you save, calculate your net worth, and target your wallet with phishing, social engineering, and address poison attacks. Cyvera encapsulates all balances into encrypted ciphertexts.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Dices className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">2. Draw Odds & Strategy Exposure</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                When lottery weights are public, opportunistic whales and MEV actors can manipulate participation timings and calculate the exact moment to enter or exit. Cyvera computes all draw weights homomorphically onchain without publishing plaintext weights.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">3. Public Winner Doxxing & Extortion</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Transparent prize pools broadcast winner wallet addresses and prize sizes to the entire globe. In Cyvera, prize credits remain encrypted ciphertext handles that only the rightful winner can authorize decryption to claim.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="cyvera-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-sm">4. Mempool Front-Running & MEV Extraction</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Searcher bots exploit public deposit amounts to sandwich transactions and extract yield. Cyvera uses Zama FHE to shield token interactions at the smart contract level, making transactions opaque to mempool exploiters.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. The Cyvera Cryptographic FHE Engine */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-black border border-cyan-500/20 uppercase tracking-wide">
            <Cpu className="w-3.5 h-3.5" />
            <span>Fully Homomorphic Encryption (FHE)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            How Cyvera Operates Over Encrypted State
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-medium">
            Smart contracts perform computations on encrypted data without ever decrypting it onchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="cyvera-card p-6 space-y-3">
            <div className="font-mono text-[11px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg inline-block">
              FHE.asEuint64()
            </div>
            <h4 className="font-bold text-foreground text-sm">Homomorphic State Wrapping</h4>
            <p className="text-[var(--muted)] leading-relaxed font-medium">
              Deposits are encrypted into 64-bit homomorphic ciphertexts. The contract adds, subtracts, and tracks cumulative pool shares without knowing the underlying balance amounts.
            </p>
          </div>

          <div className="cyvera-card p-6 space-y-3">
            <div className="font-mono text-[11px] font-black text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-lg inline-block">
              FHE.randEuint64()
            </div>
            <h4 className="font-bold text-foreground text-sm">Verifiable Entropy Engine</h4>
            <p className="text-[var(--muted)] leading-relaxed font-medium">
              At draw intervals, the protocol invokes onchain FHE randomness. The random seed is generated homomorphically onchain, making it immune to miner front-running or keeper tampering.
            </p>
          </div>

          <div className="cyvera-card p-6 space-y-3">
            <div className="font-mono text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg inline-block">
              EIP-712 Decryption
            </div>
            <h4 className="font-bold text-foreground text-sm">Authorized User Reveal</h4>
            <p className="text-[var(--muted)] leading-relaxed font-medium">
              Only the account holding the corresponding private key can authorize an offchain decryption session through the Zama relayer to privately reveal their prize outcome.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Mathematical Solvency Proof & Security Guarantee */}
      <section id="zero-loss-security" className="py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full space-y-8 scroll-mt-16">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black border border-emerald-500/20 uppercase tracking-wide">
            <Scale className="w-3.5 h-3.5" />
            <span>Economic Architecture & Security</span>
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Mathematical Zero-Loss Invariant</h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-medium">
            How Cyvera ensures that your savings are fundamentally immune to loss.
          </p>
        </div>

        <div className="cyvera-card p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Yield-Separation Escrow</span>
              </h4>
              <p className="text-[var(--muted)] leading-relaxed font-medium">
                User principal is segregated into an escrow vault that never wagers or stakes into volatile assets. Only the harvested DeFi interest and reserve yields are funneled into the prize jackpot.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Counterparty Risk</span>
              </h4>
              <p className="text-[var(--muted)] leading-relaxed font-medium">
                No uncollateralized lending or algorithmic rehypothecation. Every deposited token is 1:1 backed onchain in the smart contract escrow, allowing instant withdrawal at any block height.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--muted)] font-medium">
              Ready to protect your savings while competing for confidential prize draws?
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnterApp("vault")}
              className="px-8 py-3.5 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs uppercase tracking-wider shadow-cyvera-glow"
            >
              Launch App to Deposit
            </motion.button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-[var(--card-border)] bg-[var(--card-bg)] text-xs text-[var(--muted)] text-center space-y-2">
        <div className="flex justify-center">
          <AuraLogo size="sm" />
        </div>
        <p>Cyvera Protocol — Confidential No-Loss Prize Savings Powered by Zama FHEVM.</p>
        <p className="text-[11px] opacity-70">Ethereum Sepolia Testnet Deployment • Supporting cUSDT and cUSDC Markets</p>
      </footer>
    </div>
  );
};
