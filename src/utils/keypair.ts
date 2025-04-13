import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function createKeypairFromPrivateKey(privateKeyString: string): Keypair {
  try {
    let privateKeyBytes: Uint8Array;

    if (privateKeyString.startsWith("0x")) {
      console.log("Private key starts with 0x, removing it");
      privateKeyString = privateKeyString.slice(2);
    }

    if (/^[0-9a-fA-F]+$/.test(privateKeyString)) {
      console.log("Private key is in hex format");
      privateKeyBytes = new Uint8Array(privateKeyString.length / 2);
      for (let i = 0; i < privateKeyString.length; i += 2) {
        privateKeyBytes[i / 2] = parseInt(
          privateKeyString.substring(i, i + 2),
          16
        );
      }
    } else {
      try {
        console.log("Private key is in base58 format");
        privateKeyBytes = bs58.decode(privateKeyString);
      } catch (error) {
        throw new Error("Invalid base58 string");
      }
    }

    if (privateKeyBytes.length !== 64) {
      throw new Error("Private key must be 64 bytes");
    }

    return Keypair.fromSecretKey(privateKeyBytes);
  } catch (error: any) {
    throw new Error(`Invalid private key format: ${error.message}`);
  }
}
