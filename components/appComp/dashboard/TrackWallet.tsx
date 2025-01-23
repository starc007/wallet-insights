import React, { useState } from "react";
import { Button } from "@/components/UI";
import { Input } from "@/components/UI";
import { useAppKitAccount } from "@reown/appkit/react";
import { shortenAddress } from "@/utils/utils";
import Image from "next/image";
import { rasters } from "@/assets";
import Link from "next/link";
import { useTrackedWallets } from "@/hooks/useTrackedWallets";
import toast from "react-hot-toast";

const TrackWallet = () => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { address: userAddress } = useAppKitAccount();
  const { trackedWallets, addWallet, removeWallet } =
    useTrackedWallets(userAddress);

  const handleTrack = async () => {
    if (!address || !name) return;

    setLoading(true);
    try {
      await addWallet(address, name);
      setAddress("");
      setName("");
      toast.success("Wallet tracked successfully!");
    } catch (error) {
      console.error("Error tracking wallet:", error);
      toast.error("Failed to track wallet");
    }
    setLoading(false);
  };

  return (
    <div className="mt-5">
      <div className="max-w-2xl">
        <h2 className="text-xl font-medium text-primary/50 mb-5">
          Track Other Wallets
        </h2>
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
          >
            Track Wallet
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-medium text-primary/50 mb-5">
          Tracked Wallets
        </h2>
        {trackedWallets.length === 0 ? (
          <div className="max-w-lg flex flex-col items-center justify-center border-2 border-gray-100 bg-gray-50 rounded-2xl h-48">
            <Image src={rasters.wallet} alt="wallet" className="w-16 h-16" />
            <p className="text-primaryLight font-medium mt-5 text-lg">
              No wallets tracked yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackedWallets.map((wallet) => (
              <Link
                href={`/dashboard/track/${wallet.address}`}
                key={wallet.id}
                className="group border border-gray-100 rounded-xl p-5 hover:bg-gray-50 transition duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                    onClick={(e) => {
                      e.preventDefault();
                      removeWallet(wallet.id);
                      toast.success("Wallet removed from tracking");
                    }}
                  >
                    <span className="text-red-500">Remove</span>
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Portfolio Value</p>
                  <p className="text-xl font-semibold">
                    ${wallet.portfolio.toFixed(2)}
                  </p>
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
