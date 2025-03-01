import { ImportStep } from "../types/import-wallet";

export const IMPORT_STEPS: ImportStep[] = [
  {
    title: "Select Blockchain",
    description: "Choose the blockchain network for your wallet",
    icon: "🌐",
  },
  {
    title: "Import Method",
    description: "Choose how you want to import your wallet",
    icon: "🔑",
  },
  {
    title: "Set Password",
    description: "Create a password to secure your wallet",
    icon: "🔒",
  },
];
