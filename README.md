# 🌟 AuraPool — Confidential No-Loss Prize Savings Protocol

> **Zama Developer Program Mainnet Season 4 Bounty Track Submission**  
> *A production-ready confidential version of PoolTogether powered by Zama Fully Homomorphic Encryption (FHE) on Ethereum Sepolia.*

---

## 📌 Executive Summary

On transparent public blockchains, prize-savings protocols like PoolTogether leak sensitive user data:
1. **Individual Net Worth**: Every deposit and balance is publicly visible on Etherscan.
2. **Public Winning Odds**: Large depositors can be tracked and their ticket distributions calculated.
3. **Broadcast Jackpots**: Big winners become immediate targets for phishing, social engineering, and targeted exploits.

**AuraPool eliminates these privacy trade-offs entirely using Zama's Fully Homomorphic Encryption (FHE)**. Users deposit tokens into a shared prize pool, their balances remain encrypted onchain as `euint64` ciphertexts, and accrued lending yield is awarded to depositors through periodic draws using onchain FHE randomness (`FHE.randEuint64()`). Only the winner holds the cryptographic authority (via EIP-712) to decrypt and claim their winnings.

---

## 🔗 Official Zama Sepolia Testnet Addresses & Wrappers

AuraPool is designed to plug directly into the official **Zama Sepolia Confidential Tokens ecosystem**:

| Asset / Component | Address | Details / Function |
| :--- | :--- | :--- |
| **Wrappers Registry** | `0x2f0750Bbb0A246059d80e94c454586a7F27a128e` | Official Zama Registry |
| **Zama Token** | `0xa798B04149e7a61cc95B7D114AD420e8969eA268` | Official Zama Sepolia Token |
| **Confidential USDT (cUSDTMock)** | `0x4E7B06D78965594eB5EF5414c357ca21E1554491` | FHE Encrypted Wrapper |
| **Underlying USDT (cUSDT)** | `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0` | Public `mint(to, amount)` (1M Limit) |
| **Confidential USDC (cUSDCMock)** | `0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639` | FHE Encrypted Wrapper |
| **Underlying USDC (cUSDC)** | `0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF` | Public `mint(to, amount)` (1M Limit) |
| **Confidential WETH (cWETHMock)** | `0x46208622DA27d91db4f0393733C8BA082ed83158` | FHE Encrypted Wrapper |
| **Underlying WETH (cWETH)** | `0xff54739b16576FA5402F211D0b938469Ab9A5f3F` | Public `mint(to, amount)` (1M Limit) |
| **Confidential ZAMA (cZAMAMock)** | `0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB` | FHE Encrypted Wrapper |
| **Underlying ZAMA (cZAMA)** | `0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57` | Public `mint(to, amount)` (1M Limit) |

---

## 🚀 Manual Deployment Guide (100% Pure Foundry)

You can manually deploy `AuraPrizePool` to Ethereum Sepolia or Zama Sepolia in 1 command using Foundry:

### 1. Set Environment Variables
```bash
export RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
export PRIVATE_KEY="your_private_key_here"
```

### 2. Deploy AuraPrizePool with Official Zama Sepolia Token
```bash
# Deploys AuraPrizePool linked to official Zama Sepolia cUSDT (0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0)
forge create contracts/AuraPrizePool.sol:AuraPrizePool \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args 0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0
```

### 3. Deploy Mock Yield Source (Optional)
```bash
forge create contracts/MockYieldSource.sol:MockYieldSource \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args 0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0
```

---

## ⚡ Key Architecture Features

- 🔒 **Confidential Deposit Accounting (`euint64`)**: Deposits are wrapped into Zama fhEVM encrypted integers. No outside observer can inspect a wallet's savings balance or share of the pool.
- 🎲 **Deposit-Weighted FHE Random Draws**: Periodic winner selection is computed onchain using Zama's `FHE.randEuint64()`. Winner probability scales proportionally with deposit size without revealing individual balances.
- 🔑 **EIP-712 User Decryption**: Users securely decrypt their confidential balances and private winnings using typed signatures without exposing keys onchain.
- 🛡️ **Guaranteed No-Loss Invariant**: Deposited principal is never spent on tickets and never wagered. Users can withdraw 100% of their deposit at any time with zero lockups and zero fees.
- ⚡ **1-Click Testnet Faucet**: Built-in test token faucet allows judges and testers to mint 1,000 cUSDT on Sepolia directly via the official Zama token `mint()` method.

---

## 🏗️ Protocol Lifecycle & Confidentiality

```
[ User Wallet ]
      │
      │ 1. Approve & Deposit cUSDT
      ▼
┌────────────────────────────────────────────────────────┐
│               AuraPrizePool.sol                        │
│                                                        │
│  - Encrypts deposit as euint64                         │
│  - FHE.allow(encBalance, user)                         │
│  - FHE.allowThis(encBalance)                           │
│                                                        │
│  [ Accrues 8.50% APY Yield from Lending Source ]       │
│                                                        │
│  - 24h Periodic Draw: FHE.randEuint64()                │
│  - Deposit-Weighted Winner Selection                   │
│  - Encrypted Prize Award: FHE.allow(winnings, winner)  │
└────────────────────────────────────────────────────────┘
      │
      │ 2. EIP-712 Typed Signature Decryption
      ▼
[ Winner Claims to Wallet OR Auto-Compounds into Savings ]
```

---

## 🔒 Confidentiality Design & Leakage Analysis

| Metric / Field | Onchain Visibility | Protection Mechanism |
| :--- | :--- | :--- |
| **Individual Deposit Amount** | 🔒 **100% Encrypted** | Stored as `euint64` ciphertext handle. |
| **User Savings Balance** | 🔒 **100% Encrypted** | Decryptable only by user via EIP-712 KMS signature. |
| **Individual Winning Odds** | 🔒 **100% Encrypted** | Deposit weights are concealed during draw execution. |
| **Winner Prize Allocation** | 🔒 **Winner-Only** | Only the winner holds the permission to decrypt their prize. |
| **Total Pool TVL** | 🌐 **Public Aggregate** | Necessary for DeFi lending protocol routing. |
| **Participant Addresses** | 🌐 **Public Set** | Active wallet set without deposit balance values. |

---

## 🧪 Testing & Verification

The smart contracts are fully tested using pure Foundry with a 100% test pass rate.

```bash
# Run pure Foundry smart contract test suite
forge test -vvv
```

### Test Results:
```
Ran 5 tests for test/AuraPrizePool.t.sol:AuraPrizePoolTest
[PASS] test_DepositFlow() (gas: 195942)
[PASS] test_Faucet() (gas: 36137)
[PASS] test_InitialState() (gas: 16707)
[PASS] test_WithdrawNoLoss() (gas: 213480)
[PASS] test_YieldAccrualAndDraw() (gas: 459768)
Suite result: ok. 5 passed; 0 failed; 0 skipped
```

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/Oluwa-Laughter/aurapool.git
cd aurapool
npm install
```

### 2. Run Foundry Tests & Next.js Build
```bash
forge test
npm run build
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

MIT License &copy; 2026 AuraPool Protocol
