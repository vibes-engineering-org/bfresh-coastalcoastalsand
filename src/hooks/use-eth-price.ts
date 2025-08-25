"use client";

import * as React from "react";

/**
 * Hook to fetch current ETH price in USD and calculate $0.10 worth of ETH
 * Uses a free API to get real-time ETH price
 */
export function useEthPrice() {
  const [ethPriceUSD, setEthPriceUSD] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchEthPrice() {
      try {
        setLoading(true);
        setError(null);
        
        // Using CoinGecko's free API to get ETH price
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch ETH price");
        }
        
        const data = await response.json();
        const price = data.ethereum?.usd;
        
        if (typeof price !== "number") {
          throw new Error("Invalid price data received");
        }
        
        setEthPriceUSD(price);
      } catch (err) {
        console.error("Error fetching ETH price:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fallback to approximate ETH price if API fails
        setEthPriceUSD(3300);
      } finally {
        setLoading(false);
      }
    }

    fetchEthPrice();
    
    // Refresh price every 5 minutes
    const interval = setInterval(fetchEthPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate $0.10 worth of ETH
  const pointOneUSDInEth = React.useMemo(() => {
    if (!ethPriceUSD) return null;
    return 0.1 / ethPriceUSD;
  }, [ethPriceUSD]);

  // Format as string for display
  const pointOneUSDInEthFormatted = React.useMemo(() => {
    if (!pointOneUSDInEth) return "0.00003";
    return pointOneUSDInEth.toFixed(8);
  }, [pointOneUSDInEth]);

  return {
    ethPriceUSD,
    pointOneUSDInEth,
    pointOneUSDInEthFormatted,
    loading,
    error,
  };
}