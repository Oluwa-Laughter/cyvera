"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  Lock, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw,
  Coins,
  CheckCircle2
} from "lucide-react";

interface CreateAuctionViewProps {
  account: string | null;
  onConnect: () => void;
  onCreateAuction: (
    title: string,
    description: string,
    tokenLotSize: string,
    reservePrice: string,
    durationSeconds: number
  ) => Promise<void>;
  isLoadingAction: boolean;
  onNavigateTab: (tab: any) => void;
}

export const CreateAuctionView: React.FC<CreateAuctionViewProps> = ({
  account,
  onConnect,
  onCreateAuction,
  isLoadingAction,
  onNavigateTab,
}) => {
  const [title, setTitle] = useState("Confidential Token Allocation Lot");
  const [description, setDescription] = useState("Sealed-bid auction evaluated homomorphically via Zama FHE.");
  const [tokenLotSize, setTokenLotSize] = useState("25,000 AURA");
  const [reservePrice, setReservePrice] = useState("15.00");
  const [durationSeconds, setDurationSeconds] = useState(60); // 1 minute default for easy testing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !tokenLotSize || !reservePrice || durationSeconds <= 0) return;
    await onCreateAuction(title, description, tokenLotSize, reservePrice, durationSeconds);
    onNavigateTab("auctions");
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto text-black">
      {/* 1. Header Hero */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-aura-yellow text-black flex items-center justify-center font-bold shadow-sm">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black">Create Dark Auction Lot</h2>
            <p className="text-xs text-slate-500 font-medium">
              List asset lots or private allocations for confidential onchain sealed bidding.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Creation Form */}
      <form onSubmit={handleSubmit} className="aura-card p-6 sm:p-10 bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4 text-xs font-medium">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Auction Title / Asset Lot:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Genesis Protocol Allocation #1"
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Description & Terms:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe the allocation and bidding conditions..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lot Size */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold block">Lot Size (Reward Tokens):</label>
              <input
                type="text"
                value={tokenLotSize}
                onChange={(e) => setTokenLotSize(e.target.value)}
                placeholder="e.g. 50,000 AURA"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Reserve Price */}
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold block">Secret Reserve Price (cUSDT):</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="e.g. 20.00"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-bold text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Auction Duration (Testing Presets):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: "1 Minute (Test)", secs: 60 },
                { label: "5 Minutes", secs: 300 },
                { label: "1 Hour", secs: 3600 },
                { label: "24 Hours", secs: 86400 },
              ].map((preset) => (
                <button
                  key={preset.secs}
                  type="button"
                  onClick={() => setDurationSeconds(preset.secs)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    durationSeconds === preset.secs
                      ? "bg-aura-yellow border-black text-black shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Invariant Note */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-extrabold">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Zama FHE Encrypted Settlement</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When users bid on this auction, their bid amount is wrapped into an <code>euint64</code> ciphertext. The contract automatically uses <code>FHE.gt</code> to determine the highest bidder onchain with zero front-running.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div>
          {!account ? (
            <button
              type="button"
              onClick={onConnect}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow active:scale-95"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoadingAction}
              className="w-full py-4 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoadingAction ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Creating Onchain Dark Auction...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-black" />
                  <span>Deploy Dark Auction Lot</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
