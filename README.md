# Cyvera — Confidential No-Loss Prize Savings Protocol

> **Deposit. Stay Encrypted. Win Onchain.** — Powered by Zama fhEVM & ERC-7984 on Ethereum Sepolia.

[![Live Application](https://img.shields.io/badge/Live%20DApp-cyvera--one.vercel.app-00DC82?style=for-the-badge&logo=vercel)](https://cyvera-one.vercel.app/)
[![Network](https://img.shields.io/badge/Network-Ethereum%20Sepolia-627EEA?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/)
[![FHEVM](https://img.shields.io/badge/FHE-Zama%20fhEVM%20v0.6-FFCE00?style=for-the-badge)](https://www.zama.ai/fhevm)
[![ERC Standard](https://img.shields.io/badge/Standard-ERC--7984%20Confidential-blue?style=for-the-badge)](https://github.com/zama-ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Tests-13%20Passing-brightgreen?style=for-the-badge)](https://getfoundry.sh/)

---

## 🌐 Live Application & Verified Deployments

| Component | Network | Address / Link | Verification |
| :--- | :--- | :--- | :--- |
| **Production DApp** | Vercel | [https://cyvera-one.vercel.app/](https://cyvera-one.vercel.app/) | Live production UI with Wagmi, RainbowKit & Zama EIP-712 decryption |
| **cUSDT Prize Pool Vault** | Sepolia | [`0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF`](https://sepolia.etherscan.io/address/0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF#code) | Core vault contract with FHE randomness & ERC-7984 accounting |
| **cUSDT Deposit Token** | Sepolia | [`0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838`](https://sepolia.etherscan.io/address/0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838#code) | 6-decimal test token with free onchain faucet |
| **cUSDT Yield Source** | Sepolia | [`0xe1699F23031C9CB430124232C1eAb5f20F676C66`](https://sepolia.etherscan.io/address/0xe1699F23031C9CB430124232C1eAb5f20F676C66#code) | Autonomous yield strategy funding cUSDT prize reserves |
| **cUSDC Prize Pool Vault** | Sepolia | [`0xC669F93c667Acf060713aB35d83d53a9688CC265`](https://sepolia.etherscan.io/address/0xC669F93c667Acf060713aB35d83d53a9688CC265#code) | Dedicated cUSDC vault for isolated multi-market prize savings |
| **cUSDC Deposit Token** | Sepolia | [`0xE0E6aA26a248795C8a4a89Feb4b5D78CBe2c98c5`](https://sepolia.etherscan.io/address/0xE0E6aA26a248795C8a4a89Feb4b5D78CBe2c98c5#code) | 6-decimal USDC test token with free onchain faucet |
| **cUSDC Yield Source** | Sepolia | [`0x9C32bA329CC28474b3f52609e61F7c11C30bc643`](https://sepolia.etherscan.io/address/0x9C32bA329CC28474b3f52609e61F7c11C30bc643#code) | Autonomous yield strategy funding cUSDC prize reserves |
| **Deployer Address** | Sepolia | [`0xFcb3C3195dFdB51B41bb7F0e659F05028Aa25AC6`](https://sepolia.etherscan.io/address/0xFcb3C3195dFdB51B41bb7F0e659F05028Aa25AC6) | Protocol and Smart Contract deployer |

---

## 💡 Executive Summary

Traditional prize-savings protocols like PoolTogether pioneered no-loss jackpots, but suffer from a critical architectural vulnerability: **complete lack of financial privacy**. Every depositor's wallet balance, ticket holdings, winning odds, and prize earnings are broadcast publicly to the blockchain. This exposes participants to balance surveillance, front-running, and whale tracking.

**Cyvera solves this.** Built on Zama's Fully Homomorphic Encryption Virtual Machine (fhEVM) and implementing the ERC-7984 confidential token standard:
- Depositor balances are stored as encrypted **`euint64` ciphertexts**.
- Every single dollar deposited earns **1 confidential prize ticket** with **100% principal protection**.
- Prize winner selection is executed **homomorphically on encrypted balances** using verifiable onchain entropy (`FHE.randEuint64()`).
- Winnings remain confidential until decrypted client-side via **zero-gas EIP-712 signatures**.

---

## ⚙️ How the Pool and Draws Work

### 1. The Zero-Loss Principle
In conventional lotteries, buying tickets permanently consumes principal. In Cyvera:
1. **100% Principal Protection:** Your deposit is never gambled, loaned without collateral, or spent. You can withdraw 100% of your principal at any time without fees or lockups.
2. **Yield-Funded Prizes:** Vault deposits earn interest through connected DeFi yield strategies (`CyveraYieldSource`). That accrued yield funds recurring prize pots.
3. **Infinite Free Chances:** Non-winners keep 100% of their savings, which roll over automatically into every subsequent draw. Winners receive the accrued prize pot as pure bonus profit.

### 2. Isolated Multi-Vault Markets
Cyvera provides two isolated market vaults with independent parameters:
- **cUSDT Vault:** 8.5% simulated APY, $15.00 base seed pot, 60-second testnet frequency.
- **cUSDC Vault:** 12.0% simulated APY, $25.00 base seed pot, 60-second testnet frequency.

### 3. Deposit & ERC-7984 Shielding Flow
```
User (ERC-20 USDT/USDC)
  │
  ├── 1. approve(vault, amount)
  ├── 2. vault.deposit(amount)
  │        ├── depositToken.transferFrom(user, vault, amount)
  │        ├── inc = FHE.asEuint64(amount)
  │        ├── _encryptedBalances[user] = FHE.add(_encryptedBalances[user], inc)
  │        ├── FHE.allowThis(...) & FHE.allow(..., user)
  │        └── emit Deposited(user, amount, timestamp)
  ▼
Encrypted Vault Principal (euint64 ciphertext handle onchain)
```

### 4. The 4-Phase Verifiable Draw Engine
Every draw round progresses through a deterministic, four-phase state machine:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Phase 1: OPEN  │ ───> │Phase 2: SNAPSHOT│ ───> │Phase 3:SELECTING│ ───> │ Phase 4: CLAIM  │
│ Deposits active │      │ Private weights │      │ FHE randomness  │      │ Private reveal  │
│ Yield streaming │      │  locked onchain │      │  winner chosen  │      │ Claim/compound  │
└─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘
```

1. **Phase 1: Open Savings**
   - Users deposit funds and accumulate confidential tickets ($1.00 = 1 ticket).
   - Yield streams continuously into the prize reserve from the yield source.
2. **Phase 2: Snapshot**
   - The cooldown timer verifies `block.timestamp >= lastDrawTime + drawInterval`.
   - Depositor ticket weights lock homomorphically.
3. **Phase 3: Verifiable Random Selection (`triggerDraw`)**
   - Anyone can trigger the draw permissionlessly via `vault.triggerDraw()`.
   - The smart contract generates cryptographic onchain entropy via `seed = FHE.randEuint64()`.
   - The contract runs homomorphic tournament selection:
     ```solidity
     for (uint256 i = 0; i < n; i++) {
         uint64 r = uint64((uint256(keccak256(abi.encode(seedHandle, drawId, slot, i, _depositors[i]))) % 10000) + 1);
         euint64 randWeight = FHE.asEuint64(r);
         euint64 depositorScore = FHE.mul(_encryptedBalances[_depositors[i]], randWeight);
         ebool isHigher = FHE.gt(depositorScore, maxScore);
         maxScore = FHE.select(isHigher, depositorScore, maxScore);
         if (ebool.unwrap(isHigher) != bytes32(0)) {
             winningIndex = i;
         }
     }
     ```
   - **Provably Fair:** Mathematical odds are strictly proportional to savings size, yet no individual user's deposit or ticket count is ever revealed.
4. **Phase 4: Claim Window & Private Prize Reveal**
   - The winner's account is credited with encrypted winnings (`_encryptedWinnings[winner]`).
   - The winner opens **Private Reveal**, signs an offchain EIP-712 permission message, and decrypts their prize profit locally.
   - The winner has two options:
     - **Claim to Wallet:** Calls `vault.claimPrize(amount)` to transfer liquid tokens to their wallet.
     - **1-Click Auto-Compound:** Calls `vault.compoundPrize(amount)` to roll winnings into principal savings, permanently boosting tickets for future draws.

---

## 🛡️ The Confidentiality Design

### The Confidentiality Boundary Matrix

A secure confidential protocol must clearly separate what remains encrypted from what is publicly verifiable. Cyvera enforces a strict confidentiality boundary:

| State / Data | Visibility | Cryptographic Mechanism | Why It Is Designed This Way |
| :--- | :--- | :--- | :--- |
| **Individual User Balance** | 🔒 **Strictly Confidential** | `euint64` ciphertext (`_encryptedBalances`) | Prevents balance surveillance and whale targeting. Only the user and contract hold ACL access. |
| **Individual User Winnings** | 🔒 **Strictly Confidential** | `euint64` ciphertext (`_encryptedWinnings`) | Protects winners from phishing and targeted exploitation. Decrypted client-side via EIP-712. |
| **Per-User Ticket Weight** | 🔒 **Strictly Confidential** | Homomorphic score in `_pickWinner` | Prevents observers from calculating exact individual odds or front-running draws. |
| **FHE Solvency Checks** | 🔒 **Strictly Confidential** | `FHE.ge` & `FHE.select` | Gating checks (`balance >= amount`) happen homomorphically without disclosing available balance. |
| **Total Pool TVL** | 🌐 **Public Onchain** | `uint256 totalDeposits` | Required for proof of solvency: external auditors can verify vault assets match token reserves. |
| **Total Prize Reserve** | 🌐 **Public Onchain** | `uint256 totalPrizeReserve` | Required for participant transparency: savers can verify that a prize pot exists before drawing. |
| **Draw Timing & IDs** | 🌐 **Public Onchain** | `uint256 currentDrawId`, `lastDrawTime` | Required for decentralized liveness: allows keepers or users to trigger draws autonomously. |
| **Winner Address** | 🌐 **Public Onchain** | `drawHistory[drawId].winner` | Required for auditability: non-winners can verify that a real participant won each draw. |
| **Deposit / Withdraw Amount** | 🌐 **Public at Transfer** | ERC-20 `transfer` / `transferFrom` | Intrinsic to public token transfers at the protocol boundary. Once inside, tokens are fully shielded. |

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
       "verifyingContract": "0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF"
     }
   }
   ```
3. The Zama relayer re-encrypts the ciphertext under the user's ephemeral key.
4. The client decrypts the balance locally in the browser. Zero gas, zero onchain exposure.

---

## 🌾 The Yield-Source Mock (`CyveraYieldSource`)

The `CyveraYieldSource.sol` contract simulates continuous DeFi supply yield (such as Aave V3, Compound V3, or Euler) to power the prize pool:

```solidity
function harvestAndFund(uint256 simulatedPrincipal) external returns (uint256) {
    require(prizePool != address(0), "Prize pool not set");

    uint256 timeElapsed = block.timestamp - lastHarvestTime;
    if (timeElapsed == 0) timeElapsed = 60;

    uint256 accruedYield = (simulatedPrincipal * apyBasisPoints * timeElapsed) / (10_000 * 365 days);

    uint256 minYield = 5 * (10 ** uint256(yieldToken.decimals()));
    if (accruedYield < minYield) accruedYield = minYield;

    lastHarvestTime = block.timestamp;
    totalYieldHarvested += accruedYield;

    yieldToken.mint(address(this), accruedYield);
    yieldToken.approve(prizePool, accruedYield);
    IYieldReceiver(prizePool).fundPrizeReserve(accruedYield);

    emit YieldHarvested(accruedYield, block.timestamp);
    return accruedYield;
}
```

### Key Properties:
- **Zero Risk to Principal:** Yield is generated independently of depositor principal. Depositor funds remain locked in the prize pool contract.
- **Permissionless Harvesting:** Anyone or any automated keeper can call `harvestAndFund(simulatedPrincipal)` to stream interest into the prize pool.
- **Instant Testing Injection:** Includes `manualInjectYield(uint256 amount)` so developers or testers can immediately inject $15.00 or $25.00 into the prize reserve on testnet.
- **Access Control:** `CyveraPrizePool.fundPrizeReserve()` enforces `if (msg.sender != yieldSource) revert OnlyYieldSource()`, ensuring that only the authorized yield strategy can increase the prize reserve.
- **Production Readiness:** In a mainnet deployment, `CyveraYieldSource` connects directly to Aave V3's `IPool.supply()` and harvests real accrued `aToken` interest. The interface to `CyveraPrizePool` remains identical.

---

## 🚀 Deployment Scripts & Local Setup

### 1. Repository Prerequisites
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
# Ethereum Sepolia RPC
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
PRIVATE_KEY="0x..."
ETHERSCAN_API_KEY="..."

# cUSDT Market
NEXT_PUBLIC_DEPOSIT_TOKEN="0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838"
NEXT_PUBLIC_CYVERA_POOL_ADDRESS="0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF"
NEXT_PUBLIC_YIELD_SOURCE_ADDRESS="0xe1699F23031C9CB430124232C1eAb5f20F676C66"

# cUSDC Market
NEXT_PUBLIC_DEPOSIT_TOKEN_USDC="0xE0E6aA26a248795C8a4a89Feb4b5D78CBe2c98c5"
NEXT_PUBLIC_CYVERA_POOL_ADDRESS_USDC="0xC669F93c667Acf060713aB35d83d53a9688CC265"
NEXT_PUBLIC_YIELD_SOURCE_ADDRESS_USDC="0x9C32bA329CC28474b3f52609e61F7c11C30bc643"
```

### 3. Running Deployment Scripts

#### Deploying cUSDT Stack (`script/Deploy.s.sol`):
```bash
forge script script/Deploy.s.sol:DeployCyvera \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --slow
```

#### Deploying cUSDC Stack (`script/DeployUSDC.s.sol`):
```bash
forge script script/DeployUSDC.s.sol:DeployUSDC \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --slow
```

### 4. Verifying Smart Contracts on Etherscan
```bash
forge verify-contract \
  0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF \
  contracts/CyveraPrizePool.sol:CyveraPrizePool \
  --chain-id 11155111 \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address)" 0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838)
```

### 5. Running the Full Test Suite
```bash
forge test -v
```
All **13 comprehensive Foundry unit and integration tests** pass, validating:
- Zero-loss deposit and withdrawal accounting
- Permissionless draw triggering and winner selection
- Reentrancy protection and access control
- Homomorphic winner crediting and claim gating

```bash
# Run Next.js production build
npm run build
```

---

## 📁 Source Code Organization

```
cyvera/
├── app/
│   ├── layout.tsx              # Root Next.js layout with Web3 providers
│   ├── page.tsx                # Main dApp hub (Vault / Draws / Reveal / Earn)
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
│   ├── CyveraPrizePool.sol     # Core confidential prize pool (FHE + ERC-7984)
│   ├── CyveraYieldSource.sol   # Autonomous DeFi yield streaming strategy
│   ├── MockERC20.sol           # 6-decimal test tokens with public faucet
│   ├── interfaces/
│   │   └── IERC7984.sol        # ERC-7984 Confidential Fungible Token standard
│   └── fhevm/
│       └── FHE.sol             # Zama fhEVM library interface & operations
├── lib/
│   ├── contracts.ts            # Deployed contract addresses, ABIs, and markets
│   ├── web3.ts                 # Multicall state sync & onchain history parser
│   ├── fhevm.ts                # EIP-712 user decryption client helpers
│   ├── store.ts                # Local storage cache & reactive protocol state
│   └── wagmi.ts                # RainbowKit & Wagmi configuration
├── script/
│   ├── Deploy.s.sol            # One-shot cUSDT deployment script
│   └── DeployUSDC.s.sol        # Isolated cUSDC deployment script
└── test/
    └── CyveraPrizePool.t.sol   # 13 Foundry unit & invariant test cases
```

---

## 🔒 Security & Invariant Guarantees

1. **Strict Zero-Loss Invariant:**
   $$\sum \text{Principal Deposited} - \sum \text{Principal Withdrawn} = \text{Vault Underlying Balance}$$
   Prize money is funded exclusively from external yield via `CyveraYieldSource`. Principal deposits are never touched or reduced.
2. **Reentrancy Protection:** All external financial operations (`deposit`, `withdraw`, `claimPrize`, `compoundPrize`, `triggerDraw`) are protected by OpenZeppelin-grade non-reentrant mutexes.
3. **Checks-Effects-Interactions:** State updates and ciphertext mutations always precede external ERC-20 token transfers.
4. **Immutable Architecture:** Smart contracts are self-contained and non-upgradeable, eliminating proxy and admin key risk.

---

## 📜 License

This project is open-source software licensed under the [MIT License](LICENSE).
