"use client";

import React from "react";
import { X, Shield, Lock, Cpu, KeyRound, Eye, EyeOff, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfidentialityArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>VeilPrize Protocol Architecture</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Zama fhEVM
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Confidentiality design, FHE randomness, and mathematical winner selection
            </p>
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="space-y-6 text-xs text-slate-300 font-mono">
          {/* Section 1: Core Flow Diagram */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>1. End-to-End Cryptographic Cycle</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">1. Deposit</div>
                <p className="text-slate-400">Tokens wrapped into onchain <code className="text-cyan-300">euint64</code></p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-purple-400 font-bold mb-1">2. FHE Draw</div>
                <p className="text-slate-400">Weighted RNG over encrypted balances</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-amber-400 font-bold mb-1">3. EIP-712 Decrypt</div>
                <p className="text-slate-400">Winner decrypts prize with wallet key</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">4. Zero-Loss Exit</div>
                <p className="text-slate-400">Principal withdrawable at 100% anytime</p>
              </div>
            </div>
          </div>

          {/* Section 2: What Stays Encrypted vs What Leaks */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>2. Confidentiality Matrix: What Stays Encrypted vs What Leaks</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2">Protocol Metric</th>
                    <th className="py-2">Privacy State</th>
                    <th className="py-2">Technical Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2 font-semibold text-slate-200">Individual Deposit Amounts</td>
                    <td className="py-2 text-emerald-400">🔒 Strictly Confidential</td>
                    <td className="py-2 text-slate-400">Zama <code className="text-cyan-300">euint64</code> ciphertext</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-200">User Savings Balances</td>
                    <td className="py-2 text-emerald-400">🔒 Strictly Confidential</td>
                    <td className="py-2 text-slate-400">Decryption locked to user EIP-712 key</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-200">Individual Winning Odds</td>
                    <td className="py-2 text-emerald-400">🔒 Strictly Confidential</td>
                    <td className="py-2 text-slate-400">Zero balance leakage prevents odds calculation</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-200">Winner Allocation</td>
                    <td className="py-2 text-emerald-400">🔒 Winner-Only Decryptable</td>
                    <td className="py-2 text-slate-400">Encrypted prize credit awarded onchain</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-200">Total Pool Deposits (TVL)</td>
                    <td className="py-2 text-amber-400">🌐 Public Aggregation</td>
                    <td className="py-2 text-slate-400">Aggregated for yield strategy accounting</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-200">Participant Addresses List</td>
                    <td className="py-2 text-amber-400">🌐 Public Address Set</td>
                    <td className="py-2 text-slate-400">Set of active wallets without balances</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Mathematical Winner Selection */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>3. Mathematical Deposit-Weighted Draw Algorithm</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              For $N$ depositors with encrypted balances $B_1, B_2, \dots, B_N$, the draw generates onchain FHE entropy:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto">
              <code>
                eRandom = FHE.randEuint64();<br/>
                isWinner[i] = FHE.and(FHE.ge(eRandom, eCum[i-1]), FHE.lt(eRandom, eCum[i]));<br/>
                prizeCredit[i] = FHE.select(isWinner[i], ePrizeAmount, FHE.asEuint64(0));
              </code>
            </div>
            <p className="text-slate-400 text-[11px]">
              The winning depositor receives an encrypted prize credit equal to the prize pot, while all other participants receive an encrypted zero. No observer learns who won until the winner chooses to claim.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-glow"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
