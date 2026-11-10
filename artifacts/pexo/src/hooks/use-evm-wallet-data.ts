import { useCallback, useMemo } from "react";
import { formatUnits, zeroAddress, type Address } from "viem";
import { useBalance, useReadContracts } from "wagmi";
import { useCryptoPrices } from "@/lib/crypto-prices";
import { evmNetworkById } from "@/lib/reown-config";
import { useEvmWallet } from "@/lib/evm-wallet-provider";

const erc20BalanceAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

interface TokenDefinition {
  id: string;
  name: string;
  symbol: string;
  chainId: number;
  chainName: string;
  address: Address;
  decimals: number;
}

export interface EvmWalletAsset {
  id: string;
  name: string;
  symbol: string;
  chainId: number;
  chainName: string;
  balance: number;
  decimals: number;
  usdPrice: number | null;
  usdValue: number | null;
  isNative: boolean;
  contractAddress?: Address;
}

const tokenDefinitions: TokenDefinition[] = [
  {
    id: "ethereum:usdt",
    name: "Tether USD",
    symbol: "USDT",
    chainId: 1,
    chainName: "Ethereum",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
  },
  {
    id: "ethereum:usdc",
    name: "USD Coin",
    symbol: "USDC",
    chainId: 1,
    chainName: "Ethereum",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
  },
  {
    id: "polygon:usdt",
    name: "Tether USD",
    symbol: "USDT",
    chainId: 137,
    chainName: "Polygon",
    address: "0xc2132d05d31c914a87c6611c10748aacba5a600",
    decimals: 6,
  },
  {
    id: "polygon:usdc",
    name: "USD Coin",
    symbol: "USDC",
    chainId: 137,
    chainName: "Polygon",
    address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    decimals: 6,
  },
  {
    id: "bsc:usdt",
    name: "Tether USD",
    symbol: "USDT",
    chainId: 56,
    chainName: "BNB Smart Chain",
    address: "0x55d398326f99059ff775485246999027b3197955",
    decimals: 18,
  },
  {
    id: "bsc:usdc",
    name: "USD Coin",
    symbol: "USDC",
    chainId: 56,
    chainName: "BNB Smart Chain",
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    decimals: 18,
  },
  {
    id: "arbitrum:usdt",
    name: "Tether USD",
    symbol: "USDT",
    chainId: 42161,
    chainName: "Arbitrum One",
    address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    decimals: 6,
  },
  {
    id: "arbitrum:usdc",
    name: "USD Coin",
    symbol: "USDC",
    chainId: 42161,
    chainName: "Arbitrum One",
    address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    decimals: 6,
  },
  {
    id: "base:usdc",
    name: "USD Coin",
    symbol: "USDC",
    chainId: 8453,
    chainName: "Base",
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    decimals: 6,
  },
  {
    id: "avalanche:usdt",
    name: "Tether USD",
    symbol: "USDT",
    chainId: 43114,
    chainName: "Avalanche",
    address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
    decimals: 6,
  },
  {
    id: "arbitrum:arb",
    name: "Arbitrum",
    symbol: "ARB",
    chainId: 42161,
    chainName: "Arbitrum One",
    address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
    decimals: 18,
  },
  {
    id: "optimism:op",
    name: "Optimism",
    symbol: "OP",
    chainId: 10,
    chainName: "OP Mainnet",
    address: "0x4200000000000000000000000000000000000042",
    decimals: 18,
  },
];

const nativeAssets = [
  { id: "ethereum:eth", name: "Ethereum", symbol: "ETH", chainId: 1, decimals: 18 },
  { id: "polygon:pol", name: "Polygon", symbol: "POL", chainId: 137, decimals: 18 },
  { id: "bsc:bnb", name: "BNB", symbol: "BNB", chainId: 56, decimals: 18 },
  { id: "arbitrum:eth", name: "Ethereum", symbol: "ETH", chainId: 42161, decimals: 18 },
  { id: "base:eth", name: "Ethereum", symbol: "ETH", chainId: 8453, decimals: 18 },
  { id: "optimism:eth", name: "Ethereum", symbol: "ETH", chainId: 10, decimals: 18 },
  { id: "avalanche:avax", name: "Avalanche", symbol: "AVAX", chainId: 43114, decimals: 18 },
] as const;

