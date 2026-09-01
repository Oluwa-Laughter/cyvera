"use client";

import React from "react";
import { AuctionView } from "@/lib/auctionStore";
import { 
  WalletCards, 
  Lock, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  ArrowDownLeft, 
  Award,
  Sparkles,
  Gift
} from "lucide-react";
import { HiTrophy } from "react-icons/hi2";

interface MyBidsViewProps {
  auctions: AuctionView[];
  account: string | null;
  onConnect: () => void;
  onClaimRefund: (auctionId: number) => Promise<void>;
  onClaimWonAsset: (auctionId: number) => Promise<void>;
  isLoadingAction: boolean;
  onNavigateTab: (tab: any) => void;
}

export const MyBidsView: React.FC<MyBidsViewProps> = ({
  auctions,
  account,
  onConnect,
  onClaimRefund,
  onClaimWonAsset,
  isLoadingAction,
  onNavigateTab,
}) => {
  const myBids = auctions.filter((a) => parseFloat(a.myEscrow || "0") > 0);
  const totalMyEscrow = myBids.reduce((acc, a) => acc + parseFloat(a.myEscrow || "0"), 0);

  const wonAuctions = auctions.filter((a) => a.isMyWin && a.status === "Settled");
  const refundAuctions = auctions.filter(
    (a) => a.status === "Settled" && parseFloat(a.myEscrow || "0") > 0 && !a.isMyWin && !a.hasClaimedRefund
  );

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto text-black">
      {/* 1. Header Hero */}
      <div className="aura-card p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border border-slate-200 shadow-aura-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Confidential Positions</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-200">
                100% Escrow Protected
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <div className="text-4xl sm:text-5xl font-black text-black">
                {account ? (
                  <span>
                    ${totalMyEscrow.toFixed(2)}{" "}
                    <span className="text-base text-slate-500 font-medium">cUSDT in Escrow</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-2xl font-bold">Not Connected</span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Encrypted bids in active sealed pools. Non-winning escrows are 100% refundable upon settlement.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!account ? (
              <button
                onClick={onConnect}
                className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs shadow-aura-yellow active:scale-95"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab("auctions")}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-aura-yellow hover:bg-aura-yellowHover text-black font-extrabold text-xs shadow-aura-yellow flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Explore Dark Auctions</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
          <div>
            <span className="text-slate-400 text-[11px] block">Active Bids Placed:</span>
            <strong className="text-black text-sm">{myBids.length} Auctions</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Won Auctions:</span>
            <strong className="text-emerald-700 text-sm">{wonAuctions.length} Lots Won</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Refunds Available:</span>
            <strong className="text-amber-800 text-sm">{refundAuctions.length} Ready</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Privacy Invariant:</span>
            <strong className="text-black text-sm">Zama FHE Encrypted</strong>
          </div>
        </div>
      </div>

      {/* 2. Won Auctions Banner (if any) */}
      {wonAuctions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-black flex items-center gap-2">
            <HiTrophy className="w-5 h-5 text-amber-500" />
            <span>Won Auction Lots (Claim Ready)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wonAuctions.map((auc) => (
              <div
                key={auc.id}
                className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-300 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-900 bg-aura-yellow px-2.5 py-0.5 rounded-full">
                    Winner #{auc.id}
                  </span>
                  <span className="text-xs font-bold text-amber-900">Winning Bid: ${auc.winningAmount} cUSDT</span>
                </div>

                <div>
                  <h4 className="text-base font-black text-black">{auc.title}</h4>
                  <p className="text-xs text-amber-900 font-medium">Won Lot: <strong>{auc.tokenLotSize}</strong></p>
                </div>

                <button
                  onClick={() => onClaimWonAsset(auc.id)}
                  disabled={isLoadingAction || auc.assetClaimed}
                  className="w-full py-3 rounded-2xl bg-black text-white hover:bg-slate-800 font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {auc.assetClaimed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Asset Claimed to Wallet</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 text-aura-yellow" />
                      <span>Claim Won Lot to Wallet</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Pending Refunds Banner (if any) */}
      {refundAuctions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-black flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
            <span>100% Escrow Refunds Ready to Withdraw</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {refundAuctions.map((auc) => (
              <div
                key={auc.id}
                className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Pool #{auc.id} Settled</span>
                  <span className="text-xs font-black text-emerald-900 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                    +${auc.myEscrow} cUSDT Refund
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-black">{auc.title}</h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    This auction completed. Claim your full deposit back directly to your wallet.
                  </p>
                </div>

                <button
                  onClick={() => onClaimRefund(auc.id)}
                  disabled={isLoadingAction}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Withdraw ${auc.myEscrow} Refund</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Active Bids List */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-black flex items-center gap-2">
          <WalletCards className="w-5 h-5 text-amber-600" />
          <span>All My Sealed Bid Positions</span>
        </h3>

        {myBids.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-black">No Active Sealed Bids</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">
                You haven't placed any bids yet. Explore active dark auctions to place encrypted bids!
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("auctions")}
              className="px-6 py-3 rounded-2xl bg-aura-yellow text-black font-extrabold text-xs shadow-aura-yellow"
            >
              Explore Auctions
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myBids.map((auc) => (
              <div
                key={auc.id}
                className="aura-card p-6 bg-white border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Pool #{auc.id}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    auc.status === "Settled" ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-900"
                  }`}>
                    {auc.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-black">{auc.title}</h4>
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Your Deposited Escrow:</span>
                      <strong className="text-black">${auc.myEscrow} cUSDT</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Ciphertext Handle:</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {auc.myEncryptedBidHandle ? `${auc.myEncryptedBidHandle.slice(0, 10)}...` : "euint64 (Zama)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
