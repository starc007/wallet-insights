import React, { useState, useEffect } from "react";
import { Button } from "@/components/UI";
import { Input } from "@/components/UI";
import { shortenAddress } from "@/utils/utils";
import Image from "next/image";
import { rasters } from "@/assets";
import Link from "next/link";

import toast from "react-hot-toast";
import { Modal } from "@/components/UI/Modal";
import { AddCircleIcon } from "hugeicons-react";
import { useTrackedWalletsContext } from "@/context/TrackedWalletsContext";
import { useDataContext } from "@/context/DataContext";
import { useTrackedWallets } from "@/hooks/useTrackedWallets";
import { useAppKitAccount } from "@reown/appkit/react";
import { Shimmer } from "@/components/UI/Shimmer";

const TrackWallet = () => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    trackedWallets,
    addWallet,
    removeWallet,
    isLoading,
    calculatePortfolio,
  } = useTrackedWalletsContext();
  const { fetchWalletData } = useDataContext();
  const { address: userAddress } = useAppKitAccount();
  const { updateWalletPortfolio } = useTrackedWallets(userAddress);

  useEffect(() => {
    const updatePortfolios = async () => {
      if (trackedWallets.length > 0) {
        setLoading(true);
        try {
          await Promise.all(
            trackedWallets.map(async (wallet) => {
              const data = await fetchWalletData(wallet.address);
              const portfolio = calculatePortfolio(
                data.tokensPrices,
                data.tokensInfo
              );
              const totalValue =
                portfolio + data.nftData?.nativeBalance?.total_price;

              updateWalletPortfolio(wallet.id, totalValue);
            })
          );
        } catch (error) {
          console.error("Error updating portfolios:", error);
        }
        setLoading(false);
      }
    };

    updatePortfolios();
  }, [trackedWallets?.length]);

  const handleTrack = async () => {
    if (!address || !name) return;

    setLoading(true);
    try {
      await addWallet(address, name);

      // Fetch and update portfolio for the new wallet immediately
      const data = await fetchWalletData(address);
      const portfolio = calculatePortfolio(data.tokensPrices, data.tokensInfo);
      const totalValue = portfolio + data.nftData?.nativeBalance?.total_price;

      // Find the newly added wallet and update its portfolio
      const newWallet = trackedWallets.find((w) => w.address === address);
      if (newWallet) {
        updateWalletPortfolio(newWallet.id, totalValue);
      }

      setAddress("");
      setName("");
      setIsModalOpen(false);
      toast.success("Wallet tracked successfully!");
    } catch (error) {
      console.error("Error tracking wallet:", error);
      toast.error("Failed to track wallet");
    }
    setLoading(false);
  };

  const handleRemoveWallet = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeWallet(id);
    toast.success("Wallet removed from tracking");
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-primary/50">Tracked Wallets</h2>
        <Button
          variant="special"
          onClick={() => setIsModalOpen(true)}
          lefticon={<AddCircleIcon size={20} />}
        >
          Track New Wallet
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        title="Track New Wallet"
        showCloseButton
      >
        <div className="mt-5">
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              placeholder="Enter name for this wallet"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              onClick={handleTrack}
              disabled={!address || !name || loading}
              showloading={loading}
              className="w-full"
            >
              Track Wallet
            </Button>
          </div>
        </div>
      </Modal>

      <div className="mt-5">
        {trackedWallets.length === 0 ? (
          <div className="max-w-lg mx-auto mt-24 flex flex-col items-center justify-center border-2 border-gray-100 bg-gray-50 rounded-2xl h-48">
            <Image src={rasters.wallet} alt="wallet" className="w-16 h-16" />
            <p className="text-primaryLight font-medium mt-5 text-lg">
              No wallets tracked yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackedWallets.map((wallet) => (
              <Link
                key={wallet.id}
                href={`/dashboard/track/${wallet.address}`}
                className="block group border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Image
                      src={rasters.wallet}
                      alt="wallet"
                      className="w-10 h-10"
                    />
                    <div>
                      <h3 className="font-medium">{wallet.name}</h3>
                      <p className="text-sm text-gray-500">
                        {shortenAddress(wallet.address)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleRemoveWallet(e, wallet.id)}
                  >
                    <span className="text-red-500">Remove</span>
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Portfolio Value</p>
                  {loading || isLoading ? (
                    <Shimmer className="h-8 w-32" />
                  ) : (
                    <p className="text-xl font-semibold">
                      ${wallet.portfolio.toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackWallet;
