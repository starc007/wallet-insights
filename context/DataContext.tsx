/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  getAllNFTs,
  getAllTokens,
  getTokenInfo,
  getTokenPrice,
} from "@/apiRoutes/api";

interface DataContextProps {
  nftData: NftData;
  tokensData: TokenData;
  isLoading: boolean;
  tokensPrices: Record<string, ITokenPrice>;
  loader: boolean;
  tokensInfo: IToken[];
  fetchWalletData: (address: string) => Promise<{
    nftData: NftData;
    tokensData: TokenData;
    tokensPrices: Record<string, ITokenPrice>;
    tokensInfo: IToken[];
  }>;
}

export const initialState: DataContextProps = {
  nftData: {
    grand_total: 0,
    items: [],
    limit: 10,
    page: 1,
    total: 0,
    nativeBalance: {
      lamports: 0,
      price_per_sol: 0,
      total_price: 0,
    },
  },
  tokensData: {
    limit: 10,
    page: 1,
    total: 0,
    token_accounts: [],
  },
  isLoading: false,
  tokensPrices: {},
  loader: false,
  tokensInfo: [],
  fetchWalletData: async () => ({
    nftData: initialState.nftData,
    tokensData: initialState.tokensData,
    tokensPrices: {},
    tokensInfo: [],
  }),
};

export const DataContext = createContext<DataContextProps>(initialState);
export const useDataContext = () => useContext(DataContext);

// Add this helper function outside the component
const processTokensInfo = (info: any[], tokensDataInfo: any): IToken[] => {
  return info
    .map((token: any) => {
      const amount = tokensDataInfo.token_accounts.find(
        (tokenAccount: any) => tokenAccount.mint === token.account
      )?.amount;

      return {
        name: token.offChainMetadata?.metadata?.name || "-",
        symbol: token.offChainMetadata?.metadata?.symbol || "-",
        logo:
          token.offChainMetadata?.metadata?.image ||
          "https://placehold.co/200x200",
        amount: amount,
        address: token.account,
        decimals:
          token?.onChainAccountInfo?.accountInfo?.data?.parsed?.info?.decimals,
      };
    })
    .filter(Boolean);
};

export const DataContextProvider: FC<{
  children: ReactNode;
  overrideAddress?: string;
}> = ({ children, overrideAddress }) => {
  const { address: connectedAddress } = useAppKitAccount();
  const address = overrideAddress || connectedAddress;
  const [nftData, setNftData] = useState<NftData>(initialState.nftData);
  const [tokensData, setTokensData] = useState<any>(initialState.tokensData);
  const [isError, setIsError] = useState(false);
  const isFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [tokensPrices, setTokensPrices] = useState<Record<string, ITokenPrice>>(
    {}
  );
  const [tokensInfo, setTokensInfo] = useState<IToken[] | []>([]);

  const fetchWalletData = async (walletAddress: string) => {
    try {
      const [nftData, tokensDataInfo] = await Promise.all([
        getAllNFTs(walletAddress),
        getAllTokens(walletAddress),
      ]);

      let prices = {};
      let tokensInfoData: IToken[] = [];

      if (tokensDataInfo?.token_accounts.length > 0) {
        const allMintAddress = tokensDataInfo.token_accounts.map(
          (token: any) => token.mint
        );

        const [pricesData, info] = await Promise.all([
          getTokenPrice(allMintAddress),
          getTokenInfo(allMintAddress),
        ]);

        prices = pricesData;
        tokensInfoData = processTokensInfo(info, tokensDataInfo);
      }

      return {
        nftData,
        tokensData: tokensDataInfo,
        tokensPrices: prices,
        tokensInfo: tokensInfoData,
      };
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      return {
        nftData: initialState.nftData,
        tokensData: initialState.tokensData,
        tokensPrices: {},
        tokensInfo: [],
      };
    }
  };

  const parallelFetch = async () => {
    setIsLoading(true);
    const data = await fetchWalletData(address!);
    setIsLoading(false);

    if (data.nftData) {
      setNftData(data.nftData);
    }
    if (data.tokensInfo) {
      setTokensData(data.tokensData);
      setTokensPrices(data.tokensPrices);
      setTokensInfo(data.tokensInfo);
    }

    if (!data.nftData && !data.tokensData) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!isFetched.current && address) {
      isFetched.current = true;
      parallelFetch();
    }
  }, [isFetched, address]);

  return (
    <DataContext.Provider
      value={{
        nftData,
        tokensData,
        isLoading,
        tokensPrices,
        loader,
        tokensInfo,
        fetchWalletData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
