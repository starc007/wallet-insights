"use client";

import React from "react";

import {
  projectId,
  solanaWeb3JsAdapter,
  walletMetadata,
} from "@/utils/walletConfig";
import { createAppKit } from "@reown/appkit/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: walletMetadata,
  projectId: projectId!,
  features: {
    socials: [],
    email: false,
  },
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default WalletProvider;
