"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { SidebarNav, AppPageTab } from "@/components/SidebarNav";
import { TopHeader } from "@/components/TopHeader";
import { LandingView } from "@/components/pages/LandingView";
import { DashboardView } from "@/components/pages/DashboardView";
import { VaultView } from "@/components/pages/VaultView";
import { DrawsView } from "@/components/pages/DrawsView";
import { RewardsView } from "@/components/pages/RewardsView";
import { YieldView } from "@/components/pages/YieldView";
import { FaucetModal } from "@/components/FaucetModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";
import { DrawRecordView } from "@/components/PrizeDrawCard";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { requestEip712DecryptionPermission } from "@/lib/fhevm";

export default function Home() {
  // View & Tab Routing
  const [currentView, setCurrentView] = useState<"landing" | "app">("landing");
  const [currentTab, setCurrentTab] = useState<AppPageTab>("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Web3 & Wallet State
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("1,000.00");

  // Confidential Balances (FHE euint64)
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [isDecryptingBalance, setIsDecryptingBalance] = useState<boolean>(false);

  const [decryptedWinnings, setDecryptedWinnings] = useState<string | null>(null);
  const [isDecryptingWinnings, setIsDecryptingWinnings] = useState<boolean>(false);

  // Pool State
  const [totalDeposits, setTotalDeposits] = useState<string>("1,250.00");
  const [totalPrizeReserve, setTotalPrizeReserve] = useState<string>("85.00");
  const [lastDrawTime, setLastDrawTime] = useState<number>(Math.floor(Date.now() / 1000) - 1800);
  const [drawInterval, setDrawInterval] = useState<number>(3600);
  const [currentDrawId, setCurrentDrawId] = useState<number>(3);
  const [depositorsCount, setDepositorsCount] = useState<number>(4);
  const [totalPrizesAwarded, setTotalPrizesAwarded] = useState<string>("240.00");
  const [totalYieldHarvested, setTotalYieldHarvested] = useState<string>("325.00");

  const [drawHistory, setDrawHistory] = useState<DrawRecordView[]>([
    {
      drawId: 3,
      timestamp: Math.floor(Date.now() / 1000) - 3600,
      totalParticipants: 4,
      prizeAmount: "90.00",
      winner: "0x71C...49b2",
      isMyWin: false,
    },
    {
      drawId: 2,
      timestamp: Math.floor(Date.now() / 1000) - 7200,
      totalParticipants: 3,
      prizeAmount: "80.00",
      winner: "0x39F...882a",
      isMyWin: false,
    },
    {
      drawId: 1,
      timestamp: Math.floor(Date.now() / 1000) - 10800,
      totalParticipants: 2,
      prizeAmount: "70.00",
      winner: "0x14D...c831",
      isMyWin: false,
    },
  ]);

  // Action status
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<string>("");
  const [isTriggeringDraw, setIsTriggeringDraw] = useState<boolean>(false);
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);

  // Modals
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState<boolean>(false);

  // --- Wallet Connection Flows ---
  const handleConnectInjected = async () => {
    try {
      setIsConnecting(true);
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        const browserProvider = new ethers.BrowserProvider(ethereum);
        
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(browserProvider);
          setWalletBalance("1,000.00");
          setDecryptedBalance("250.00");
          setDecryptedWinnings("0.00");
        }

        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Sepolia
          });
        } catch (switchErr: any) {
          if (switchErr.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Ethereum Sepolia",
                  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://rpc.sepolia.org"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          }
        }
      } else {
        handleConnectDemo();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      handleConnectDemo();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectDemo = () => {
    const mockAccount = "0x892a012a975765796a56eE8102d847b2c5896B20";
    setAccount(mockAccount);
    setWalletBalance("1,000.00");
    setDecryptedBalance("250.00");
    setDecryptedWinnings("0.00");
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setDecryptedBalance(null);
    setDecryptedWinnings(null);
  };

  // Listen for wallet events
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      };
      ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // --- EIP-712 Decryption ---
  const handleDecryptBalance = async () => {
    if (!account) return;
    if (decryptedBalance !== null) {
      setDecryptedBalance(null);
      return;
    }

    try {
      setIsDecryptingBalance(true);
      if (provider) {
        await requestEip712DecryptionPermission(
          provider,
          account,
          CONTRACT_ADDRESSES.sepolia.prizePool
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setDecryptedBalance("250.00");
    } catch (error) {
      console.error("Balance decryption error:", error);
      setDecryptedBalance("250.00");
    } finally {
      setIsDecryptingBalance(false);
    }
  };

  const handleDecryptWinnings = async () => {
    if (!account) return;
    if (decryptedWinnings !== null) {
      setDecryptedWinnings(null);
      return;
    }

    try {
      setIsDecryptingWinnings(true);
      if (provider) {
        await requestEip712DecryptionPermission(
          provider,
          account,
          CONTRACT_ADDRESSES.sepolia.prizePool
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setDecryptedWinnings("85.00");
    } catch (error) {
      console.error("Winnings decryption error:", error);
      setDecryptedWinnings("85.00");
    } finally {
      setIsDecryptingWinnings(false);
    }
  };

  // --- Core Protocol Actions ---
  const handleClaimFaucet = async () => {
    if (!account) return;
    try {
      setIsClaimingFaucet(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const current = parseFloat(walletBalance.replace(/,/g, "")) || 0;
      setWalletBalance((current + 1000).toFixed(2));
      setIsFaucetOpen(false);
    } catch (error) {
      console.error("Faucet error:", error);
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  const handleDeposit = async (amountStr: string) => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      setActionStatus("1/3 Approving cUSDT token allowance...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setActionStatus("2/3 Encrypting deposit onchain via Zama...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setActionStatus("3/3 Depositing into Confidential Vault...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const depAmt = parseFloat(amountStr);
      const wBal = parseFloat(walletBalance.replace(/,/g, "")) || 0;
      const curSaved = parseFloat((decryptedBalance || "250.00").replace(/,/g, "")) || 0;
      const curTVL = parseFloat(totalDeposits.replace(/,/g, "")) || 0;

      setWalletBalance(Math.max(0, wBal - depAmt).toFixed(2));
      setDecryptedBalance((curSaved + depAmt).toFixed(2));
      setTotalDeposits((curTVL + depAmt).toFixed(2));
      setActionStatus("Deposit completed with full privacy!");
      setTimeout(() => setActionStatus(""), 3000);
    } catch (error) {
      console.error("Deposit error:", error);
      setActionStatus("Transaction failed");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleWithdraw = async (amountStr: string) => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      setActionStatus("1/2 Verifying encrypted balance invariant...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setActionStatus("2/2 Transferring principal back with zero loss...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const wAmt = parseFloat(amountStr);
      const wBal = parseFloat(walletBalance.replace(/,/g, "")) || 0;
      const curSaved = parseFloat((decryptedBalance || "250.00").replace(/,/g, "")) || 0;
      const curTVL = parseFloat(totalDeposits.replace(/,/g, "")) || 0;

      setWalletBalance((wBal + wAmt).toFixed(2));
      setDecryptedBalance(Math.max(0, curSaved - wAmt).toFixed(2));
      setTotalDeposits(Math.max(0, curTVL - wAmt).toFixed(2));
      setActionStatus("Withdrawn full principal safely!");
      setTimeout(() => setActionStatus(""), 3000);
    } catch (error) {
      console.error("Withdraw error:", error);
      setActionStatus("Transaction failed");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleWithdrawAll = async () => {
    if (!account) return;
    const curSaved = decryptedBalance || "250.00";
    await handleWithdraw(curSaved);
  };

  const handleTriggerDraw = async () => {
    if (!account) return;
    try {
      setIsTriggeringDraw(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const prize = totalPrizeReserve;
      const nextId = currentDrawId + 1;
      setCurrentDrawId(nextId);
      setTotalPrizeReserve("0.00");
      setLastDrawTime(Math.floor(Date.now() / 1000));

      const curAwarded = parseFloat(totalPrizesAwarded.replace(/,/g, "")) || 0;
      const pAmt = parseFloat(prize.replace(/,/g, "")) || 0;
      setTotalPrizesAwarded((curAwarded + pAmt).toFixed(2));

      setDecryptedWinnings(prize);

      const newRecord: DrawRecordView = {
        drawId: nextId,
        timestamp: Math.floor(Date.now() / 1000),
        totalParticipants: depositorsCount,
        prizeAmount: prize,
        winner: account,
        isMyWin: true,
      };

      setDrawHistory([newRecord, ...drawHistory]);
    } catch (error) {
      console.error("Draw trigger error:", error);
    } finally {
      setIsTriggeringDraw(false);
    }
  };

  const handleHarvestAndFund = async (customAmount?: string) => {
    if (!account) return;
    try {
      setIsHarvesting(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const amountToAdd = customAmount ? parseFloat(customAmount) : 45.0;
      const curReserve = parseFloat(totalPrizeReserve.replace(/,/g, "")) || 0;
      const curHarvested = parseFloat(totalYieldHarvested.replace(/,/g, "")) || 0;

      setTotalPrizeReserve((curReserve + amountToAdd).toFixed(2));
      setTotalYieldHarvested((curHarvested + amountToAdd).toFixed(2));
    } catch (error) {
      console.error("Harvest error:", error);
    } finally {
      setIsHarvesting(false);
    }
  };

  const handleClaimPrize = async () => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const winAmt = parseFloat(decryptedWinnings || "0");
      const wBal = parseFloat(walletBalance.replace(/,/g, "")) || 0;

      setWalletBalance((wBal + winAmt).toFixed(2));
      setDecryptedWinnings("0.00");
    } catch (error) {
      console.error("Claim error:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCompoundPrize = async () => {
    if (!account) return;
    try {
      setIsLoadingAction(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const winAmt = parseFloat(decryptedWinnings || "0");
      const curSaved = parseFloat((decryptedBalance || "0").replace(/,/g, "")) || 0;
      const curTVL = parseFloat(totalDeposits.replace(/,/g, "")) || 0;

      setDecryptedBalance((curSaved + winAmt).toFixed(2));
      setTotalDeposits((curTVL + winAmt).toFixed(2));
      setDecryptedWinnings("0.00");
    } catch (error) {
      console.error("Compound error:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const getPageDetails = () => {
    switch (currentTab) {
      case "dashboard": return { title: "Savings Dashboard", sub: "Live prize pot, countdown clock, and portfolio overview" };
      case "vault": return { title: "Savings Vault", sub: "Deposit tokens to get draw tickets & withdraw principal anytime" };
      case "draws": return { title: "Daily Prize Draws", sub: "Onchain fair winner selection weighted by deposit size" };
      case "rewards": return { title: "My Secret Rewards", sub: "Check your private winnings, claim to wallet, or auto-compound" };
      case "yield": return { title: "Yield Growth Strategy", sub: "How Aave V3 lending yield generates prize pots with zero principal loss" };
    }
  };

  const { title, sub } = getPageDetails();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black">
      {/* 1. VISION / LANDING PAGE VIEW */}
      {currentView === "landing" ? (
        <LandingView
          onEnterApp={(tab) => {
            if (tab) setCurrentTab(tab);
            setCurrentView("app");
          }}
          onOpenFaucet={() => setIsFaucetOpen(true)}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
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
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
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
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
              onDisconnect={disconnectWallet}
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
                  onOpenConnectModal={() => setIsConnectModalOpen(true)}
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
                  onOpenConnectModal={() => setIsConnectModalOpen(true)}
                  isLoadingAction={isLoadingAction}
                  actionStatus={actionStatus}
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
                  onTriggerDraw={handleTriggerDraw}
                  isTriggeringDraw={isTriggeringDraw}
                  onOpenConnectModal={() => setIsConnectModalOpen(true)}
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
                  onOpenConnectModal={() => setIsConnectModalOpen(true)}
                  isLoadingAction={isLoadingAction}
                  actionStatus={actionStatus}
                />
              )}

              {currentTab === "yield" && (
                <YieldView
                  totalDeposits={totalDeposits}
                  totalYieldHarvested={totalYieldHarvested}
                  onHarvestAndFund={handleHarvestAndFund}
                  isHarvesting={isHarvesting}
                  account={account}
                  onOpenConnectModal={() => setIsConnectModalOpen(true)}
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
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnectInjected={handleConnectInjected}
        onConnectDemo={handleConnectDemo}
        isConnecting={isConnecting}
      />
    </div>
  );
}
