"use client";
import { rasters } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "../UI";
import { usePathname } from "next/navigation";
import { shortenAddress } from "@/utils/utils";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const pathname = usePathname();
  const { open } = useAppKit();

  return (
    <nav className="glass_bg px-4 border-b border-gray-50 h-16 flex items-center sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={rasters.logo}
            alt="logo"
            width={100}
            height={100}
            className="w-7"
          />
          <span className="text-xl font-semibold">WalletScope</span>
        </Link>
        <div className="flex items-center gap-3">
          {isConnected && (
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
          )}
          <Button
            variant={isConnected ? "outline" : "special"}
            onClick={() => open()}
          >
            {isConnected ? shortenAddress(address!) : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
