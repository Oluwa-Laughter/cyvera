"use client";

import React, { useState } from "react";
import { 
  History, 
  Wallet, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Trophy,
  ShieldCheck,
  RotateCw
} from "lucide-react";
import { getStoredActivity, getAllStoredActivity, StoredActivityItem } from "@/lib/store";

interface ActivityViewProps {
  account: string | null;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  account,
}) => {
  const [filterMode, setFilterMode] = useState<"my" | "all">("my");

  // Filter activities strictly for the active wallet when in "my" mode
  const displayedEntries = filterMode === "my" && account 
    ? getStoredActivity(account)
    : getAllStoredActivity();

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-foreground">
      {/* 1. Header Banner (Double-Bezel Architecture) */}
      <div className="p-1 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/90 backdrop-blur-xl border border-white/[0.04] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <History className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Activity & Audit Log</h2>
                <p className="text-xs text-slate-400 font-normal">
                  Verified history of your deposits, withdrawals, draws, and prize distributions.
                </p>
              </div>
            </div>

            {/* Filter Mode Selector */}
            <div className="flex items-center p-1 rounded-xl bg-[#101524] border border-white/[0.06] text-xs font-semibold">
              <button
                onClick={() => setFilterMode("my")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  filterMode === "my" 
                    ? "bg-[#182032] text-white font-bold shadow-sm border border-cyan-500/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                <span>My Wallet</span>
              </button>
              <button
                onClick={() => setFilterMode("all")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  filterMode === "all" 
                    ? "bg-[#182032] text-white font-bold shadow-sm border border-cyan-500/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Global Audit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Activity List */}
      <div className="p-1 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        <div className="p-6 rounded-[calc(1.5rem-4px)] bg-[#0C101A]/70 space-y-3">
          {displayedEntries.length === 0 ? (
            <div className="p-8 text-center bg-[#101524]/50 rounded-2xl border border-dashed border-white/[0.08] space-y-2">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs font-bold text-white">No Activity Records Yet</div>
              <p className="text-[11px] text-slate-400">
                {filterMode === "my"
                  ? "Deposit tokens into the vault or participate in draws to generate verified audit history."
                  : "No global protocol events recorded yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedEntries.map((item) => {
                const isDraw = item.action.includes("Draw");
                const isDeposit = item.action.includes("Deposit");
                const isWithdraw = item.action.includes("Withdraw");
                const isClaim = item.action.includes("Claim");

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#101524]/60 border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-cyan-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isDeposit ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        isWithdraw ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        isClaim ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                        "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}>
                        {isDeposit && <ArrowDownLeft className="w-4 h-4" />}
                        {isWithdraw && <ArrowUpRight className="w-4 h-4" />}
                        {isClaim && <Trophy className="w-4 h-4" />}
                        {isDraw && <RotateCw className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{item.action}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                            {item.asset || "cUSDT"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {new Date(item.timestamp).toLocaleString()} •{" "}
                          <span>{item.account.slice(0, 6)}...{item.account.slice(-4)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {item.status || "CONFIRMED"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
