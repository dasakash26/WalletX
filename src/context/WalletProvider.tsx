import { useState, ReactNode } from "react";
import { WalletContext } from "./wallet.context";
import { Wallet } from "@/types/wallet";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
