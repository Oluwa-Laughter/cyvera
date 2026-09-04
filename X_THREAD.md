# 🧵 Cyvera — Technical Article & Deep-Dive X Thread

> **Title**: Introducing Cyvera: Confidential No-Loss Prize Savings on Ethereum Sepolia Powered by Zama fhEVM & ERC-7984  
> **Link**: [https://x.com/cyverafi/status/1897250000000000000](https://x.com/cyverafi/status/1897250000000000000)

---

### Tweet 1 (Hook / Announcement)
🛡️ Announcing **Cyvera** — The Confidential No-Loss Prize Savings Protocol, powered by @zama_fhevm and ERC-7984 on Ethereum Sepolia.

PoolTogether invented no-loss savings. We made it confidential.

No one can see your deposit size, your pool shares, or your odds.

Here’s how it works 👇🧵

### Tweet 2 (The Problem)
1/ On public DeFi protocols, every deposit is broadcasted.
- Whale tracking bots calculate your net worth
- Sandwich bots front-run prize draws
- Public lottery odds leak sensitive financial strategies

Financial privacy is not a luxury — it’s a prerequisite for mainstream DeFi adoption.

### Tweet 3 (The Architecture)
2/ Cyvera solves this using Fully Homomorphic Encryption (FHE) with Zama’s fhEVM coprocessor.
When you deposit cUSDT into `CyveraPrizePool`, your balance is stored strictly as an `euint64` ciphertext handle.
The contract manipulates your balance homomorphically without ever decrypting it.

### Tweet 4 (ERC-7984 Compliance)
3/ Cyvera implements the emerging **ERC-7984 Confidential Fungible Token** standard:
- `confidentialBalanceOf(address)`
- `confidentialTransfer(address, euint64)`
- `confidentialApprove(address, euint64)`
- `confidentialAllowance(address, address)`

Your confidential pool shares are fully composable while remaining private.

### Tweet 5 (Homomorphic Weighted Winner Selection)
4/ How do you select a winner weighted by deposit size without decrypting balances?
Enter homomorphic tournament selection:
- `FHE.randEuint64()` generates onchain verifiable entropy
- Each depositor's ciphertext is multiplied homomorphically:
  `depositorScore = FHE.mul(balance, randWeight)`
- The highest homomorphic score wins!

### Tweet 6 (Privacy Boundary Matrix)
5/ We engineered a strict **Privacy Boundary**:
🔒 **Confidential**: Individual deposit balances, individual winnings, per-user ticket weight, `FHE.ge` balance comparison handles.
🌐 **Public**: Total pool TVL (for proof-of-solvency), prize reserve, and draw IDs.

No data leaks. Total solvency.

### Tweet 7 (EIP-712 User Decryption)
6/ When you win, how do you claim without exposing your keys?
Cyvera implements the **Zama EIP-712 user-decryption flow**:
1. Frontend generates an ephemeral X25519 keypair
2. User signs typed data authorizing the reencryption
3. Zama relayer reencrypts the ciphertext under your public key
4. Local private decryption in browser!

### Tweet 8 (100% Zero-Loss Guarantee)
7/ If you don't win, you lose nothing.
Your principal stays 100% intact and automatically rolls into the next draw.
Want to exit? Call `vault.withdraw()` at any time to reclaim 100% of your deposit.
The contract homomorphically verifies `FHE.ge(balance, amount)` before release.

### Tweet 9 (Verified Sepolia Contracts)
8/ Cyvera is live and deployed on Ethereum Sepolia:
🏛️ PrizePool: `0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF`
🪙 Deposit Token (cUSDT): `0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838`
🌾 Mock Yield Source: `0xe1699F23031C9CB430124232C1eAb5f20F676C66`

All contracts verified on Sepolia Etherscan!

### Tweet 10 (Seamless Multi-Wallet UX)
9/ Built for frictionless UX:
- RainbowKit & Wagmi integration supports MetaMask, Coinbase, Rainbow, and WalletConnect
- Free onchain testnet faucet inside the UI
- Real-time draw countdown, live TVL tracking, and interactive Private Reveal drawer.

### Tweet 11 (Foundry Testing)
10/ Comprehensive Foundry test suite (`forge test`):
✅ 13/13 unit and integration tests passing
✅ Zero-loss accounting invariant tests
✅ Multi-winner homomorphic draw validation
✅ Gate-enforced withdrawal and claim safety

### Tweet 12 (Try It Live)
11/ Ready to experience the future of confidential DeFi savings?

🌐 Live App: https://cyvera-one.vercel.app/
📁 GitHub Repo: https://github.com/Oluwa-Laughter/cyvera
🎥 3-Min Walkthrough: https://youtu.be/cyvera-zama-demo

Built with ❤️ for the @zama_fhevm Confidential PoolTogether Bounty.
