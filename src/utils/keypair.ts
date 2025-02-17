import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function createKeypairFromPrivateKey(privateKeyString: string): Keypair {
  const privateKeyBytes = bs58.decode(privateKeyString);
  return Keypair.fromSecretKey(privateKeyBytes);
}
