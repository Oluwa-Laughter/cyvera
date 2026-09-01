/**
 * AuraDark / AuraBid: Confidential Sealed-Bid Dark Auction & Batch Settlement Protocol
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
  chainName: "Ethereum Sepolia",
  wrappersRegistry: toChecksumAddress("0x2f0750Bbb0A246059d80e94c454586a7F27a128e"),
  zamaToken: toChecksumAddress("0xa798B04149e7a61cc95B7D114AD420e8969eA268"),
  relayerUrl: "https://relayer.testnet.zama.cloud",
  tokens: {
    cUSDT: {
      name: "Confidential USDT (Mock)",
      symbol: "cUSDT",
      wrapper: toChecksumAddress("0x4E7B06D78965594eB5EF5414c357ca21E1554491"),
      underlying: toChecksumAddress("0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0"),
      decimals: 6,
    },
    cUSDC: {
      name: "Confidential USDC (Mock)",
      symbol: "cUSDC",
      wrapper: toChecksumAddress("0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639"),
      underlying: toChecksumAddress("0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF"),
      decimals: 6,
    },
    cWETH: {
      name: "Confidential WETH (Mock)",
      symbol: "cWETH",
      wrapper: toChecksumAddress("0x46208622DA27d91db4f0393733C8BA082ed83158"),
      underlying: toChecksumAddress("0xff54739b16576FA5402F211D0b938469Ab9A5f3F"),
      decimals: 18,
    },
    cZAMA: {
      name: "Confidential ZAMA (Mock)",
      symbol: "cZAMA",
      wrapper: toChecksumAddress("0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB"),
      underlying: toChecksumAddress("0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57"),
      decimals: 18,
    },
  },
};

export const CONTRACT_ADDRESSES = {
  sepolia: {
    depositToken: toChecksumAddress(
      process.env.NEXT_PUBLIC_DEPOSIT_TOKEN || ZAMA_SEPOLIA_CONFIG.tokens.cUSDT.underlying
    ),
    confidentialWrapper: toChecksumAddress(ZAMA_SEPOLIA_CONFIG.tokens.cUSDT.wrapper),
    auctionContract: toChecksumAddress(
      process.env.NEXT_PUBLIC_AURA_AUCTION_ADDRESS || "0x6A8D279eC8463fAc9a67a050f1173cfFf5979C63"
    ),
    prizePool: toChecksumAddress(
      process.env.NEXT_PUBLIC_AURA_POOL_ADDRESS || "0x892a012A975765796A56Ee8102D847b2C5896b20"
    ),
    yieldSource: toChecksumAddress(
      process.env.NEXT_PUBLIC_YIELD_SOURCE_ADDRESS || "0x63BC7333B39794966953289052d751079F4386A4"
    ),
  },
  local: {
    depositToken: toChecksumAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
    auctionContract: toChecksumAddress("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"),
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

export const AURA_AUCTION_ABI = [
  "function auctionCount() view returns (uint256)",
  "function defaultToken() view returns (address)",
  "function bidderEscrow(uint256 auctionId, address bidder) view returns (uint256)",
  "function hasClaimedRefund(uint256 auctionId, address bidder) view returns (bool)",
  "function getBidders(uint256 auctionId) view returns (address[])",
  "function getBidderEncryptedBid(uint256 auctionId, address bidder) view returns (bytes32)",
  "function getAuctionSummary(uint256 auctionId) view returns (uint256 id, address seller, string title, string description, address paymentToken, uint256 tokenLotSize, uint256 reservePrice, uint256 startTime, uint256 endTime, uint8 status, address highestBidder, uint256 winningAmount, uint256 totalBidsCount, uint256 totalEscrowCollected, bool assetClaimed)",
  "function createAuction(string title, string description, address paymentToken, uint256 tokenLotSize, uint256 reservePrice, uint256 durationSeconds) returns (uint256)",
  "function placeBid(uint256 auctionId, uint256 escrowAmount) returns ()",
  "function settleAuction(uint256 auctionId) returns ()",
  "function claimRefund(uint256 auctionId) returns ()",
  "function claimWonAsset(uint256 auctionId) returns ()",
  "event AuctionCreated(uint256 indexed auctionId, address indexed seller, string title, address paymentToken, uint256 tokenLotSize, uint256 startTime, uint256 endTime)",
  "event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 escrowAmount, bytes32 encryptedBidHandle, uint256 timestamp)",
  "event AuctionSettled(uint256 indexed auctionId, address indexed winner, uint256 winningAmount, uint256 totalBids, uint256 timestamp)",
  "event RefundClaimed(uint256 indexed auctionId, address indexed bidder, uint256 refundAmount, uint256 timestamp)",
  "event AssetClaimed(uint256 indexed auctionId, address indexed winner, uint256 lotSize, uint256 timestamp)",
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
