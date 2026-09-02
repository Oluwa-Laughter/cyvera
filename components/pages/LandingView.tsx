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
  Key
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
      {/* 1. Header Navigation */}
      <header className="w-full bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--card-border)] sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <AuraLogo size="md" />

        <div className="flex items-center gap-2 sm:gap-3 font-medium text-xs">
          <button
            onClick={() => onEnterApp("how-it-works")}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground transition-all border border-[var(--card-border)]"
          >
            <span>Architecture</span>
          </button>

          <button
            onClick={() => onEnterApp("earn")}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-bold transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Liquidity Hunt</span>
          </button>

          <button
            onClick={() => onEnterApp("vault")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-[var(--card-border)] text-foreground font-bold transition-all"
          >
            <Droplets className="w-3.5 h-3.5 text-amber-500" />
            <span>Get Test Tokens</span>
          </button>

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

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onEnterApp("dashboard")}
            className="flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold shadow-cyvera-glow transition-all"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </motion.button>
        </div>
      </header>

      {/* 2. Hero Section with Live Simulator */}
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
                <span>Start Saving (100% Zero-Loss)</span>
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

          {/* Right Column: Live Multi-Market Simulator */}
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
                <h3 className="text-lg font-black text-foreground">{ZAMA_SEPOLIA_CONFIG.markets[selectedMarket].name}</h3>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Deposit tokens to accumulate draw tickets while your principal stays 100% withdrawable at any block.
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEnterApp("vault", calcDeposit)}
                className="w-full py-4 rounded-2xl bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-black text-xs uppercase tracking-wider shadow-cyvera-glow flex items-center justify-center gap-2"
              >
                <span>Deposit into {selectedMarket} Vault</span>
                <ChevronRight className="w-4 h-4 text-black" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. The 4 Fundamental Privacy Crises Solved by Cyvera */}
      <section className="py-16 px-4 sm:px-8 bg-slate-50/70 dark:bg-slate-900/40 border-t border-[var(--card-border)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 text-[11px] font-black border border-rose-500/20 uppercase tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>The Public Blockchain Surveillance Problem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              What Cyvera Solves in Decentralized Finance
            </h2>
            <p className="text-xs text-[var(--muted)] font-medium">
              Transparent blockchains expose sensitive financial positions to bots, drainers, and predatory analytics.
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

      {/* 4. The Cyvera Cryptographic FHE Engine */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-black border border-cyan-500/20 uppercase tracking-wide">
            <Cpu className="w-3.5 h-3.5" />
            <span>Fully Homomorphic Encryption (FHE)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            How Cyvera Operates Over Encrypted State
          </h2>
          <p className="text-xs text-[var(--muted)] font-medium">
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

      {/* 5. The 6-Stage End-to-End Money Flow */}
      <section className="py-16 px-4 sm:px-8 bg-slate-50/70 dark:bg-slate-900/40 border-t border-[var(--card-border)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              The 6-Stage Money Flow Lifecycle
            </h2>
            <p className="text-xs text-[var(--muted)] font-medium">
              Complete walkthrough of how capital flows safely through Cyvera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-bold text-foreground text-sm">Public Token Faucet</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Claim 1,000 test tokens directly to your connected Sepolia wallet via the 1-click testnet faucet.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-bold text-foreground text-sm">Token Shielding (ERC-7984)</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Convert public tokens into encrypted confidential representations (`cUSDT` / `cUSDC`) with zero address tracking.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-bold text-foreground text-sm">Shielded Vault Deposit</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Deposit shielded tokens into the prize pool. Your deposit amount and draw ticket count stay strictly encrypted in `euint64`.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="font-bold text-foreground text-sm">4-Phase Verifiable Draw</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Draws progress permissionlessly: Open → Snapshot → FHE Randomness Selection → Claim Window without privileged keepers.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center text-xs">
                5
              </div>
              <h4 className="font-bold text-foreground text-sm">Private Prize Reveal</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Authorize a private decryption session to inspect your result: win prize profit or $0.00 with 100% principal safety.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="cyvera-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center text-xs">
                6
              </div>
              <h4 className="font-bold text-foreground text-sm">100% Zero-Loss Exit</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                Withdraw 100% of your deposited principal anytime with zero locking periods, zero penalties, and instant settlement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Mathematical Solvency Proof */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black border border-emerald-500/20 uppercase tracking-wide">
            <Scale className="w-3.5 h-3.5" />
            <span>Economic Architecture & Security</span>
          </div>
          <h2 className="text-2xl font-black text-foreground">Mathematical Zero-Loss Invariant</h2>
          <p className="text-xs text-[var(--muted)] font-medium">
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

          <div className="pt-4 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--muted)]">
              Ready to protect your savings while competing for confidential prize draws?
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnterApp("vault")}
              className="px-6 py-3 rounded-full bg-cyvera-gold hover:bg-cyvera-goldHover text-black font-extrabold text-xs shadow-cyvera-glow"
            >
              Deposit in Cyvera Vault
            </motion.button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-[var(--card-border)] bg-[var(--card-bg)] text-xs text-[var(--muted)] text-center space-y-2">
        <div className="flex justify-center">
          <AuraLogo size="sm" />
        </div>
        <p>Cyvera Protocol — Confidential No-Loss Prize Savings Powered by Zama FHEVM.</p>
        <p className="text-[11px] opacity-70">Ethereum Sepolia Testnet Deployment</p>
      </footer>
    </div>
  );
};
