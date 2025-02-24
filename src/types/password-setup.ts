export interface PasswordSetupProps {
  onConfirm: (password: string) => Promise<void>;
  mnemonic: string;
}

export interface FormState {
  firstWord: string;
  lastWord: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationState {
  firstWord: boolean | null;
  lastWord: boolean | null;
  password: boolean | null;
}
