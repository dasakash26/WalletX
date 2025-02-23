import { useWallet } from "@/context/wallet.context";
import { ChainType } from "@/types/chains";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getWallet } from "@/utils/storage";
import { toast } from "sonner";
import { Loader } from "lucide-react";

function ChainSwitcher() {
  const { wallet, setWallet, passWord } = useWallet();
  const [selectedChain, setSelectedChain] = useState<string | undefined>(
    wallet?.chain
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChainSelect = (value: string) => {
    setSelectedChain(value);
  };

  useEffect(() => {
    async function changeWallet() {
      if (!selectedChain) return;
      setIsLoading(true);

      try {
        const wallet = await getWallet(passWord, selectedChain as ChainType);
        if (!wallet) throw new Error("Wallet not found");

        const finalWallet = {
          ...wallet,
          chain: selectedChain as ChainType,
        };

        setWallet(finalWallet);
        toast.success(`Switched to ${selectedChain.toLowerCase()} network`);
      } catch (error: any) {
        toast.error(`Failed to switch network: ${error.message}`);
        setSelectedChain(wallet?.chain);
      } finally {
        setIsLoading(false);
      }
    }
    changeWallet();
  }, [selectedChain]);

  return (
    <div className="relative w-[180px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md z-20">
          <Loader className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}

      <Select
        value={selectedChain}
        onValueChange={handleChainSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full capitalize">
          <SelectValue placeholder="Select network" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ChainType).map((chain) => (
            <SelectItem
              key={chain}
              value={chain}
              className={`capitalize ${
                wallet?.chain === chain ? "bg-secondary/50" : ""
              }`}
            >
              {chain.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ChainSwitcher;
