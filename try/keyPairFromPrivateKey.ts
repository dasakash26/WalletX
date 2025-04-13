import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

function keyPairFromPrivateKey(privateKey: string): Keypair {
  try {
    // Check if the key is a hex string (only contains 0-9, a-f, A-F)
    if (/^[0-9a-fA-F]+$/.test(privateKey)) {
      // Convert hex string to Uint8Array
      console.log("Hex");
      const hexToUint8Array = (hex: string): Uint8Array => {
        if (hex.length % 2 !== 0) {
          throw new Error("Hex string must have an even number of characters");
        }
        const byteArray = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          byteArray[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return byteArray;
      };

      const secretKey = hexToUint8Array(privateKey);
      return Keypair.fromSecretKey(secretKey);
    } else {
      // Assume it's a base58 encoded key
      console.log("Base58");
      const decodedKey = bs58.decode(privateKey);
      return Keypair.fromSecretKey(decodedKey);
    }
  } catch (e) {
    console.error("Error deriving Solana key:", e);
    throw new Error("Error deriving Solana key");
  }
}

const key =
  "5119038b6e06366193a1c221e5d9777f85b6a54c67a37e4e6c293f566daa52ffc3cc6cd14051b3c3bde1098c6a1f767c2b5cb6713f0fbdf36c65075a8ed0f5fd";

console.log(keyPairFromPrivateKey(key));
