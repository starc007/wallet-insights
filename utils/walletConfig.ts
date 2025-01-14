import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

export const walletMetadata = {
  name: "Wallet Insight",
  description: "Wallet Insight",
  url: "https://walletinsight.xyz", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};
