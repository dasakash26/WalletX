import {
  RefreshCcw,
  Send,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  Copy,
  Eye,
  EyeOff,
  Shield,
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

import { cn } from "@/lib/utils";
import { useTransaction } from "@/hooks/useTransaction";
import { useEffect, useState, useRef } from "react";
import { AmountInput } from "@/components/inputs/AmountInput";
import { toast } from "sonner";

const formatPercentage = (value: number | null): string => {
  if (value === null) return "0%";
  const rounded = Math.round(value * 100) / 100;
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
};

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
  const [showPrivateKeyDialog, setShowPrivateKeyDialog] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);
  const [keyRevealed, setKeyRevealed] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCopyPublicKey = async () => {
    try {
      if (publicKey) {
        await navigator.clipboard.writeText(publicKey);

        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }

        setCopiedPublic(true);
        toast("Public key copied", {
          description: "Your wallet address has been copied to clipboard",
        });

        copyTimeoutRef.current = setTimeout(() => {
          setCopiedPublic(false);
          copyTimeoutRef.current = null;
        }, 2000);
      }
    } catch (error) {
      toast("Copy failed", {
        description: "Could not copy wallet address",
        icon: <X className="h-4 w-4 text-destructive" />,
        duration: 3000,
        className:
          "bg-destructive/10 border border-destructive/20 text-destructive",
      });
    }
  };

  const handleCopyPrivateKey = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      setCopiedPrivate(true);
      toast("Private key copied", {
        description: "Your private key has been copied securely",
        icon: <Shield className="h-4 w-4 text-success" />,
        duration: 3000,
        className: "bg-success/10 border border-success/20",
      });

      copyTimeoutRef.current = setTimeout(() => {
        setCopiedPrivate(false);
        setKeyRevealed(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch (error) {
      toast("Copy failed", {
        description: "Could not copy private key",
        icon: <X className="h-4 w-4 text-destructive" />,
        duration: 3000,
        className:
          "bg-destructive/10 border border-destructive/20 text-destructive",
      });
    }
    setShowPrivateKeyDialog(false);
  };

  const formatAddress = (address: string) => {
    if (!address || address.length < 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const getDisplayAmount = () => {
    if (currencyUnit === "lamports") {
      return `${amount.toLocaleString()} lamports`;
    } else {
      return `${amount.toLocaleString(undefined, {
        maximumFractionDigits: 9,
      })} SOL`;
    }
  };

  return (
    <Card
      className={cn(
        "p-6 md:p-8 rounded-xl shadow-lg bg-gradient-to-br from-background/80 to-background/80 backdrop-blur-md border border-border transition-all duration-300 relative flex flex-col min-h-[320px]",
        transactionStatus === "success" && "border-green-500/50",
        transactionStatus === "error" && "border-red-500/50",
        transactionStatus === "pending" && "border-yellow-500/50",
        "hover:scale-[1.02]"
      )}
    >
      {/* Refresh Button - Fixed position with consistent spacing */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-5 top-5 h-9 w-9 rounded-full hover:bg-primary/10 transition-colors border border-border/40"
              onClick={onRefresh}
              disabled={isLoading}
              aria-label="Refresh balance"
            >
              <RefreshCcw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Refresh balance</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Main content container */}
      <div className="flex flex-col h-full">
        {/* Top section with balance */}
        <div className="flex-grow flex flex-col items-center justify-center mb-6">
          {/* Balance Value with improved vertical spacing */}
          <div className="text-center mb-3">
            <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-2">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ${!isNaN(balance) ? balance.toFixed(2) : "0.00"}
              </span>
            </div>

            {/* Percentage Change */}
            {percentageChange !== null && (
              <span
                className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full ${
                  percentageChange < 0
                    ? "text-destructive bg-destructive/10"
                    : "text-success bg-success/10"
                }`}
              >
                {formatPercentage(percentageChange)}
              </span>
            )}
          </div>

          {/* Transaction Status Messages - Improved positioning */}
          {transactionStatus !== "idle" && (
            <div
              className={cn(
                "w-full max-w-md mx-auto rounded-lg p-3 text-center text-sm animate-in fade-in duration-300 shadow-sm mb-4",
                {
                  "bg-success/10 text-success border border-success/20":
                    transactionStatus === "success",
                  "bg-destructive/10 text-destructive border border-destructive/20":
                    transactionStatus === "error",
                  "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20":
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
        </div>

        {/* Bottom section with wallet info and actions */}
        <div className="space-y-5">
          {/* Wallet Info */}
          {publicKey && (
            <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-4 border border-border/30 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Wallet Address Group */}
                <div className="px-4 py-2.5 bg-background/80 backdrop-blur-sm rounded-xl flex items-center shadow-sm border border-border/50 transition-all hover:border-primary/30 flex-1 w-full">
                  <div className="flex flex-col items-start mr-3">
                    <span className="text-xs text-muted-foreground font-medium">
                      Wallet Address
                    </span>
                    <span className="font-mono text-sm font-semibold">
                      {formatAddress(publicKey)}
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 transition-colors ml-auto relative"
                          onClick={handleCopyPublicKey}
                          aria-label="Copy Wallet Address"
                        >
                          <span className="sr-only">Copy address</span>
                          {copiedPublic ? (
                            <CheckCircle className="h-4 w-4 text-success absolute inset-0 m-auto animate-in zoom-in-50 duration-300" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={4}
                        className="text-xs font-medium"
                      >
                        {copiedPublic ? "Copied!" : "Copy Wallet Address"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Private Key Button */}
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-xl text-xs flex items-center gap-2 bg-background/80 backdrop-blur-sm border-warning/20 text-warning hover:text-warning hover:bg-warning/5 transition-all px-4 shadow-sm w-full sm:w-auto"
                        onClick={() => setShowPrivateKeyDialog(true)}
                        aria-label="Access Private Key"
                      >
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Private Key</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={4}
                      className="text-xs font-medium"
                    >
                      Access your private key securely
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center w-full gap-4">
            <TooltipProvider>
              {/* Send Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md h-11"
                    aria-label="Send funds"
                    onClick={() => setSendDialogOpen(true)}
                  >
                    <Send className="h-4 w-4" />
                    <span className="font-medium">Send</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send funds to another wallet</TooltipContent>
              </Tooltip>

              {/* Swap Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-6 rounded-xl bg-background/70 backdrop-blur-sm border-border hover:bg-background/90 transition-all h-11"
                    aria-label="Swap tokens"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    <span className="font-medium">Swap</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Swap between different tokens</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Send Dialog - Opens immediately when clicking Send */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-md p-6 gap-6 rounded-xl">
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

            {/* Amount Input with Currency Selection - Now using our new component */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">Amount</label>

              <AmountInput
                amount={amount}
                setAmount={setAmount}
                currencyUnit={currencyUnit}
                setCurrencyUnit={setCurrencyUnit}
                availableBalance={balance}
                disabled={isSending}
                getEquivalentValue={getEquivalentValue}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              className="sm:mr-2"
              onClick={() => setSendDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-primary"
              onClick={handleProceedToConfirmation}
              disabled={!address || amount <= 0 || !!addressError || isSending}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="border-2 border-warning/50 bg-gradient-to-b from-card/95 to-card shadow-lg max-w-md mx-auto rounded-xl">
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

      {/* Private Key Copy Confirmation Dialog */}
      <AlertDialog
        open={showPrivateKeyDialog}
        onOpenChange={setShowPrivateKeyDialog}
      >
        <AlertDialogContent className="border-2 border-warning/50 bg-gradient-to-b from-card/95 to-card shadow-lg max-w-md mx-auto rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-warning">
              <Shield className="h-5 w-5" />
              Secure Access
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your private key is sensitive information that controls your
              wallet funds.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 my-4">
            <div className="bg-warning/10 p-4 rounded-md border border-warning/20">
              <p className="text-warning text-sm font-medium mb-1">
                Security Warning
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <span>Never share your private key with anyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <span>Make sure no one is watching your screen</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Your Private Key</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => setKeyRevealed(!keyRevealed)}
                >
                  {keyRevealed ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Reveal
                    </>
                  )}
                </Button>
              </div>
              <div className="relative bg-muted/30 p-3 rounded-md border border-input break-all font-mono text-xs">
                {keyRevealed ? (
                  privateKey
                ) : (
                  <div className="flex gap-1 overflow-hidden">
                    {Array(12)
                      .fill("●●●●")
                      .map((dots, i) => (
                        <span key={i}>{dots}</span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <AlertDialogCancel className="rounded-full border-muted-foreground/30 hover:bg-background hover:text-foreground w-full sm:w-auto">
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCopyPrivateKey}
              className="rounded-full bg-primary hover:bg-primary/90 w-full sm:w-auto"
              disabled={!keyRevealed && !copiedPrivate}
            >
              <div className="flex items-center gap-2">
                {copiedPrivate ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copiedPrivate ? "Copied!" : "Copy Private Key"}
              </div>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
