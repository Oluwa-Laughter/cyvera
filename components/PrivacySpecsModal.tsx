"use client";

import React from "react";
import { X, Shield, Lock, Cpu, KeyRound, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

interface PrivacySpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacySpecsModal: React.FC<PrivacySpecsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="zama-card p-6 sm:p-8 max-w-3xl w-full my-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-white/15">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-zama-yellow/10 border border-zama-yellow/30 text-zama-yellow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>VeilPrize Technical Architecture</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zama-yellow text-black font-bold">
                Zama fhEVM
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Confidentiality design, FHE randomness, and mathematical winner selection
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs text-zinc-300 font-mono">
          {/* Section 1: Confidentiality Matrix */}
          <div className="p-5 rounded-2xl bg-zama-dark border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-zama-yellow flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>1. Confidentiality Matrix: What Stays Encrypted vs What Leaks</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400">
                    <th className="py-2">Protocol Metric</th>
                    <th className="py-2">Privacy State</th>
                    <th className="py-2">Technical Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 font-bold text-white">Individual Deposit Amounts</td>
                    <td className="py-2 text-zama-yellow">🔒 Strictly Confidential</td>
                    <td className="py-2 text-zinc-400">Zama <code className="text-white">euint64</code> ciphertext</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">User Savings Balances</td>
                    <td className="py-2 text-zama-yellow">🔒 Strictly Confidential</td>
                    <td className="py-2 text-zinc-400">Locked to user EIP-712 key</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">Individual Winning Odds</td>
                    <td className="py-2 text-zama-yellow">🔒 Strictly Confidential</td>
                    <td className="py-2 text-zinc-400">Concealed balances prevent odds leaks</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">Winner Prize Allocation</td>
                    <td className="py-2 text-zama-yellow">🔒 Winner-Only Decryptable</td>
                    <td className="py-2 text-zinc-400">Encrypted prize credit onchain</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">Total Pool Deposits (TVL)</td>
                    <td className="py-2 text-zinc-400">🌐 Public Aggregation</td>
                    <td className="py-2 text-zinc-400">Aggregated for DeFi yield routing</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">Participant Addresses List</td>
                    <td className="py-2 text-zinc-400">🌐 Public Address Set</td>
                    <td className="py-2 text-zinc-400">Set of active wallets without balances</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Mathematical Draw Algorithm */}
          <div className="p-5 rounded-2xl bg-zama-dark border border-white/5 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-zama-yellow" />
              <span>2. Mathematical Deposit-Weighted Draw Engine</span>
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              For $N$ active depositors with encrypted balances $B_1, B_2, \dots, B_N$, winner selection samples onchain FHE randomness:
            </p>
            <div className="p-3 rounded-xl bg-black border border-white/10 text-zama-yellow text-[11px] overflow-x-auto">
              <code>
                eRandom = FHE.randEuint64();<br/>
                isWinner[i] = FHE.and(FHE.ge(eRandom, eCum[i-1]), FHE.lt(eRandom, eCum[i]));<br/>
                prizeCredit[i] = FHE.select(isWinner[i], ePrizeAmount, FHE.asEuint64(0));
              </code>
            </div>
            <p className="text-zinc-400 text-[11px]">
              The winning depositor receives an encrypted prize credit equal to the prize pot, while non-winners receive an encrypted zero. No observer learns the winner identity or balance sizes until the winner claims.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-zama-yellow hover:bg-zama-yellowHover text-black font-extrabold text-xs transition-all shadow-zama-glow"
          >
            Close Specs
          </button>
        </div>
      </div>
    </div>
  );
};
