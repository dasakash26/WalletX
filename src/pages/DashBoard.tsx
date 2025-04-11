import { useState, useEffect } from "react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  ParsedTransactionWithMeta,
} from "@solana/web3.js";
import { useWallet } from "@/context/wallet.context";
import { BalanceCard } from "@/components/cards/BalanceCard";
import { TokenCard } from "@/components/cards/TokenCard";
import { WalletSwitcher } from "@/components/WalletSwitcher";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionCard } from "@/components/cards/TransactionCard";
import useSolanaPrice from "@/hooks/useSolanaPrice";

type Token = {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  percentageChange: number;
  icon: string;
};

type Transaction = {
  signature: string;
  type: "send" | "receive";
  amount: number;
  timestamp: number;
  fromAddress: string;
  toAddress: string;
};

type NetworkStatus = {
  status: "up" | "down" | "degraded";
  latency: number;
};

export function DashBoard() {
  const { wallets } = useWallet();
  const [error, setError] = useState<string | null>(null);
  if (!wallets) {
    setError("No wallets found");
    return <>Error</>;
  }
  const [activeWallet, setActiveWallet] = useState(wallets[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    status: "up",
    latency: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { solPrice, priceChange24h } = useSolanaPrice();

  const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL);

  const fetchBalances = async () => {
    if (!activeWallet?.publicKey) {
      setError("No wallet selected");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const publicKey = new PublicKey(activeWallet.publicKey);
      const solBalance = await connection.getBalance(publicKey);
      const solInUSD = (solBalance / LAMPORTS_PER_SOL) * (solPrice || 0);

      setBalance(solInUSD);
      setTokens([
        {
          symbol: "SOL",
          name: "Solana",
          balance: solBalance / LAMPORTS_PER_SOL,
          usdValue: solInUSD,
          percentageChange: priceChange24h || 0,
          icon: "🌞",
        },
      ]);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch wallet balance");
    } finally {
      setIsLoading(false);
    }
  };

  const determineTransactionType = (
    transaction: ParsedTransactionWithMeta,
    walletAddress: string
  ): "send" | "receive" => {
    if (!transaction.meta) return "receive";

    const accountKeys = transaction.transaction.message.accountKeys;
    const walletIndex = accountKeys.findIndex(
      (key) => key.pubkey.toString() === walletAddress
    );

    if (walletIndex === -1) return "receive";

    const preBalance = transaction.meta.preBalances[walletIndex];
    const postBalance = transaction.meta.postBalances[walletIndex];
    const netChange = postBalance - preBalance;

    return netChange < 0 ? "send" : "receive";
  };

  const calculateTransactionAmount = (
    transaction: ParsedTransactionWithMeta,
    walletAddress: string
  ): number => {
    if (!transaction.meta) return 0;

    const accountKeys = transaction.transaction.message.accountKeys;
    const walletIndex = accountKeys.findIndex(
      (key) => key.pubkey.toString() === walletAddress
    );

    if (walletIndex === -1) return 0;

    const preBalance = transaction.meta.preBalances[walletIndex];
    const postBalance = transaction.meta.postBalances[walletIndex];
    return Math.abs(postBalance - preBalance) / LAMPORTS_PER_SOL;
  };

  const fetchTransactions = async () => {
    if (!activeWallet?.publicKey) {
      setError("No wallet selected");
      return;
    }

    try {
      const publicKey = new PublicKey(activeWallet.publicKey);
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 5,
      });

      const transactionPromises = signatures.map(async (sig) => {
        const tx = await connection.getParsedTransaction(sig.signature);
        if (!tx || !activeWallet.publicKey) return null;

        const type = determineTransactionType(
          tx,
          activeWallet.publicKey.toString()
        );

        const amount = calculateTransactionAmount(
          tx,
          activeWallet.publicKey.toString()
        );

        return {
          signature: sig.signature,
          type,
          amount,
          timestamp: sig.blockTime || Date.now(),
          fromAddress: tx.transaction.message.accountKeys[0].pubkey.toString(),
          toAddress:
            tx.transaction.message.accountKeys[1]?.pubkey.toString() || "",
        };
      });

      const results = await Promise.all(transactionPromises);
      const validTransactions = results.filter(
        (tx): tx is Transaction => tx !== null
      );
      setTransactions(validTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions");
    }
  };

  const checkNetworkStatus = async () => {
    try {
      const start = Date.now();
      const version = await connection.getVersion();
      const latency = Date.now() - start;

      setNetworkStatus({
        status: version ? (latency < 1000 ? "up" : "degraded") : "down",
        latency,
      });
    } catch (error) {
      console.error("Network status check failed:", error);
      setNetworkStatus({ status: "down", latency: 0 });
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (activeWallet?.publicKey) {
        await Promise.all([
          fetchBalances(),
          fetchTransactions(),
          checkNetworkStatus(),
        ]);
      }
    };

    initialize();

    const statusInterval = setInterval(checkNetworkStatus, 30000);

    return () => {
      clearInterval(statusInterval);
    };
  }, [activeWallet?.publicKey, solPrice]);

  const refreshBalance = () => {
    fetchBalances();
  };

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <main className="flex-1 container max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <WalletSwitcher
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
          />
          <Badge
            variant={
              networkStatus.status === "up"
                ? "default"
                : networkStatus.status === "degraded"
                ? "secondary"
                : "destructive"
            }
          >
            Network: {networkStatus.status} ({networkStatus.latency}ms)
          </Badge>
        </div>

        <BalanceCard
          balance={balance}
          publicKey={activeWallet?.publicKey?.toString()}
          percentageChange={priceChange24h || 0}
          isLoading={isLoading}
          onRefresh={refreshBalance}
          privateKey={activeWallet?.privateKey|| ""}
        />

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredTokens.map((token) => (
            <TokenCard key={token.symbol} {...token} />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-3">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4 h-[76px]" />
                    </Card>
                  ))
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TransactionCard key={tx.signature} {...tx} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No transactions found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
      </main>
    </div>
  );
}
