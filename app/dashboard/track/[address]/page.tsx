"use client";
import { DataContextProvider } from "@/context/DataContext";
import {
  AllNfts,
  AllTokens,
  AllTransactions,
  Overview,
} from "@/components/appComp/dashboard";
import { Tabs } from "@/components";
import { useTrackedWalletsContext } from "@/context/TrackedWalletsContext";
import { useAppKitAccount } from "@reown/appkit/react";

const tabList = [
  {
    title: "Tokens",
    content: <AllTokens />,
  },
  {
    title: "Nfts",
    content: <AllNfts />,
  },
  {
    title: "Transactions",
    content: <AllTransactions />,
  },
];

const TrackedWalletDetail = ({ params }: { params: { address: string } }) => {
  const { address } = params;
  const { trackedWallets } = useTrackedWalletsContext();
  const walletInfo = trackedWallets.find(
    (wallet) => wallet.address === address
  );

  return (
    <DataContextProvider overrideAddress={address}>
      <div className="max-w-6xl mx-auto my-10 lg:px-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">{walletInfo?.name}</h2>
            <p className="text-gray-500">{address}</p>
          </div>
        </div>
        <Overview />
        <div className="mt-10">
          <Tabs tabList={tabList} />
        </div>
      </div>
    </DataContextProvider>
  );
};

export default TrackedWalletDetail;
