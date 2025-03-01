import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWalletImport } from "../hooks/useWalletImport";
import { WalletImportType } from "../types/wallet";
import { MnemonicDisplay } from "../components/wallet-import/MnemonicDisplay";
import { CheckCircleIcon, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { WalletInput } from "@/components/wallet-import/WalletInput";
import { ImportTypeSelect } from "@/components/wallet-import/ImportTypeSelect";
import { ChainSelect } from "@/components/wallet-import/ChainSelect";
import { Input } from "@/components/ui/input";
import { IMPORT_STEPS } from "../constants/import-steps";
import { ProgressStep } from "../components/wallet-import/ProgressStep";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router";

const ImportWalletPage = () => {
  const [importType, setImportType] = useState<WalletImportType>("phrase");
  const [input, setInput] = useState("");
  const [selectedChain, setSelectedChain] = useState("solana");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { importWallet, error } = useWalletImport();
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const validateInput = () => {
    if (importType === "phrase") {
      const words = input.trim().split(" ");
      return words.length === 12 || words.length === 24;
    }
    if (importType === "privateKey") {
      return input.length >= 64;
    }
    return false;
  };

  const validatePassword = () => {
    return password.length >= 2;
  };

  const getPasswordError = () => {
    if (!password) return "";
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const canProceed = {
    1: selectedChain !== "",
    2: importType && input !== "" && validateInput(),
    3: password.length >= 8,
  } as const;

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const wallet = await importWallet(importType, input, {
        chain: selectedChain,
        password,
      });
      if (wallet) setIsSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleImport();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ChainSelect value={selectedChain} onChange={setSelectedChain} />
        );
      case 2:
        return (
          <>
            <ImportTypeSelect value={importType} onChange={setImportType} />
            <WalletInput
              value={input}
              onChange={setInput}
              type={importType}
              errors={
                input && !validateInput()
                  ? [
                      `Invalid ${
                        importType === "phrase"
                          ? "mnemonic phrase"
                          : "private key"
                      }. ${
                        importType === "phrase"
                          ? "Must be 12 or 24 words"
                          : "Invalid format"
                      }`,
                    ]
                  : error
                  ? [error]
                  : undefined
              }
            />
            {importType === "phrase" && input && validateInput() && (
              <MnemonicDisplay words={input.trim().split(" ")} />
            )}
          </>
        );
      case 3:
        return (
          <>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter wallet password (minimum 8 characters)"
              className={`w-full ${
                password && !validatePassword() ? "border-destructive" : ""
              }`}
            />
            {password && !validatePassword() && (
              <p className="text-destructive text-sm mt-2">
                {getPasswordError()}
              </p>
            )}
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            {password && validatePassword() && (
              <p className="text-destructive text-sm mt-2">
                If you already have a password, please use the same.
              </p>
            )}
          </>
        );
    }
  };

  const isLastStep = currentStep === IMPORT_STEPS.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative w-full py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xl mx-auto"
        >
          {/* Progress Steps with enhanced animations */}
          <div className="mb-8 relative">
            <div className="flex justify-between items-center mb-8">
              {IMPORT_STEPS.map((step, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger>
                    <ProgressStep
                      currentStep={currentStep}
                      step={step}
                      index={idx}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{step.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Content Card with improved animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {IMPORT_STEPS[currentStep - 1].title}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {IMPORT_STEPS[currentStep - 1].description}
                </p>
              </div>

              <div className="space-y-4">{renderStepContent()}</div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-4 border-t border-border/50">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={
                    isLastStep
                      ? isLoading
                      : !canProceed[currentStep as 1 | 2 | 3]
                  }
                  className={`
                    px-6 py-2 rounded-lg flex items-center gap-2
                    ${
                      isLastStep
                        ? "bg-gradient-to-r from-primary to-primary/80"
                        : "bg-primary"
                    }
                    text-primary-foreground
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  `}
                >
                  {isLastStep ? (
                    isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        Import Wallet
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Success Message */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-6 bg-success/10 text-success rounded-lg flex items-center gap-3 border border-success/20"
              >
                <div className="bg-success text-success-foreground p-2 rounded-full">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Success!</h4>
                  <p className="text-sm text-success/80">
                    Your wallet has been imported successfully.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ImportWalletPage;
