export interface Wallet {
  publicKey: string;
  privateKey: string;
  chain: string;
}

export interface WalletContextType {
  wallet: Wallet;
  setWallet: (wallet: Wallet) => void;
}
