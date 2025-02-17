import { Keypair } from "@solana/web3.js";

export interface BaseWallet {
  publicKey: string;
  privateKey: string;
  chain: string;
}

export interface SolanaWallet extends BaseWallet {
  chain: "SOLANA";
  keypair: Keypair;
}

export interface OtherWallet extends BaseWallet {
  chain: "ETHEREUM" | "BITCOIN";
}

export type Wallet = SolanaWallet | OtherWallet;
