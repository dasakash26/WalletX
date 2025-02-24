import { useWallet } from "@/context/wallet.context";
import { Wallet } from "@/types/wallet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WalletIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface WalletSwitcherProps {
  activeWallet: Wallet;
  setActiveWallet: (wallet: Wallet) => void;
}

export function WalletSwitcher({
  activeWallet,
  setActiveWallet,
}: WalletSwitcherProps) {
  const { wallets } = useWallet();

  if (!wallets?.length) return null;

  const activeWalletKey = activeWallet?.publicKey?.toString() || "";

  return (
    <Select
      value={activeWalletKey}
      onValueChange={(value) => {
        const selected = wallets.find((w) => w.publicKey?.toString() === value);
        if (selected) setActiveWallet(selected);
      }}
    >
      <SelectTrigger
        className={cn(
          "w-[280px] h-12 px-4",
          "rounded-xl border-[1.5px] border-border",
          "bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-md",
          "hover:bg-background hover:border-primary/20",
          "transition-all duration-200 ease-in-out",
          "focus:ring-2 focus:ring-ring/20 focus:border-ring"
        )}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center">
                <WalletIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
            </div>
            <Separator orientation="vertical" className="h-6" />
          </div>

          <SelectValue
            placeholder={activeWallet.name || "Select wallet"}
            className="font-medium "
          />
          <div className="ml-4"></div>
        </div>
      </SelectTrigger>
      <SelectContent
        className={cn(
          "max-h-[300px]",
          "rounded-xl border-border",
          "bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-xl",
          "shadow-lg shadow-black/10"
        )}
      >
        {wallets.map((wallet) => (
          <SelectItem
            key={wallet.publicKey?.toString() || Math.random().toString()}
            value={wallet.publicKey?.toString() || ""}
            className={cn(
              "flex items-center justify-center gap-3 py-2.5 px-3",
              "hover:bg-muted/50 cursor-pointer",
              "transition-colors duration-150",
              "data-[state=checked]:bg-primary/10"
            )}
          >
            <div className="flex flex-col items-center text-md">
              <span className="font-medium">
                {wallet.name || `Wallet ${wallets.indexOf(wallet) + 1}`}
              </span>
              <span className="text-xs text-muted-foreground">
                {wallet.publicKey?.toString().slice(0, 5)}...
                {wallet.publicKey?.toString().slice(-5)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
