import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

function keyPairFromPrivateKey(privateKey: string): Keypair {
  try {
    const decodedKey = bs58.decode(privateKey);
    const keypair = Keypair.fromSecretKey(decodedKey);
    return keypair;
  } catch (e) {
    console.error("Error deriving Solana key:", e);
    throw new Error("Error deriving Solana key");
  }
}

const key =
  "32oCBbVrVGnuS955bqASknaswPPz9CmZSN7HDpaE1Cou1hDKeRM1tTBCr1wxuGXPyD5Cuy9LqTasWkrvs4sAXETF";

console.log(keyPairFromPrivateKey(key));
