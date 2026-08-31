export const CONTRACT_ADDRESSES = {
  sepolia: {
    depositToken: "0x3244D42f9bF85aB047a27F994361559Fa5B92109", // Mock cUSDT Sepolia
    prizePool: "0x892a012a975765796a56eE8102d847b2c5896B20", // VeilPrizePool Sepolia
    yieldSource: "0x63Bc7333B39794966953289052D751079F4386A4", // MockYieldSource Sepolia
  },
  local: {
    depositToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    prizePool: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    yieldSource: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  }
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
  "event FaucetUsed(address indexed recipient, uint256 amount)"
] as const;

export const VEIL_PRIZE_POOL_ABI = [
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
  "event Deposited(address indexed user, uint256 amount, bytes32 encryptedHandle, uint256 timestamp)",
  "event Withdrawn(address indexed user, uint256 amount, uint256 timestamp)",
  "event DrawExecuted(uint256 indexed drawId, uint256 prizeAmount, uint256 participantsCount, uint256 timestamp)",
  "event PrizeClaimed(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeCompounded(address indexed winner, uint256 amount, uint256 timestamp)",
  "event PrizeReserveFunded(address indexed funder, uint256 amount, uint256 newReserveTotal, uint256 timestamp)"
] as const;

export const MOCK_YIELD_SOURCE_ABI = [
  "function yieldToken() view returns (address)",
  "function prizePool() view returns (address)",
  "function apyBasisPoints() view returns (uint256)",
  "function totalYieldHarvested() view returns (uint256)",
  "function lastHarvestTime() view returns (uint256)",
  "function harvestAndFund(uint256 simulatedPrincipal) returns (uint256)",
  "function manualInjectYield(uint256 amount) returns ()",
  "function setApy(uint256 _apyBasisPoints) returns ()",
  "event YieldHarvested(uint256 amount, uint256 timestamp)",
  "event YieldRateUpdated(uint256 newApyBasisPoints)"
] as const;
