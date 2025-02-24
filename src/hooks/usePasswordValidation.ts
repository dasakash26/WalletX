import { useState } from "react";
import { FormState, ValidationState } from "@/types/password-setup";

export function usePasswordValidation(mnemonic: string) {
  const [validation, setValidation] = useState<ValidationState>({
    firstWord: null,
    lastWord: null,
    password: null,
  });

  const mnemonicWords = mnemonic.split(" ");
  const actualFirstWord = mnemonicWords[0];
  const actualLastWord = mnemonicWords[mnemonicWords.length - 1];

  const validateField = (name: string, value: string, formState: FormState) => {
    switch (name) {
      case "firstWord":
        return value === "" ? null : value === actualFirstWord;
      case "lastWord":
        return value === "" ? null : value === actualLastWord;
      case "password":
      case "confirmPassword":
        return value === ""
          ? null
          : formState.password.length >= 8 &&
              formState.password === formState.confirmPassword;
      default:
        return null;
    }
  };

  return { validation, setValidation, validateField };
}
