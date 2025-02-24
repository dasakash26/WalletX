import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChainType } from "@/types/chains";

interface Chain {
  id: string;
  name: string;
  description: string;
}

const chains: Chain[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    description: "The original cryptocurrency network",
  },
  {
    id: "solana",
    name: "Solana",
    description: "High-performance blockchain with fast transactions",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    description: "The main Ethereum network with smart contract capability",
  },
];

interface ChainSelectProps {
  onSelect: (chain: ChainType) => void;
  selectedChain?: string | null;
}

export function ChainSelect({ onSelect, selectedChain }: ChainSelectProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-slate-300 text-sm font-medium">
          Choose a blockchain network
        </p>
        <Select value={selectedChain || undefined} onValueChange={onSelect}>
          <SelectTrigger className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 hover:from-slate-700 hover:to-slate-800 transition-all duration-300">
            <SelectValue placeholder="Select a blockchain" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {chains.map((chain) => (
              <SelectItem
                key={chain.id}
                value={chain.id}
                className="hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-700 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span>{chain.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
