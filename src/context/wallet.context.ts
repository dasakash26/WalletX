import { createContext, useContext } from "react";
import { Wallet } from "@/types/wallet";

export type WalletContextType = {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  passWord: string;
  setPassWord: (password: string) => void;
};

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  passWord: "",
  setWallet: () => null,
  setPassWord: () => "",
});

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
