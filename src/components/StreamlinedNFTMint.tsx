"use client";

import * as React from "react";
import { NFTCard } from "~/components/nft-card";
import { NFTMintButton } from "~/components/nft-mint-button";
import { useToast } from "~/hooks/use-toast";
import { useEthPrice } from "~/hooks/use-eth-price";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Sparkles, Zap, Clock, DollarSign, TrendingUp } from "lucide-react";

/**
 * Streamlined NFT Minting Experience
 * 
 * Features:
 * - Two-click minting: connect wallet -> mint
 * - Unlimited mints per wallet
 * - Fixed $0.10 worth of ETH pricing on Arbitrum
 * - Notification system for status updates
 */
export function StreamlinedNFTMint() {
  const { toast } = useToast();
  const { ethPriceUSD, pointOneUSDInEthFormatted, loading } = useEthPrice();
  
  // For demo purposes - replace with your actual contract address
  const CONTRACT_ADDRESS = "0x32dd0a7190b5bba94549a0d04659a9258f5b1387" as const;
  
  const handleMintSuccess = React.useCallback((txHash: string) => {
    toast({
      title: "Mint Successful!",
      description: `Your NFT has been minted successfully. Transaction: ${txHash.slice(0, 10)}...`,
      duration: 5000,
    });
  }, [toast]);
  
  const handleMintError = React.useCallback((error: string) => {
    toast({
      title: "Mint Failed",
      description: error,
      variant: "destructive",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Collection Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Limited Collection</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Clock className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pricing and Details */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Price</span>
            </div>
            {loading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <div className="text-right">
                <div className="font-semibold">$0.10 USD</div>
                <div className="text-xs text-muted-foreground">
                  ~{pointOneUSDInEthFormatted} ETH
                </div>
              </div>
            )}
          </div>
          
          {ethPriceUSD && (
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">ETH Price</span>
              </div>
              <span className="font-semibold">${ethPriceUSD.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Per Wallet</span>
            </div>
            <span className="font-semibold text-green-600">Unlimited</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Network</span>
            </div>
            <span className="font-semibold">Arbitrum</span>
          </div>
        </CardContent>
      </Card>

      {/* NFT Preview */}
      <div className="space-y-4">
        <NFTCard 
          contractAddress={CONTRACT_ADDRESS}
          tokenId="1"
          network="arbitrum"
          size={350}
          displayOptions={{
            showTitle: true,
            showNetwork: true,
            rounded: "xl",
            shadow: true,
          }}
        />
        
        {/* Mint Button */}
        <NFTMintButton
          contractAddress={CONTRACT_ADDRESS}
          network="arbitrum"
          amount={1}
          buttonText="Mint NFT - $0.10"
          variant="default"
          size="lg"
          className="w-full"
          onMintSuccess={handleMintSuccess}
          onMintError={handleMintError}
        />
      </div>
      
      {/* Quick Info */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Two clicks to mint: Connect wallet, then mint
        </p>
        <p className="text-xs text-muted-foreground">
          Powered by Arbitrum • Low gas fees
        </p>
      </div>
    </div>
  );
}