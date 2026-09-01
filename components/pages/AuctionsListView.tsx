"use client";

import React, { useState, useEffect } from "react";
import { AuctionView } from "@/lib/auctionStore";
import { 
  Gavel, 
  Lock, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  Sparkles,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";
import { HiTrophy } from "react-icons/hi2";
import { FaShieldAlt } from "react-icons/fa";

interface AuctionsListViewProps {
  auctions: AuctionView[];
  account: string | null;
  onConnect: () => void;
  onPlaceBid: (auctionId: number, amount: string) => Promise<void>;
  onSettleAuction: (auctionId: number) => Promise<void>;
  isLoadingAction: boolean;
  walletBalance: string;
}

export const AuctionsListView: React.FC<AuctionsListViewProps> = ({
  auctions,
  account,
  onConnect,
  onPlaceBid,
  onSettleAuction,
  isLoadingAction,
  walletBalance,
}) => {
  const [selectedAuction, setSelectedAuction] = useState<AuctionView | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenBidModal = (auc: AuctionView) => {
    setSelectedAuction(auc);
    const minBid = Math.max(parseFloat(auc.reservePrice || "0"), 10);
    setBidAmount(minBid.toString());
  };

  const handleConfirmBid = async () => {
    if (!selectedAuction || !bidAmount || parseFloat(bidAmount) <= 0) return;
    setIsSubmittingBid(true);
    try {
      await onPlaceBid(selectedAuction.id, bidAmount);
      setSelectedAuction(null);
      setBidAmount("");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const formatCountdown = (endTime: number) => {
    const diff = Math.max(0, endTime - now);
    if (diff === 0) return "Ended (Ready to Settle)";
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto text-black">
      {/* 1. Protocol Hero Banner */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-aura-yellow text-black shadow-sm">
                Zama fhEVM Protocol
              </span>
              <span className="text-xs font-bold text-slate-500">MEV-Resistant Dark Auctions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Confidential Sealed-Bid Dark Auctions
            </h2>
            <p className="text-xs text-slate-600 font-medium max-w-xl leading-relaxed">
              Place sealed bids encrypted onchain with Zama FHE. Competitors and MEV bots cannot see your bid amount or front-run you. Non-winning bidders get <strong>100% full escrow refunds</strong> instantly upon settlement.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="text-xs font-bold text-slate-500">Total Dark Pools Active</div>
            <div className="text-3xl font-black text-black">{auctions.filter(a => a.status === "Active").length} Live Pools</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-extrabold">
              <FaShieldAlt className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Front-Running</span>
            </div>
          </div>
        </div>

        {/* Hero Features Sub-bar */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block font-bold text-black">Encrypted euint64 Bids</span>
              <span className="text-slate-500 text-[11px]">Nobody sees your bid value</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block font-bold text-black">Homomorphic FHE.gt</span>
              <span className="text-slate-500 text-[11px]">Highest bid picked without decrypting</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="block font-bold text-black">100% Full Refunds</span>
              <span className="text-slate-500 text-[11px]">Zero loss for non-winning bidders</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Auctions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-black flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-600" />
            <span>Active Dark Auction Lots</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Real onchain escrow & settlement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {auctions.map((auc) => {
            const isEnded = now >= auc.endTime;
            const hasMyBid = parseFloat(auc.myEscrow || "0") > 0;

            return (
              <div 
                key={auc.id}
                className="aura-card p-6 bg-white border border-slate-200 hover:border-amber-300 transition-all shadow-sm flex flex-col justify-between space-y-6"
              >
                {/* Card Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Pool #{auc.id}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1 ${
                      auc.status === "Settled"
                        ? "bg-slate-100 text-slate-600"
                        : isEnded 
                          ? "bg-amber-100 text-amber-900" 
                          : "bg-emerald-100 text-emerald-900"
                    }`}>
                      <Clock className="w-3 h-3" />
                      <span>{auc.status === "Settled" ? "Settled" : formatCountdown(auc.endTime)}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-black leading-snug">{auc.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{auc.description}</p>
                  </div>
                </div>

                {/* Lot Stats & Sealed Bid Info */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Asset Lot Size:</span>
                    <strong className="text-black font-extrabold">{auc.tokenLotSize}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Min Reserve Price:</span>
                    <span className="font-bold text-black">${auc.reservePrice} cUSDT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Sealed Bids:</span>
                    <span className="font-bold text-amber-900">{auc.totalBidsCount} Encrypted Bids</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Locked Escrow:</span>
                    <strong className="text-black">${auc.totalEscrowCollected} cUSDT</strong>
                  </div>

                  {hasMyBid && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>Your Sealed Bid:</span>
                      </span>
                      <span>${auc.myEscrow} cUSDT</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="space-y-2">
                  {!account ? (
                    <button
                      onClick={onConnect}
                      className="w-full py-3 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider transition-all shadow-aura-yellow active:scale-95"
                    >
                      Connect Wallet
                    </button>
                  ) : auc.status === "Settled" ? (
                    <div className="w-full py-3 rounded-2xl bg-slate-100 text-slate-500 font-bold text-xs text-center border border-slate-200">
                      Auction Settled
                    </div>
                  ) : isEnded ? (
                    <button
                      onClick={() => onSettleAuction(auc.id)}
                      disabled={isLoadingAction}
                      className="w-full py-3 rounded-2xl bg-black text-white hover:bg-slate-800 font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                    >
                      {isLoadingAction ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Gavel className="w-4 h-4 text-aura-yellow" />
                      )}
                      <span>Settle Auction on FHE</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenBidModal(auc)}
                      className="w-full py-3 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider transition-all shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{hasMyBid ? "Increase Sealed Bid" : "Place Sealed Bid"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Sealed Bid Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="aura-card max-w-md w-full p-6 sm:p-8 bg-white border border-slate-200 shadow-xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-black">Submit Sealed Bid</h4>
                  <span className="text-[11px] text-slate-500">Pool #{selectedAuction.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuction(null)}
                className="text-slate-400 hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block">{selectedAuction.title}</span>
                <p className="text-amber-800 text-[11px]">
                  Lot Size: <strong>{selectedAuction.tokenLotSize}</strong> | Min Reserve: <strong>${selectedAuction.reservePrice} cUSDT</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <label className="text-slate-700">Sealed Bid Escrow (cUSDT):</label>
                  <span className="text-slate-500 font-mono">Wallet: ${walletBalance}</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min={selectedAuction.reservePrice}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min ${selectedAuction.reservePrice}`}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 font-bold text-base focus:border-amber-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-4 font-bold text-slate-400">cUSDT</span>
                </div>
              </div>

              {/* FHE Guarantee note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Escrow Protection</span>
                </div>
                <p>
                  Your bid is encrypted into an <code>euint64</code> ciphertext. If another bidder submits a higher bid, you can withdraw 100% of your escrow refund with 1 click.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedAuction(null)}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBid}
                disabled={isSubmittingBid || !bidAmount || parseFloat(bidAmount) < parseFloat(selectedAuction.reservePrice || "0")}
                className="flex-1 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-black text-xs uppercase tracking-wider shadow-aura-yellow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingBid ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Encrypting & Bidding...</span>
                  </>
                ) : (
                  <span>Confirm Sealed Bid</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
