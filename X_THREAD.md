# X / Twitter launch thread (7 tweets)

> **AuraPool** — Confidential No-Loss Prize Savings, built on Zama FHE for the Mainnet Season 4 bounty.
> Replace the bracketed placeholders with the live URL when posting.

---

### 1/7
🧵 Today I'm shipping **AuraPool** for the @zama_fhe Season 4 bounty — a no-loss prize-savings protocol where every deposit, balance, and winning ticket is encrypted end-to-end with Fully Homomorphic Encryption.

Imagine PoolTogether, but nobody can see your savings or your odds. 👇

### 2/7
On transparent chains, prize-savings leaks *everything*:
• Your deposit is public on Etherscan
• Big winners become instant phishing targets
• Whales get tracked → exit the pool → yield dries up

AuraPool fixes this with Zama's fhEVM. Balances live as `euint64` ciphertexts; only the wallet holder can decrypt via EIP-712.

### 3/7
How the deposit flow works:
1. Approve cUSDT spend on the prize pool
2. `deposit(amount)` — the contract encrypts the amount homomorphically and increments your private ticket balance
3. ACL is set so **only your wallet** can request a re-encryption of the handle from the Zama relayer

You can audit every step on Sepolia: [etherscan link]

### 4/7
Draws run **onchain** with `FHE.randEuint64`. The randomness is bound to `block.prevrandao + block.timestamp` and committed via the `DrawExecuted` event so the outcome is verifiable after the fact.

Winners are picked with a salted sub-ticket per slot — the pool walks the cumulative encrypted balances (via the relayer) and credits the winner's encrypted winnings handle. Multi-winner draws are configurable.

### 5/7
User experience:
• 1-click faucet for the test cUSDT
• EIP-712 "Reveal Balance" — wallet signs, relayer re-encrypts, frontend decrypts locally
• "Check if you won" on the draws page
• "Claim" or "Compound" winnings
• "Withdraw All" — exit with 100% of your principal. Zero loss, zero lockups.

### 6/7
Confidentiality, in one table:

| What | Visibility |
| --- | --- |
| Your deposit / balance | 🔒 Encrypted euint64 |
| Your winnings | 🔒 Encrypted until you claim |
| Winner address | 🌐 Public (needed for claim) |
| Prize amount per draw | 🌐 Public (PoolTogether does this too) |
| Total pool TVL | 🌐 Public aggregate |

No offchain RNG. No plaintext mirrors. The only public aggregate is the total pool size, which is required for routing yield strategies.

### 7/7
Live demo: [aurapool.vercel.app]
Code: github.com/Oluwa-Laughter/aurapool
Built with @zama_fhe fhEVM, Solidity 0.8.20, Next.js 15, Foundry, wagmi/viem.

If you think privacy-preserving DeFi is the next unlock for consumer crypto, try the app and let me know what you'd add next. 🏆
