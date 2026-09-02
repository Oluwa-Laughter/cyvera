/**
 * VeilPool: Confidential No-Loss Prize Savings Protocol
 * Powered by Zama FHEVM & ERC-7984 Confidential Tokens
 */
import { ethers } from "ethers";

export const toChecksumAddress = (address: string): string => {
  try {
    if (!address || typeof address !== "string") return address;
    return ethers.getAddress(address.toLowerCase().trim());
  } catch {
    return address;
  }
};

export const ZAMA_SEPOLIA_CONFIG = {
  chainId: 11155111,
  chainName: "Ethereum Sepolia",
  wrappersRegistry: toChecksumAddress("0x2f0750Bbb0A246059d80e94c454586a7F27a128e"),
  zamaToken: toChecksumAddress("0xa798B04149e7a61cc95B7D114AD420e8969eA268"),
  relayerUrl: "https://relayer.testnet.zama.cloud",
  markets: {
    cUSDT: {
      name: "Confidential USDT Prize Vault",
      symbol: "cUSDT",
      publicSymbol: "USDT",
      decimals: 6,
      underlying: toChecksumAddress("0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0"),
      wrapper: toChecksumAddress("0x4E7B06D78965594eB5EF5414c357ca21E1554491"),
      vault: toChecksumAddress("0x9fCd8e05C9f08FDaB15871178B67055bEc3Cf00F"),
      yieldSource: toChecksumAddress("0x63BC7333B39794966953289052d751079F4386A4"),
      apy: "8.50%",
      drawFrequency: "1-Minute (Testing) / Daily (Mainnet)",
    },
    cUSDC: {
      name: "Confidential USDC Prize Vault",
      symbol: "cUSDC",
      publicSymbol: "USDC",
      decimals: 6,
      underlying: toChecksumAddress("0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF"),
      wrapper: toChecksumAddress("0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639"),
      vault: toChecksumAddress("0x0Df09628bAdA515D3b0A3AC8945120C14C725819"),
      yieldSource: toChecksumAddress("0x7cF1156D254930364966953289052d751079F438"),
      apy: "12.00%",
      drawFrequency: "1-Minute (Testing) / Weekly (Mainnet)",
    },
  },
};

export type ActiveMarketId = "cUSDT" | "cUSDC";

export const CONTRACT_ADDRESSES = {
  sepolia: {
    depositToken: toChecksumAddress(
      process.env.NEXT_PUBLIC_DEPOSIT_TOKEN || ZAMA_SEPOLIA_CONFIG.markets.cUSDT.underlying
    ),
    confidentialWrapper: toChecksumAddress(ZAMA_SEPOLIA_CONFIG.markets.cUSDT.wrapper),
    prizePool: toChecksumAddress(
      process.env.NEXT_PUBLIC_AURA_POOL_ADDRESS || ZAMA_SEPOLIA_CONFIG.markets.cUSDT.vault
    ),
    yieldSource: toChecksumAddress(
      process.env.NEXT_PUBLIC_YIELD_SOURCE_ADDRESS || ZAMA_SEPOLIA_CONFIG.markets.cUSDT.yieldSource
    ),
  },
  local: {
    depositToken: toChecksumAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
    prizePool: toChecksumAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"),
    yieldSource: toChecksumAddress("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"),
  },
};

export const MOCK_ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function faucet() returns ()",
  "function mint(address to, uint256 amount) returns ()",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event FaucetUsed(address indexed recipient, uint256 amount)",
] as const;

export const WRAPPER_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function underlyingToken() view returns (address)",
  "function deposit(uint256 amount) returns ()",
  "function withdraw(uint256 amount) returns ()",
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Deposit(address indexed user, uint256 amount)",
  "event Withdraw(address indexed user, uint256 amount)",
] as const;

export const AURA_PRIZE_POOL_ABI = [
  "function depositToken() view returns (address)",
  "function owner() view returns (address)",
  "function yieldSource() view returns (address)",
  "function drawInterval() view returns (uint256)",
  "function lastDrawTime() view returns (uint256)",
  "function currentDrawId() view returns (uint256)",
  "function winnersPerDraw() view returns (uint256)",
  "function totalPrizeReserve() view returns (uint256)",
  "function totalPrizesAwarded() view returns (uint256)",
  "function totalWithdrawn() view returns (uint256)",
  "function totalDeposits() view returns (uint256)",
  "function isUserDepositor(address user) view returns (bool)",
  "function getDepositorCount() view returns (uint256)",
  "function getDepositors() view returns (address[])",
  "function getUserEncryptedBalance(address user) view returns (bytes32)",
  "function getUserEncryptedWinnings(address user) view returns (bytes32)",
  "function getUnclaimedWinnings(address user) view returns (uint256)",
  "function timeUntilNextDraw() view returns (uint256)",
  "function authorizedKeepers(address) view returns (bool)",
  "function getPoolSummary() view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)",
  "function getDrawHistory(uint256 drawId) view returns (tuple(uint256 drawId, uint256 timestamp, uint256 totalParticipants, uint256 prizeAmount, address winner, bool executed))",
  "function deposit(uint256 amount) returns ()",
  "function withdraw(uint256 amount) returns ()",
  "function withdrawAll() returns ()",
  "function fundPrizeReserve(uint256 amount) returns ()",
  "function triggerDraw() returns ()",
  "function claimPrize() returns ()",
  "function compoundPrize() returns ()",
  "function setDrawInterval(uint256 _drawInterval) returns ()",
  "function setWinnersPerDraw(uint256 _winners) returns ()",
  "function setYieldSource(address _yieldSource) returns ()",
  "function setKeeperAuthorization(address keeper, bool authorized) returns ()",
  "event Deposited(address indexed user, bytes32 encryptedBalanceHandle, uint256 timestamp)",
  "event Withdrawn(address indexed user, uint256 amount, bytes32 encryptedBalanceHandle, uint256 timestamp)",
  "event DrawExecuted(uint256 indexed drawId, uint256 prizeAmount, uint256 totalParticipants, uint256 timestamp, bytes32 randomnessHandle)",
  "event WinnerSelected(uint256 indexed drawId, address indexed winner, bytes32 encryptedWinningsHandle)",
  "event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeCompounded(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeReserveFunded(address indexed funder, uint256 amount, uint256 newReserveTotal, uint256 timestamp)",
  "event DrawIntervalUpdated(uint256 newInterval)",
  "event WinnerCountUpdated(uint256 newCount)",
  "event YieldSourceUpdated(address newYieldSource)",
  "event KeeperAuthorizationUpdated(address indexed keeper, bool authorized)",
] as const;

export const MOCK_YIELD_SOURCE_ABI = [
  "function yieldToken() view returns (address)",
  "function prizePool() view returns (address)",
  "function apyBasisPoints() view returns (uint256)",
  "function totalYieldHarvested() view returns (uint256)",
  "function lastHarvestTime() view returns (uint256)",
  "function harvestAndFund(uint256 simulatedPrincipal) returns (uint256)",
  "function manualInjectYield(uint256 amount) returns (uint256)",
  "function setApyBasisPoints(uint256 _apyBasisPoints) returns ()",
  "function setPrizePool(address _prizePool) returns ()",
  "event YieldHarvested(uint256 amount, uint256 timestamp)",
  "event ApyUpdated(uint256 oldApy, uint256 newApy)",
] as const;
