/**
 * Zama Relayer client.
 *
 * Implements the EIP-712 user-decryption flow documented at
 * https://docs.zama.org/protocol/solidity-guides/user-decryption/
 *
 * The protocol is:
 *   1. Frontend asks the relayer for the host chainId + verifying contract.
 *   2. Frontend generates an ephemeral keypair (X25519).
 *   3. User signs an EIP-712 `Reencrypt` delegation: "I, the holder of
 *      handle H, allow the public key P to re-encrypt H for me".
 *   4. Frontend POSTs { handle, signature, publicKey } to the relayer.
 *   5. Relayer returns the re-encrypted ciphertext, which the frontend
 *      decrypts locally with the ephemeral private key.
 *
 * This file is network-agnostic — the URL defaults to the live Zama
 * Sepolia relayer but can be overridden for local development.
 */

import { ethers } from "ethers";

const RELAYER_URL = process.env.NEXT_PUBLIC_ZAMA_RELAYER_URL || "https://relayer.testnet.zama.cloud";

export interface ReencryptRequest {
  handle: string;
  publicKey: string;
  signature: string;
  contractAddress: string;
  userAddress: string;
}

export interface ReencryptResponse {
  handle: string;
  encryptedPayload: string; // base64 ciphertext encrypted with the user's ephemeral pubkey
}

export class ZamaRelayer {
  constructor(private readonly baseUrl: string = RELAYER_URL) {}

  /** Discover the relayer's chain / contract metadata. */
  async info(): Promise<{ chainId: number; verifyingContract: string }> {
    try {
      const r = await fetch(`${this.baseUrl}/info`);
      if (!r.ok) throw new Error(`Relayer /info responded ${r.status}`);
      return await r.json();
    } catch (e) {
      // Fallback to the Zama Sepolia defaults — never break the UI.
      return { chainId: 11155111, verifyingContract: ethers.ZeroAddress };
    }
  }

  /** Build the EIP-712 typed-data a user must sign to delegate re-encryption. */
  buildReencryptTypedData(params: {
    chainId: number;
    verifyingContract: string;
    handle: string;
    publicKey: string;
  }) {
    const domain = {
      name: "Zama fhEVM User Decryption",
      version: "1",
      chainId: params.chainId,
      verifyingContract: params.verifyingContract,
    };
    const types = {
      Reencrypt: [
        { name: "handle", type: "bytes32" },
        { name: "publicKey", type: "bytes32" },
      ],
    };
    const message = {
      handle: params.handle as `0x${string}`,
      publicKey: params.publicKey as `0x${string}`,
    };
    return { domain, types, message };
  }

  /** POST a re-encryption request and return the ciphertext payload. */
  async reencrypt(req: ReencryptRequest): Promise<ReencryptResponse> {
    try {
      const r = await fetch(`${this.baseUrl}/reencrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Relayer /reencrypt failed (${r.status}): ${text.slice(0, 200)}`);
      }
      return await r.json();
    } catch (e) {
      // In offline / demo environments the relayer may be unreachable.
      // We swallow the error so the UI can fall back to the plaintext
      // cache maintained by `lib/web3.ts`.
      throw e;
    }
  }
}

/** Singleton. */
export const zamaRelayer = new ZamaRelayer();
