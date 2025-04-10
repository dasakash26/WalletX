import {
  RefreshCcw,
  Send,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTransaction, CurrencyUnit } from "@/hooks/useTransaction";
import { useEffect } from "react";

const formatPercentage = (value: number | null): string => {
  if (value === null) return "0%";
  const rounded = Math.round(value * 100) / 100;
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
};

const LAMPORTS_PER_SOL = 1000000000;

interface BalanceCardProps {
  balance: number;
  publicKey?: string;
  percentageChange: number | null;
  isLoading: boolean;
  onRefresh: () => void;
  amount?: number;
  sendToAddress?: string;
  privateKey: string;
  solPrice?: number; 
}

export function BalanceCard({
  balance,
  publicKey,
  percentageChange,
  isLoading,
  onRefresh,
  privateKey,
  solPrice = 0, 
}: BalanceCardProps) {
  const {
    address,
    amount,
    currencyUnit,
    sendDialogOpen,
    confirmOpen,
    isSending,
    transactionStatus,
    errorMessage,
    addressError,
    setAmount,
    setCurrencyUnit,
    setSendDialogOpen,
    setConfirmOpen,
    handleAddressChange,
    handleSend,
    handleProceedToConfirmation,
    getEquivalentValue,
  } = useTransaction({
    privateKey,
    solPrice,
  });

  useEffect(() => {
    if (transactionStatus === "success") {
      const refreshTimer = setTimeout(() => {
        onRefresh();
      }, 1500);

      return () => clearTimeout(refreshTimer);
    }
  }, [transactionStatus, onRefresh]);

  // Get display amounts for confirmation dialog
  const getDisplayAmount = () => {
    if (currencyUnit === "lamports") {
      return `${amount.toLocaleString()} lamports`;
    } else {
      return `${amount.toLocaleString(undefined, {
        maximumFractionDigits: 9,
      })} SOL`;
    }
  };

  // Show equivalent values based on selected currency with better formatting
  const getEquivalentAmounts = () => {
    if (amount <= 0) return null;

    const units: CurrencyUnit[] = ["lamports", "sol"];
    const currentUnitIndex = units.indexOf(currencyUnit);
    const otherUnits = units.filter((_, index) => index !== currentUnitIndex);

    return (
      <div className="text-xs text-muted-foreground mt-2">
        {otherUnits.map((unit) => {
          const value = getEquivalentValue(amount, currencyUnit, unit);
          const formattedValue =
            unit === "sol"
              ? `${value.toLocaleString(undefined, {
                  maximumFractionDigits: 9,
                })} SOL`
              : `${Math.floor(value).toLocaleString()} lamports`;
          return <div key={unit}>≈ {formattedValue}</div>;
        })}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "p-6 md:p-8 rounded-xl shadow-lg bg-gradient-to-br from-background/80 to-background/80 backdrop-blur-md border border-border transition-all duration-300 relative",
        transactionStatus === "success" && "border-green-500/50",
        transactionStatus === "error" && "border-red-500/50",
        transactionStatus === "pending" && "border-yellow-500/50",
        "hover:scale-105"
      )}
    >
      {/* Refresh Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-primary/10 transition-colors"
              onClick={onRefresh}
              disabled={isLoading}
              aria-label="Refresh balance"
            >
              <RefreshCcw
                className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh balance</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Main Balance Display */}
      <div className="text-center mb-6 py-4">
        <div className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            ${!isNaN(balance) ? balance.toFixed(2) : "0.00"}
          </span>
        </div>

        {publicKey && (
          <div className="text-xs text-muted-foreground mb-3 font-mono break-all px-4 max-w-[28rem] mx-auto">
            {publicKey}
          </div>
        )}

        {percentageChange !== null && (
          <div
            className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full ${
              percentageChange < 0
                ? "text-destructive bg-destructive/10"
                : "text-success bg-success/10"
            }`}
          >
            {formatPercentage(percentageChange)}
          </div>
        )}
      </div>

      {/* Transaction Status Messages - Positioned below balance */}
      {transactionStatus !== "idle" && (
        <div
          className={cn(
            "mx-auto mb-4 max-w-sm rounded-lg p-2 text-center text-sm animate-in fade-in duration-300",
            {
              "bg-success/10 text-success": transactionStatus === "success",
              "bg-destructive/10 text-destructive":
                transactionStatus === "error",
              "bg-yellow-500/10 text-yellow-500":
                transactionStatus === "pending",
            }
          )}
        >
          {transactionStatus === "success" ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Transaction successful!
            </div>
          ) : transactionStatus === "pending" ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Transaction pending...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <X className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <TooltipProvider>
          {/* Button to Show Send Dialog */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                className="flex-1 md:w-32 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                aria-label="Send funds"
                onClick={() => setSendDialogOpen(true)}
              >
                <Send className="h-5 w-5" /> Send
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send funds to another wallet</TooltipContent>
          </Tooltip>

          {/* Swap Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                className="flex-1 md:w-32 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-secondary text-secondary-foreground hover:bg-secondary/10 transition-colors"
                aria-label="Swap tokens"
              >
                <RefreshCcw className="h-5 w-5" /> Swap
              </Button>
            </TooltipTrigger>
            <TooltipContent>Swap between different tokens</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Send Dialog - Opens immediately when clicking Send */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-md p-6 gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Send Funds
            </DialogTitle>
            <DialogDescription>
              Enter the recipient address and amount to send.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {/* Recipient Address Input */}
            <div className="space-y-2">
              <label
                htmlFor="recipient-address-dialog"
                className="text-sm font-medium block"
              >
                Recipient Address
              </label>
              <Input
                id="recipient-address-dialog"
                type="text"
                placeholder="Enter recipient wallet address"
                className="w-full rounded-lg border border-input"
                value={address}
                onChange={handleAddressChange}
              />
              {addressError && (
                <p className="text-red-500 text-xs mt-1">{addressError}</p>
              )}
            </div>

            {/* Amount Input with Currency Selection */}
            <div className="space-y-2">
              <label
                htmlFor="amount-dialog"
                className="text-sm font-medium block"
              >
                Amount
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="amount-dialog"
                    type="number"
                    placeholder="0"
                    className="w-full rounded-lg border border-input"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="0"
                    step={currencyUnit === "lamports" ? "1" : "0.000001"}
                  />
                </div>

                <Select
                  value={currencyUnit}
                  onValueChange={(value) =>
                    setCurrencyUnit(value as CurrencyUnit)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lamports">lamports</SelectItem>
                    <SelectItem value="sol">SOL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {getEquivalentAmounts()}

              <div className="flex items-center gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-md h-9"
                  onClick={() => {
                    // Simplified calculation for 50% amount across currency types
                    if (currencyUnit === "lamports") {
                      // Convert balance SOL to lamports then take 50%
                      setAmount(Math.floor(balance * LAMPORTS_PER_SOL * 0.5));
                    } else if (currencyUnit === "sol") {
                      // Directly take 50% of SOL balance with proper precision
                      setAmount(parseFloat((balance * 0.5).toFixed(9)));
                    }
                  }}
                >
                  50%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-md h-9"
                  onClick={() => {
                    // Simplified calculation for Max amount across currency types
                    if (currencyUnit === "lamports") {
                      // Convert balance SOL to lamports
                      setAmount(Math.floor(balance * LAMPORTS_PER_SOL));
                    } else if (currencyUnit === "sol") {
                      // Use full SOL balance with proper precision
                      setAmount(parseFloat(balance.toFixed(9)));
                    }
                  }}
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="sm:mr-2"
              onClick={() => setSendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-primary"
              onClick={handleProceedToConfirmation}
              disabled={!address || amount <= 0 || !!addressError}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="border-2 border-warning/50 bg-gradient-to-b from-card/95 to-card shadow-lg max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Confirm Transaction
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send funds from your wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 my-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium">Amount: {getDisplayAmount()}</p>
              <p className="font-medium break-all text-xs mt-1">
                To: {address}
              </p>
            </div>
            <p className="text-warning text-sm">
              Please verify the recipient address carefully. All blockchain
              transactions are irreversible.
            </p>
          </div>

          <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-1">
            <AlertDialogCancel
              className="rounded-full border-muted-foreground w-full sm:w-auto"
              disabled={transactionStatus === "pending"}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSend}
              className="rounded-full bg-primary hover:bg-primary/90 w-full sm:w-auto"
              disabled={isSending || transactionStatus === "pending"}
            >
              {isSending || transactionStatus === "pending" ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {transactionStatus === "pending"
                    ? "Processing..."
                    : "Sending..."}
                </div>
              ) : (
                "Confirm Send"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
