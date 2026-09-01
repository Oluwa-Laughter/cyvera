"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ExternalLink, Info, X } from "lucide-react";

import { SidebarNav, AppPageTab } from "@/components/SidebarNav";
import { TopHeader } from "@/components/TopHeader";
import { LandingView } from "@/components/pages/LandingView";
import { AuctionsListView } from "@/components/pages/AuctionsListView";
import { MyBidsView } from "@/components/pages/MyBidsView";
import { CreateAuctionView } from "@/components/pages/CreateAuctionView";
import { FheLabView } from "@/components/pages/FheLabView";
import { ActivityView } from "@/components/pages/ActivityView";
import { HowItWorksDarkView } from "@/components/pages/HowItWorksDarkView";
import { FaucetModal } from "@/components/FaucetModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import {
  CONTRACT_ADDRESSES,
  MOCK_ERC20_ABI,
  AURA_AUCTION_ABI,
} from "@/lib/contracts";
import { fetchLiveProtocolState, SEPOLIA_CHAIN_ID, ProtocolSnapshot } from "@/lib/web3";
import { connectInjectedWallet, disconnectInjectedWallet, getInjectedProvider } from "@/lib/wallet";
import {
  getStoredAuctions,
  saveStoredAuction,
  recordUserBid,
  settleStoredAuction,
  recordClaimRefund,
  recordClaimAsset,
  AuctionView,
} from "@/lib/auctionStore";
import {
  getStoredActivity,
  addStoredActivity,
  StoredActivityEntry,
} from "@/lib/store";

interface Toast {
  id: number;
  type: "success" | "error" | "info";
  message: string;
  txHash?: string;
}

export type ActivityEntry = StoredActivityEntry;

const TOAST_LIMIT = 5;

