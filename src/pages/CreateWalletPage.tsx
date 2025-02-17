import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/create-wallet/StepIndicator";
import { PasswordSetup } from "@/components/create-wallet/PasswordSetup";
import { SuccessMessage } from "@/components/create-wallet/SuccessMessage";
import type { StepStatus, WalletStep } from "@/types";
import { SecretPhrase } from "@/components/SecretPhrase";
import { generateMnemonic } from "../utils/wallet";
const WALLET_STEPS = {
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

export function CreateWalletPage() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<WalletStep[]>(INITIAL_STEPS);

  useEffect(() => {
    generateNewWallet();
  }, []);

  const generateNewWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
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
    console.log(password);
    try {
      // TODO: Implement wallet creation with password
      await new Promise((resolve) => setTimeout(resolve, 2000));
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

  function CurrentStepContent() {
    switch (currentStep) {
      case 2:
        return (
          <PasswordSetup
            onConfirm={handlePasswordConfirmed}
            mnemonic={mnemonic}
          />
        );
      case 3:
        return <SuccessMessage />;
      default:
        return <SecretPhrase phrase={mnemonic} onConfirm={handleConfirm} />;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Generating your wallet...</p>
        <p className="text-sm text-muted-foreground">
          This may take a few seconds
        </p>
      </div>
    );
  }

  const { title, description } = getStepHeading();

  return (
    <div className="container max-w-2xl mx-auto p-5 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
      </div>

      <StepIndicator steps={steps} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewWallet}
              className="ml-4"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="">
        <CurrentStepContent />
      </div>
    </div>
  );
}
