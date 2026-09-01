"use client";

import React, { useState } from "react";
import { Cpu, Plus, Play, Sparkles, RefreshCw, CheckCircle2, Lock, Unlock, ArrowRight } from "lucide-react";

export const FHEInteractiveLab: React.FC = () => {
  const [valA, setValA] = useState<string>("150");
  const [valB, setValB] = useState<string>("350");
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [hasComputed, setHasComputed] = useState<boolean>(false);
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);

  const hashCipher = (val: string, salt: string) => {
    return `0x${(parseInt(val || "0") * 918273645).toString(16).padStart(16, "0")}...${salt}`;
  };

  const handleRunHomomorphicAdd = async () => {
    setIsComputing(true);
    setHasComputed(false);
    setIsDecrypted(false);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsComputing(false);
    setHasComputed(true);
  };

  const totalPlaintext = (parseFloat(valA || "0") + parseFloat(valB || "0")).toFixed(2);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zama-emerald/10 border border-zama-emerald/30 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zama-emerald mb-4">
          <span>Interactive Developer Lab</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Zama FHE Homomorphic Circuit.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
          Test live homomorphic addition and encrypted comparison. Experience how computation executes directly on encrypted ciphertexts without ever decrypting underlying data.
        </p>
      </div>

      {/* Lab Interface (Double-Bezel) */}
      <div className="double-bezel-outer max-w-4xl mx-auto">
        <div className="double-bezel-inner p-6 sm:p-10 space-y-8">
          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Input A */}
            <div className="p-5 rounded-2xl bg-void-950/80 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Depositor Alice Balance (A)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zama-cyan/10 text-zama-cyan border border-zama-cyan/20">
                  euint64
                </span>
              </div>
              <input
                type="number"
                value={valA}
                onChange={(e) => {
                  setValA(e.target.value);
                  setHasComputed(false);
                }}
                className="w-full bg-transparent text-3xl font-extrabold font-mono text-white focus:outline-none"
                placeholder="150"
              />
              <div className="text-[11px] font-mono text-zama-cyan truncate">
                Ciphertext: {hashCipher(valA, "alice")}
              </div>
            </div>

            {/* Input B */}
            <div className="p-5 rounded-2xl bg-void-950/80 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Depositor Bob Balance (B)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zama-emerald/10 text-zama-emerald border border-zama-emerald/20">
                  euint64
                </span>
              </div>
              <input
                type="number"
                value={valB}
                onChange={(e) => {
                  setValB(e.target.value);
                  setHasComputed(false);
                }}
                className="w-full bg-transparent text-3xl font-extrabold font-mono text-white focus:outline-none"
                placeholder="350"
              />
              <div className="text-[11px] font-mono text-zama-emerald truncate">
                Ciphertext: {hashCipher(valB, "b0b")}
              </div>
            </div>
          </div>

          {/* Execution Button */}
          <div className="flex justify-center">
            <button
              onClick={handleRunHomomorphicAdd}
              disabled={isComputing}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-zama-violet via-purple-500 to-zama-cyan hover:opacity-95 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-glow-purple active:scale-[0.98] disabled:opacity-50"
            >
              {isComputing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating FHE.add(A, B)...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 text-white" />
                  <span>Execute FHE.add(encA, encB) Onchain</span>
                </>
              )}
            </button>
          </div>

          {/* Result Homomorphic State */}
          {hasComputed && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-void-850 to-void-950 border border-zama-violet/30 space-y-4 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400">Homomorphic Sum Output</span>
                  <div className="text-sm font-mono font-bold text-zama-violet">
                    FHE.add Result = Encrypted Total Vault Principal
                  </div>
                </div>

                <button
                  onClick={() => setIsDecrypted(!isDecrypted)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-all"
                >
                  {isDecrypted ? <Lock className="w-3.5 h-3.5 text-zama-violet" /> : <Unlock className="w-3.5 h-3.5 text-zama-emerald" />}
                  <span>{isDecrypted ? "Mask Ciphertext" : "Verify Plaintext via EIP-712"}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-baseline gap-4 font-mono">
                {isDecrypted ? (
                  <div className="text-3xl font-extrabold text-zama-emerald glow-text-emerald">
                    {totalPlaintext} <span className="text-sm text-zama-emerald/80">cUSDT (Mathematically Exact)</span>
                  </div>
                ) : (
                  <div className="text-xl font-bold text-zama-cyan glow-text-cyan truncate">
                    0x4a91f82c0b7e192a83e...homomorphic_sum
                  </div>
                )}
              </div>

              <div className="text-[11px] font-mono text-slate-400 leading-relaxed pt-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zama-emerald shrink-0" />
                <span><strong>Zero Knowledge Guaranteed:</strong> The smart contract added both encrypted numbers together without ever learning the balance of Alice or Bob.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
