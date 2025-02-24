import { Card } from "@/components/ui/card";

interface TokenCardProps {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  percentageChange: number;
  icon: string;
}

export function TokenCard({
  symbol,
  name,
  balance,
  usdValue,
  percentageChange,
  icon,
}: TokenCardProps) {
  return (
    <Card className="p-4 backdrop-blur-md bg-gradient-to-b from-background/95 to-background/90 border-border hover:bg-background hover:border-primary/20 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <div className="font-medium text-lg">{name}</div>
            <div className="text-sm text-muted-foreground font-mono">
              {balance} {symbol}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-lg">${usdValue.toFixed(2)}</div>
          <div
            className={`text-sm ${
              percentageChange < 0 ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {percentageChange > 0 ? "+" : ""}
            {percentageChange}%
          </div>
        </div>
      </div>
    </Card>
  );
}
