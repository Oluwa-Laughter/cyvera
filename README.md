# 🛡️ Cyvera: Confidential No-Loss Prize Savings Protocol

> **Private Wealth Preservation • Provable Onchain Jackpots • Powered by Zama FHEVM & ERC-7984**

[![Live Web App](https://img.shields.io/badge/Live%20DApp-cyvera--one.vercel.app-00DC82?style=for-the-badge&logo=vercel&logoColor=white)](https://cyvera-one.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Oluwa--Laughter%2Fcyvera-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Oluwa-Laughter/cyvera)
[![Network](https://img.shields.io/badge/Network-Ethereum%20Sepolia%20(11155111)-627EEA?style=for-the-badge&logo=ethereum&logoColor=white)](https://sepolia.etherscan.io/)
[![FHEVM](https://img.shields.io/badge/Powered%20By-Zama%20FHEVM-FFCE00?style=for-the-badge)](https://www.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015.5.25-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

---

## 🌐 Quick Links & Access

- 🚀 **Live Production Application**: [https://cyvera-one.vercel.app/](https://cyvera-one.vercel.app/)
- 📦 **GitHub Repository**: [https://github.com/Oluwa-Laughter/cyvera](https://github.com/Oluwa-Laughter/cyvera)
- 📜 **Smart Contracts Core**: [`contracts/CyveraPrizePool.sol`](./contracts/CyveraPrizePool.sol)
- 🌾 **Yield Source Engine**: [`contracts/CyveraYieldSource.sol`](./contracts/CyveraYieldSource.sol)
- 🔨 **Sealed-Bid Dark Auction**: [`contracts/CyveraAuction.sol`](./contracts/CyveraAuction.sol)
- 🚀 **Deployment Automation**: [`script/Deploy.s.sol`](./script/Deploy.s.sol)

---

## 🌟 Executive Summary

**Cyvera** is an institutional-grade, confidential decentralized prize savings protocol built on **Ethereum Sepolia** using the **Zama Fully Homomorphic Encryption Virtual Machine (fhEVM)** and **ERC-7984 Confidential Tokens**.

Traditional decentralized prize mechanisms (such as PoolTogether or lottery protocols) force participants into a severe privacy dilemma: every deposit amount, ticket weight, odds calculation, winning probability, and prize distribution is permanently visible to the global public. This invites:
1. **Balance Surveillance & Whale Tracking**: High-net-worth savers expose their principal to predatory tracking.
2. **Targeted Front-Running & Social Engineering**: Winners are publicly tagged onchain immediately upon victory.
3. **Mempool Sniping**: Adversaries can model pool odds in plaintext to exploit timing windows.

**Cyvera eliminates these vulnerabilities entirely.** Through homomorphic encryption over ciphertexts (`euint64`), Cyvera guarantees that deposits, draw weights, and prize payouts remain cryptographically concealed from all outside observers, node operators, and protocol keepers—while retaining 100% verifiable solvency and zero-loss principal protection.

---

## 🏗️ System Architecture & End-to-End Flow

```
                                  ┌──────────────────────────────────────────────────┐
                                  │               CYVERA DAPP CLIENT                │
                                  │      (Next.js 15.5.25 + Wagmi + Zama SDK)       │
                                  └─────────────────────────┬────────────────────────┘
                                                            │ EIP-712 Signed Intent
                                                            ▼
┌─────────────────────────┐       ┌───────────────────────────────────┐       ┌───────────────────────────┐
│ 1. Public Stablecoins   │ ───→  │ 2. Shielding Converter            │ ───→  │ 3. Confidential Deposit   │
│   (Mock USDT / USDC)    │       │   (ERC-7984 Wrapper / Faucet)     │       │   (euint64 Ciphertext)    │
└─────────────────────────┘       └───────────────────────────────────┘       └─────────────┬─────────────┘
                                                                                            │
                                                                                            ▼
┌─────────────────────────┐       ┌───────────────────────────────────┐       ┌───────────────────────────┐
│ 6. 100% Zero-Loss Exit  │ ←───  │ 5. Private Reveal & Claim         │ ←───  │ 4. CyveraPrizePool Core   │
│   (Instant Principal    │       │   (EIP-712 Decrypt Session;       │       │   (Homomorphic Accounting │
│    Withdrawal anytime)  │       │    Claim real ERC-20 profit)      │       │    + 4-Phase Draw Engine) │
└─────────────────────────┘       └─────────────────▲─────────────────┘       └─────────────▲─────────────┘
                                                    │                                       │
                                                    │                             Yield Stream Funding
                                                    │                         (harvestAndFund / injectYield)
                                                    │                                       │
                                      ┌─────────────┴─────────────────┐       ┌─────────────┴─────────────┐
                                      │  Zama FHE Verifiable Entropy  │       │     CyveraYieldSource     │
                                      │     (FHE.randEuint64() RNG)   │       │   (Decoupled APY Engine)  │
                                      └───────────────────────────────┘       └───────────────────────────┘
```

---

## 🔒 Confidentiality Design: Explicit Privacy Boundary

Cyvera follows an **Explicit Privacy Boundary** model. State variables that represent financial solvency and operational timing are verifiably public, while all user balances, odds, and individual payouts remain strictly confidential:

| Dimension | Classification | Technology | Description |
| :--- | :--- | :--- | :--- |
| **User Deposit Balances** | 🔒 **Strictly Confidential** | Zama `euint64` | Individual wallet principal is never stored as plaintext onchain. |
| **Ticket Weights & Odds** | 🔒 **Strictly Confidential** | Zama `euint64` | Winning chances are calculated homomorphically; competitors cannot profile whale tickets. |
| **Winner Prize Amount** | 🔒 **Strictly Confidential** | Zama `euint64` | Payouts are encrypted to the winner; only decryptable via the winner's EIP-712 signature. |
| **Sealed Auction Bids** | 🔒 **Strictly Confidential** | Zama `euint64` | Bids submitted to dark auctions remain blinded until settlement using `FHE.gt` & `FHE.select`. |
| **Active Participant Count** | 🔍 **Verifiably Public** | `uint256` | Aggregate count of depositors is transparent to prove pool liveness. |
| **Total Prize Reserve** | 🔍 **Verifiably Public** | `uint256` | Verifiable solvency proof that prizes are fully backed by yield tokens. |
| **Draw Timing & Draw IDs** | 🔍 **Verifiably Public** | `uint256` | Draw cadence, countdown timers, and historical draw indices are transparent. |
| **User Wallet Address** | 🔍 **Verifiably Public** | `address` | Necessary for EVM transaction attribution and authorization verification. |

### 🛡️ Why This Boundary?
By storing individual shares in ciphertexts while keeping the aggregate prize reserve public:
- **Solvency is provable**: Any saver can verify that the prize pot contains real funds.
- **Privacy is absolute**: No one can deduce how much money Alice or Bob has deposited.
- **No plaintext mirror**: There is no shadow balance table onchain. Even contract owners and validators cannot read user balances.

---

## 🎯 How the Prize Pool & 4-Phase Draws Work

### 1. The No-Loss Principle
In Cyvera, **you never lose your deposit**:
1. You deposit `$100.00` into the pool.
2. For every `$1.00` deposited, you receive 1 confidential prize ticket.
3. The pool's underlying assets generate yield through the **`CyveraYieldSource`** strategy.
4. Only the **accrued yield** is pooled into the prize jackpot.
5. When a draw executes, the winner takes the yield prize.
6. **Your `$100.00` principal remains 100% untouched and withdrawable at any moment.**

---

### 2. The 4-Phase Draw Engine Lifecycle

Every Cyvera prize pool runs on an automated or permissionless 4-phase cycle:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Phase 1: OPEN  │ ───→  │Phase 2: SNAPSHOT│ ───→  │Phase 3: SELECT  │ ───→  │ Phase 4: CLAIM  │
│ Deposits Active │       │ Weights Locked  │       │ Fair Random RNG │       │ Private Reveal  │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

#### 🟢 Phase 1: Open Savings
- Users deposit `cUSDT` or `cUSDC` at any time.
- Encrypted balances are updated homomorphically using `FHE.add`.
- Savers can deposit additional funds or initiate instant zero-loss withdrawals.
- Each dollar deposited grants one confidential draw weight unit.

#### 🟡 Phase 2: Snapshot Weights
- When the countdown timer expires, active participant balances are committed into the draw snapshot.
- Snapshotting prevents **flash-deposit attacks** (depositing right before a draw and withdrawing immediately after).
- Draw weights remain encrypted in homomorphic state.

#### 🔵 Phase 3: Fair Selection (Verifiable Onchain Entropy)
- Selection is triggered permissionlessly by any user or automated keeper.
- The contract requests cryptographically secure entropy from Zama's native pseudorandom engine:
  ```solidity
  euint64 randomSeed = FHE.randEuint64();
  ```
- The winning ticket is selected homomorphically proportional to deposit weight.
- The prize reward is added directly to the winner's encrypted winnings balance (`_encryptedWinnings`).

#### 🟣 Phase 4: Claim Window & Private Reveal
- The draw concludes and enters the Claim Window.
- Participants inspect their status through the **Private Reveal** interface.
- Using Zama's offchain decryption protocol (EIP-712 signature request), the winner decrypts their prize handle.
- The winner can:
  - **Claim Prize**: Transfer real public ERC-20 profit directly to their personal wallet.
  - **Compound Prize**: Automatically reinvest winnings back into the savings pool to increase future draw odds.

---

## 🌾 The Yield Source Architecture (`CyveraYieldSource.sol`)

To ensure clean separation of concerns and maximum composability, Cyvera isolates yield generation from pool mechanics.

### Architecture Overview
```solidity
interface IYieldReceiver {
    function fundPrizeReserve(uint256 amount) external;
}
```

The `CyveraYieldSource` contract:
- Acts as a dedicated yield-bearing strategy adapter.
- In production, it interfaces with lending protocols (e.g., **Aave V3, Compound V3, Morpho, Euler**).
- On testnet, it operates a high-precision continuous APY calculation model that streams rewards into the pool's prize reserve.

### Yield Calculation Formula
$$AccruedYield = \frac{SimulatedPrincipal \times APYBasisPoints \times TimeElapsed}{10000 \times 365\text{ days}}$$

- **Configurable APY**: Set dynamically by governance (default: **8.50%** for `cUSDT`, **12.00%** for `cUSDC`).
- **Autonomous Streaming (`harvestAndFund`)**: Called automatically during draws to calculate elapsed time, mint accrued yield, and push it directly into `CyveraPrizePool.fundPrizeReserve()`.
- **Manual Yield Injection (`manualInjectYield`)**: Allows external sponsors, DAOs, or hackathon judges to inject bonus prize pots at any time without diluting saver deposits.

---

## 🪙 Live Sepolia Deployments & Dual Markets

Cyvera is live on **Ethereum Sepolia (Chain ID: `11155111`)**:

| Parameter | Market 1: cUSDT Shielded Vault | Market 2: cUSDC High-Yield Treasury |
| :--- | :--- | :--- |
| **Vault Type** | Conservative Shielded Savings | High-Yield Growth Treasury |
| **Underlying Token** | `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0` | `0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF` |
| **ERC-7984 Wrapper** | `0x4E7B06D78965594eB5EF5414c357ca21E1554491` | `0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639` |
| **Prize Vault Address** | `0x9fCd8e05C9f08FDaB15871178B67055bEc3Cf00F` | `0x0Df09628bAdA515D3b0A3AC8945120C14C725819` |
| **Yield Source Address** | `0x63BC7333B39794966953289052d751079F4386A4` | `0x7cF1156D254930364966953289052d751079F438` |
| **Target APY** | `8.50%` | `12.00%` |
| **Draw Frequency** | 1-Minute (Testing) / Daily (Mainnet) | 1-Minute (Testing) / Weekly (Mainnet) |
| **Zama Relayer** | `https://relayer.testnet.zama.cloud` | `https://relayer.testnet.zama.cloud` |

---

## 🛠️ Deployment & Developer Guide

### 1. Smart Contract Deployment via Foundry

The deployment pipeline is orchestrated via [`script/Deploy.s.sol`](./script/Deploy.s.sol).

#### Prerequisites
- Foundry installed (`forge`, `cast`)
- An Ethereum Sepolia RPC endpoint (Alchemy, Infura, or 1RPC)
- A funded deployer account with Sepolia ETH

#### Dry-Run Simulation
Always simulate before broadcasting to guarantee valid bytecode compilation:
```bash
forge script script/Deploy.s.sol \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY \
  -vvvv
```

#### On-Chain Deployment with `--slow`
> ⚠️ **Important for Alchemy & Public RPCs**: Always include `--slow` to prevent nonce conflicts and the `-32000 in-flight transaction limit` error.

Using a Foundry keystore account:
```bash
forge script script/Deploy.s.sol \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY \
  --account deployer \
  --broadcast \
  --slow \
  --verify \
  --etherscan-api-key YOUR_ETHERSCAN_API_KEY \
  -vvvv
```

Or using a raw private key:
```bash
export PRIVATE_KEY="0xYOUR_TESTNET_PRIVATE_KEY"

forge script script/Deploy.s.sol \
  --rpc-url https://1rpc.io/sepolia \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --slow \
  -vvv
```

#### Post-Deployment Setup (Funding Prize Reserve via `cast`)
```bash
# 1. Mint test deposit tokens to deployer
cast send <TOKEN_ADDRESS> "mint(address,uint256)" <YOUR_WALLET> 1000000000 \
  --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# 2. Approve Prize Pool
cast send <TOKEN_ADDRESS> "approve(address,uint256)" <POOL_ADDRESS> 500000000 \
  --rpc-url $RPC_URL --private-key $PRIVATE_KEY

# 3. Inject initial $500.00 prize pot
cast send <POOL_ADDRESS> "fundPrizeReserve(uint256)" 500000000 \
  --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

---

### 2. Frontend Deployment to Vercel

The frontend is a production-ready Next.js 15 app optimized for Vercel deployment.

#### Step 1: Push Code to GitHub
```bash
git push origin main
```

#### Step 2: Configure Environment Variables in Vercel
In **Vercel Project Settings ➔ Environment Variables**, configure:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CYVERA_POOL_ADDRESS` | `0x9fCd8e05C9f08FDaB15871178B67055bEc3Cf00F` | Deployed prize pool contract address |
| `NEXT_PUBLIC_DEPOSIT_TOKEN` | `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0` | Deployed deposit token contract address |
| `NEXT_PUBLIC_YIELD_SOURCE_ADDRESS` | `0x63BC7333B39794966953289052d751079F4386A4` | Deployed yield generator contract address |
| `NEXT_PUBLIC_RPC_URL` | `https://ethereum-sepolia-rpc.publicnode.com` | Sepolia RPC endpoint |
| `NEXT_PUBLIC_ZAMA_RELAYER_URL` | `https://relayer.testnet.zama.cloud` | Zama confidential relayer gateway |
| `NEXT_PUBLIC_ETHERSCAN_API_KEY` | *(Optional)* | Etherscan key for deep transaction history |

*(Note: If omitted, the frontend automatically falls back to the live Sepolia contracts configured in [`lib/contracts.ts`](./lib/contracts.ts)).*

---

## 🧪 Testing & Verification

Cyvera contains unit, fuzzing, and invariant test suites:

```bash
# 1. Run full Foundry test suite
forge test -v

# 2. Run with detailed execution traces
forge test --match-contract CyveraPrizePoolTest -vvvv

# 3. Verify Next.js production build locally
npm run build
```

---

## 🛡️ Security & Invariants

1. **Zero-Loss Guarantee**: `CyveraPrizePool` never executes external calls that risk user principal. All prize payouts originate strictly from the `totalPrizeReserve` funded by yield or sponsors.
2. **Reentrancy Protection**: All user-facing state-changing operations (`deposit`, `withdraw`, `claimPrize`, `triggerDraw`) implement non-reentrant state transitions.
3. **EIP-712 Private Decryption**: Balances and prize reveals require an offchain signature from the authorized address, ensuring node operators cannot eavesdrop on private state.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ for private, provably fair decentralized finance on Ethereum Sepolia & Zama FHEVM.</sub>
</div>
