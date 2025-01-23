"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { useTrackedWallets, TrackedWallet } from "@/hooks/useTrackedWallets";
import { useAppKitAccount } from "@reown/appkit/react";

import { useDataContext } from "@/context/DataContext";

interface TrackedWalletsContextProps {
  trackedWallets: TrackedWallet[];
  addWallet: (address: string, name: string) => Promise<void>;
  removeWallet: (id: string) => void;
  isLoading: boolean;
  calculatePortfolio: (tokensPrices: any, tokensInfo: IToken[]) => number;
}

const TrackedWalletsContext = createContext<TrackedWalletsContextProps>({
  trackedWallets: [],
  addWallet: async () => {},
  removeWallet: () => {},
  isLoading: false,
  calculatePortfolio: () => 0,
});

export const useTrackedWalletsContext = () => useContext(TrackedWalletsContext);

export const TrackedWalletsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { address: userAddress } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchWalletData } = useDataContext();
  const {
    trackedWallets,
    addWallet: addTrackedWallet,
    removeWallet,
    updateWalletPortfolio,
  } = useTrackedWallets(userAddress);

  const calculatePortfolio = (
    tokensPrices: any,
    tokensInfo: IToken[]
  ): number => {
    let total = 0;
    const isTokenPrices = Object.keys(tokensPrices).length > 0;

    if (isTokenPrices && tokensInfo.length > 0) {
      tokensInfo.forEach((token) => {
        const pricePerToken = tokensPrices[token.address]?.price;

        const totalTokens = token.amount / 10 ** token.decimals;
        const price = (pricePerToken || 0) * totalTokens;

        total += price;
      });
    }
    return total;
  };

  const updateAllWalletPortfolios = useCallback(async () => {
    if (!trackedWallets.length) return;

    setIsLoading(true);
    try {
      console.log("trackedWallets", trackedWallets);
      await Promise.all(
        trackedWallets.map(async (wallet) => {
          const data = await fetchWalletData(wallet.address);
          console.log("data", data);
          const portfolio = calculatePortfolio(
            data.tokensPrices,
            data.tokensInfo
          );
          updateWalletPortfolio(wallet.id, portfolio);
        })
      );
    } catch (error) {
      console.error("Error updating wallet portfolios:", error);
    }
    setIsLoading(false);
  }, [fetchWalletData, updateWalletPortfolio]);

  const addWallet = async (address: string, name: string) => {
    const wallet = await addTrackedWallet(address, name);
    const data = await fetchWalletData(address);
    const portfolio = calculatePortfolio(data.tokensPrices, data.tokensInfo);
    updateWalletPortfolio(wallet.id, portfolio);
  };

  return (
    <TrackedWalletsContext.Provider
      value={{
        trackedWallets,
        addWallet,
        removeWallet,
        isLoading,
        calculatePortfolio,
      }}
    >
      {children}
    </TrackedWalletsContext.Provider>
  );
};
