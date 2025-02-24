import { WalletImportType } from "../../types/wallet";
import { AlertCircle } from "lucide-react";

interface WalletInputProps {
  value: string;
  onChange: (value: string) => void;
  type: WalletImportType;
  errors?: string[];
}

export const WalletInput = ({
  value,
  onChange,
  type,
  errors,
}: WalletInputProps) => (
  <div className="space-y-2">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={
        type === "phrase"
          ? "Enter your 12/24 word recovery phrase"
          : "Enter your private key"
      }
      className="w-full p-3 border border-gray-200 rounded-xl h-32 bg-gray-50/50 
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white 
        transition-all duration-200 placeholder:text-gray-400 text-gray-700
        dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
    />
    {errors && errors.length > 0 && (
      <div className="space-y-1">
        {errors.map((error, index) => (
          <div key={index} className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);
