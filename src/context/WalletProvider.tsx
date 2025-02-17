import React, { createContext, useState, useContext } from "react";
import { Keypair } from "@solana/web3.js";

interface WalletContextType {
  wallet: Keypair | null;
  setWallet: (wallet: Keypair | null) => void;
}

export const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Keypair | null>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
