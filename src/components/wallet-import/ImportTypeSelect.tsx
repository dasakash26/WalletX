import { WalletImportType } from "@/types/wallet";
import { KeySquare, Book } from "lucide-react";

interface ImportTypeSelectProps {
  value: WalletImportType;
  onChange: (type: WalletImportType) => void;
}

export const ImportTypeSelect = ({
  value,
  onChange,
}: ImportTypeSelectProps) => (
  <div className="flex flex-col space-y-3 w-full">
    <button
      onClick={() => onChange("phrase")}
      className={`group flex items-center p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] ${
        value === "phrase"
          ? "border-primary bg-primary/5 shadow shadow-primary/10"
          : "border-border hover:border-primary/20 hover:bg-muted/50"
      }`}
    >
      <Book
        className={`h-6 w-6 mr-3 shrink-0 ${
          value === "phrase"
            ? "text-primary"
            : "text-muted-foreground group-hover:text-primary"
        }`}
      />
      <div className="text-left">
        <div className="font-medium text-base text-foreground">
          Recovery Phrase
        </div>
        <div className="text-xs text-muted-foreground">
          Import using 12 or 24 word seed phrase
        </div>
      </div>
    </button>

    <button
      onClick={() => onChange("privateKey")}
      className={`group flex items-center p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] ${
        value === "privateKey"
          ? "border-primary bg-primary/5 shadow shadow-primary/10"
          : "border-border hover:border-primary/20 hover:bg-muted/50"
      }`}
    >
      <KeySquare
        className={`h-6 w-6 mr-3 shrink-0 ${
          value === "privateKey"
            ? "text-primary"
            : "text-muted-foreground group-hover:text-primary"
        }`}
      />
      <div className="text-left">
        <div className="font-medium text-base text-foreground">Private Key</div>
        <div className="text-xs text-muted-foreground">
          Import using wallet private key
        </div>
      </div>
    </button>
  </div>
);
