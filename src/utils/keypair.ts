import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function createKeypairFromPrivateKey(privateKeyString: string): Keypair {
  try {
    // First try to decode if it's a base58 string
    let privateKeyBytes: Uint8Array;

    try {
      privateKeyBytes = bs58.decode(privateKeyString);
    } catch {
      // If not base58, try to parse as hex
      if (privateKeyString.startsWith("0x")) {
        privateKeyString = privateKeyString.slice(2);
      }
      privateKeyBytes = new Uint8Array(
        privateKeyString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ||
          []
      );
    }

    // Validate private key length
    if (privateKeyBytes.length !== 64) {
      throw new Error("Private key must be 64 bytes");
    }

    return Keypair.fromSecretKey(privateKeyBytes);
  } catch (error: any) {
    throw new Error(`Invalid private key format: ${error.message}`);
  }
}
