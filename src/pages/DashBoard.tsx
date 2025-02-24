import { useState, useEffect } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/context/wallet.context";
import { BalanceCard } from "@/components/cards/BalanceCard";
import { TokenCard } from "@/components/cards/TokenCard";
import { WalletSwitcher } from "@/components/WalletSwitcher";

type Token = {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  percentageChange: number;
  icon: string;
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
  const percentageChange = 15;
  //const [percentageChange, setPercentageChange] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);

  const connection = new Connection("https://api.devnet.solana.com");

  const fetchBalances = async () => {
    if (!activeWallet?.publicKey) return;

    setIsLoading(true);
    setError(null);
    try {
      const solBalance = await connection.getBalance(
        new PublicKey(activeWallet.publicKey)
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
      setError("Failed to fetch wallet balance");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeWallet?.publicKey) {
      fetchBalances();
    }
  }, [activeWallet?.publicKey]);

  const refreshBalance = () => {
    fetchBalances();
  };

  return (
    <div className="flex flex-col flex-1">
      {error && (
        <div className="bg-red-500 text-white p-4 text-center">{error}</div>
      )}
      <main className="flex-1 container max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex justify-center">
          <WalletSwitcher
            activeWallet={activeWallet}
            setActiveWallet={setActiveWallet}
          />
        </div>
        <BalanceCard
          balance={balance}
          publicKey={activeWallet?.publicKey?.toString()}
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
