import { WalletImportType } from "./wallet";

export interface ImportStep {
  title: string;
  description: string;
  icon: string;
}

export interface ImportStepProps {
  currentStep: number;
  step: ImportStep;
  index: number;
}

export interface StepContentProps {
  importType: WalletImportType;
  input: string;
  selectedChain: string;
  password: string;
  error?: string;
  onImportTypeChange: (type: WalletImportType) => void;
  onInputChange: (value: string) => void;
  onChainChange: (chain: string) => void;
  onPasswordChange: (password: string) => void;
}
