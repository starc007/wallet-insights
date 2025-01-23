"use client";
import { Tabs } from "@/components";
import {
  AllNfts,
  AllTokens,
  AllTransactions,
  Overview,
} from "@/components/appComp/dashboard";
import { DataContextProvider } from "@/context/DataContext";
import { shortenAddress } from "@/utils/utils";
import { useAppKitAccount } from "@reown/appkit/react";
import React from "react";
import TrackWallet from "@/components/appComp/dashboard/TrackWallet";

const innerTabList = [
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

const tabList = [
  {
    title: "Home",
    content: (
      <div>
        <Overview />
        <div className="mt-10">
          <Tabs tabList={innerTabList} />
        </div>
      </div>
    ),
  },
  {
    title: "Track",
    content: <TrackWallet />,
  },
];

const Dashboard = () => {
  const { address } = useAppKitAccount();
  return (
    <DataContextProvider>
      <div className="max-w-6xl mx-auto my-10 lg:px-10">
        <h2 className="text-3xl font-semibold">
          Gm, {shortenAddress(address!)}
        </h2>
        <div className="mt-10">
          <Tabs tabList={tabList} />
        </div>
      </div>
    </DataContextProvider>
  );
};

export default Dashboard;
