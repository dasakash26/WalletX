import { useState } from "react";
import { WalletImportType } from "../types/wallet";
import {
  createWalletFromMnemonic,
  importFromPrivateKey,
} from "@/utils/createAccount";
import { ChainType } from "@/types/chains";

export const useWalletImport = () => {
  const [error, setError] = useState<string | null>(null);

  const importWallet = async (
    type: WalletImportType,
    input: string,
    options: { chain: string; password: string }
  ) => {
    setError(null);
    try {
      if (!options.password || options.password.length < 2) {
        throw new Error("Password must be at least 8 characters long");
      }
      options.chain = options.chain.toLocaleUpperCase();
      const wallet =
        type === "phrase"
          ? await createWalletFromMnemonic(
              options.chain as ChainType,
              input.trim(),
              options.password
            )
          : importFromPrivateKey(
              options.chain as ChainType,
              input.trim(),
              options.password
            );

      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import wallet");
      return null;
    }
  };

  return { importWallet, error };
};
