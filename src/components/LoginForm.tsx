import { useState } from "react";
import { useNavigate } from "react-router";
import { getWallet } from "@/utils/storage";
import { createKeypairFromPrivateKey } from "@/utils/keypair";
import { SolanaWallet, OtherWallet } from "@/types/wallet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useWallet } from "@/context/wallet.context";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [selectedChain, setSelectedChain] = useState<
    "SOLANA" | "ETHEREUM" | "BITCOIN"
  >("SOLANA");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setWallet } = useWallet();

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const walletData = await getWallet(password, selectedChain);

      if (!walletData || !walletData.privateKey || !walletData.publicKey) {
        setError("Invalid wallet data. Please try again!");
        return;
      }

      if (selectedChain === "SOLANA") {
        try {
          if (
            !walletData.privateKey ||
            typeof walletData.privateKey !== "string"
          ) {
            throw new Error("Invalid private key format");
          }

          const keypair = createKeypairFromPrivateKey(walletData.privateKey);
          if (!keypair) {
            throw new Error("Failed to create keypair");
          }

          setWallet({
            chain: selectedChain,
            keypair,
            publicKey: walletData.publicKey,
            privateKey: walletData.privateKey,
          });

          navigate("/");
        } catch (keypairError) {
          console.error("Keypair creation error:", keypairError);
          setError(
            "Invalid wallet format. Please ensure you're using the correct password."
          );
          return;
        }
      } else {
        const processedWallet: OtherWallet = {
          ...walletData,
          chain: selectedChain,
        };
        localStorage.setItem("wallet", JSON.stringify(walletData));
        setWallet(processedWallet);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to unlock wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChainSelect = (value: "SOLANA" | "ETHEREUM" | "BITCOIN") => {
    setSelectedChain(value);
  };

  return (
    <div className=" flex flex-col items-center justify-center bg-gradient-to-br from-background via-background/95 to-background relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-auto w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-20" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-full max-w-md px-4"
      >
        <Card className="backdrop-blur-2xl bg-background/30 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(31,41,55,0.2)] transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg" />

          <CardHeader className="space-y-2 pb-6 relative">
            <CardTitle className="text-3xl font-bold text-center">
              <span className="bg-gradient-to-r from-primary via-white to-secondary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                Welcome Back
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your credentials to access your wallet
            </p>
          </CardHeader>

          <CardContent className="relative space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <TooltipProvider>
                {/* Network Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="chain" className="text-sm font-medium pl-1">
                      Network
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground/70 hover:text-primary/70 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Select the blockchain network for your wallet
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={selectedChain}
                    onValueChange={handleChainSelect}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <SelectTrigger className="w-full transition-all duration-300 hover:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/40 backdrop-blur-xl border-white/10 hover:bg-white/5">
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                    </motion.div>
                    <SelectContent className="border-white/10 backdrop-blur-2xl bg-background/80">
                      <SelectItem value="SOLANA" className="focus:bg-primary/5">
                        Solana
                      </SelectItem>
                      <SelectItem
                        value="ETHEREUM"
                        className="focus:bg-primary/5"
                      >
                        Ethereum
                      </SelectItem>
                      <SelectItem
                        value="BITCOIN"
                        className="focus:bg-primary/5"
                      >
                        Bitcoin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password Input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium pl-1"
                    >
                      Password
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground/70 hover:text-primary/70 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Enter your wallet encryption password
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your wallet password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="transition-all duration-300 hover:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/40 backdrop-blur-xl border-white/10 hover:bg-white/5 placeholder:text-muted-foreground/40"
                      autoComplete="current-password"
                      required
                    />
                  </motion.div>
                </div>
              </TooltipProvider>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <Alert
                    variant="destructive"
                    className="animate-shake bg-destructive/10 text-destructive border-none"
                  >
                    <AlertDescription className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 transition-all duration-300 bg-gradient-to-r from-primary via-primary/90 to-secondary bg-[length:200%_auto] hover:bg-[length:100%_auto] disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 border border-white/10 font-semibold tracking-wide text-white"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Unlocking...
                    </span>
                  ) : (
                    "Unlock Wallet"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="relative flex flex-col gap-4 pt-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors hover:bg-white/5 font-medium"
                onClick={() => navigate("/create-wallet")}
              >
                Create New Wallet
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
