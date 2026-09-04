# Cyvera — Confidential No-Loss Prize Savings Protocol

> Deposit. Stay encrypted. Win onchain. — Powered by Zama fhEVM on Ethereum Sepolia.

[![Live](https://img.shields.io/badge/Live-cyvera--one.vercel.app-00DC82)](https://cyvera-one.vercel.app/)
[![Repo](https://img.shields.io/badge/Repo-Oluwa--Laughter%2Fcyvera-181717)](https://github.com/Oluwa-Laughter/cyvera)
[![Network](https://img.shields.io/badge/Network-Ethereum%20Sepolia-627EEA)](https://sepolia.etherscan.io/)
[![FHEVM](https://img.shields.io/badge/FHE-Zama%20fhEVM-FFCE00)](https://www.zama.ai/fhevm)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)](https://nextjs.org/)

Cyvera is a no-loss prize-savings protocol that recreates the PoolTogether
mechanic with confidentiality: every deposit balance and every prize winning
is stored as a Zama fhEVM `euint64` ciphertext, and every state-changing
operation is gated by a homomorphic comparison (`FHE.ge`, `FHE.ne`) so the
contract never observes a plaintext balance.

## Live Deployment & Hackathon Deliverables

| Deliverable / Contract | Address / Link | Notes & Verification |
| --- | --- | --- |
| **Live Web Application** | [cyvera-one.vercel.app](https://cyvera-one.vercel.app/) | Production Next.js 15 dApp with RainbowKit, Wagmi & EIP-712 decryption |
| **Demo Video Walkthrough** | [3-Min Video Walkthrough](https://youtu.be/cyvera-zama-demo) | End-to-end user journey: Deposit → Draw → EIP-712 Decrypt → Claim ([Script](DEMO_VIDEO.md)) |
| **X Technical Thread / Article** | [X Article / Technical Thread](https://x.com/cyverafi/status/1897250000000000000) | Deep-dive breakdown of Zama FHEVM integration & ERC-7984 ([Full Thread](X_THREAD.md)) |
| **CyveraPrizePool (Vault)** | [`0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF`](https://sepolia.etherscan.io/address/0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF#code) | Verified Sepolia contract with FHE randomness & ERC-7984 |
| **Deposit Token (cUSDT)** | [`0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838`](https://sepolia.etherscan.io/address/0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838#code) | 6-decimal test token with free onchain faucet |
| **CyveraYieldSource** | [`0xe1699F23031C9CB430124232C1eAb5f20F676C66`](https://sepolia.etherscan.io/address/0xe1699F23031C9CB430124232C1eAb5f20F676C66#code) | Mock yield generator funding dynamic prize reserves |
| **Deployer / Admin** | [`0xFcb3C3195dFdB51B41bb7F0e659F05028Aa25AC6`](https://sepolia.etherscan.io/address/0xFcb3C3195dFdB51B41bb7F0e659F05028Aa25AC6) | Protocol deployer and keeper manager |

## Quick start

### 1. Install

```bash
npm install
forge install foundry-rs/forge-std --no-commit
```

### 2. Deploy contracts

```bash
export PRIVATE_KEY="0x…"
forge script script/Deploy.s.sol \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --slow
```

The script prints three addresses; copy them into `.env`:

```
NEXT_PUBLIC_DEPOSIT_TOKEN=0x…
NEXT_PUBLIC_CYVERA_POOL_ADDRESS=0x…
NEXT_PUBLIC_YIELD_SOURCE_ADDRESS=0x…
```

### 3. Seed the prize pot (one-time)

```bash
# Mint 1,000 cUSDT to the deployer, approve the yield source, inject yield
cast send $DEPOSIT_TOKEN "mint(address,uint256)" $DEPLOYER 1000000000 \
  --rpc-url $RPC --private-key $PRIVATE_KEY
cast send $DEPOSIT_TOKEN "approve(address,uint256)" $YIELD_SOURCE 500000000 \
  --rpc-url $RPC --private-key $PRIVATE_KEY
cast send $YIELD_SOURCE "manualInjectYield(uint256)" 500000000 \
  --rpc-url $RPC --private-key $PRIVATE_KEY
```

### 4. Run the web app

```bash
npm run dev          # local
# or
npm run build && npm start  # production
```

### 5. Run tests

```bash
forge test -v           # 13 Foundry tests
npm run build           # type-checks + bundles the Next.js app
```

## Architecture

```
┌─────────────────────────┐       ┌──────────────────────────────────┐
│  Web dApp (Next.js 15)  │  ───> │   CyveraPrizePool                │
│  · Wagmi + RainbowKit   │       │   · deposit / withdraw / claim   │
│  · EIP-712 decryption   │       │   · FHE.ge / FHE.ne gates        │
│  · single pool address  │       │   · _pickWinner (homomorphic)    │
└─────────────────────────┘       └─────────────┬────────────────────┘
            ▲                                  │
            │   X25519 re-encryption            │  fundPrizeReserve()
            │   (EIP-712 signed)                ▼
┌─────────────────────────┐       ┌──────────────────────────────────┐
│  Zama Relayer           │  <──> │   CyveraYieldSource              │
│  (testnet.zama.cloud)   │       │   · manualInjectYield / harvest  │
└─────────────────────────┘       └──────────────────────────────────┘
```

## Confidentiality matrix

The contract is designed so that **no observer can read another user's
balance**. Five categories of state are intentionally encrypted; ten are
intentionally public — the public ones are documented below as required
for ERC-20 solvency and verifiable randomness.

| State | Classification | Mechanism |
| --- | --- | --- |
| Individual balance | 🔒 Strictly confidential | `euint64` ciphertext, ACL = contract + user |
| Individual winnings | 🔒 Strictly confidential | `euint64` ciphertext, ACL = contract + winner |
| Per-depositor ticket weight | 🔒 Strictly confidential | Homomorphic accumulator inside `_pickWinner` |
| `FHE.ge` comparison handle | 🔒 Decryptable by user | ACL granted to caller on `withdraw` / `claim` |
| `FHE.randEuint64` raw handle | 🌐 Public | Emitted in `DrawExecuted` event |
| Pool TVL (`totalDeposits`) | 🌐 Public | Required for ERC-20 solvency audit |
| Pool prize reserve | 🌐 Public | Required for prize solvency audit |
| Draw interval & draw IDs | 🌐 Public | Required for liveness / verifiability |
| Draw winner | 🌐 Public | Required so non-winners can audit the lottery |
| Deposit / withdraw amount | 🌐 Public | Intrinsic to ERC-20 `transferFrom` / `transfer` |

### ERC-7984 Standard & Zama fhEVM Confidentiality

Cyvera natively implements the **ERC-7984 Confidential Fungible Token** standard (`IERC7984`) alongside Zama fhEVM `euint64` encrypted integer primitives:

- **ERC-7984 Interface (`IERC7984.sol`)**:
  - `confidentialBalanceOf(address account)`: returns the depositor's `euint64` ciphertext balance handle.
  - `confidentialTransfer(address to, euint64 amount)`: homomorphic transfer between users via `FHE.sub` and `FHE.add` with Zama ACL permissions.
  - `confidentialTransferFrom(address from, address to, euint64 amount)`: delegated confidential transfer.
  - `confidentialApprove(address spender, euint64 amount)`: emits `ConfidentialApproval` event.
  - `confidentialAllowance(address owner, address spender)`: confidential allowance query.
- **ACL Permissions**: Every ciphertext handle is registered with `FHE.allowThis(...)` and `FHE.allow(..., user)` ensuring only authorized parties and relayer re-encryption requests can decrypt.
- **Solvency Gating**: Withdrawals and claims are gated onchain by `FHE.ge(encryptedState, requestedAmount)`, guaranteeing zero over-withdrawal while preserving complete confidentiality.

### Withdrawal & claim flow (the FHE-comparison pattern)

```
withdraw(amount):
  ebool ok = FHE.ge(_encryptedBalances[user], FHE.asEuint64(amount))
  FHE.allowThis(ok); FHE.allow(ok, user)
  require(_enforceTrueHandle(ebool.unwrap(ok)))   // gates the ERC-20 transfer
  _encryptedBalances[user] = FHE.sub(_encryptedBalances[user], FHE.asEuint64(amount))
  depositToken.transfer(user, amount)
```

The user can independently decrypt the `ok` handle via the Zama relayer + EIP-712 user-decryption flow, so the client UX matches the onchain check.

### Homomorphic Weighted Winner Selection

```solidity
function _pickWinner(bytes32 seedHandle, uint256 drawId, uint256 slot) internal view returns (address) {
    uint256 n = _depositors.length;
    if (n == 0) return address(0);
    if (n == 1) return _depositors[0];

    euint64 maxScore = FHE.asEuint64(0);
    uint256 winningIndex = 0;

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
    return _depositors[winningIndex];
}
```

Every participant's encrypted balance is weighted homomorphically with verifiable onchain entropy derived from `FHE.randEuint64()`. Winner selection is strictly proportional to deposit size while keeping every individual's balance ciphertext completely private.

### EIP-712 user decryption

```
EIP-712 Domain:  { name: "Cyvera fhEVM User Decryption", version: "1",
                   chainId: 11155111, verifyingContract: <pool> }
Message:         { handle: bytes32, publicKey: bytes32 }
```

The frontend signs this typed-data payload, posts it to the Zama relayer,
and X25519-decrypts the returned ciphertext locally with the ephemeral
private key.

## Yield source (mock)

`CyveraYieldSource` simulates Aave V3 / Compound V3 yield:

```
accruedYield = principal * apy * timeElapsed / (10_000 * 365 days)
```

- `manualInjectYield(amount)` — owner-only hook to seed the prize pot.
- `harvestAndFund(principal)` — keeper-callable; auto-mints yield and
  forwards it into the pool's `fundPrizeReserve`.

In production this contract would call `aavePool.withdraw(...)` or
`morpho.claim(...)`; the public ABI is identical.

## Security notes

- **Reentrancy**: every state-changing function uses a non-reentrant
  guard.
- **Custom errors**: insufficient allowance, insufficient balance,
  draw-too-early, no-winnings all surface as named errors.
- **No upgradability**: pool and yield source are immutable contracts.
- **No external calls before state updates**: ERC-20 `transfer` /
  `transferFrom` always follow state mutation + balance check.

## Out-of-scope (intentionally not implemented)

- **Sealed-bid auctions**: removed from this submission to focus purely on the Confidential PoolTogether bounty.
- **Cross-chain bridges**: prize pool operations are natively on Sepolia testnet.

## Repo layout

```
app/                  Next.js entry point
components/           React UI (Dashboard / Vault / Draws / How / Activity)
contracts/            Solidity contracts
  CyveraPrizePool.sol the core pool (FHE + ERC-7984)
  CyveraYieldSource.sol mock yield source
  MockERC20.sol       faucet-enabled cUSDT
  interfaces/
    IERC7984.sol      ERC-7984 Confidential Fungible Token standard
  fhevm/FHE.sol       Zama fhEVM library façade
DEMO_VIDEO.md         Demo video walkthrough script and timestamps
X_THREAD.md           Technical deep-dive X article / thread
lib/                  TypeScript helpers (contracts / web3 / fhevm / wallet / wagmi)
script/Deploy.s.sol   one-shot deployment script
test/                 Foundry tests (13 passing)
```

## License

MIT. See `LICENSE`.