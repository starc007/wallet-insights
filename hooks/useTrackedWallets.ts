import { useState, useEffect } from "react";

export interface TrackedWallet {
  id: string;
  address: string;
  name: string;
  createdAt: string;
  portfolio: number;
}

export const useTrackedWallets = (userAddress: string | undefined) => {
  const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([]);

  // Load tracked wallets from localStorage on mount
  useEffect(() => {
    if (userAddress) {
      const stored = localStorage.getItem(`tracked_wallets_${userAddress}`);
      if (stored) {
        setTrackedWallets(JSON.parse(stored));
      }
    }
  }, [userAddress]);

  // Save to localStorage whenever trackedWallets changes
  useEffect(() => {
    if (userAddress && trackedWallets.length > 0) {
      localStorage.setItem(
        `tracked_wallets_${userAddress}`,
        JSON.stringify(trackedWallets)
      );
    }
  }, [trackedWallets, userAddress]);

  const addWallet = async (address: string, name: string) => {
    const newWallet: TrackedWallet = {
      id: Math.random().toString(36).substr(2, 9),
      address,
      name,
      createdAt: new Date().toISOString(),
      portfolio: 0, // This will be updated when fetching wallet data
    };

    setTrackedWallets((prev) => [newWallet, ...prev]);
    return newWallet;
  };

  const removeWallet = (id: string) => {
    setTrackedWallets((prev) => prev.filter((wallet) => wallet.id !== id));
    if (userAddress) {
      const stored = localStorage.getItem(`tracked_wallets_${userAddress}`);
      if (stored) {
        const wallets = JSON.parse(stored).filter(
          (wallet: TrackedWallet) => wallet.id !== id
        );
        localStorage.setItem(
          `tracked_wallets_${userAddress}`,
          JSON.stringify(wallets)
        );
      }
    }
  };

  const updateWalletPortfolio = (id: string, portfolio: number) => {
    setTrackedWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === id ? { ...wallet, portfolio } : wallet
      )
    );
  };

  return {
    trackedWallets,
    addWallet,
    removeWallet,
    updateWalletPortfolio,
  };
};
