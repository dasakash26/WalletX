export enum ChainType {
  SOLANA = "solana",
  ETHEREUM = "ethereum",
  BITCOIN = "bitcoin",
}

export interface WalletKey {
  address: string;
  privateKey: string;
}
