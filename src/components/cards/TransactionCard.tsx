import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface TransactionCardProps {
  signature: string;
  type: "send" | "receive";
  amount: number;
  timestamp: number;
  fromAddress: string;
  toAddress: string;
}

export function TransactionCard({
  signature,
  type,
  amount,
  timestamp,
  fromAddress,
  toAddress,
}: TransactionCardProps) {
  const [copied, setCopied] = useState(false);
  const isReceive = type === "receive";
  const displayAddress = isReceive ? fromAddress : toAddress;
  const formattedAddress = `${displayAddress.slice(
    0,
    4
  )}...${displayAddress.slice(-4)}`;

  const statusStyles = {
    icon: isReceive ? "text-green-500" : "text-red-500",
    bg: isReceive
      ? "from-green-500/20 to-green-500/5"
      : "from-red-500/20 to-red-500/5",
    badge: isReceive
      ? "bg-green-500/10 text-green-500"
      : "bg-red-500/10 text-red-500",
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group hover:shadow-md hover:scale-[1.01] bg-background hover:bg-accent/5 transition-all duration-200">
      <CardContent className="p-3.5 sm:p-5 flex items-start sm:items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-full shrink-0 bg-gradient-to-br",
            statusStyles.bg
          )}
        >
          {isReceive ? (
            <ArrowDownLeft
              className={cn("h-4 w-4", statusStyles.icon)}
              aria-label="Received"
            />
          ) : (
            <ArrowUpRight
              className={cn("h-4 w-4", statusStyles.icon)}
              aria-label="Sent"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{amount.toFixed(4)} SOL</span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                statusStyles.badge
              )}
            >
              {isReceive ? "Received" : "Sent"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs text-muted-foreground">
              {isReceive ? "From: " : "To: "}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-mono text-xs">{formattedAddress}</span>
              </TooltipTrigger>
              <TooltipContent side="bottom">{displayAddress}</TooltipContent>
            </Tooltip>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-accent rounded-md transition-colors"
              aria-label="Copy address"
            >
              <Copy className="h-3 w-3" />
            </button>
            {copied && (
              <span className="text-xs text-muted-foreground">Copied</span>
            )}
          </div>

          <time className="text-xs text-muted-foreground/70">
            {new Date(timestamp * 1000).toLocaleString()}
          </time>
        </div>

        <a
          href={`https://explorer.solana.com/tx/${signature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 hover:bg-accent rounded-full transition-colors opacity-70 hover:opacity-100"
          aria-label="View transaction details"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </CardContent>
    </Card>
  );
}
