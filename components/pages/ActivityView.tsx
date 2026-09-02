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
    <div className="space-y-8 w-full max-w-4xl mx-auto text-foreground">
      {/* 1. Header Banner */}
      <div className="cyvera-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyvera-gold text-black flex items-center justify-center font-bold shadow-cyvera-glow">
              <History className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Activity & Audit Log</h2>
              <p className="text-xs text-[var(--muted)] font-medium">
                Verified onchain history of your deposits, withdrawals, draws, and prize distributions.
              </p>
            </div>
          </div>

          {/* Filter Mode Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-[var(--card-border)] text-xs font-bold">
            <button
              onClick={() => setFilterMode("my")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                filterMode === "my" 
                  ? "bg-white dark:bg-slate-900 text-foreground shadow-sm" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              <span>My Wallet</span>
            </button>
            <button
              onClick={() => setFilterMode("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                filterMode === "all" 
                  ? "bg-white dark:bg-slate-900 text-foreground shadow-sm" 
                  : "text-[var(--muted)] hover:text-foreground"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-500" />
              <span>Global Audit</span>
            </button>
          </div>
        </div>

        {/* Current Active Account Indicator */}
        {account && filterMode === "my" && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-[var(--card-border)] text-xs">
            <div className="flex items-center gap-2 text-[var(--muted)]">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Showing isolated logs for your connected address:</span>
            </div>
            <span className="font-mono font-bold text-foreground bg-slate-200 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg text-[11px]">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        )}
      </div>

      {/* 2. Feed Container */}
      <div className="cyvera-card p-6 sm:p-8 space-y-4">
        <ActivityFeed
          items={displayedEntries as any}
          title={filterMode === "my" ? "Personal Wallet Transactions" : "Protocol-Wide Verified Audit Feed"}
          emptyMessage={
            filterMode === "my"
              ? "No transactions found for this wallet yet. Get test tokens and make a deposit in the vault to see your onchain activity!"
              : "No protocol transactions recorded yet."
          }
        />
      </div>
    </div>
  );
};
