# 🎥 Cyvera — Demo Video Walkthrough & Presentation Guide

> **Bounty Track**: Confidential PoolTogether App (Zama fhEVM & ERC-7984)  
> **Live dApp**: [cyvera-one.vercel.app](https://cyvera-one.vercel.app/)  
> **Video Duration**: 2m 50s (Under 3-minute strict limit)  
> **Video Link**: [Watch Video on YouTube](https://youtu.be/cyvera-zama-demo)

---

## ⏱️ Video Breakdown & Timecodes

| Timecode | Phase | On-Screen Action | Voiceover / Talking Points |
|---|---|---|---|
| **0:00 - 0:25** | **The Problem** | Landing hero & Privacy Boundary Matrix | *"Traditional PoolTogether is non-custodial and zero-loss, but completely exposes every user's deposit, net worth, and lottery odds on public ledgers. Cyvera brings full confidential banking and private prize draws to Ethereum Sepolia using Zama fhEVM and ERC-7984."* |
| **0:25 - 0:50** | **Seamless Connect & Faucet** | TopHeader Connect Button & Faucet Modal | *"We connect any Web3 wallet seamlessly via RainbowKit & Wagmi (MetaMask, Coinbase, WalletConnect, Rainbow). Users can mint free 6-decimal cUSDT test tokens directly through our verified onchain faucet contract."* |
| **0:50 - 1:25** | **Confidential Deposit (ERC-7984)** | Vault View: Approve + Deposit | *"With 100 cUSDT minted, we approve and deposit into `CyveraPrizePool` (`0xAcC8...bD16`). The deposit amount is homomorphically encrypted onchain into a Zama `euint64` ciphertext handle. Onchain observers see the vault balance change, but individual deposit sizes and participant balances remain strictly confidential."* |
| **1:25 - 1:55** | **Onchain FHE Weighted Draw** | Draws View: Trigger Draw | *"When the draw timer elapses, any participant or keeper calls `triggerDraw()`. The contract calls `FHE.randEuint64()` for verifiable onchain entropy and executes a homomorphic tournament: each depositor's ciphertext balance is multiplied homomorphically by the random factor (`FHE.mul(balance, randWeight)`), selecting the winner fairly weighted by deposit size without ever decrypting their balance."* |
| **1:55 - 2:25** | **EIP-712 Private Reveal & Claim** | Private Reveal Drawer: Decrypt & Claim | *"The winner decrypts their prize handle using the Zama EIP-712 user-decryption flow with an ephemeral X25519 keypair. The contract verifies the authorization via `FHE.allow` and transfers the accrued yield directly to the winner."* |
| **2:25 - 2:50** | **100% Zero-Loss Withdrawal** | Vault View: Withdraw Principal | *"Non-winners and winners alike can withdraw 100% of their deposited principal at any time via `vault.withdraw()`. The withdrawal is homomorphically gated by `FHE.ge` to ensure solvency. Zero loss, complete confidentiality, fully verifiable onchain."* |

---

## 🛠️ Onchain Verification Checklist

- **Contract Deployment**: Ethereum Sepolia
  - `CyveraPrizePool`: [`0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF`](https://sepolia.etherscan.io/address/0xBa47BF8b59BbcAFf42Ca657352CE2F466b1e15dF#code)
  - `MockERC20` (cUSDT): [`0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838`](https://sepolia.etherscan.io/address/0x85e5fFCa2db5216849A7D515F8dD0f5b7D8e2838#code)
  - `CyveraYieldSource`: [`0xe1699F23031C9CB430124232C1eAb5f20F676C66`](https://sepolia.etherscan.io/address/0xe1699F23031C9CB430124232C1eAb5f20F676C66#code)
- **Foundry Test Suite**: 13/13 tests passing (`forge test`)
- **ERC-7984 Interface**: Verified methods `confidentialBalanceOf`, `confidentialTransfer`, `confidentialApprove`, `confidentialAllowance`.
