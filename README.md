# Cyvera — Confidential No-Loss Prize Savings Protocol

> **Deposit. Stay Encrypted. Win Onchain.** — Powered by Zama fhEVM, ERC-7984, and 3-Tier Randomized Uniform Threshold Selection on Ethereum Sepolia.

[![Live Application](https://img.shields.io/badge/Live%20DApp-cyvera--one.vercel.app-00DC82?style=for-the-badge&logo=vercel)](https://cyvera-one.vercel.app/)
[![Network](https://img.shields.io/badge/Network-Ethereum%20Sepolia-627EEA?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/)
[![FHEVM](https://img.shields.io/badge/FHE-Zama%20fhEVM%20v0.6-FFCE00?style=for-the-badge)](https://www.zama.ai/fhevm)
[![ERC Standard](https://img.shields.io/badge/Standard-ERC--7984%20Confidential-blue?style=for-the-badge)](https://github.com/zama-ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Tests-19%20Passing-brightgreen?style=for-the-badge)](https://getfoundry.sh/)

---

## 🌐 Live Application & Verified Deployments

| Component | Network | Address / Link | Verification |
| :--- | :--- | :--- | :--- |
| **Production DApp** | Vercel | [https://cyvera-one.vercel.app/](https://cyvera-one.vercel.app/) | Live responsive UI with Wagmi, RainbowKit, 3-Tier tracker & Zama EIP-712 decryption |
| **cUSDT Prize Pool Vault** | Sepolia | [`0xdDC923846eb23AbeD5f020C3DF7c897e2bDce2D4`](https://sepolia.etherscan.io/address/0xdDC923846eb23AbeD5f020C3DF7c897e2bDce2D4#code) | Core vault contract with FHE randomness & ERC-7984 accounting |
| **cUSDT Deposit Token** | Sepolia | [`0xBB7A2409F083C8BF8a083222959e356EBCCB5153`](https://sepolia.etherscan.io/address/0xBB7A2409F083C8BF8a083222959e356EBCCB5153#code) | 6-decimal test token with free onchain faucet |
| **cUSDT Yield Source** | Sepolia | [`0xF6314F966985eED395F0FC3C5D50C0c00cE49b09`](https://sepolia.etherscan.io/address/0xF6314F966985eED395F0FC3C5D50C0c00cE49b09#code) | Autonomous yield strategy funding cUSDT prize reserves |
| **cUSDC Prize Pool Vault** | Sepolia | [`0x591985294e08c7e837Fab14e796E7957BfC6bC6B`](https://sepolia.etherscan.io/address/0x591985294e08c7e837Fab14e796E7957BfC6bC6B#code) | Dedicated cUSDC vault for isolated multi-market prize savings |
| **cUSDC Deposit Token** | Sepolia | [`0xf1BC5e35bF3a97Da12c764B34109d7406d676c4e`](https://sepolia.etherscan.io/address/0xf1BC5e35bF3a97Da12c764B34109d7406d676c4e#code) | 6-decimal USDC test token with free onchain faucet |
| **cUSDC Yield Source** | Sepolia | [`0xfD95F2C9E965224c3A07E77EFc2c7aC6F3b0bB1b`](https://sepolia.etherscan.io/address/0xfD95F2C9E965224c3A07E77EFc2c7aC6F3b0bB1b#code) | Autonomous yield strategy funding cUSDC prize reserves |
| **AI Agent Session Module** | Sepolia | [`0x3f5Be0F9348197269fAACC9525131E09F85f8198`](https://sepolia.etherscan.io/address/0x3f5Be0F9348197269fAACC9525131E09F85f8198#code) | Encrypted budget manager for AI agents & MCP session keys |
| **Steakhouse Prime USDC** | Sepolia | [`0x6AB54988261AEC573a2CA13cF802d3B1114f864C`](https://sepolia.etherscan.io/address/0x6AB54988261AEC573a2CA13cF802d3B1114f864C) | Zama confidential institutional yield vault composition |
| **Zama Deposit Batcher** | Sepolia | [`0x48758559c14d4d92b4C74A99660B6a8dbe85F53b`](https://sepolia.etherscan.io/address/0x48758559c14d4d92b4C74A99660B6a8dbe85F53b) | Zama confidential token deposit queue |
| **Zama Redeem Batcher** | Sepolia | [`0xe94E9afdDd43a19C2914739e9279cb6Fe287BEb0`](https://sepolia.etherscan.io/address/0xe94E9afdDd43a19C2914739e9279cb6Fe287BEb0) | Zama confidential token redemption queue |

---

## 💡 Summary & Architectural Breakthrough

Traditional prize-savings protocols like PoolTogether pioneered no-loss jackpots, but suffer from a critical architectural vulnerability: **complete lack of financial privacy**. Every depositor's wallet balance, ticket holdings, winning odds, and prize earnings are broadcast publicly to the blockchain. This exposes participants to balance surveillance, front-running, and whale tracking.

**Cyvera solves this.** Built on Zama's Fully Homomorphic Encryption Virtual Machine (fhEVM) and implementing the ERC-7984 confidential token standard:
- Depositor balances are stored as encrypted **`euint64` ciphertexts**.
- Every single dollar deposited earns **1 confidential prize ticket** with **100% principal protection**.
- Prize selection operates via a **3-Tier Randomized Uniform Threshold Engine** (PoolTogether V5 derivation) combined with unbiased rejection sampling.
- **Zero Onchain Winner Leakage:** For multi-saver pools, onchain observers see `winner = address(0)`. Only winners can decrypt their own prizes client-side via zero-gas **EIP-712 signatures**.
- **AI Agent Session Governance:** Includes `CyveraSession.sol`, enabling autonomous AI agents and Model Context Protocol (MCP) clients to interact with encrypted budgets clamped homomorphically without balance revert leaks.

---

## ⚙️ How the Pool and Draws Work

### 1. The Zero-Loss Principle
In conventional lotteries, buying tickets permanently consumes principal. In Cyvera:
1. **100% Principal Protection:** Your deposit is never gambled, loaned without collateral, or spent. You can withdraw 100% of your principal at any time without fees or lockups.
2. **Yield-Funded Prizes:** Vault deposits earn interest through connected DeFi yield strategies (`CyveraYieldSource`). That accrued yield funds recurring prize pots.
3. **Infinite Free Chances:** Non-winners keep 100% of their savings, which roll over automatically into every subsequent draw. Winners receive the accrued prize pot as pure bonus profit.

### 2. 3-Tier Prize System & Mathematical Derivation
Cyvera structures prize distributions across three mathematical tiers derived from PoolTogether V5:

$$\mathbb{P}(\text{User } i \text{ wins Tier } t) = \frac{\text{Deposit}_i}{\text{TotalDeposits} \times k_t}$$

$$\mathbb{E}[\text{Winners of Tier } t] = \sum_i \frac{\text{Deposit}_i}{\text{TotalDeposits} \times k_t} = \frac{1}{k_t}$$

| Tier | Name | Prize Allocation | Odds Multiplier ($k$) | Expected Winners / Draw | Payout Model |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 0** | **Grand Prize** | **50%** of Prize Pot | $k = 100$ | $0.01$ (1 every 100 draws) | High variance jackpot |
| **Tier 1** | **Middle Prize** | **30%** of Prize Pot | $k = 10$ | $0.10$ (1 every 10 draws) | Regular substantial win |
| **Tier 2** | **Ordinary Prize** | **20%** of Prize Pot | $k = 1$ | $1.00$ (1 every draw) | Guaranteed frequent winner |

**Key Mathematical Properties:**
- **Whale Invariance:** The expected number of winners per tier is strictly $\frac{1}{k_t}$, independent of balance concentration.
- **Best-Tier Precedence:** In `_accrueSaver`, tiers are evaluated from Ordinary (2) up to Grand (0) so the rarest tier overrides, ensuring savers receive their maximum prize without double-crediting.

### 3. Modulo-Bias-Free Rejection Sampling
A standard modulus operation `entropy % upperBound` introduces statistical bias toward lower numbers whenever $2^{256} \pmod{\text{upperBound}} \neq 0$. Cyvera implements cryptographic rejection sampling in `_uniform`:

```solidity
function _uniform(uint256 entropy, uint256 upperBound) internal pure returns (uint256) {
    if (upperBound == 0) return 0;
    uint256 min = (type(uint256).max - upperBound + 1) % upperBound;
    uint256 random = entropy;
    while (random < min) {
        random = uint256(keccak256(abi.encode(random)));
    }
    return random % upperBound;
}
```

### 4. Zero-Knowledge Winner Privacy
In Cyvera, the draw does NOT leak the winner's identity to observers:
1. `triggerDraw()` samples onchain FHE randomness `seed = FHE.randEuint64()`.
2. For each participant, `_accrueSaver` homomorphically computes:
   ```solidity
   ebool won = FHE.gt(_encryptedBalances[user], FHE.asEuint64(uint64(threshold)));
   credit = FHE.select(won, FHE.asEuint64(tierPrize[t]), credit);
   _encryptedWinnings[user] = FHE.add(_encryptedWinnings[user], credit);
   ```
3. Every depositor's ciphertext is updated with an identical instruction sequence and gas profile. Observers on Etherscan see `winner = address(0)`.
4. Only the winner can open the **Private Reveal** interface and decrypt their winnings using their private key!

---

## 🛡️ The Confidentiality Design

### Confidentiality Boundary Matrix

| State / Data | Visibility | Cryptographic Mechanism | Rationale |
| :--- | :--- | :--- | :--- |
| **Individual User Balance** | 🔒 **Strictly Confidential** | `euint64` ciphertext (`_encryptedBalances`) | Prevents balance surveillance and whale targeting. Only the user and contract hold ACL access. |
| **Individual User Winnings** | 🔒 **Strictly Confidential** | `euint64` ciphertext (`_encryptedWinnings`) | Protects winners from phishing and targeted exploitation. Decrypted client-side via EIP-712. |
| **Winner Identity (Multi-Saver)** | 🔒 **Strictly Confidential** | Recorded as `address(0)` onchain | Eliminates public leaderboard tracking and doxed winner addresses. |
| **Per-User Ticket Weight** | 🔒 **Strictly Confidential** | `euint64` evaluated against public threshold | Prevents observers from calculating individual odds. |
| **Solvency Checks** | 🔒 **Strictly Confidential** | `FHE.ge` & `FHE.select` | Gating checks (`balance >= amount`) happen homomorphically without disclosing amounts. |
| **Total Pool TVL** | 🌐 **Public Onchain** | `uint256 totalDeposits` | Required for proof of solvency: external auditors verify vault assets match token reserves. |
| **Total Prize Reserve** | 🌐 **Public Onchain** | `uint256 totalPrizeReserve` | Required for transparency: savers verify that a prize pot exists before drawing. |
| **Draw Timing & Randomness** | 🌐 **Public Onchain** | `bytes32 randomnessHandle`, `lastDrawTime` | Required for decentralized liveness and open mathematical verification. |
| **Deposit / Withdraw Amount** | 🌐 **Public at Transfer** | ERC-20 `transfer` / `transferFrom` | Intrinsic to public token transfers at protocol entry/exit. Once inside, tokens are fully shielded. |

### EIP-712 Client-Side Decryption
To inspect balances without gas fees or RPC data leakage:
1. The frontend requests an ephemeral keypair.
2. The user signs an EIP-712 structured data payload:
   ```json
   {
     "types": {
       "UserDecryption": [
         { "name": "handle", "type": "bytes32" },
         { "name": "publicKey", "type": "bytes32" }
       ]
     },
     "primaryType": "UserDecryption",
     "domain": {
       "name": "Cyvera fhEVM User Decryption",
       "version": "1",
       "chainId": 11155111,
       "verifyingContract": "0xdDC923846eb23AbeD5f020C3DF7c897e2bDce2D4"
     }
   }
   ```
3. The Zama relayer re-encrypts the ciphertext under the user's ephemeral key.
4. The client decrypts the balance locally in the browser. Zero gas, zero onchain exposure.

---

## 🤖 Autonomous AI Agent Session Module (`CyveraSession.sol`)

Cyvera introduces native support for autonomous agents and Model Context Protocol (MCP) clients through `CyveraSession.sol`:

- **The Problem:** Setting an unlimited operator grant (`setOperator`) exposes wallets to total balance drainage if an AI agent key is compromised.
- **The Solution:** `CyveraSession` holds an encrypted spending budget `euint64 remaining` per session key:
  - Transfers exceeding the budget are **homomorphically clamped to zero without reverting**.
  - Observers and external contracts cannot distinguish an accepted transfer from a clamped transfer by analyzing reverts or gas consumption.
  - Features EIP-712 cryptographic authorization (`openSession`), expiry boundaries, transaction count limits, and recipient allowlists.

---

## 🔬 Open Mathematical Draw Auditability (`scripts/verify-draw.ts`)

Cyvera provides a standalone verification script allowing anyone to verify the fairness of any draw without special permissions:

```bash
# Verify the latest executed draw on Sepolia
npx ts-node scripts/verify-draw.ts

# Verify a specific draw ID
DRAW=12 npx ts-node scripts/verify-draw.ts
```

**What is Audited:**
- Recomputes every participant's threshold using offchain pure TypeScript rejection sampling.
- Verifies that `thresholdFor` onchain matches offchain math exactly with zero modulo bias.
- Confirms zero-knowledge winner privacy (`winner = address(0)`).

---

## 🌾 Yield Sources & Zama DeFi Composition

The protocol supports both simulated and real institutional confidential yield strategies:
- **`CyveraYieldSource.sol`**: Automated yield stream harvesting APY continuously into the prize reserve. Includes `manualInjectYield(uint256 amount)` for developer testnet simulation.
- **Steakhouse Confidential Prime USDC (`0x6AB549...`)**: Institutional vault on Zama Sepolia generating real yield.
- **Zama Deposit/Redeem Batchers (`0x487585...` / `0xe94E9a...`)**: High-throughput confidential asset batching.

---

## 🚀 Deployment & Local Testing

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **Foundry**: `forge` and `cast` installed ([foundry.sh](https://getfoundry.sh/))

```bash
# Clone the repository
git clone https://github.com/Oluwa-Laughter/cyvera.git
cd cyvera

# Install dependencies
npm install
forge install foundry-rs/forge-std --no-commit
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
PRIVATE_KEY="0x..."
ETHERSCAN_API_KEY="..."

NEXT_PUBLIC_DEPOSIT_TOKEN="0xBB7A2409F083C8BF8a083222959e356EBCCB5153"
NEXT_PUBLIC_CYVERA_POOL_ADDRESS="0xdDC923846eb23AbeD5f020C3DF7c897e2bDce2D4"
NEXT_PUBLIC_YIELD_SOURCE_ADDRESS="0xF6314F966985eED395F0FC3C5D50C0c00cE49b09"
NEXT_PUBLIC_CYVERA_SESSION_ADDRESS="0x3f5Be0F9348197269fAACC9525131E09F85f8198"

NEXT_PUBLIC_DEPOSIT_TOKEN_USDC="0xf1BC5e35bF3a97Da12c764B34109d7406d676c4e"
NEXT_PUBLIC_CYVERA_POOL_ADDRESS_USDC="0x591985294e08c7e837Fab14e796E7957BfC6bC6B"
NEXT_PUBLIC_YIELD_SOURCE_ADDRESS_USDC="0xfD95F2C9E965224c3A07E77EFc2c7aC6F3b0bB1b"
```

### 3. Running Foundry Test Suites
```bash
forge test -v
```
All **19 Foundry unit and integration tests** pass across both test suites:
- `CyveraPrizePool.t.sol`: 3-tier threshold math, rejection sampling, permissionless accrual, zero-loss invariants, and claim gating (16 tests).
- `CyveraSession.t.sol`: AI agent EIP-712 session opening, encrypted budget clamping without reverts, and session lifecycle (3 tests).

### 4. Running Next.js Production Build
```bash
npm run build
```

---

## 📁 Repository Directory Structure

```
cyvera/
├── app/
│   ├── layout.tsx              # Root layout with Web3Provider & RainbowKit
│   ├── page.tsx                # Main DApp hub (Vault / Draws / Reveal / Earn)
│   └── globals.css             # Tailwind CSS & custom design tokens
├── components/
│   ├── FaucetModal.tsx         # Free 1-click testnet token minter
│   ├── HowItWorksModal.tsx     # Interactive 4-phase explainer
│   ├── TopHeader.tsx           # Responsive header with wallet connection
│   ├── SidebarNav.tsx          # Mobile navigation drawer
│   └── pages/
│       ├── DashboardView.tsx   # Portfolio overview & encrypted positions
│       ├── VaultView.tsx       # Deposit & zero-loss withdrawal interface
│       ├── DrawsView.tsx       # Live 4-phase draw tracker & APY harvesting
│       ├── RewardsView.tsx     # Private Reveal & claiming / compounding
│       ├── EarnView.tsx        # Liquidity Hunt points & APY metrics
│       └── LandingView.tsx     # High-conversion protocol introduction
├── contracts/
│   ├── CyveraPrizePool.sol     # Core 3-tier confidential prize pool (FHE + ERC-7984)
│   ├── CyveraSession.sol       # AI agent & MCP encrypted session budget manager
│   ├── CyveraYieldSource.sol   # Autonomous DeFi yield streaming strategy
│   ├── MockERC20.sol           # 6-decimal test tokens with public faucet
│   ├── interfaces/
│   │   ├── IERC7984.sol        # ERC-7984 Confidential Fungible Token standard
│   │   └── ICyveraSession.sol  # AI agent session budget interface
│   └── fhevm/
│       └── FHE.sol             # Zama fhEVM library interface & operations
├── lib/
│   ├── contracts.ts            # Contract addresses, ABIs, and market configs
│   ├── web3.ts                 # Multicall state sync & onchain history parser
│   ├── fhevm.ts                # EIP-712 user decryption client helpers
│   ├── store.ts                # Local storage cache & reactive protocol state
│   └── wagmi.ts                # RainbowKit & Wagmi configuration
├── scripts/
│   └── verify-draw.ts          # Open mathematical draw auditability tool
├── test/
│   ├── CyveraPrizePool.t.sol   # 16 Foundry unit & invariant test cases
│   └── CyveraSession.t.sol     # 3 Foundry tests for AI agent encrypted sessions
├── foundry.toml                # Foundry build & compiler configuration
└── package.json                # Next.js and TypeScript project dependencies
```

---

## 🔒 Security & Invariant Guarantees

1. **Strict Zero-Loss Invariant:**
   $$\sum \text{Principal Deposited} - \sum \text{Principal Withdrawn} = \text{Vault Underlying Balance}$$
   Prize money is funded exclusively from external yield via `CyveraYieldSource`. Principal deposits are never touched or reduced.
2. **Reentrancy Protection:** All external financial operations (`deposit`, `withdraw`, `claimPrize`, `compoundPrize`, `triggerDraw`, `send`) are protected by non-reentrant mutexes.
3. **Checks-Effects-Interactions:** State updates and ciphertext mutations always precede external token transfers.
4. **Zero Modulo Bias:** Rejection sampling guarantees mathematically uniform threshold distributions.
5. **No Onchain Winner Disclosure:** Observers cannot determine winners from event logs or public state variables.

---

## 📜 License

This project is open-source software licensed under the [MIT License](LICENSE).
