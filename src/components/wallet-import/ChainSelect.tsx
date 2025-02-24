import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chains = [
  { id: "solana", name: "Solana" },
  { id: "ethereum", name: "Ethereum" },
  { id: "polygon", name: "Polygon" },
];

interface ChainSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChainSelect = ({ value, onChange }: ChainSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Select Chain
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a blockchain" />
        </SelectTrigger>
        <SelectContent>
          {chains.map((chain) => (
            <SelectItem key={chain.id} value={chain.id}>
              {chain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
