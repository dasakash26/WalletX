import { Wallet } from "@/types/wallet";
import { getWallets } from "@/utils/storage";
import { useEffect, useState } from "react";

function Test() {
  const [wallets, setWallets] = useState<Wallet[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWallets() {
      try {
        const res = await getWallets("akash", "SOLANA");
        console.log(res);
        setWallets(res);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch wallets"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWallets();
  }, []);

  if (loading) {
    return <div className="p-4">Loading wallets...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Wallets</h1>
      {wallets && wallets.length > 0 ? (
        <div className="grid gap-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.publicKey}
              className="border p-4 rounded-lg shadow"
            >
              <p className="font-medium">Address: {wallet.publicKey}</p>
              <p>Name: {wallet.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No wallets found</p>
      )}
    </div>
  );
}

export default Test;
