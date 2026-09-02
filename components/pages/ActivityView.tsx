"use client";

import React, { useState } from "react";
import { ActivityFeed, ActivityFeedItem } from "@/components/ActivityFeed";
import { History, ShieldCheck, Lock, Globe, Wallet, CheckCircle2 } from "lucide-react";
import { getAllStoredActivity, getStoredActivity } from "@/lib/store";

interface ActivityViewProps {
  activity: ActivityFeedItem[];
  history: any[];
  isLoadingHistory: boolean;
  account: string | null;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  activity,
  history,
  isLoadingHistory,
  account,
}) => {
  const [filterMode, setFilterMode] = useState<"my" | "all">("my");

  // Filter activities strictly for the active wallet when in "my" mode
  const displayedEntries = filterMode === "my" && account 
    ? getStoredActivity(account)
    : getAllStoredActivity();

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header Banner */}
      <div className="aura-card p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-aura-yellow text-black flex items-center justify-center font-bold shadow-sm">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black">Activity & Audit Log</h2>
              <p className="text-xs text-slate-500 font-medium">
                Verified onchain history of your deposits, withdrawals, draws, and prize distributions.
              </p>
            </div>
          </div>

          {/* Filter Mode Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterMode("my")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                filterMode === "my" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-slate-500 hover:text-black"
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-amber-600" />
              <span>My Wallet</span>
            </button>
            <button
              onClick={() => setFilterMode("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                filterMode === "all" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-slate-500 hover:text-black"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Global Audit</span>
            </button>
          </div>
        </div>

        {/* Connected Wallet Scope Badge */}
        {account && (
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Filtering for: <strong className="font-mono text-black">{account.slice(0, 8)}...{account.slice(-6)}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Encrypted History</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Session Activity Feed */}
      <ActivityFeed entries={displayedEntries} />
    </div>
  );
};
