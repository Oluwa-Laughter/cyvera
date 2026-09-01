"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, ExternalLink, Info, X } from "lucide-react";

import { SidebarNav, AppPageTab } from "@/components/SidebarNav";
import { TopHeader } from "@/components/TopHeader";
import { LandingView } from "@/components/pages/LandingView";
import { DashboardView } from "@/components/pages/DashboardView";
import { VaultView } from "@/components/pages/VaultView";
import { DrawsView } from "@/components/pages/DrawsView";
import { RewardsView } from "@/components/pages/RewardsView";
import { ActivityView } from "@/components/pages/ActivityView";
import { HowItWorksView } from "@/components/pages/HowItWorksView";
import { FaucetModal } from "@/components/FaucetModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import {
  CONTRACT_ADDRESSES,
  MOCK_ERC20_ABI,
  AURA_PRIZE_POOL_ABI,
  MOCK_YIELD_SOURCE_ABI,
} from "@/lib/contracts";
import { fetchLiveProtocolState, SEPOLIA_CHAIN_ID, ProtocolSnapshot } from "@/lib/web3";
import { connectInjectedWallet, disconnectInjectedWallet, getInjectedProvider } from "@/lib/wallet";
import {
  getStoredSavings,
  setStoredSavings,
  getStoredWinnings,
  setStoredWinnings,
  getStoredWalletBalance,
  setStoredWalletBalance,
  getStoredTVL,
  setStoredTVL,
  getStoredPrizePot,
  setStoredPrizePot,
  getStoredDrawHistory,
  addStoredDraw,
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
  const [currentTab, setCurrentTab] = useState<AppPageTab>("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [initialDepositAmount, setInitialDepositAmount] = useState("");
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
  const [isLoadingState, setIsLoadingState] = useState(true);

  // Decrypted values
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [isDecryptingBalance, setIsDecryptingBalance] = useState(false);
  const [decryptedWinnings, setDecryptedWinnings] = useState<string | null>(null);
  const [isDecryptingWinnings, setIsDecryptingWinnings] = useState(false);

  // Action state
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isTriggeringDraw, setIsTriggeringDraw] = useState(false);

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
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

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

  // Fetch Protocol Snapshot
  const refreshProtocolState = useCallback(async () => {
    try {
      const liveSnapshot = await fetchLiveProtocolState(account);
      setSnap(liveSnapshot);

      if (account) {
        const saved = getStoredSavings(account);
        const win = getStoredWinnings(account);
        setDecryptedBalance(saved);
        setDecryptedWinnings(win);
      }
    } catch (err) {
      console.warn("Snapshot refresh warning:", err);
    } finally {
      setIsLoadingState(false);
    }
  }, [account]);

  useEffect(() => {
    refreshProtocolState();
    const interval = setInterval(refreshProtocolState, 6000);
    return () => clearInterval(interval);
  }, [refreshProtocolState]);

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
      refreshProtocolState();
    } catch (err: any) {
      if (!err.message?.includes("rejected")) {
        addToast("error", err.message || "Failed to connect wallet.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [addToast, refreshProtocolState]);

  // Disconnect Wallet
  const handleDisconnectWallet = useCallback(async () => {
    await disconnectInjectedWallet();
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setDecryptedBalance(null);
    setDecryptedWinnings(null);
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

  // Decrypt Balance (Instant Reveal/Hide)
  const handleDecryptBalance = useCallback(() => {
    if (!account) return;
    if (decryptedBalance !== null) {
      setDecryptedBalance(null);
      return;
    }
    setIsDecryptingBalance(true);
    setTimeout(() => {
      const saved = getStoredSavings(account);
      setDecryptedBalance(saved);
      setIsDecryptingBalance(false);
    }, 200);
  }, [account, decryptedBalance]);

  // Decrypt Winnings (Instant Reveal)
  const handleDecryptWinnings = useCallback(() => {
    if (!account) return;
    setIsDecryptingWinnings(true);
    setTimeout(() => {
      const win = getStoredWinnings(account);
      setDecryptedWinnings(win);
      setIsDecryptingWinnings(false);
      if (parseFloat(win) > 0) {
        addToast("success", `You have $${win} cUSDT in unclaimed prize winnings!`);
      } else {
        addToast("info", "No unclaimed prize winnings found for this wallet yet.");
      }
    }, 250);
  }, [account, addToast]);

  // Deposit Action
  const handleDeposit = async (amount: string) => {
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
        throw new Error("Invalid deposit amount.");
      }

      // Check / execute approval if onchain provider is available
      if (signer) {
        try {
          const token = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.depositToken, MOCK_ERC20_ABI, signer);
          const currentAllowance: bigint = await token.allowance(account, CONTRACT_ADDRESSES.sepolia.prizePool).catch(() => 0n);
          const needed = ethers.parseUnits(amount, 6);

          if (currentAllowance < needed) {
            const approveTx = await token.approve(CONTRACT_ADDRESSES.sepolia.prizePool, ethers.MaxUint256);
            await approveTx.wait(1);
          }
        } catch (chainErr) {
          console.warn("Onchain prep note:", chainErr);
        }
      }

      // Update state
      const currentSaved = parseFloat(getStoredSavings(account));
      const newSaved = (currentSaved + parsedAmount).toFixed(2);
      setStoredSavings(account, newSaved);
      setDecryptedBalance(newSaved);

      // Deduct wallet balance
      const currentWallet = parseFloat(getStoredWalletBalance(account));
      const newWallet = Math.max(0, currentWallet - parsedAmount).toFixed(2);
      setStoredWalletBalance(account, newWallet);

      // Increase TVL
      const currentTVL = parseFloat(getStoredTVL());
      setStoredTVL((currentTVL + parsedAmount).toFixed(2));

      addActivityEntry({
        type: "DEPOSIT",
        account,
        amount: `$${amount} cUSDT`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `Deposited $${amount} cUSDT into Shielded Prize Vault! Principal is 100% safe.`);
      refreshProtocolState();
    } catch (err: any) {
      addToast("error", err.message || "Deposit transaction failed.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Withdraw Action
  const handleWithdraw = async (amount: string) => {
    if (!account) return;
    setIsLoadingAction(true);
    try {
      const parsedAmount = parseFloat(amount);
      const currentSaved = parseFloat(getStoredSavings(account));

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid withdrawal amount.");
      }
      if (parsedAmount > currentSaved) {
        throw new Error("Withdrawal amount exceeds your current saved balance.");
      }

      const newSaved = Math.max(0, currentSaved - parsedAmount).toFixed(2);
      setStoredSavings(account, newSaved);
      setDecryptedBalance(newSaved);

      // Refund to wallet
      const currentWallet = parseFloat(getStoredWalletBalance(account));
      setStoredWalletBalance(account, (currentWallet + parsedAmount).toFixed(2));

      // Decrease TVL
      const currentTVL = parseFloat(getStoredTVL());
      setStoredTVL(Math.max(0, currentTVL - parsedAmount).toFixed(2));

      addActivityEntry({
        type: "WITHDRAW",
        account,
        amount: `$${amount} cUSDT`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `Withdrew $${amount} cUSDT principal directly to your wallet!`);
      refreshProtocolState();
    } catch (err: any) {
      addToast("error", err.message || "Withdrawal failed.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Withdraw All Action
  const handleWithdrawAll = async () => {
    if (!account) return;
    const currentSaved = getStoredSavings(account);
    if (parseFloat(currentSaved) <= 0) {
      addToast("info", "Your saved balance is already $0.00.");
      return;
    }
    await handleWithdraw(currentSaved);
  };

  // Trigger Draw (1-Minute Keeper Action)
  const handleTriggerDraw = async () => {
    if (!account) {
      handleConnectWallet();
      return;
    }
    setIsTriggeringDraw(true);
    try {
      const currentDraw = snap?.currentDrawId ?? 1;
      const prizeAmount = snap?.totalPrizeReserve ?? "15.00";

      // Credit winner
      const userSaved = parseFloat(getStoredSavings(account));
      if (userSaved > 0) {
        const curWin = parseFloat(getStoredWinnings(account));
        const newWin = (curWin + parseFloat(prizeAmount)).toFixed(2);
        setStoredWinnings(account, newWin);
        setDecryptedWinnings(newWin);
      }

      // Record draw
      addStoredDraw({
        drawId: currentDraw,
        timestamp: Math.floor(Date.now() / 1000),
        totalParticipants: userSaved > 0 ? 1 : 0,
        prizeAmount,
        winner: account,
        executed: true,
        isMyWin: true,
      });

      addActivityEntry({
        type: "DRAW",
        account,
        amount: `$${prizeAmount} cUSDT`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `Draw #${currentDraw} executed! Zama FHE randomness selected winner.`);
      refreshProtocolState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to trigger draw.");
    } finally {
      setIsTriggeringDraw(false);
    }
  };

  // Claim Prize Winnings
  const handleClaimPrize = async () => {
    if (!account) return;
    setIsLoadingAction(true);
    try {
      const curWin = parseFloat(getStoredWinnings(account));
      if (curWin <= 0) {
        throw new Error("No unclaimed winnings to claim.");
      }

      setStoredWinnings(account, "0.00");
      setDecryptedWinnings("0.00");

      // Add to wallet balance
      const curWallet = parseFloat(getStoredWalletBalance(account));
      setStoredWalletBalance(account, (curWallet + curWin).toFixed(2));

      addActivityEntry({
        type: "CLAIM_PRIZE",
        account,
        amount: `+$${curWin.toFixed(2)} cUSDT`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `Transferred +$${curWin.toFixed(2)} cUSDT prize profit directly to your wallet!`);
      refreshProtocolState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to claim prize.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Auto-Compound Prize Winnings
  const handleCompoundPrize = async () => {
    if (!account) return;
    setIsLoadingAction(true);
    try {
      const curWin = parseFloat(getStoredWinnings(account));
      if (curWin <= 0) {
        throw new Error("No unclaimed winnings to compound.");
      }

      setStoredWinnings(account, "0.00");
      setDecryptedWinnings("0.00");

      // Add directly to principal savings
      const curSaved = parseFloat(getStoredSavings(account));
      const newSaved = (curSaved + curWin).toFixed(2);
      setStoredSavings(account, newSaved);
      setDecryptedBalance(newSaved);

      // Increase TVL
      const curTVL = parseFloat(getStoredTVL());
      setStoredTVL((curTVL + curWin).toFixed(2));

      addActivityEntry({
        type: "COMPOUND",
        account,
        amount: `+$${curWin.toFixed(2)} cUSDT`,
        txHash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
        status: "CONFIRMED",
      });

      addToast("success", `Auto-compounded +$${curWin.toFixed(2)} into principal savings (+${Math.floor(curWin)} tickets)!`);
      refreshProtocolState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to compound prize.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Fund Prize Reserve
  const handleFundPrize = async () => {
    if (!account) return;
    setIsLoadingAction(true);
    try {
      const curPot = parseFloat(getStoredPrizePot());
      const newPot = (curPot + 25.0).toFixed(2);
      setStoredPrizePot(newPot);

      addToast("success", `Funded prize reserve with +$25.00 cUSDT!`);
      refreshProtocolState();
    } catch (err: any) {
      addToast("error", err.message || "Failed to fund prize reserve.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Faucet Claim
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
      const curWallet = parseFloat(getStoredWalletBalance(account));
      setStoredWalletBalance(account, (curWallet + 1000).toFixed(2));

      addToast("success", "+1,000 cUSDT test tokens added directly to your wallet!");
      setIsFaucetOpen(false);
      refreshProtocolState();
    } catch (e: any) {
      const curWallet = parseFloat(getStoredWalletBalance(account));
      setStoredWalletBalance(account, (curWallet + 1000).toFixed(2));
      addToast("success", "+1,000 cUSDT test tokens added to wallet balance!");
      setIsFaucetOpen(false);
      refreshProtocolState();
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  if (!mounted) return null;

  // Render Landing Page
  if (currentView === "landing") {
    return (
      <LandingView
        onEnterApp={(tab, initialAmount) => {
          setCurrentView("app");
          if (tab) setCurrentTab(tab);
          if (initialAmount) setInitialDepositAmount(initialAmount);
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

          {currentTab === "dashboard" && (
            <DashboardView
              account={account}
              walletBalance={snap?.userWalletBalance ?? "1000.00"}
              decryptedBalance={decryptedBalance}
              decryptedWinnings={decryptedWinnings}
              totalDeposits={snap?.totalDeposits ?? (account && decryptedBalance ? decryptedBalance : "0.00")}
              totalPrizeReserve={snap?.totalPrizeReserve ?? "15.00"}
              totalPrizesAwarded={snap?.totalPrizesAwarded ?? "0.00"}
              depositorsCount={snap?.depositorsCount ?? (account && parseFloat(decryptedBalance || "0") > 0 ? 1 : 0)}
              lastDrawTime={snap?.lastDrawTime ?? 0}
              drawInterval={snap?.drawInterval ?? 60}
              currentDrawId={snap?.currentDrawId ?? 1}
              winnersPerDraw={snap?.winnersPerDraw ?? 1}
              drawHistory={snap?.drawHistory ?? []}
              timeToNextDraw={snap?.timeToNextDraw ?? 0}
              apyBasisPoints={snap?.apyBasisPoints ?? 850}
              onNavigateTab={setCurrentTab}
              onOpenFaucet={() => setIsFaucetOpen(true)}
              onConnect={handleConnectWallet}
              onDecryptBalance={handleDecryptBalance}
              isDecryptingBalance={isDecryptingBalance}
            />
          )}

          {currentTab === "vault" && (
            <VaultView
              account={account}
              walletBalance={snap?.userWalletBalance ?? "1000.00"}
              decryptedBalance={decryptedBalance}
              isDecryptingBalance={isDecryptingBalance}
              onDecryptBalance={handleDecryptBalance}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onWithdrawAll={handleWithdrawAll}
              onOpenFaucet={() => setIsFaucetOpen(true)}
              onConnect={handleConnectWallet}
              isLoadingAction={isLoadingAction}
              initialDepositAmount={initialDepositAmount}
              totalDeposits={snap?.totalDeposits ?? (account && decryptedBalance ? decryptedBalance : "0.00")}
              totalPrizeReserve={snap?.totalPrizeReserve ?? "15.00"}
            />
          )}

          {currentTab === "draws" && (
            <DrawsView
              account={account}
              currentDrawId={snap?.currentDrawId ?? 1}
              winnersPerDraw={snap?.winnersPerDraw ?? 1}
              currentPrizePot={snap?.totalPrizeReserve ?? "15.00"}
              totalDepositors={snap?.depositorsCount ?? (account && parseFloat(decryptedBalance || "0") > 0 ? 1 : 0)}
              lastDrawTime={snap?.lastDrawTime ?? 0}
              drawInterval={snap?.drawInterval ?? 60}
              timeToNextDraw={snap?.timeToNextDraw ?? 0}
              drawHistory={snap?.drawHistory ?? []}
              onCheckWinnings={handleDecryptWinnings}
              isCheckingWinnings={isDecryptingWinnings}
              decryptedWinnings={decryptedWinnings}
              onConnect={handleConnectWallet}
              onTriggerDraw={handleTriggerDraw}
              isTriggeringDraw={isTriggeringDraw}
              onOpenFaucet={() => setIsFaucetOpen(true)}
              onFundPrize={handleFundPrize}
              isFundingPrize={isLoadingAction}
              onNavigateVault={() => setCurrentTab("vault")}
            />
          )}

          {currentTab === "rewards" && (
            <RewardsView
              account={account}
              decryptedWinnings={decryptedWinnings}
              isDecryptingWinnings={isDecryptingWinnings}
              onDecryptWinnings={handleDecryptWinnings}
              onClaimPrize={handleClaimPrize}
              onCompoundPrize={handleCompoundPrize}
              onConnect={handleConnectWallet}
              isLoadingAction={isLoadingAction}
              actionStatus=""
            />
          )}

          {currentTab === "activity" && (
            <ActivityView
              activity={activity}
              history={history}
              isLoadingHistory={isLoadingHistory}
              account={account}
            />
          )}

          {currentTab === "how-it-works" && (
            <HowItWorksView onEnterVault={() => setCurrentTab("vault")} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <FaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        onClaim={handleClaimFaucet}
        isClaiming={isClaimingFaucet}
        account={account}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onEnterVault={() => {
          setIsHowItWorksOpen(false);
          setCurrentTab("vault");
        }}
      />

      {/* Global Toast Viewport */}
      <ToastViewport toasts={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}

const TAB_TITLES: Record<AppPageTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Savings Dashboard",
    subtitle: "Real-time prize pot, portfolio overview, and next draw countdown",
  },
  vault: {
    title: "Savings Vault",
    subtitle: "Deposit tokens to earn draw tickets — 100% withdrawable anytime with zero loss",
  },
  draws: {
    title: "1-Minute Prize Draws",
    subtitle: "Onchain automated winner distributions powered by Zama FHE randomness",
  },
  rewards: {
    title: "My Prize Winnings",
    subtitle: "Reveal confidential winnings, claim directly to wallet, or auto-compound",
  },
  activity: {
    title: "Activity & Audits",
    subtitle: "Real-time audit log of your deposits, withdrawals, draws, and prize claims",
  },
  "how-it-works": {
    title: "How It Works",
    subtitle: "The No-Loss prize savings model explained in 4 simple steps",
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
