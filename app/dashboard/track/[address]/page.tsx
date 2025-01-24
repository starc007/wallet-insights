"use client";
import { DataContextProvider } from "@/context/DataContext";
import {
  AllNfts,
  AllTokens,
  AllTransactions,
  Overview,
  Analysis,
} from "@/components/appComp/dashboard";
import { Tabs } from "@/components";
import { useTrackedWalletsContext } from "@/context/TrackedWalletsContext";
import { Button } from "@/components/UI";
import { useRouter } from "next/navigation";
import { ArrowLeft01Icon } from "hugeicons-react";

const TrackedWalletDetail = ({ params }: { params: { address: string } }) => {
  const { address } = params;
  const router = useRouter();
  const { trackedWallets } = useTrackedWalletsContext();
  const walletInfo = trackedWallets.find(
    (wallet) => wallet.address === address
  );

  const tabList = [
    {
      title: "Analysis",
      content: <Analysis address={address} />,
    },
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

  return (
    <DataContextProvider overrideAddress={address}>
      <div className="max-w-6xl mx-auto my-10 lg:px-10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            lefticon={<ArrowLeft01Icon size={20} />}
          >
            Back
          </Button>
        </div>
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
