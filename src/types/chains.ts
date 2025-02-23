export enum ChainType {
  SOLANA = "SOLANA",
  ETHEREUM = "ETHEREUM",
  BITCOIN = "BITCOIN",
}

export interface WalletKey {
  address: string;
  privateKey: string;
}
