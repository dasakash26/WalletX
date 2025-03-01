import { useState, useEffect, useRef } from "react";

const useSolanaPrice = (pollInterval = 60000) => {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();

    const fetchPrice = async (retries = 3, delay = 2000) => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true",
          { signal: controller.signal }
        );

        if (!response.ok) {
          if (response.status === 429 && retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchPrice(retries - 1, delay * 2);
          }
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.solana || typeof data.solana.usd === "undefined") {
          throw new Error("Unexpected API response format");
        }

        if (isMountedRef.current) {
          setSolPrice(data.solana.usd);
          setPriceChange24h(data.solana.usd_24h_change);
          setError(null);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        if (isMountedRef.current) {
          console.error("Error fetching SOL price:", err);
          setError(err.message || "Error fetching SOL price");
        }
      }
    };

    fetchPrice();
    const intervalId = setInterval(fetchPrice, pollInterval);

    return () => {
      isMountedRef.current = false;
      controller.abort();
      clearInterval(intervalId);
    };
  }, [pollInterval]);

  return { solPrice, priceChange24h, error };
};

export default useSolanaPrice;
