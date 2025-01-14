"use client";

import React, { FC } from "react";
import UnauthorizedState from "./UnauthorizedState";
import { useAppKitAccount } from "@reown/appkit/react";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const { address } = useAppKitAccount();

  if (!address) {
    return <UnauthorizedState />;
  }

  return children;
};

export default ProtectedRoute;
