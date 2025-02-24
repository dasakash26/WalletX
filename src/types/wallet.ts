export interface Wallet {
  publicKey?: string;
  name?: string;
}

export interface WalletContextType {
  wallets: Wallet[] | null;
  setWallets: (wallets: Wallet[]) => void;
}

export type WalletImportType = "phrase" | "privateKey";

export interface ImportedWallet {
  publicKey: string;
  secretKey: Uint8Array;
}
