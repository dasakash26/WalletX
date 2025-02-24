import { useState } from "react";
import { motion } from "framer-motion";
import { useWalletImport } from "../hooks/useWalletImport";
import { WalletImportType } from "../types/wallet";
import { MnemonicDisplay } from "../components/wallet-import/MnemonicDisplay";
import { CheckCircleIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { WalletInput } from "@/components/wallet-import/WalletInput";
import { ImportTypeSelect } from "@/components/wallet-import/ImportTypeSelect";
import { ChainSelect } from "@/components/wallet-import/ChainSelect";
import { Input } from "@/components/ui/input";

const ImportWalletPage = () => {
  const [importType, setImportType] = useState<WalletImportType>("phrase");
  const [input, setInput] = useState("");
  const [selectedChain, setSelectedChain] = useState("solana");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { importWallet, error } = useWalletImport();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const canProceed: Record<1 | 2 | 3, boolean> = {
    1: selectedChain !== "",
    2: importType && input !== "",
    3: password.length >= 1,
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const wallet = await importWallet(importType, input, {
        chain: selectedChain,
        password,
      });
      if (wallet) {
        setIsSuccess(true);
        if (importType === "phrase") {
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Blockchain</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Choose the blockchain network for your wallet
            </p>
            <ChainSelect value={selectedChain} onChange={setSelectedChain} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Import Method</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Choose how you want to import your wallet
            </p>
            <ImportTypeSelect value={importType} onChange={setImportType} />
            <WalletInput
              value={input}
              onChange={setInput}
              type={importType}
              errors={error ? [error] : undefined}
            />
            {importType === "phrase" && input && (
              <MnemonicDisplay words={input.trim().split(" ")} />
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Set Password</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Create a password to secure your wallet
            </p>
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter wallet password"
                className="w-full"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        {/* Header with Progress */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Import Wallet
          </h1>
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-16 rounded-full transition-colors ${
                  idx + 1 <= currentStep ? "bg-primary" : "bg-primary/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-background border border-border/50 rounded-2xl shadow-sm p-8"
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border/50">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep === totalSteps ? (
              <motion.button
                onClick={handleImport}
                disabled={isLoading || !canProceed[currentStep]}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  px-8 py-2 rounded-lg text-primary-foreground font-medium
                  transition-all ${
                    isLoading || !canProceed[currentStep]
                      ? "bg-primary/70 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }
                `}
              >
                {isLoading ? "Importing..." : "Import Wallet"}
              </motion.button>
            ) : (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed[currentStep as 1 | 2 | 3]}
                className="flex items-center gap-2 text-primary hover:text-primary/90 disabled:opacity-50"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Success Message */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-success/10 text-success rounded-lg flex items-center justify-center gap-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>Wallet imported successfully!</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImportWalletPage;
