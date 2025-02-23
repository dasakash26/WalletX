import { useState, useEffect } from "react";
import { Copy, Send, QrCode, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/layout/Logo";
import { useWallet } from "@/context/wallet.context";

// import {
//   getSolanaBalance,
//   getEthereumBalance,
//   getBitcoinBalance,
// } from "@/utils/fetchBalance";

type Transaction = {
  id: string;
  type: "send" | "receive";
  amount: number;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
};

export function DashBoard() {
  const { wallet } = useWallet();
  const [selectedChain, setSelectedChain] = useState(wallet?.chain || "SOLANA");
  const [balance, setBalance] = useState(0);
  const [transactions] = useState<Transaction[]>([
    {
      id: "tx1",
      type: "send",
      amount: 0.1,
      status: "completed",
      timestamp: new Date(),
    },
    {
      id: "tx2",
      type: "receive",
      amount: 0.5,
      status: "pending",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    if (wallet?.publicKey) {
      const fetchBalance = async () => {
        let fetchedBalance: number = 100;
        try {
          if (selectedChain === "SOLANA") {
            // fetchedBalance = await getSolanaBalance(wallet.publicKey);
          } else if (selectedChain === "ETHEREUM") {
            //fetchedBalance = await getEthereumBalance(wallet.publicKey);
          } else if (selectedChain === "BITCOIN") {
            //fetchedBalance = await getBitcoinBalance(wallet.publicKey);
          }
          setBalance(fetchedBalance);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setBalance(0);
        }
      };

      fetchBalance();
    }
  }, [wallet, selectedChain]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const handleChainSelect = (value: string) => {
    if (value === "SOLANA" || value === "ETHEREUM" || value === "BITCOIN") {
      setSelectedChain(value);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Logo />
        <Select value={selectedChain} onValueChange={handleChainSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SOLANA">Solana</SelectItem>
            <SelectItem value="ETHEREUM">Ethereum</SelectItem>
            <SelectItem value="BITCOIN">Bitcoin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wallet Info Card */}
      <Card className="backdrop-blur-xl bg-background/30 border-white/10">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Public Key
                </span>
                <span className="font-mono text-sm">
                  {wallet?.publicKey.slice(0, 8)}...
                  {wallet?.publicKey.slice(-8)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(wallet?.publicKey || "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span>Balance:</span>
                <span className="font-bold">
                  {balance} {selectedChain}
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-32" onClick={() => {}}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="secondary" className="w-32" onClick={() => {}}>
                <QrCode className="mr-2 h-4 w-4" />
                Receive
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="backdrop-blur-xl bg-background/30 border-white/10">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/40 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      tx.status === "completed"
                        ? "bg-green-500"
                        : tx.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-mono text-sm">
                    {tx.id.slice(0, 8)}...{tx.id.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={
                      tx.type === "receive" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {tx.type === "receive" ? "+" : "-"}
                    {tx.amount} {selectedChain}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
