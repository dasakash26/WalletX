import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { WalletImportType, ImportedWallet } from "../types/wallet";

export const useWalletImport = () => {
  const [error, setError] = useState<string | null>(null);

  const importFromPhrase = async (phrase: string): Promise<ImportedWallet> => {
    try {
      if (!bip39.validateMnemonic(phrase)) {
        throw new Error("Invalid recovery phrase");
      }
      const seed = await bip39.mnemonicToSeed(phrase);
      const derivedPath = "m/44'/501'/0'/0'";
      const keypair = Keypair.fromSeed(
        derivePath(derivedPath, seed.toString("hex")).key
      );
      return {
        publicKey: keypair.publicKey.toString(),
        secretKey: keypair.secretKey,
      };
    } catch (err) {
      throw new Error("Failed to import from recovery phrase");
    }
  };

  const importFromPrivateKey = (privateKey: string): ImportedWallet => {
    try {
      const decoded = new Uint8Array(Buffer.from(privateKey, "hex"));
      const keypair = Keypair.fromSecretKey(decoded);
      return {
        publicKey: keypair.publicKey.toString(),
        secretKey: keypair.secretKey,
      };
    } catch (err) {
      throw new Error("Invalid private key");
    }
  };

  const importWalletForChain = async (
    type: WalletImportType,
    input: string,
    options: { chain: string; password: string }
  ) => {
    // Implement chain-specific wallet import logic here
    return type === "phrase"
      ? await importFromPhrase(input.trim())
      : importFromPrivateKey(input.trim());
  };

  const importWallet = async (
    type: WalletImportType,
    input: string,
    options: { chain: string; password: string }
  ) => {
    setError(null);
    try {
      // Add validation for password
      if (!options.password || options.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Implement chain-specific wallet import logic here
      const wallet = await importWalletForChain(type, input, options);
      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import wallet");
      return null;
    }
  };

  return { importWallet, error };
};
