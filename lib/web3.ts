import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, MOCK_ERC20_ABI, AURA_PRIZE_POOL_ABI, MOCK_YIELD_SOURCE_ABI } from "./contracts";

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_HEX_CHAIN_ID = "0xaa36a7";
export const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

// Public RPC Read-Only Provider
export const getPublicProvider = () => {
  return new ethers.JsonRpcProvider(SEPOLIA_RPC);
};

// Check if mobile device
export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Connect Wallet directly
export const connectWalletDirect = async () => {
  if (typeof window === "undefined") throw new Error("Window not defined");

  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    if (isMobileDevice()) {
      // Deep link to MetaMask mobile app browser
      const currentUrl = window.location.href.replace(/^https?:\/\//, "");
      window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
      return null;
    }
    throw new Error("No Web3 wallet detected. Please install MetaMask, Coinbase Wallet, or Rabby.");
  }

  // Request accounts
  const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) {
    throw new Error("No account selected");
  }

  const browserProvider = new ethers.BrowserProvider(ethereum);

  // Auto switch / add Sepolia testnet
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_HEX_CHAIN_ID }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902 || switchError.code === -32603) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SEPOLIA_HEX_CHAIN_ID,
            chainName: "Ethereum Sepolia",
            nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [SEPOLIA_RPC, "https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    }
  }

  const signer = await browserProvider.getSigner();
  return {
    account: accounts[0],
    provider: browserProvider,
    signer,
  };
};

// Live Onchain Protocol State Reader
export const fetchLiveProtocolState = async (userAccount?: string | null) => {
  const provider = getPublicProvider();
  const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.depositToken, MOCK_ERC20_ABI, provider);
  const poolContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.prizePool, AURA_PRIZE_POOL_ABI, provider);
  const yieldContract = new ethers.Contract(CONTRACT_ADDRESSES.sepolia.yieldSource, MOCK_YIELD_SOURCE_ABI, provider);

  try {
    const [
      totalDepositsRaw,
      totalPrizeReserveRaw,
      totalPrizesAwardedRaw,
      lastDrawTimeRaw,
      drawIntervalRaw,
      currentDrawIdRaw,
      depositorsCountRaw,
      totalYieldHarvestedRaw,
    ] = await Promise.all([
      poolContract.totalDeposits().catch(() => 0n),
      poolContract.totalPrizeReserve().catch(() => 0n),
      poolContract.totalPrizesAwarded().catch(() => 0n),
      poolContract.lastDrawTime().catch(() => 0n),
      poolContract.drawInterval().catch(() => 3600n),
      poolContract.currentDrawId().catch(() => 0n),
      poolContract.getDepositorCount().catch(() => 0n),
      yieldContract.totalYieldHarvested().catch(() => 0n),
    ]);

    let userWalletBalance = "0.00";
    let userShieldedBalance = "0.00";
    let userWinnings = "0.00";

    if (userAccount) {
      const [bal, shieldedBal, winnings] = await Promise.all([
        tokenContract.balanceOf(userAccount).catch(() => 0n),
        poolContract.getUserPlaintextBalance(userAccount).catch(() => 0n),
        poolContract.getUserPlaintextWinnings(userAccount).catch(() => 0n),
      ]);
      userWalletBalance = ethers.formatUnits(bal, 6);
      userShieldedBalance = ethers.formatUnits(shieldedBal, 6);
      userWinnings = ethers.formatUnits(winnings, 6);
    }

    // Fetch real onchain draw history records
    const numDraws = Number(currentDrawIdRaw) || 0;
    const realHistory: any[] = [];
    if (numDraws > 0) {
      for (let i = numDraws; i >= Math.max(1, numDraws - 10); i--) {
        try {
          const rec = await poolContract.getDrawHistory(i);
          if (rec && rec.executed) {
            const winnerAddr = rec.winner ? rec.winner.toString() : "";
            const isMyWin = userAccount && winnerAddr && userAccount.toLowerCase() === winnerAddr.toLowerCase();
            realHistory.push({
              drawId: Number(rec.drawId),
              timestamp: Number(rec.timestamp),
              totalParticipants: Number(rec.totalParticipants),
              prizeAmount: ethers.formatUnits(rec.prizeAmount, 6),
              winner: winnerAddr ? `${winnerAddr.slice(0, 6)}...${winnerAddr.slice(-4)}` : "Confidential",
              isMyWin: !!isMyWin,
            });
          }
        } catch (e) {
          // ignore single draw read error
        }
      }
    }

    return {
      totalDeposits: ethers.formatUnits(totalDepositsRaw, 6),
      totalPrizeReserve: ethers.formatUnits(totalPrizeReserveRaw, 6),
      totalPrizesAwarded: ethers.formatUnits(totalPrizesAwardedRaw, 6),
      lastDrawTime: Number(lastDrawTimeRaw) || Math.floor(Date.now() / 1000),
      drawInterval: Number(drawIntervalRaw) || 3600,
      currentDrawId: Number(currentDrawIdRaw) || 0,
      depositorsCount: Number(depositorsCountRaw) || 0,
      totalYieldHarvested: ethers.formatUnits(totalYieldHarvestedRaw, 6),
      userWalletBalance,
      userShieldedBalance,
      userWinnings,
      drawHistory: realHistory,
    };
  } catch (error) {
    console.error("Error reading live onchain protocol state:", error);
    return {
      totalDeposits: "0.00",
      totalPrizeReserve: "0.00",
      totalPrizesAwarded: "0.00",
      lastDrawTime: Math.floor(Date.now() / 1000),
      drawInterval: 3600,
      currentDrawId: 0,
      depositorsCount: 0,
      totalYieldHarvested: "0.00",
      userWalletBalance: "0.00",
      userShieldedBalance: "0.00",
      userWinnings: "0.00",
      drawHistory: [],
    };
  }
};
