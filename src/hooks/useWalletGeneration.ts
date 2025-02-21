import { useState, useEffect } from "react";
import { deriveSolanaKey } from "@/utils/createAccount.ts";

export function useWalletGeneration() {
  const [mnemonic, setMnemonic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [copied, setCopied] = useState<"public" | "private" | null>(null);
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);

  useEffect(() => {
    const words = mnemonic.trim().split(/\s+/).filter(Boolean);
    setMnemonicWords(words);
  }, [mnemonic]);

  const generateWallet = () => {
    try {
      setIsGenerating(true);
      console.log("Generating wallet...");
      const key = deriveSolanaKey(mnemonic);
      console.log("Generated wallet:", key);
      setPublicKey(key.address);
      setPrivateKey(key.privateKey);
    } catch (error) {
      console.error("Error generating wallet:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: "public" | "private") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return {
    mnemonic,
    setMnemonic,
    isGenerating,
    publicKey,
    privateKey,
    copied,
    mnemonicWords,
    generateWallet,
    copyToClipboard,
  };
}
