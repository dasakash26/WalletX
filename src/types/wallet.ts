export interface Wallet {
  publicKey?: string;
  name?: string;
  chain: string;
}

export interface WalletContextType {
  wallets: Wallet[] | null;
  setWallets: (wallets: Wallet[]) => void;
}

export type WalletImportType = "phrase" | "privateKey";

export interface ImportedWallet {
  address: string;
  privateKey: string;
}
