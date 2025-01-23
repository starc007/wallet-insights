"use client";
import { LineTabs, Tabs } from "@/components";
import {
  AllNfts,
  AllTokens,
  AllTransactions,
  Overview,
} from "@/components/appComp/dashboard";
import { DataContextProvider } from "@/context/DataContext";
import { shortenAddress } from "@/utils/utils";
import { useAppKitAccount } from "@reown/appkit/react";
import React, { useState } from "react";
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

const Dashboard = () => {
  const { address } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState(0);

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

  return (
    <DataContextProvider overrideAddress={address}>
      <div className="max-w-6xl mx-auto my-10 lg:px-10">
        <h2 className="text-3xl font-semibold">
          Gm, {shortenAddress(address!)}
        </h2>
        <div className="mt-10">
          <LineTabs tabList={tabList} onTabChange={setActiveTab} />
        </div>
      </div>
    </DataContextProvider>
  );
};

export default Dashboard;
