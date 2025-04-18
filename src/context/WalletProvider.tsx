import { useState, ReactNode } from "react";
import { WalletContext } from "./wallet.context";
import { Wallet } from "@/types/wallet";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [passWord, setPassWord] = useState<string>("");

  return (
    <WalletContext.Provider
      value={{ wallets, setWallets, passWord, setPassWord }}
    >
      {children}
    </WalletContext.Provider>
  );
}
