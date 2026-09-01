"use client";

import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Cpu, 
  CheckCircle2, 
  Gavel, 
  WalletCards,
  ArrowDownLeft
} from "lucide-react";
import { FaShieldAlt } from "react-icons/fa";

interface HowItWorksDarkViewProps {
  onEnterAuctions: () => void;
}

export const HowItWorksDarkView: React.FC<HowItWorksDarkViewProps> = ({
  onEnterAuctions,
}) => {
  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Hero */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-aura-yellow text-black shadow-sm">
            Architecture Guide
          </span>
          <span className="text-xs font-bold text-slate-500">Zama FHE Cryptography</span>
        </div>
        <h2 className="text-3xl font-black text-black mt-2">
          How Confidential Sealed-Bid Dark Auctions Work
        </h2>
        <p className="text-xs text-slate-600 font-medium mt-2 max-w-xl leading-relaxed">
          On public blockchains, transparent bids invite front-running, sniper bots, and MEV extraction. AuraDark solves this using Zama Fully Homomorphic Encryption.
        </p>
      </div>

      {/* 2. 4-Step Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 */}
        <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
            1
          </div>
          <h3 className="text-base font-black text-black">Encrypted Bid Submission</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            When you bid, your amount is encrypted into an <code>euint64</code> ciphertext. The transaction lands onchain with your escrow locked safely in the smart contract, but your actual bid number is completely sealed from the public.
          </p>
        </div>

        {/* Step 2 */}
        <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
            2
          </div>
          <h3 className="text-base font-black text-black">Onchain Homomorphic Evaluation</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            The smart contract executes <code>FHE.gt(newBid, highestBid)</code> directly over ciphertexts. The contract determines if the new bid is higher without anyone (even the seller or contract owner) knowing any bid value!
          </p>
        </div>

        {/* Step 3 */}
        <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
            3
          </div>
          <h3 className="text-base font-black text-black">Batch Settlement & Seller Payout</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Once the auction timer expires, anyone can trigger settlement. The contract transfers the winning bid escrow to the seller and unlocks the auctioned asset lot for the winner.
          </p>
        </div>

        {/* Step 4 */}
        <div className="aura-card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-black">
            4
          </div>
          <h3 className="text-base font-black text-black">100% Escrow Refunds (Zero Loss)</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            All non-winning bidders are 100% protected: they can withdraw their full escrow deposit back directly into their wallet with a single click. Zero slippage, zero loss.
          </p>
        </div>
      </div>

      {/* 3. CTA */}
      <div className="p-8 rounded-3xl bg-aura-yellow text-black text-center space-y-4 shadow-aura-yellow">
        <h3 className="text-xl font-black">Ready to Place Your First Sealed Bid?</h3>
        <p className="text-xs font-semibold max-w-md mx-auto">
          Explore active dark auction lots, list your own token lots, or test our live FHE Cryptography Lab.
        </p>
        <button
          onClick={onEnterAuctions}
          className="px-8 py-3.5 rounded-2xl bg-black text-white hover:bg-slate-800 font-black text-xs uppercase tracking-wider transition-all active:scale-95"
        >
          Explore Dark Auctions
        </button>
      </div>
    </div>
  );
};
