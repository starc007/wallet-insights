"use client";
import { rasters } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

import { Button } from "../UI";

import { useRouter, usePathname } from "next/navigation";
import { shortenAddress } from "@/utils/utils";

const Navbar = () => {
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const pathname = usePathname();
  const { open } = useAppKit();

  useEffect(() => {
    if (address && pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  }, [address, pathname]);

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
          <span className="text-xl font-semibold">walletwit</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant={isConnected ? "outline" : "special"}
            onClick={() => open()}
          >
            {isConnected ? shortenAddress(address!) : "connect wallet"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
