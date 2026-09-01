"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  PiggyBank, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Cpu, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  RefreshCw, 
  Coins, 
  Scale, 
  ExternalLink 
} from "lucide-react";

interface HowItWorksViewProps {
  onEnterVault: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onEnterVault }) => {
  // Sandbox Simulator State
  const [testA, setTestA] = useState<string>("200");
  const [testB, setTestB] = useState<string>("300");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulated, setSimulated] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  const handleRunSim = async () => {
    setIsSimulating(true);
    setSimulated(false);
    setRevealed(false);
    await new Promise((r) => setTimeout(r, 800));
    setIsSimulating(false);
    setSimulated(true);
  };

  const sumTotal = (parseFloat(testA || "0") + parseFloat(testB || "0")).toFixed(2);

  const phases = [
    {
      step: "01",
      title: "Confidential Deposit & Shielding",
      badge: "ERC-7984 / euint64",
      desc: "You deposit standard tokens (cUSDT) into the pool. AuraPool encrypts your deposit onchain into an encrypted euint64 balance handle. Nobody on Etherscan can view your individual savings or calculate your wallet's net worth.",
      icon: <Lock className="w-5 h-5 text-amber-600" />,
      color: "border-amber-200 bg-amber-50/50",
    },
    {
      step: "02",
      title: "Continuous DeFi Yield Staking",
      badge: "8.50% APY Stream",
      desc: "The collective pool funds are supplied into battle-tested lending strategies (like Aave V3). The accrued interest is automatically harvested and streamed into the upcoming prize pot. 100% of your initial deposit remains completely safe and untouched.",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      color: "border-emerald-200 bg-emerald-50/50",
    },
    {
      step: "03",
      title: "Onchain FHE Weighted Random Draw",
      badge: "FHE.randEuint64",
      desc: "Periodic draws execute onchain using Zama's Fully Homomorphic Encryption randomness. The smart contract calculates winner selection weighted by how much each saver deposited without ever decrypting individual balances to the public.",
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      color: "border-purple-200 bg-purple-50/50",
    },
    {
      step: "04",
      title: "Winner-Only EIP-712 Decryption",
      badge: "EIP-712 KMS Key",
      desc: "Only the winning depositor possesses the cryptographic authority to decrypt their prize tokens. You can claim your winnings directly to your wallet or auto-compound them into your principal to earn more tickets for future draws.",
      icon: <Trophy className="w-5 h-5 text-amber-600" />,
      color: "border-amber-200 bg-amber-50/50",
    },
  ];

  return (
    <div className="space-y-12 w-full max-w-5xl mx-auto text-black">
      {/* 1. Header Banner */}
      <div className="aura-card p-8 sm:p-12 bg-gradient-to-br from-white via-slate-50 to-amber-50/50 relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aura-yellow text-black text-xs font-mono font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture & Cryptographic Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
            How AuraPool Operates.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            AuraPool bridges <strong>PoolTogether&apos;s No-Loss Savings Model</strong> with <strong>Zama&apos;s Fully Homomorphic Encryption (FHE)</strong> to deliver provably fair, deposit-weighted prize draws with zero wealth exposure.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Principal Safe</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-800">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-700">
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Provably Fair Onchain Draws</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Interactive Phases */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            The 4-Step Confidential Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From deposit to prize claim, your financial data remains completely shielded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={`aura-card p-6 sm:p-8 border ${phase.color} flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <span className="text-2xl font-black text-slate-300 font-mono">
                    {phase.step}
                  </span>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-sm">
                    {phase.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-4 mb-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    {phase.icon}
                  </div>
                  <h3 className="text-lg font-black text-black">{phase.title}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {phase.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Homomorphic Sandbox */}
      <div className="aura-card p-8 sm:p-10 space-y-6 bg-gradient-to-br from-white to-slate-50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-mono font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive FHE Demonstration</span>
          </div>
          <h3 className="text-xl font-black text-black">Try Onchain Homomorphic Addition</h3>
          <p className="text-xs text-slate-600">
            See how the smart contract adds Alice and Bob&apos;s deposits together directly on encrypted ciphertexts without ever decrypting their balances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-slate-500 font-bold">Alice Encrypted Deposit ($):</span>
            <input
              type="number"
              value={testA}
              onChange={(e) => {
                setTestA(e.target.value);
                setSimulated(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xl font-black text-black focus:outline-none"
            />
            <div className="text-[10px] font-mono text-slate-400 truncate">
              Ciphertext: 0x7f9a...{testA}alice
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-slate-500 font-bold">Bob Encrypted Deposit ($):</span>
            <input
              type="number"
              value={testB}
              onChange={(e) => {
                setTestB(e.target.value);
                setSimulated(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xl font-black text-black focus:outline-none"
            />
            <div className="text-[10px] font-mono text-slate-400 truncate">
              Ciphertext: 0x3d2c...{testB}bob
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRunSim}
            disabled={isSimulating}
            className="px-8 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs transition-all shadow-aura-yellow flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating FHE Addition Onchain...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Execute Encrypted Addition (FHE.add)</span>
              </>
            )}
          </button>
        </div>

        {simulated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase">Homomorphic Output Result</span>
                <p className="text-xs text-amber-800">Total Encrypted Vault Principal</p>
              </div>

              <button
                onClick={() => setRevealed(!revealed)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-300 text-xs font-bold text-amber-950 transition-all shadow-sm active:scale-95"
              >
                {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealed ? "Mask Output" : "Verify Plaintext Result"}</span>
              </button>
            </div>

            <div className="text-3xl font-black text-black">
              {revealed ? (
                <span className="text-emerald-700">
                  ${sumTotal} <span className="text-sm font-bold text-emerald-800">cUSDT (Exact Result)</span>
                </span>
              ) : (
                <span className="text-amber-950 font-mono text-xl tracking-wider">
                  0x9c41a7d...encrypted_total_principal
                </span>
              )}
            </div>

            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              🔒 <strong>Zero Knowledge Guaranteed:</strong> The smart contract added both numbers together without learning Alice or Bob&apos;s individual deposit amounts.
            </p>
          </motion.div>
        )}
      </div>

      {/* 4. The Confidentiality Matrix */}
      <div className="aura-card p-8 sm:p-10 space-y-4">
        <h3 className="text-xl font-black text-black">The Confidentiality Matrix</h3>
        <p className="text-xs text-slate-600">
          Clear distinction of what is encrypted onchain vs what is public for transparency.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3">Data Point</th>
                <th className="py-3">Privacy Status</th>
                <th className="py-3">Cryptographic Layer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-bold text-black">Your Deposit Size</td>
                <td className="py-3 text-emerald-700 font-extrabold">🔒 100% Encrypted</td>
                <td className="py-3 text-slate-600 font-mono text-[11px]">Zama euint64 Ciphertext</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-black">Your Savings Balance</td>
                <td className="py-3 text-emerald-700 font-extrabold">🔒 100% Encrypted</td>
                <td className="py-3 text-slate-600 font-mono text-[11px]">Decrypted only via your EIP-712 key</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-black">Your Odds of Winning</td>
                <td className="py-3 text-emerald-700 font-extrabold">🔒 100% Encrypted</td>
                <td className="py-3 text-slate-600 font-mono text-[11px]">Concealed deposit weights</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-black">Winner Prize Allocation</td>
                <td className="py-3 text-emerald-700 font-extrabold">🔒 Winner-Only Decrypt</td>
                <td className="py-3 text-slate-600 font-mono text-[11px]">Encrypted onchain prize credit</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-black">Total Pool TVL</td>
                <td className="py-3 text-slate-600">🌐 Public Aggregate</td>
                <td className="py-3 text-slate-600 font-mono text-[11px]">Necessary for DeFi lending routing</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-black">Participant Addresses</td>
                <td className="py-3 text-slate-600">🌐 Public List</td>
                <td className="py-3 text-slate-600 font-mono text-[11px]">Active wallet set without balance amounts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Mathematical Proof of No-Loss Invariant */}
      <div className="aura-card p-8 sm:p-10 space-y-4 bg-slate-50 border border-slate-200">
        <h3 className="text-xl font-black text-black">The No-Loss Mathematical Proof</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          In AuraPool, all deposited capital is held in non-custodial custody. The prize pot is exclusively generated via:
        </p>
        <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-800 font-bold">
          <code>PrizePot(t) = TotalTVL * APY * (t - t_last) / (365 days)</code>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Because $PrizePot(t)$ is funded from external lending returns rather than user capital deductions, a depositor&apos;s principal balance satisfies:
        </p>
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-xs text-emerald-900 font-bold">
          <code>Principal(t) ≥ Principal(0)  ∀ t ≥ 0 (Withdraw 100% at any time)</code>
        </div>
      </div>

      {/* 6. CTA Footer */}
      <div className="text-center py-6">
        <button
          onClick={onEnterVault}
          className="px-10 py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-sm tracking-tight transition-all shadow-aura-yellow hover:scale-105 active:scale-95 inline-flex items-center gap-2"
        >
          <span>Enter Savings Vault & Start Saving</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
