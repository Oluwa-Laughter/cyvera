"use client";

import React from "react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { UserHistory } from "@/components/UserHistory";
import { ActivityEntry } from "@/app/page";
import { HistoryEntry } from "@/lib/history";
import { History, Activity, ShieldCheck, Zap } from "lucide-react";

interface ActivityViewProps {
  activity: ActivityEntry[];
  history: HistoryEntry[];
  isLoadingHistory: boolean;
  account: string | null;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  activity,
  history,
  isLoadingHistory,
  account,
}) => {
  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header Banner */}
      <div className="aura-card p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-aura-yellow text-black flex items-center justify-center font-bold shadow-sm">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-black">Protocol Activity & Transactions</h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time audit log of your deposits, withdrawals, FHE draws, and prize claims.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Onchain User History */}
      <UserHistory entries={history} isLoading={isLoadingHistory} />

      {/* 3. Session Activity Feed */}
      <ActivityFeed entries={activity} />
    </div>
  );
};