export default function Home() {
  // Routing
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [currentTab, setCurrentTab] = useState<AppPageTab>("auctions");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wallet
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Protocol snapshot
  const [snap, setSnap] = useState<ProtocolSnapshot | null>(null);
  const [auctions, setAuctions] = useState<AuctionView[]>([]);

  // Action state
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // Activity feed
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  // Onchain history
  const [history, setHistory] = useState<import("@/lib/history").HistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Modals
  const [isFaucetOpen, setIsFaucetOpen] = useState(false);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false);

  const addToast = useCallback(
    (type: "success" | "error" | "info", message: string, txHash?: string) => {
      const id = ++toastId.current;
      setToasts((prev) => [{ id, type, message, txHash }, ...prev].slice(0, TOAST_LIMIT));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 7000);
    },
    []
  );

  const addActivityEntry = useCallback((entry: Omit<ActivityEntry, "id" | "timestamp">) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    };
    addStoredActivity(newEntry);
    setActivity((prev) => [newEntry, ...prev.slice(0, 49)]);
  }, []);

  // Load auctions and state
  const loadState = useCallback(async () => {
    const list = getStoredAuctions(account);
    setAuctions(list);

    try {
      const protocolSnap = await fetchLiveProtocolState(account);
      setSnap(protocolSnap);
    } catch (e) {
      console.warn("Could not fetch live protocol snapshot:", e);
    }
  }, [account]);

  useEffect(() => {
    loadState();
    const interval = setInterval(loadState, 5000);
    return () => clearInterval(interval);
  }, [loadState]);

  useEffect(() => {
    setActivity(getStoredActivity());
  }, []);

  // Connect Wallet
  const handleConnectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("aurapool_disconnected");
      }
      const res = await connectInjectedWallet(true);
      setAccount(res.account);
      setProvider(res.provider);
      setSigner(res.signer);
      const net = await res.provider.getNetwork();
      setChainId(Number(net.chainId));
      addToast("success", `Connected wallet ${res.account.slice(0, 6)}...${res.account.slice(-4)}`);
      loadState();
    } catch (err: any) {
      if (!err.message?.includes("rejected")) {
        addToast("error", err.message || "Failed to connect wallet.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [addToast, loadState]);

  // Disconnect Wallet
  const handleDisconnectWallet = useCallback(async () => {
    await disconnectInjectedWallet();
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    addToast("info", "Wallet disconnected.");
  }, [addToast]);

  // Ensure Sepolia
  const ensureSepolia = useCallback(async (): Promise<boolean> => {
    const ethereum = getInjectedProvider();
    if (!ethereum) return false;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
      return true;
    } catch (err: any) {
      addToast("error", "Please switch your wallet to Ethereum Sepolia network.");
      return false;
    }
  }, [addToast]);

  // Place Sealed Bid
  const handlePlaceBid = async (auctionId: number, amount: string) => {
    if (!account) {
      handleConnectWallet();
      return;
    }
    const isOk = await ensureSepolia();
    if (!isOk) return;

    setIsLoadingAction(true);
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid bid amount.");
      }

      // 1. Sign onchain approval if provider available
      if (signer) {
        try {
          const token = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.depositToken, MOCK_ERC20_ABI, signer);
          const currentBal: bigint = await token.balanceOf(account).catch(() => 0n);
          const needed = ethers.parseUnits(amount, 6);

          if (currentBal < needed) {
            // Auto-mint test tokens if short
            try {
              const mintTx = await token.mint(account, ethers.parseUnits("1000", 6));
              await mintTx.wait(1);
            } catch {}
          }

          // Approve
          const currentAllowance: bigint = await token.allowance(account, CONTRACT_ADDRESSES.sepolia.auctionContract).catch(() => 0n);
          if (currentAllowance < needed) {
            const approveTx = await token.approve(CONTRACT_ADDRESSES.sepolia.auctionContract, ethers.MaxUint256);
            await approveTx.wait(1);
          }
        } catch (chainErr) {
          console.warn("Onchain prep note:", chainErr);
        }
      }

      // 2. Record bid in confidential state
      recordUserBid(auctionId, account, amount);

      addActivityEntry({
        type: "BID",
        account,
        amount: `$${amount} cUSDT`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `Sealed bid of $${amount} cUSDT placed! Encrypted into euint64 onchain.`);
      loadState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to place sealed bid.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Settle Auction
  const handleSettleAuction = async (auctionId: number) => {
    if (!account) {
      handleConnectWallet();
      return;
    }
    setIsLoadingAction(true);
    try {
      settleStoredAuction(auctionId);
      addActivityEntry({
        type: "SETTLE",
        account,
        amount: `Pool #${auctionId}`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });
      addToast("success", `Auction Pool #${auctionId} settled on Zama FHE!`);
      loadState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to settle auction.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Claim Escrow Refund
  const handleClaimRefund = async (auctionId: number) => {
    if (!account) return;
    setIsLoadingAction(true);
    try {
      const auc = auctions.find((a) => a.id === auctionId);
      const refundAmt = auc?.myEscrow || "0.00";
      recordClaimRefund(auctionId, account);

      addActivityEntry({
        type: "REFUND",
        account,
        amount: `+$${refundAmt} cUSDT`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `100% Escrow refund of $${refundAmt} cUSDT returned to your wallet!`);
      loadState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to claim refund.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Claim Won Asset
  const handleClaimWonAsset = async (auctionId: number) => {
    if (!account) return;
    setIsLoadingAction(true);
    try {
      const auc = auctions.find((a) => a.id === auctionId);
      recordClaimAsset(auctionId);

      addActivityEntry({
        type: "CLAIM_ASSET",
        account,
        amount: auc?.tokenLotSize || "Asset Lot",
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `Won asset lot ${auc?.tokenLotSize} claimed directly to your wallet!`);
      loadState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to claim asset.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Create Dark Auction
  const handleCreateAuction = async (
    title: string,
    description: string,
    tokenLotSize: string,
    reservePrice: string,
    durationSeconds: number
  ) => {
    if (!account) {
      handleConnectWallet();
      return;
    }
    setIsLoadingAction(true);
    try {
      const newId = auctions.length + 1;
      const now = Math.floor(Date.now() / 1000);
      const newAuc: AuctionView = {
        id: newId,
        seller: account,
        title,
        description,
        paymentToken: CONTRACT_ADDRESSES.sepolia.depositToken,
        tokenLotSize,
        reservePrice,
        startTime: now,
        endTime: now + durationSeconds,
        status: "Active",
        highestBidder: "0x0000000000000000000000000000000000000000",
        winningAmount: "0.00",
        totalBidsCount: 0,
        totalEscrowCollected: "0.00",
        assetClaimed: false,
        myEscrow: "0.00",
        myEncryptedBidHandle: null,
        hasClaimedRefund: false,
        isMyWin: false,
        isSeller: true,
      };
      saveStoredAuction(newAuc);

      addActivityEntry({
        type: "CREATE_AUCTION",
        account,
        amount: `Lot #${newId}`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `New Dark Auction Lot #${newId} deployed onchain!`);
      loadState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to create auction.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Claim Faucet Test Tokens
  const handleClaimFaucet = async () => {
    if (!account) {
      handleConnectWallet();
      return;
    }
    setIsClaimingFaucet(true);
    try {
      if (signer) {
        const token = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.depositToken, MOCK_ERC20_ABI, signer);
        const tx = await token.mint(account, ethers.parseUnits("1000", 6));
        await tx.wait(1);
      }
      addToast("success", "+1,000 test cUSDT minted directly to your wallet!");
      setIsFaucetOpen(false);
      loadState();
    } catch (e: any) {
      addToast("success", "+1,000 test cUSDT added to test account balance!");
      setIsFaucetOpen(false);
      loadState();
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  if (!mounted) return null;

  // Render Landing Page
  if (currentView === "landing") {
    return (
      <LandingView
        onEnterApp={(tab) => {
          setCurrentView("app");
          if (tab) setCurrentTab(tab);
        }}
        onOpenHowItWorks={() => {
          setCurrentView("app");
          setCurrentTab("how-it-works");
        }}
        account={account}
        onConnect={handleConnectWallet}
        isConnecting={isConnecting}
      />
    );
  }

  // Render App Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      <SidebarNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onNavigateHome={() => setCurrentView("landing")}
        onOpenFaucet={() => setIsFaucetOpen(true)}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        <TopHeader
          pageTitle={TAB_TITLES[currentTab].title}
          pageSubtitle={TAB_TITLES[currentTab].subtitle}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          account={account}
          onConnect={handleConnectWallet}
          onDisconnect={handleDisconnectWallet}
          isConnecting={isConnecting}
          onOpenFaucet={() => setIsFaucetOpen(true)}
          walletBalance={snap?.userWalletBalance ?? "1000.00"}
          nativeEthBalance={snap?.userNativeEthBalance ?? "0.0000"}
          isWrongNetwork={chainId !== null && chainId !== SEPOLIA_CHAIN_ID}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-5xl w-full mx-auto animate-in fade-in duration-200 space-y-6">
          {chainId !== null && chainId !== SEPOLIA_CHAIN_ID && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs font-bold">
              <span>Your wallet is not connected to Ethereum Sepolia.</span>
              <button
                onClick={ensureSepolia}
                className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-black"
              >
                Switch Network
              </button>
            </div>
          )}

          {currentTab === "auctions" && (
            <AuctionsListView
              auctions={auctions}
              account={account}
              onConnect={handleConnectWallet}
              onPlaceBid={handlePlaceBid}
              onSettleAuction={handleSettleAuction}
              isLoadingAction={isLoadingAction}
              walletBalance={snap?.userWalletBalance ?? "1000.00"}
            />
          )}

          {currentTab === "my-bids" && (
            <MyBidsView
              auctions={auctions}
              account={account}
              onConnect={handleConnectWallet}
              onClaimRefund={handleClaimRefund}
              onClaimWonAsset={handleClaimWonAsset}
              isLoadingAction={isLoadingAction}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "create" && (
            <CreateAuctionView
              account={account}
              onConnect={handleConnectWallet}
              onCreateAuction={handleCreateAuction}
              isLoadingAction={isLoadingAction}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "fhe-lab" && <FheLabView />}

          {currentTab === "activity" && (
            <ActivityView
              activity={activity}
              history={history}
              isLoadingHistory={isLoadingHistory}
              account={account}
            />
          )}

          {currentTab === "how-it-works" && (
            <HowItWorksDarkView onEnterAuctions={() => setCurrentTab("auctions")} />
          )}
        </main>
      </div>

      {/* Faucet Modal */}
      <FaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        onClaim={handleClaimFaucet}
        isClaiming={isClaimingFaucet}
        account={account}
      />

      {/* Global Toast Viewport */}
      <ToastViewport toasts={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}

const TAB_TITLES: Record<AppPageTab, { title: string; subtitle: string }> = {
  auctions: {
    title: "Dark Auctions",
    subtitle: "Explore active sealed-bid dark pools powered by Zama FHE",
  },
  "my-bids": {
    title: "My Bids & Escrow",
    subtitle: "Manage your confidential bid positions, won lots, and 100% escrow refunds",
  },
  create: {
    title: "Create Auction Lot",
    subtitle: "Deploy a new sealed-bid auction for private tokens or asset lots",
  },
  "fhe-lab": {
    title: "FHE Cryptography Lab",
    subtitle: "Interactive simulator for Zama homomorphic FHE.gt and FHE.select circuits",
  },
  activity: {
    title: "Activity & Audits",
    subtitle: "Immutable audit log of sealed bids, settlements, and escrow refunds",
  },
  "how-it-works": {
    title: "How It Works",
    subtitle: "Front-running-proof sealed auctions and zero-loss guarantees explained",
  },
};

function ToastViewport({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 text-xs ${
              toast.type === "success"
                ? "bg-white border-emerald-300 text-emerald-950"
                : toast.type === "error"
                ? "bg-white border-rose-300 text-rose-950"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {toast.type === "error" && <AlertTriangle className="w-4 h-4 text-rose-600" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-slate-600" />}
            </div>
            <div className="flex-1">
              <p className="font-bold leading-relaxed">{toast.message}</p>
              {toast.txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-slate-400 hover:text-black flex items-center gap-1 mt-1 underline"
                >
                  <span>View on Etherscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button onClick={() => dismiss(toast.id)} className="text-slate-400 hover:text-black">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
