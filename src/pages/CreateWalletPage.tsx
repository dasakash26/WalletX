import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/create-wallet/StepIndicator";
import { PasswordSetup } from "@/components/create-wallet/PasswordSetup";
import { SuccessMessage } from "@/components/create-wallet/SuccessMessage";
import { SecretPhrase } from "@/components/SecretPhrase";
import { useWalletCreation } from "@/hooks/useWalletCreation";

export function CreateWalletPage() {
  const {
    mnemonic,
    isLoading,
    error,
    currentStep,
    steps,
    generateNewWallet,
    handleConfirm,
    handlePasswordConfirmed,
    getStepHeading,
  } = useWalletCreation();

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
