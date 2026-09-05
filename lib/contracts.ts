/**
 * Cyvera: Confidential No-Loss Prize Savings Protocol
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
      underlying: toChecksumAddress(
        process.env.NEXT_PUBLIC_DEPOSIT_TOKEN || "0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838"
      ),
      wrapper: toChecksumAddress("0x4E7B06D78965594eB5EF5414c357ca21E1554491"),
      vault: toChecksumAddress(
        process.env.NEXT_PUBLIC_CYVERA_POOL_ADDRESS || "0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF"
      ),
      yieldSource: toChecksumAddress(
        process.env.NEXT_PUBLIC_YIELD_SOURCE_ADDRESS || "0xe1699F23031C9CB430124232C1eAb5f20F676C66"
      ),
      apy: "8.50%",
      drawFrequency: "1-Minute (Testing) / Daily (Mainnet)",
    },
    cUSDC: {
      name: "Confidential USDC Prize Vault",
      symbol: "cUSDC",
      publicSymbol: "USDC",
      decimals: 6,
      underlying: toChecksumAddress(
        process.env.NEXT_PUBLIC_DEPOSIT_TOKEN_USDC || "0xE0E6aA26a248795C8a4a89Feb4b5D78CBe2c98c5"
      ),
      wrapper: toChecksumAddress("0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639"),
      vault: toChecksumAddress(
        process.env.NEXT_PUBLIC_CYVERA_POOL_ADDRESS_USDC || "0xC669F93c667Acf060713aB35d83d53a9688CC265"
      ),
      yieldSource: toChecksumAddress(
        process.env.NEXT_PUBLIC_YIELD_SOURCE_ADDRESS_USDC || "0x9C32bA329CC28474b3f52609e61F7c11C30bc643"
      ),
      apy: "12.00%",
      drawFrequency: "1-Minute (Testing) / Weekly (Mainnet)",
    },
  },
};

export type ActiveMarketId = "cUSDT" | "cUSDC";

export const CONTRACT_ADDRESSES = {
  sepolia: {
    depositToken: toChecksumAddress(
      process.env.NEXT_PUBLIC_DEPOSIT_TOKEN || "0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838"
    ),
    confidentialWrapper: toChecksumAddress("0x4E7B06D78965594eB5EF5414c357ca21E1554491"),
    prizePool: toChecksumAddress(
      process.env.NEXT_PUBLIC_CYVERA_POOL_ADDRESS || process.env.NEXT_PUBLIC_AURA_POOL_ADDRESS || "0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF"
    ),
    yieldSource: toChecksumAddress(
      process.env.NEXT_PUBLIC_YIELD_SOURCE_ADDRESS || "0xe1699F23031C9CB430124232C1eAb5f20F676C66"
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

export const CYVERA_PRIZE_POOL_ABI = [
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
  "function getEncryptedBalanceHandle(address user) view returns (bytes32)",
  "function getUserEncryptedWinnings(address user) view returns (bytes32)",
  "function getEncryptedWinningsHandle(address user) view returns (bytes32)",
  "function getLastDrawWinner(uint256 drawId) view returns (address)",
  "function getUnclaimedWinnings(address user) view returns (uint256)",
  "function timeUntilNextDraw() view returns (uint256)",
  "function authorizedKeepers(address) view returns (bool)",
  "function getPoolSummary() view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)",
  "function drawHistory(uint256 drawId) view returns (uint256 drawId, uint256 timestamp, uint256 totalParticipants, uint256 prizeAmount, address winner, bool executed)",
  "function deposit(uint256 amount) returns ()",
  "function withdraw(uint256 amount) returns ()",
  "function withdrawAll() returns ()",
  "function fundPrizeReserve(uint256 amount) returns ()",
  "function triggerDraw() returns ()",
  "function claimPrize(uint256 amount) returns ()",
  "function compoundPrize(uint256 amount) returns ()",
  "function setDrawInterval(uint256 _drawInterval) returns ()",
  "function setWinnersPerDraw(uint256 _winners) returns ()",
  "function setYieldSource(address _yieldSource) returns ()",
  "function setKeeperAuthorization(address keeper, bool authorized) returns ()",
  // ERC-7984 Confidential Fungible Token Interface
  "function confidentialBalanceOf(address account) view returns (bytes32)",
  "function confidentialTransfer(address to, bytes32 amount) returns (bool)",
  "function confidentialTransferFrom(address from, address to, bytes32 amount) returns (bool)",
  "function confidentialApprove(address spender, bytes32 amount) returns (bool)",
  "function confidentialAllowance(address owner, address spender) view returns (bytes32)",
  "event ConfidentialTransfer(address indexed from, address indexed to, bytes32 amount)",
  "event ConfidentialApproval(address indexed owner, address indexed spender, bytes32 amount)",
  "event Deposited(address indexed user, uint256 amount, uint256 timestamp)",
  "event Withdrawn(address indexed user, uint256 amount, uint256 timestamp)",
  "event DrawExecuted(uint256 indexed drawId, uint256 prizeAmount, uint256 totalParticipants, uint256 timestamp, bytes32 randomnessHandle)",
  "event WinnerSelected(uint256 indexed drawId, address indexed winner)",
  "event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeCompounded(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeReserveFunded(address indexed funder, uint256 amount, uint256 newReserveTotal, uint256 timestamp)",
  "event DrawIntervalUpdated(uint256 newInterval)",
  "event WinnerCountUpdated(uint256 newCount)",
  "event YieldSourceUpdated(address newYieldSource)",
  "event KeeperAuthorizationUpdated(address indexed keeper, bool authorized)",
] as const;

export const AURA_PRIZE_POOL_ABI = CYVERA_PRIZE_POOL_ABI;

export const CYVERA_YIELD_SOURCE_ABI = [
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

export const MOCK_YIELD_SOURCE_ABI = CYVERA_YIELD_SOURCE_ABI;
