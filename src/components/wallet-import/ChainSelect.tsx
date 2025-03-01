import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chains = [
  { id: "solana", name: "Solana", icon: "◎" },
  { id: "ethereum", name: "Ethereum", icon: "⟠" },
];

interface ChainSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChainSelect = ({ value, onChange }: ChainSelectProps) => {
  return (
    <div className="flex flex-col gap-3">
      {chains.map((chain) => (
        <Button
          key={chain.id}
          onClick={() => onChange(chain.id)}
          variant={value === chain.id ? "default" : "secondary"}
          className={cn(
            "flex-1 h-14 text-lg font-medium transition-all",
            "hover:scale-[1.02] active:scale-[0.98]",
            value === chain.id ? "shadow-lg" : "hover:text-primary"
          )}
        >
          <span className="mr-2 text-xl">{chain.icon}</span>
          {chain.name}
        </Button>
      ))}
    </div>
  );
};