export function useEvmWalletData() {
  const wallet = useEvmWallet();
  const address = wallet.address;
  const enabled = Boolean(wallet.configured && wallet.isConnected && address);

  const ethereum = useBalance({ address, chainId: 1, query: { enabled, refetchInterval: 30_000 } });
  const polygon = useBalance({ address, chainId: 137, query: { enabled, refetchInterval: 30_000 } });
  const bsc = useBalance({ address, chainId: 56, query: { enabled, refetchInterval: 30_000 } });
  const arbitrum = useBalance({ address, chainId: 42161, query: { enabled, refetchInterval: 30_000 } });
  const base = useBalance({ address, chainId: 8453, query: { enabled, refetchInterval: 30_000 } });
  const optimism = useBalance({ address, chainId: 10, query: { enabled, refetchInterval: 30_000 } });
  const avalanche = useBalance({ address, chainId: 43114, query: { enabled, refetchInterval: 30_000 } });

  const contracts = tokenDefinitions.map((token) => ({
    address: token.address,
    abi: erc20BalanceAbi,
    functionName: "balanceOf" as const,
    args: [address ?? zeroAddress] as const,
    chainId: token.chainId,
  }));

  const tokenBalances = useReadContracts({
    contracts,
    allowFailure: true,
    query: { enabled, refetchInterval: 30_000 },
  });

  const priceSymbols = ["ETH", "POL", "BNB", "AVAX", "USDT", "USDC", "ARB", "OP"];
  const prices = useCryptoPrices(priceSymbols);

  const assets = useMemo(() => {
    if (!enabled) return [];

    const nativeResults = [
      ethereum.data,
      polygon.data,
      bsc.data,
      arbitrum.data,
      base.data,
      optimism.data,
      avalanche.data,
    ];

    const output: EvmWalletAsset[] = [];
    nativeAssets.forEach((definition, index) => {
      const result = nativeResults[index];
      const balance = result?.formatted ?? "0";
      if (Number(balance) <= 0) return;
      const price = prices.data?.[definition.symbol]?.current_price;
      output.push({
        id: definition.id,
        name: definition.name,
        symbol: definition.symbol,
        chainId: definition.chainId,
        chainName: evmNetworkById.get(definition.chainId)?.name ?? "EVM network",
        balance: Number(balance),
        decimals: definition.decimals,
        usdPrice: typeof price === "number" ? price : null,
        usdValue: typeof price === "number" ? Number(balance) * price : null,
        isNative: true,
      });
    });

    tokenDefinitions.forEach((definition, index) => {
      const result = tokenBalances.data?.[index];
      if (!result || result.status !== "success" || typeof result.result !== "bigint") {
        return;
      }
      const balance = formatUnits(result.result, definition.decimals);
      if (Number(balance) <= 0) return;
      const price = prices.data?.[definition.symbol]?.current_price;
      output.push({
        id: definition.id,
        name: definition.name,
        symbol: definition.symbol,
        chainId: definition.chainId,
        chainName: definition.chainName,
        balance: Number(balance),
        decimals: definition.decimals,
        usdPrice: typeof price === "number" ? price : null,
        usdValue: typeof price === "number" ? Number(balance) * price : null,
        isNative: false,
        contractAddress: definition.address,
      });
    });

    return output.sort((a, b) => {
      const valueDifference = (b.usdValue ?? 0) - (a.usdValue ?? 0);
      return valueDifference || a.symbol.localeCompare(b.symbol);
    });
  }, [
    enabled,
    ethereum.data,
    polygon.data,
    bsc.data,
    arbitrum.data,
    base.data,
    optimism.data,
    avalanche.data,
    tokenBalances.data,
    prices.data,
  ]);

  const refetch = useCallback(async () => {
    await Promise.all([
      ethereum.refetch(),
      polygon.refetch(),
      bsc.refetch(),
      arbitrum.refetch(),
      base.refetch(),
      optimism.refetch(),
      avalanche.refetch(),
      tokenBalances.refetch(),
      prices.refetch(),
    ]);
  }, [
    ethereum.refetch,
    polygon.refetch,
    bsc.refetch,
    arbitrum.refetch,
    base.refetch,
    optimism.refetch,
    avalanche.refetch,
    tokenBalances.refetch,
    prices.refetch,
  ]);

  const balanceQueries = [
    ethereum,
    polygon,
    bsc,
    arbitrum,
    base,
    optimism,
    avalanche,
  ];
  const hasBalanceData = balanceQueries.some((query) => query.data);
  const allBalanceReadsFailed =
    balanceQueries.every((query) => query.isError) && tokenBalances.isError;

  return {
    assets,
    totalUsd: assets.reduce((total, asset) => total + (asset.usdValue ?? 0), 0),
    isLoading:
      enabled &&
      (balanceQueries.some((query) => query.isLoading) || tokenBalances.isLoading),
    isError: enabled && allBalanceReadsFailed && !hasBalanceData,
    error:
      enabled && allBalanceReadsFailed && !hasBalanceData
        ? new Error(
            "Could not read balances from the supported networks. Check the connection and try again.",
          )
        : null,
    isPriceLoading: prices.isLoading,
    refetch,
  };
}
