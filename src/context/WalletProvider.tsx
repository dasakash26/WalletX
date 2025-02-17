import { createContext, useContext, useState, ReactNode } from "react";
import { SolanaWallet, OtherWallet } from "@/types/wallet";

type Wallet = SolanaWallet | OtherWallet | null;

interface WalletContextType {
  wallet: Wallet;
  setWallet: (wallet: Wallet) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
