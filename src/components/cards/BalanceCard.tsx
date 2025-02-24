import { RefreshCcw, ArrowDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BalanceCardProps {
  balance: number;
  publicKey?: string;
  percentageChange: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export function BalanceCard({
  balance,
  publicKey,
  percentageChange,
  isLoading,
  onRefresh,
}: BalanceCardProps) {
  return (
    <Card className="p-6 text-center relative backdrop-blur-md bg-gradient-to-b from-background/95 to-background/90 border-border hover:bg-background hover:border-primary/20 transition-all duration-200">
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 hover:bg-primary/10 transition-all duration-200"
                onClick={onRefresh}
                disabled={isLoading}
                aria-label="Refresh balance"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh balance</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-4xl font-bold tracking-tight mb-2">
          ${balance.toFixed(2)}
        </div>
        {publicKey && (
          <div className="text-sm text-muted-foreground mb-2 font-mono">
            {publicKey}
          </div>
        )}
        <div
          className={`text-sm ${
            percentageChange < 0 ? "text-red-500" : "text-emerald-500"
          }`}
        >
          {percentageChange > 0 ? "+" : ""}
          {percentageChange}%
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-28 h-10 hover:bg-primary/10 transition-all duration-200"
                  aria-label="Receive funds"
                >
                  <ArrowDown className="mr-2 h-4 w-4" /> Receive
                </Button>
              </TooltipTrigger>
              <TooltipContent>Receive funds to your wallet</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-28 h-10 transition-all duration-200 hover:scale-105"
                  aria-label="Send funds"
                >
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send funds to another wallet</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-28 h-10 hover:bg-primary/10 transition-all duration-200"
                  aria-label="Swap tokens"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Swap
                </Button>
              </TooltipTrigger>
              <TooltipContent>Swap between different tokens</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </>
    </Card>
  );
}
