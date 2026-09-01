"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { SidebarNav, AppPageTab } from "@/components/SidebarNav";
import { TopHeader } from "@/components/TopHeader";
import { LandingView } from "@/components/pages/LandingView";
import { DashboardView } from "@/components/pages/DashboardView";
import { VaultView } from "@/components/pages/VaultView";
import { DrawsView } from "@/components/pages/DrawsView";
import { RewardsView } from "@/components/pages/RewardsView";
import { HowItWorksView } from "@/components/pages/HowItWorksView";
import { FaucetModal } from "@/components/FaucetModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { DrawRecordView } from "@/components/PrizeDrawCard";
import { CONTRACT_ADDRESSES, MOCK_ERC20_ABI, AURA_PRIZE_POOL_ABI } from "@/lib/contracts";
import { fetchLiveProtocolState } from "@/lib/web3";
import { connectInjectedWallet, getInjectedProvider } from "@/lib/wallet";
import { requestEip712DecryptionPermission } from "@/lib/fhevm";

export default function Home() {
  // Routing & Navigation
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [currentTab, setCurrentTab] = useState<AppPageTab>("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [initialDepositAmount, setInitialDepositAmount] = useState<string>("");

  // Web3 Wallet State
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("0.00");

  // Confidential Balances
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [isDecryptingBalance, setIsDecryptingBalance] = useState<boolean>(false);

  const [decryptedWinnings, setDecryptedWinnings] = useState<string | null>(null);
  const [isDecryptingWinnings, setIsDecryptingWinnings] = useState<boolean>(false);

  // Live Protocol State (Loaded directly from Sepolia contracts)
  const [totalDeposits, setTotalDeposits] = useState<string>("0.00");
  const [totalPrizeReserve, setTotalPrizeReserve] = useState<string>("0.00");
  const [lastDrawTime, setLastDrawTime] = useState<number>(Math.floor(Date.now() / 1000));
  const [drawInterval, setDrawInterval] = useState<number>(3600);
  const [currentDrawId, setCurrentDrawId] = useState<number>(0);
  const [depositorsCount, setDepositorsCount] = useState<number>(0);
  const [totalPrizesAwarded, setTotalPrizesAwarded] = useState<string>("0.00");

  const [drawHistory, setDrawHistory] = useState<DrawRecordView[]>([]);

  // Action Status
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<string>("");

  // Modals
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState<boolean>(false);

  // --- Real Live Onchain State Refresh ---
  const refreshOnchainState = useCallback(async (userAcc?: string | null) => {
    const acc = userAcc !== undefined ? userAcc : account;
    const state = await fetchLiveProtocolState(acc);
    setTotalDeposits(state.totalDeposits);
    setTotalPrizeReserve(state.totalPrizeReserve);
    setTotalPrizesAwarded(state.totalPrizesAwarded);
    setLastDrawTime(state.lastDrawTime);
    setDrawInterval(state.drawInterval);
    setCurrentDrawId(state.currentDrawId);
    setDepositorsCount(state.depositorsCount);
    setDrawHistory(state.drawHistory || []);
    if (acc) {
      setWalletBalance(state.userWalletBalance);
    } else {
      setWalletBalance("0.00");
    }
  }, [account]);

  // Initial load & Polling
  useEffect(() => {
    refreshOnchainState();
    const interval = setInterval(() => {
      refreshOnchainState();
    }, 12000);
    return () => clearInterval(interval);
  }, [refreshOnchainState]);

  // Auto connect if active (only if user hasn't explicitly disconnected)
  useEffect(() => {
    const checkAutoConnect = async () => {
      if (typeof window !== "undefined" && localStorage.getItem("aurapool_disconnected") === "true") {
        return;
      }
      const ethereum = getInjectedProvider();
      if (ethereum) {
        try {
          const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
          if (accounts && accounts.length > 0) {
            const browserProvider = new ethers.BrowserProvider(ethereum);
            const userSigner = await browserProvider.getSigner();
            setAccount(accounts[0]);
            setProvider(browserProvider);
            setSigner(userSigner);
            await refreshOnchainState(accounts[0]);
          }
        } catch (err) {
          console.error("Auto connect check error:", err);
        }
      }
    };
    checkAutoConnect();
  }, [refreshOnchainState]);

  // Direct Wallet Connect
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      if (typeof window !== "undefined") {
        localStorage.removeItem("aurapool_disconnected");
      }
      const res = await connectInjectedWallet();
      if (res) {
        setAccount(res.account);
        setProvider(res.provider);
        setSigner(res.signer);
        await refreshOnchainState(res.account);
      }
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      alert(error.message || "Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aurapool_disconnected", "true");
    }
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setDecryptedBalance(null);
    setDecryptedWinnings(null);
    setWalletBalance("0.00");
  };

  // --- EIP-712 Decryption ---
  const handleDecryptBalance = async () => {
    if (!account || !provider) {
      await handleConnectWallet();
      return;
    }
    if (decryptedBalance !== null) {
      setDecryptedBalance(null);
      return;
    }

    try {
      setIsDecryptingBalance(true);
      await requestEip712DecryptionPermission(
        provider,
        account,
        CONTRACT_ADDRESSES.sepolia.prizePool
      );
      
      // Read real onchain balance for connected account
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, provider);
      const realBal = await poolContract.getUserPlaintextBalance(account).catch(() => 0n);
      setDecryptedBalance(ethers.formatUnits(realBal, 6));
    } catch (error) {
      console.error("Balance decryption error:", error);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, provider);
      const realBal = await poolContract.getUserPlaintextBalance(account).catch(() => 0n);
      setDecryptedBalance(ethers.formatUnits(realBal, 6));
    } finally {
      setIsDecryptingBalance(false);
    }
  };

  const handleDecryptWinnings = async () => {
    if (!account || !provider) {
      await handleConnectWallet();
      return;
    }
    if (decryptedWinnings !== null) {
      setDecryptedWinnings(null);
      return;
    }

    try {
      setIsDecryptingWinnings(true);
      await requestEip712DecryptionPermission(
        provider,
        account,
        CONTRACT_ADDRESSES.sepolia.prizePool
      );
      
      // Read real onchain winnings for connected account
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, provider);
      const realWin = await poolContract.getUserPlaintextWinnings(account).catch(() => 0n);
      setDecryptedWinnings(ethers.formatUnits(realWin, 6));
    } catch (error) {
      console.error("Winnings decryption error:", error);
      setDecryptedWinnings("0.00");
    } finally {
      setIsDecryptingWinnings(false);
    }
  };

  // --- Real Onchain Protocol Interactions ---
  const handleClaimFaucet = async () => {
    if (!signer || !account) {
      await handleConnectWallet();
      return;
    }

    try {
      setIsClaimingFaucet(true);
      const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.depositToken, MOCK_ERC20_ABI, signer);
      
      // Try official Zama token mint(account, amount) first
      try {
        const mintAmount = ethers.parseUnits("1000", 6);
        const tx = await tokenContract.mint(account, mintAmount);
        await tx.wait();
      } catch (mintErr) {
        // Fallback to faucet()
        const tx = await tokenContract.faucet();
        await tx.wait();
      }

      await refreshOnchainState();
      setIsFaucetOpen(false);
    } catch (error: any) {
      console.error("Faucet tx error:", error);
      alert(error.reason || error.message || "Failed to mint test tokens.");
      setIsFaucetOpen(false);
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  const handleDeposit = async (amountStr: string) => {
    if (!signer || !account) {
      await handleConnectWallet();
      return;
    }

    try {
      setIsLoadingAction(true);
      const amountUnits = ethers.parseUnits(amountStr, 6);
      const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.depositToken, MOCK_ERC20_ABI, signer);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, signer);

      setActionStatus("1/2 Approving cUSDT token allowance onchain...");
      const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.sepolia.prizePool, amountUnits);
      await approveTx.wait();

      setActionStatus("2/2 Depositing into Savings Vault...");
      const depositTx = await poolContract.deposit(amountUnits);
      await depositTx.wait();

      setActionStatus("Deposit completed successfully!");
      await refreshOnchainState();
      
      // Update decrypted balance directly
      const realBal = await poolContract.getUserPlaintextBalance(account).catch(() => 0n);
      setDecryptedBalance(ethers.formatUnits(realBal, 6));

      setTimeout(() => setActionStatus(""), 3000);
    } catch (error: any) {
      console.error("Deposit error:", error);
      setActionStatus(error.reason || error.message || "Deposit transaction rejected or failed.");
      setTimeout(() => setActionStatus(""), 4000);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleWithdraw = async (amountStr: string) => {
    if (!signer || !account) return;

    try {
      setIsLoadingAction(true);
      const amountUnits = ethers.parseUnits(amountStr, 6);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, signer);

      setActionStatus("Withdrawing principal with zero loss...");
      const tx = await poolContract.withdraw(amountUnits);
      await tx.wait();

      setActionStatus("Withdrawal completed!");
      await refreshOnchainState();

      const realBal = await poolContract.getUserPlaintextBalance(account).catch(() => 0n);
      setDecryptedBalance(ethers.formatUnits(realBal, 6));

      setTimeout(() => setActionStatus(""), 3000);
    } catch (error: any) {
      console.error("Withdraw error:", error);
      setActionStatus(error.reason || error.message || "Withdrawal failed onchain.");
      setTimeout(() => setActionStatus(""), 4000);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleWithdrawAll = async () => {
    if (!signer || !account) return;
    try {
      setIsLoadingAction(true);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, signer);
      setActionStatus("Withdrawing all savings principal...");
      const tx = await poolContract.withdrawAll();
      await tx.wait();
      setActionStatus("All funds withdrawn!");
      await refreshOnchainState();
      setDecryptedBalance("0.00");
      setTimeout(() => setActionStatus(""), 3000);
    } catch (error: any) {
      console.error("Withdraw all error:", error);
      const curSaved = decryptedBalance || "0.00";
      await handleWithdraw(curSaved);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleClaimPrize = async () => {
    if (!signer || !account) return;

    try {
      setIsLoadingAction(true);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, signer);
      setActionStatus("Claiming prize to your wallet...");
      const tx = await poolContract.claimPrize();
      await tx.wait();
      setActionStatus("Prize claimed successfully!");
      await refreshOnchainState();
      setDecryptedWinnings("0.00");
      setTimeout(() => setActionStatus(""), 3000);
    } catch (error: any) {
      console.error("Claim prize error:", error);
      setActionStatus(error.reason || error.message || "Claim prize failed onchain.");
      setTimeout(() => setActionStatus(""), 4000);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCompoundPrize = async () => {
    if (!signer || !account) return;

    try {
      setIsLoadingAction(true);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, signer);
      setActionStatus("Compounding prize into savings principal...");
      const tx = await poolContract.compoundPrize();
      await tx.wait();
      setActionStatus("Prize compounded successfully!");
      await refreshOnchainState();
      setDecryptedWinnings("0.00");
      setTimeout(() => setActionStatus(""), 3000);
    } catch (error: any) {
      console.error("Compound prize error:", error);
      setActionStatus(error.reason || error.message || "Compound prize failed onchain.");
      setTimeout(() => setActionStatus(""), 4000);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const [isTriggeringDraw, setIsTriggeringDraw] = useState<boolean>(false);
  const [isSettingInterval, setIsSettingInterval] = useState<boolean>(false);

  const handleTriggerDraw = async () => {
    if (!signer || !account) {
      await handleConnectWallet();
      return;
    }

    try {
      setIsTriggeringDraw(true);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, signer);
      const tx = await poolContract.triggerDraw();
      await tx.wait();
      await refreshOnchainState();
    } catch (error: any) {
      console.error("Trigger draw error:", error);
      alert(error.reason || error.message || "Failed to trigger draw onchain. Ensure draw interval has elapsed.");
    } finally {
      setIsTriggeringDraw(false);
    }
  };

  const handleSetDrawInterval = async (seconds: number) => {
    if (!signer || !account) {
      await handleConnectWallet();
      return;
    }

    try {
      setIsSettingInterval(true);
      const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, signer);
      const tx = await poolContract.setDrawInterval(seconds);
      await tx.wait();
      await refreshOnchainState();
    } catch (error: any) {
      console.error("Set interval error:", error);
      alert(error.reason || error.message || "Failed to set draw interval onchain.");
    } finally {
      setIsSettingInterval(false);
    }
  };

  const getPageDetails = () => {
    switch (currentTab) {
      case "dashboard": return { title: "Savings Dashboard", sub: "Live prize pot, countdown clock, and portfolio overview" };
      case "vault": return { title: "Savings Vault", sub: "Deposit tokens to get draw tickets & withdraw principal anytime" };
      case "draws": return { title: "Daily Prize Draws", sub: "Automated daily winner distributions and prize history" };
      case "rewards": return { title: "My Prize Winnings", sub: "Check your winnings, claim directly to wallet, or auto-compound" };
      case "how-it-works": return { title: "How It Works", sub: "The No-Loss prize savings model in 4 simple steps" };
    }
  };

  const { title, sub } = getPageDetails();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black">
      {/* 1. VISION / LANDING PAGE VIEW */}
      {currentView === "landing" ? (
        <LandingView
          onEnterApp={(tab, initialAmount) => {
            if (tab) setCurrentTab(tab as AppPageTab);
            if (initialAmount) setInitialDepositAmount(initialAmount);
            setCurrentView("app");
          }}
          onOpenFaucet={() => setIsFaucetOpen(true)}
          totalDeposits={totalDeposits}
          totalPrizeReserve={totalPrizeReserve}
          totalPrizesAwarded={totalPrizesAwarded}
          depositorsCount={depositorsCount}
        />
      ) : (
        /* 2. MAIN APP DASHBOARD WITH SIDEBAR NAVIGATION */
        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* Sidebar */}
          <SidebarNav
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onNavigateHome={() => setCurrentView("landing")}
            onOpenFaucet={() => setIsFaucetOpen(true)}
            isOpenMobile={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />

          {/* Main App Content Area */}
          <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
            <TopHeader
              pageTitle={title}
              pageSubtitle={sub}
              onOpenMobileNav={() => setIsMobileNavOpen(true)}
              account={account}
              onConnect={handleConnectWallet}
              onDisconnect={handleDisconnectWallet}
              isConnecting={isConnecting}
              onOpenFaucet={() => setIsFaucetOpen(true)}
              walletBalance={walletBalance}
            />

            <main className="flex-1 p-4 sm:p-8 max-w-5xl w-full mx-auto animate-in fade-in duration-200">
              {currentTab === "dashboard" && (
                <DashboardView
                  account={account}
                  walletBalance={walletBalance}
                  decryptedBalance={decryptedBalance}
                  decryptedWinnings={decryptedWinnings}
                  totalDeposits={totalDeposits}
                  totalPrizeReserve={totalPrizeReserve}
                  totalPrizesAwarded={totalPrizesAwarded}
                  depositorsCount={depositorsCount}
                  lastDrawTime={lastDrawTime}
                  drawInterval={drawInterval}
                  currentDrawId={currentDrawId}
                  drawHistory={drawHistory}
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
                  walletBalance={walletBalance}
                  decryptedBalance={decryptedBalance}
                  isDecryptingBalance={isDecryptingBalance}
                  onDecryptBalance={handleDecryptBalance}
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                  onWithdrawAll={handleWithdrawAll}
                  onOpenFaucet={() => setIsFaucetOpen(true)}
                  onConnect={handleConnectWallet}
                  isLoadingAction={isLoadingAction}
                  actionStatus={actionStatus}
                  initialDepositAmount={initialDepositAmount}
                  totalDeposits={totalDeposits}
                  totalPrizeReserve={totalPrizeReserve}
                />
              )}

              {currentTab === "draws" && (
                <DrawsView
                  account={account}
                  currentDrawId={currentDrawId}
                  currentPrizePot={totalPrizeReserve}
                  totalDepositors={depositorsCount}
                  lastDrawTime={lastDrawTime}
                  drawInterval={drawInterval}
                  drawHistory={drawHistory}
                  onCheckWinnings={handleDecryptWinnings}
                  isCheckingWinnings={isDecryptingWinnings}
                  decryptedWinnings={decryptedWinnings}
                  onConnect={handleConnectWallet}
                  onTriggerDraw={handleTriggerDraw}
                  isTriggeringDraw={isTriggeringDraw}
                  onSetDrawInterval={handleSetDrawInterval}
                  isSettingInterval={isSettingInterval}
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
                  actionStatus={actionStatus}
                />
              )}

              {currentTab === "how-it-works" && (
                <HowItWorksView
                  onEnterVault={() => setCurrentTab("vault")}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <FaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        onClaimFaucet={handleClaimFaucet}
        isClaiming={isClaimingFaucet}
        walletBalance={walletBalance}
        account={account}
        onConnect={handleConnectWallet}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
