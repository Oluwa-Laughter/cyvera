/**
 * AuraPool: Confidential No-Loss Prize Savings Protocol
 * Official Zama Sepolia Testnet Addresses & ABIs
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
  wrappersRegistry: toChecksumAddress("0x2f0750Bbb0A246059d80e94c454586a7F27a128e"),
  zamaToken: toChecksumAddress("0xa798B04149e7a61cc95B7D114AD420e8969eA268"),
  tokens: {
    cUSDT: {
      name: "Confidential USDT (Mock)",
      symbol: "cUSDT",
      wrapper: toChecksumAddress("0x4E7B06D78965594eB5EF5414c357ca21E1554491"),
      underlying: toChecksumAddress("0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0"), // Public mint(address, uint256) up to 1,000,000
      decimals: 6
    },
    cUSDC: {
      name: "Confidential USDC (Mock)",
      symbol: "cUSDC",
      wrapper: toChecksumAddress("0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639"),
      underlying: toChecksumAddress("0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF"),
      decimals: 6
    },
    cWETH: {
      name: "Confidential WETH (Mock)",
      symbol: "cWETH",
      wrapper: toChecksumAddress("0x46208622DA27d91db4f0393733C8BA082ed83158"),
      underlying: toChecksumAddress("0xff54739b16576FA5402F211D0b938469Ab9A5f3F"),
      decimals: 18
    },
    cZAMA: {
      name: "Confidential ZAMA (Mock)",
      symbol: "cZAMA",
      wrapper: toChecksumAddress("0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB"),
      underlying: toChecksumAddress("0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57"),
      decimals: 18
    }
  }
};

export const CONTRACT_ADDRESSES = {
  sepolia: {
    // Official Zama Sepolia cUSDT underlying token (Public mintable)
    depositToken: toChecksumAddress(process.env.NEXT_PUBLIC_DEPOSIT_TOKEN || ZAMA_SEPOLIA_CONFIG.tokens.cUSDT.underlying),
    confidentialWrapper: toChecksumAddress(ZAMA_SEPOLIA_CONFIG.tokens.cUSDT.wrapper),
    // Dynamic or manual deployed AuraPrizePool address
    prizePool: toChecksumAddress(process.env.NEXT_PUBLIC_AURA_POOL_ADDRESS || "0x892a012A975765796A56Ee8102D847b2C5896b20"),
    yieldSource: toChecksumAddress(process.env.NEXT_PUBLIC_YIELD_SOURCE_ADDRESS || "0x63BC7333B39794966953289052d751079F4386A4"),
  },
  local: {
    depositToken: toChecksumAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
    prizePool: toChecksumAddress("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"),
    yieldSource: toChecksumAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"),
  }
};

export const MOCK_ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function faucet() returns ()",
  "function mint(address to, uint256 amount) returns ()",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event FaucetUsed(address indexed recipient, uint256 amount)"
] as const;

export const AURA_PRIZE_POOL_ABI = [
  "function depositToken() view returns (address)",
  "function owner() view returns (address)",
  "function yieldSource() view returns (address)",
  "function drawInterval() view returns (uint256)",
  "function lastDrawTime() view returns (uint256)",
  "function currentDrawId() view returns (uint256)",
  "function totalPrizeReserve() view returns (uint256)",
  "function totalPrizesAwarded() view returns (uint256)",
  "function totalWithdrawn() view returns (uint256)",
  "function totalDeposits() view returns (uint256)",
  "function isUserDepositor(address user) view returns (bool)",
  "function getDepositorCount() view returns (uint256)",
  "function getDepositors() view returns (address[])",
  "function getUserEncryptedBalance(address user) view returns (bytes32)",
  "function getUserEncryptedWinnings(address user) view returns (bytes32)",
  "function getUserPlaintextBalance(address user) view returns (uint256)",
  "function getUserPlaintextWinnings(address user) view returns (uint256)",
  "function getPoolSummary() view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256)",
  "function getDrawHistory(uint256 drawId) view returns (tuple(uint256 drawId, uint256 timestamp, uint256 totalParticipants, uint256 prizeAmount, address winner, bool executed))",
  "function deposit(uint256 amount) returns ()",
  "function withdraw(uint256 amount) returns ()",
  "function withdrawAll() returns ()",
  "function fundPrizeReserve(uint256 amount) returns ()",
  "function triggerDraw() returns ()",
  "function claimPrize() returns ()",
  "function compoundPrize() returns ()",
  "function setDrawInterval(uint256 _drawInterval) returns ()",
  "function setYieldSource(address _yieldSource) returns ()",
  "event Deposited(address indexed user, uint256 amount, bytes32 encryptedHandle, uint256 timestamp)",
  "event Withdrawn(address indexed user, uint256 amount, uint256 timestamp)",
  "event DrawExecuted(uint256 indexed drawId, uint256 prizeAmount, uint256 participantsCount, uint256 timestamp)",
  "event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeCompounded(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeReserveFunded(address indexed funder, uint256 amount, uint256 newReserveTotal, uint256 timestamp)",
  "event DrawIntervalUpdated(uint256 newInterval)",
  "event YieldSourceUpdated(address newYieldSource)"
] as const;

export const MOCK_YIELD_SOURCE_ABI = [
  "function depositToken() view returns (address)",
  "function prizePool() view returns (address)",
  "function apyBasisPoints() view returns (uint256)",
  "function totalYieldHarvested() view returns (uint256)",
  "function lastHarvestTime() view returns (uint256)",
  "function calculateAccruedYield() view returns (uint256)",
  "function harvestYield() returns (uint256)",
  "function setApyBasisPoints(uint256 _apyBasisPoints) returns ()",
  "function setPrizePool(address _prizePool) returns ()",
  "event YieldHarvested(address indexed prizePool, uint256 amount, uint256 timestamp)",
  "event ApyUpdated(uint256 oldApy, uint256 newApy)"
] as const;
