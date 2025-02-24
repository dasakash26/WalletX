import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorAlert } from "./ErrorAlert";
import { cn } from "@/lib/utils";
import { PasswordSetupProps, FormState } from "@/types/password-setup";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import { VerificationStep } from "./VerificationStep";
import { PasswordStep } from "./PasswordStep";
import { ExistingWalletAlert } from "./ExistingWalletAlert";

interface ExistingWalletAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

export function PasswordSetup({ onConfirm, mnemonic }: PasswordSetupProps) {
  const [formState, setFormState] = useState<FormState>({
    firstWord: "",
    lastWord: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { validation, setValidation, validateField } =
    usePasswordValidation(mnemonic);
  const [currentStep, setCurrentStep] = useState(1);
  const mnemonicWords = mnemonic.split(" ");
  const actualFirstWord = mnemonicWords[0];
  const actualLastWord = mnemonicWords[mnemonicWords.length - 1];
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (currentStep === 2) {
      setShowWarning(true);
    }
  }, [currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);

    setValidation((prev) => ({
      ...prev,
      [name]: validateField(name, value, { ...formState, [name]: value }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formState.firstWord !== actualFirstWord ||
      formState.lastWord !== actualLastWord
    ) {
      setError(
        "The words don't match your recovery phrase. Please verify you have stored it correctly."
      );
      return;
    }

    if (formState.password.length < 1) {
      setError("Password must be at least 1 characters");
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await onConfirm(formState.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set password");
    }
  };

  return (
    <>
      <ExistingWalletAlert
        open={showWarning}
        onOpenChange={setShowWarning}
        title="Important Password Notice"
        description="If you already have a wallet, you MUST use the same password. Using a different password will result in loss of access to your existing wallet."
        onConfirm={() => {
          setShowWarning(false);
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg mx-auto bg-background/60 backdrop-blur-xl border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Secure Your Wallet
            </CardTitle>
            <div className="flex justify-center items-center gap-2 mt-4">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-24 h-1 rounded-full transition-all duration-300",
                    currentStep >= step ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <VerificationStep
                    formState={formState}
                    validation={validation}
                    onChange={handleChange}
                    onNext={() => setCurrentStep(2)}
                  />
                ) : (
                  <PasswordStep
                    formState={formState}
                    validation={validation}
                    onChange={handleChange}
                    onBack={() => setCurrentStep(1)}
                  />
                )}
              </AnimatePresence>

              <ErrorAlert error={error} />
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
