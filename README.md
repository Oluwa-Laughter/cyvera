# 🛡️ Cyvera: Confidential No-Loss Prize Savings Protocol
> **Private Wealth Preservation • Provable Onchain Jackpots • Powered by Zama FHEVM**

---

## 🌟 Executive Summary

**Cyvera** is a production-ready, confidential decentralized prize savings protocol built on Ethereum Sepolia using the **Zama Fully Homomorphic Encryption Virtual Machine (fhEVM)** and **ERC-7984 Confidential Tokens**.

Traditional decentralized finance and prize mechanisms force participants into a severe privacy tradeoff: every deposit amount, ticket weight, winning probability, and winner prize payout is broadcast to the global public. This invites **balance surveillance, whale tracking, mempool front-running, and targeted social engineering**.

**Cyvera eliminates this tradeoff entirely.** By encrypting state variables into homomorphic ciphertexts (`euint64`), Cyvera executes provably fair, deposit-weighted prize draws where:
- **Deposits & pool balances stay encrypted end-to-end.**
- **Draw weights and winning odds are computed homomorphically without plaintext leakage.**
- **Winner selection runs onchain using Zama verifiable entropy (`FHE.randEuint64`).**
- **Winners privately reveal their prize payouts using offchain EIP-712 user signatures.**
- **100% of user principal is guaranteed safe and withdrawable at any block height (Zero-Loss).**

---

## 🏗️ Protocol Architecture & Flow

```
┌─────────────────────────┐       ┌───────────────────────────┐       ┌───────────────────────────┐
│ 1. Public Stablecoins   │ ───→  │ 2. Shielding Converter    │ ───→  │ 3. Confidential Deposit   │
│   (USDT / USDC Faucet)  │       │   (ERC-7984 Token Wrapper)│       │   (Encrypted euint64)     │
└─────────────────────────┘       └───────────────────────────┘       └───────────────────────────┘
                                                                                    │
                                                                                    ▼
┌─────────────────────────┐       ┌───────────────────────────┐       ┌───────────────────────────┐
│ 6. 100% Zero-Loss Exit  │ ←───  │ 5. Private Reveal Session │ ←───  │ 4. 4-Phase Verifiable Draw│
│   (Instant Withdrawal)  │       │   (EIP-712 User Decrypt)  │       │   (FHE.randEuint64() RNG) │
└─────────────────────────┘       └───────────────────────────┘       └───────────────────────────┘
```

---

## 🔒 The Cyvera Explicit Privacy Boundary

| Strictly Private (Encrypted with Zama FHE `euint64`) | Verifiably Public Onchain |
| :--- | :--- |
| ✅ User deposit amounts and aggregate vault shares | 🔍 User wallet address and transaction execution timestamps |
| ✅ Number of prize tickets and winning odds | 🔍 Total number of active pool participants |
| ✅ Encrypted snapshot weights during draw execution | 🔍 4-phase draw countdown deadlines and draw IDs |
| ✅ Winner prize amount (decrypted only by winner via EIP-712) | 🔍 Aggregate prize reserve balance (solvency proof) |

---

## 🪙 Live Sepolia Deployments & Dual Markets

Cyvera operates dual prize vaults with independent yield strategies on **Ethereum Sepolia (Chain ID: `11155111`)**:

### Market 1: cUSDT Shielded Prize Vault
- **Underlying Public Token**: `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0`
- **Confidential Wrapper**: `0x4E7B06D78965594eB5EF5414c357ca21E1554491`
- **Prize Vault**: `0x9fCd8e05C9f08FDaB15871178B67055bEc3Cf00F`
- **Yield Stream**: `8.50% APY`

### Market 2: cUSDC High-Yield Treasury
- **Underlying Public Token**: `0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF`
- **Confidential Wrapper**: `0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639`
- **Prize Vault**: `0x0Df09628bAdA515D3b0A3AC8945120C14C725819`
- **Yield Stream**: `12.00% APY`

---

## 🧪 Testing & Verification

Cyvera contains full unit, fuzzing, and invariant test suites in Foundry:

```bash
# Run contract test suite
forge test -v

# Run Next.js production build
npm run build
```

---

## 🚀 Running Locally

```bash
# 1. Clone repository
git clone https://github.com/Oluwa-Laughter/veilpool.git cyvera
cd cyvera

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
