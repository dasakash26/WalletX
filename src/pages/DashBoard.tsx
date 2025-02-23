import { useState, useEffect } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/context/wallet.context";
import { BalanceCard } from "@/components/cards/BalanceCard";
import { TokenCard } from "@/components/cards/TokenCard";

type Token = {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  percentageChange: number;
  icon: string;
};

export function DashBoard() {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);

  const connection = new Connection("https://api.devnet.solana.com");

  const fetchBalances = async () => {
    if (!wallet?.publicKey) return;

    setIsLoading(true);
    try {
      const solBalance = await connection.getBalance(
        new PublicKey(wallet.publicKey)
      );
      const solInUSD = (solBalance / LAMPORTS_PER_SOL) * 100;

      setBalance(solInUSD);
      setTokens([
        {
          symbol: "SOL",
          name: "Solana",
          balance: solBalance / LAMPORTS_PER_SOL,
          usdValue: solInUSD,
          percentageChange: 0,
          icon: "🌞",
        },
      ]);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      fetchBalances();
    }
  }, [wallet?.publicKey]);

  const refreshBalance = () => {
    fetchBalances();
  };

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 container max-w-2xl mx-auto p-4 space-y-6">
        <BalanceCard
          balance={balance}
          publicKey={wallet?.publicKey?.toString()}
          percentageChange={percentageChange}
          isLoading={isLoading}
          onRefresh={refreshBalance}
        />

        <div className="space-y-4">
          {tokens.map((token) => (
            <TokenCard key={token.symbol} {...token} />
          ))}
        </div>
      </main>
    </div>
  );
}
