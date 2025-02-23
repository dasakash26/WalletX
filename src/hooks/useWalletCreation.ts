import { useState, useEffect } from "react";
import { deriveWalletKey } from "@/utils/createAccount";
import type { StepStatus, WalletStep } from "@/types";
import { ChainType } from "@/types/chains";
import { saveWallet } from "@/utils/storage";
import { generateMnemonic } from "bip39";

export const WALLET_STEPS = {
  GENERATE: {
    number: 1,
    title: "Generate Recovery Phrase",
    description: "We're creating your unique 12-word recovery phrase",
    heading: "Create New Wallet",
    headingDescription:
      "Secure your funds with a new wallet. Make sure to backup your recovery phrase.",
  },
  PASSWORD: {
    number: 2,
    title: "Set Password",
    description: "Create a strong password to secure your wallet",
    heading: "Set Password",
    headingDescription:
      "Create a strong password to protect your wallet and verify secret phrase.",
  },
  COMPLETE: {
    number: 3,
    title: "Wallet Created",
    description: "Your wallet is ready to use",
    heading: "Wallet Created Successfully",
    headingDescription:
      "Your new wallet is ready to use. You can now start using it.",
  },
} as const;

const INITIAL_STEPS: WalletStep[] = Object.values(WALLET_STEPS).map((step) => ({
  number: step.number,
  title: step.title,
  description: step.description,
  status: step.number === 1 ? "current" : "pending",
}));

export function useWalletCreation() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<WalletStep[]>(INITIAL_STEPS);

  const generateNewWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Using generateMnemoSnic with the global Buffer now available
      const phrase = generateMnemonic();
      setMnemonic(phrase);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to generate wallet: ${errorMessage}`);
      console.error("Failed to generate mnemonic:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateNewWallet();
  }, []);

  const updateStepStatus = (stepNumber: number, status: StepStatus) => {
    setSteps(
      steps.map((step) =>
        step.number === stepNumber ? { ...step, status } : step
      )
    );
  };

  const handleConfirm = async (): Promise<void> => {
    updateStepStatus(1, "complete");
    updateStepStatus(2, "current");
    setCurrentStep(2);
    return Promise.resolve();
  };

  const handlePasswordConfirmed = async (password: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await create3Wallets(mnemonic, password);
      updateStepStatus(2, "complete");
      updateStepStatus(3, "current");
      setCurrentStep(3);
      console.log("Wallet created with password");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to create wallet: ${errorMessage}`);
      console.error("Failed to create wallet:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getStepHeading = () => {
    const step =
      Object.values(WALLET_STEPS).find((s) => s.number === currentStep) ??
      WALLET_STEPS.GENERATE;

    return {
      title: step.heading,
      description: step.headingDescription,
    };
  };

  return {
    mnemonic,
    isLoading,
    error,
    currentStep,
    steps,
    generateNewWallet,
    handleConfirm,
    handlePasswordConfirmed,
    getStepHeading,
  };
}

async function create3Wallets(mnemonic: string, password: string) {
  const solanaKey = deriveWalletKey(ChainType.SOLANA, mnemonic);
  if (!solanaKey) {
    throw new Error("Failed to derive wallet key");
  }

  console.log("solanaKey:", solanaKey);

  const resSol = await saveWallet(
    solanaKey.privateKey,
    password,
    solanaKey.address,
    ChainType.SOLANA
  );
  if (!resSol) {
    throw new Error("Failed to save wallet");
  }
  //   //create Eth wallet
  //   const ethKey = deriveWalletKey(ChainType.SOLANA, mnemonic);
  //   //save
  //   const resEth = await saveWallet(
  //     ethKey.privateKey,
  //     password,
  //     ethKey.address,
  //     ChainType.ETHEREUM
  //   );
  //   if (!resEth) {
  //     throw new Error("Failed to save wallet");
  //   }

  //   //create btc wallet
  //   const btcKey = deriveWalletKey(ChainType.BITCOIN, mnemonic);
  //   const resBtc = await saveWallet(
  //     btcKey.privateKey,
  //     password,
  //     btcKey.address,
  //     ChainType.BITCOIN
  //   );
  //   if (!resBtc) {
  //     throw new Error("Failed to save wallet");
  //   }
}
