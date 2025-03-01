import { useState, useEffect } from "react";
import { createWalletFromMnemonic } from "@/utils/createAccount";
import type { StepStatus, WalletStep } from "@/types";
import { ChainType } from "@/types/chains";
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
  CHAIN: {
    number: 2,
    title: "Select Chain",
    description: "Choose the chain you want to use",
    heading: "Select Chain",
    headingDescription: "Choose the chain you want to use",
  },
  PASSWORD: {
    number: 3,
    title: "Set Password",
    description: "Create a strong password to secure your wallet",
    heading: "Set Password",
    headingDescription:
      "Create a strong password to protect your wallet and verify secret phrase.",
  },
  COMPLETE: {
    number: 4,
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
  const [selectedChain, setSelectedChain] = useState<ChainType | null>(null);

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

  const handleChainSelect = (chain: ChainType) => {
    setSelectedChain(chain);
    updateStepStatus(2, "complete");
    updateStepStatus(3, "current");
    setCurrentStep(3);
  };

  const handlePasswordConfirmed = async (password: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await createWalletFromMnemonic(
        selectedChain as ChainType,
        mnemonic,
        password
      );
      updateStepStatus(3, "complete");
      updateStepStatus(4, "current");
      setCurrentStep(4);
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
    selectedChain,
    handleChainSelect,
  };
}
