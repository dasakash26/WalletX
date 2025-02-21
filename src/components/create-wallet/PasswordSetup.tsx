import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Lock, Unlock, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordSetupProps {
  onConfirm: (password: string) => Promise<void>;
  mnemonic: string;
}

interface FormState {
  firstWord: string; // We'll keep this but won't use it
  lastWord: string;
  password: string;
  confirmPassword: string;
}

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const strength = getStrength();
  const getLabel = () => {
    if (strength === 100) return { text: "Strong", color: "text-green-500" };
    if (strength >= 75) return { text: "Good", color: "text-blue-500" };
    if (strength >= 50) return { text: "Medium", color: "text-yellow-500" };
    return { text: "Weak", color: "text-red-500" };
  };

  const strengthLabel = getLabel();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Progress value={strength} className={cn("h-2 flex-1")} />
        <span className={cn("ml-2 text-sm font-medium", strengthLabel.color)}>
          {strengthLabel.text}
        </span>
      </div>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li className={cn(password.length >= 8 ? "text-green-500" : "")}>
          • At least 8 characters
        </li>
        <li className={cn(password.match(/[A-Z]/) ? "text-green-500" : "")}>
          • One uppercase letter
        </li>
        <li className={cn(password.match(/[0-9]/) ? "text-green-500" : "")}>
          • One number
        </li>
        <li
          className={cn(password.match(/[^A-Za-z0-9]/) ? "text-green-500" : "")}
        >
          • One special character
        </li>
      </ul>
    </div>
  );
};

export function PasswordSetup({ onConfirm, mnemonic }: PasswordSetupProps) {
  const [formState, setFormState] = useState<FormState>({
    firstWord: "",
    lastWord: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState({
    firstWord: null as boolean | null,
    lastWord: null as boolean | null,
    password: null as boolean | null,
  });
  const [currentStep, setCurrentStep] = useState(1);

  const mnemonicWords = mnemonic.split(" ");
  const actualFirstWord = mnemonicWords[0];
  const actualLastWord = mnemonicWords[mnemonicWords.length - 1];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);

    if (name === "firstWord") {
      setValidation((prev) => ({
        ...prev,
        firstWord: value === "" ? null : value === actualFirstWord,
      }));
    }
    if (name === "lastWord") {
      setValidation((prev) => ({
        ...prev,
        lastWord: value === "" ? null : value === actualLastWord,
      }));
    }
    if (name === "password") {
      setValidation((prev) => ({
        ...prev,
        password:
          value === ""
            ? null
            : value.length >= 8 && value === formState.confirmPassword,
      }));
    }
    if (name === "confirmPassword") {
      setValidation((prev) => ({
        ...prev,
        password:
          value === ""
            ? null
            : formState.password.length >= 8 && value === formState.password,
      }));
    }
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
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {validation.firstWord === null ||
                          validation.lastWord === null ? (
                            <span className="h-5 w-5 rounded-full border-2 animate-pulse" />
                          ) : validation.firstWord && validation.lastWord ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          Please verify you have safely stored your recovery
                          phrase
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    Verify Recovery Phrase
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        For security purposes, please enter the first and last
                        words of your recovery phrase. This helps ensure you
                        have properly saved your recovery phrase.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstWord">
                        First Word of Recovery Phrase
                      </Label>
                      <Input
                        id="firstWord"
                        name="firstWord"
                        value={formState.firstWord}
                        onChange={handleChange}
                        placeholder="Enter the first word"
                        className={cn(
                          "transition-colors",
                          validation.firstWord === true && "border-green-500",
                          validation.firstWord === false && "border-red-500"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastWord">
                        Last Word of Recovery Phrase
                      </Label>
                      <Input
                        id="lastWord"
                        name="lastWord"
                        value={formState.lastWord}
                        onChange={handleChange}
                        placeholder="Enter the last word"
                        className={cn(
                          "transition-colors",
                          validation.lastWord === true && "border-green-500",
                          validation.lastWord === false && "border-red-500"
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      if (validation.firstWord && validation.lastWord) {
                        setCurrentStep(2);
                      }
                    }}
                    disabled={!validation.firstWord || !validation.lastWord}
                  >
                    Next
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {validation.password === null ? (
                            <Lock className="h-5 w-5 text-blue-500" />
                          ) : validation.password ? (
                            <Unlock className="h-5 w-5 text-green-500" />
                          ) : (
                            <Lock className="h-5 w-5 text-red-500" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          Password must be at least 8 characters long
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    Set Password
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={cn(
                        "transition-colors",
                        validation.password === true && "border-green-500",
                        validation.password === false && "border-red-500"
                      )}
                    />
                    <PasswordStrengthIndicator password={formState.password} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formState.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={cn(
                        "transition-colors",
                        validation.password === true && "border-green-500",
                        validation.password === false && "border-red-500"
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create Wallet
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
