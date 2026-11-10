import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { getCryptoPrices, convertCurrency } from "@/lib/crypto-prices";
import { useWalletBalances } from "./use-wallet-balances";
import { useState, useEffect, useMemo } from "react";

export interface WalletData {
  totalBalance: number;
  pnlUSD: number;
  pnlPercent: number;
  userId?: string;
  preferredCurrency: string;
  isConverting: boolean;
  assets: {
    symbol: string;
    name: string;
    balance: number;
    price: number;
    value: number;
    change24h: number;
  }[];
}

const ASSET_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  TRX: "Tron",
  USDT: "Tether",
  USDC: "USD Coin",
  BNB: "BNB",
  XRP: "XRP",
  MATIC: "Polygon",
  ARB: "Arbitrum",
  OP: "Optimism",
  AVAX: "Avalanche",
};

const VALID_CRYPTO_SYMBOLS = Object.keys(ASSET_NAMES);

// Polygon's native token was renamed MATIC -> POL (1:1). The monitor reports POL;
// fold it into the MATIC row so the balance is not filtered out.
const SYMBOL_ALIASES: Record<string, string> = { POL: "MATIC" };

const SORT_ORDER: Record<string, number> = {
  BTC: 1,
  ETH: 2,
  SOL: 3,
  TRX: 4,
  USDT: 5,
  USDC: 6,
  BNB: 7,
  XRP: 8,
  MATIC: 9,
  ARB: 10,
  OP: 11,
  AVAX: 12,
};

export function useWalletData() {
  const { user } = useAuth();

  // Pull live balances from the edge function.
  // isLoading is true on the very first fetch (no cached data yet).
  const {
    data: monitoredBalances,
    isLoading: balancesLoading,
  } = useWalletBalances();

  const [preferredCurrency, setPreferredCurrency] = useState<string>(() => {
    if (typeof window !== "undefined" && user?.id) {
      return (localStorage.getItem(`pexly_currency_${user.id}`) || "USD").toUpperCase();
    }
    return "USD";
  });
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!user?.id) return;
      if (e.key === `pexly_currency_${user.id}` && e.newValue) {
        setPreferredCurrency(e.newValue.toUpperCase());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user?.id]);

  // Stable key derived from live balances — only changes when actual data changes.
  const balancesKey = useMemo(() => {
    if (!monitoredBalances) return null;
    return monitoredBalances.map(b => `${b.crypto_symbol}:${b.balance}`).join(",");
  }, [monitoredBalances]);

  const query = useQuery<WalletData>({
    queryKey: ["wallet-data", user?.id, balancesKey, preferredCurrency],
    // Only run after the live balance fetch has settled.
    // This prevents the hook from falling back to stale local data (balance=0)
    // before the edge-function response arrives.
    enabled: !!user?.id && !balancesLoading && balancesKey !== null,
    // Cache the computed result for the full balance-poll window.
    // The query key already changes whenever live balances change (via balancesKey),
    // so there is no need for an independent price-refresh timer — that would cause
    // the displayed balance to jump every 15 s even when holdings haven't changed.
    staleTime: 60_000,
    // Do not poll on a separate timer. Let useWalletBalances drive updates:
    // when its 60 s poll returns new on-chain data, balancesKey changes, this
    // query fires automatically with the fresh numbers.
    refetchInterval: false,
    // Skip the extra network call on tab focus — the 60 s cycle is frequent enough.
    refetchOnWindowFocus: false,
    // Keep previous data visible while a new key's query is in-flight,
    // preventing a flash of zero balances between refetches.
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      // monitoredBalances is guaranteed to be defined here (enabled gate above).
      // Map to the shape the rest of the pipeline expects.
      const wallets = (monitoredBalances ?? []).map((mb: any) => ({
        crypto_symbol: mb.crypto_symbol,
        balance: Number(mb.balance) || 0,
      }));

      // Normalize & filter to known symbols
      const normalizedWallets = wallets
        .map(w => {
          const raw = (w.crypto_symbol || "").toUpperCase();
          const rawBase = raw.split("-")[0];
          const baseSymbol = SYMBOL_ALIASES[rawBase] ?? rawBase;
          return { symbol: baseSymbol, balance: typeof w.balance === "number" ? w.balance : 0 };
        })
        .filter(w => VALID_CRYPTO_SYMBOLS.includes(w.symbol));

      const symbols = [...new Set(normalizedWallets.map(w => w.symbol))];
      const priceResponse = await getCryptoPrices(symbols.length > 0 ? symbols : VALID_CRYPTO_SYMBOLS);

      const prices: Record<string, { price: number; change24h: number }> = {};
      if (Array.isArray(priceResponse)) {
        priceResponse.forEach(p => {
          if (p?.symbol) prices[p.symbol.toUpperCase()] = {
            price: Number(p.current_price ?? p.price ?? 0),
            change24h: Number(p.price_change_percentage_24h ?? p.change24h ?? 0),
          };
        });
      } else if (priceResponse && typeof priceResponse === "object") {
        Object.entries(priceResponse).forEach(([symbol, p]: any) => {
          prices[symbol.toUpperCase()] = {
            price: Number(p.current_price ?? p.price ?? 0),
            change24h: Number(p.price_change_percentage_24h ?? p.change24h ?? 0),
          };
        });
      }

      // Aggregate by symbol
      const assetMap = new Map<string, WalletData["assets"][number]>();
      normalizedWallets.forEach(({ symbol, balance }) => {
        const priceInfo = prices[symbol] || { price: 0, change24h: 0 };
        const value = balance * priceInfo.price;
        const existing = assetMap.get(symbol);
        if (existing) {
          existing.balance += balance;
          existing.value += value;
        } else {
          assetMap.set(symbol, {
            symbol,
            name: ASSET_NAMES[symbol] || symbol,
            balance,
            price: priceInfo.price,
            value,
            change24h: priceInfo.change24h,
          });
        }
      });

      // Ensure all known assets appear in the list (with zero balance when absent)
      VALID_CRYPTO_SYMBOLS.forEach(symbol => {
        if (!assetMap.has(symbol)) {
          const priceInfo = prices[symbol] || { price: 0, change24h: 0 };
          assetMap.set(symbol, {
            symbol,
            name: ASSET_NAMES[symbol],
            balance: 0,
            price: priceInfo.price,
            value: 0,
            change24h: priceInfo.change24h,
          });
        }
      });

      const assets = Array.from(assetMap.values());
      let totalBalanceUSD = assets.reduce((sum, asset) => sum + asset.value, 0);
      // 24-hour P&L: approximate USD change per asset = value * change24h / 100
      const pnlUSD = assets.reduce((sum, a) => sum + a.value * (a.change24h / 100), 0);
      const pnlPercent = totalBalanceUSD > 0 ? (pnlUSD / totalBalanceUSD) * 100 : 0;
      let finalTotalBalance = totalBalanceUSD;

      if (preferredCurrency !== "USD") {
        setIsConverting(true);
        try {
          finalTotalBalance = await convertCurrency(totalBalanceUSD, preferredCurrency);
        } catch (e) {
          console.error("useWalletData: Currency conversion failed", e);
        } finally {
          setIsConverting(false);
        }
      }

      assets.sort((a, b) => {
        if (b.value !== a.value) return b.value - a.value;
        const orderA = SORT_ORDER[a.symbol] ?? 99;
        const orderB = SORT_ORDER[b.symbol] ?? 99;
        return orderA - orderB || a.symbol.localeCompare(b.symbol);
      });

      return { totalBalance: finalTotalBalance, pnlUSD, pnlPercent, userId: user.id, preferredCurrency, isConverting, assets };
    },
  });

  // Unified loading flag:
  // - true while the live balance fetch hasn't completed yet (balancesLoading)
  // - true while wallet-data is fetching for the first time with no cached result
  // This ensures all consumers show a skeleton until real data is ready.
  const isLoading = balancesLoading || query.isLoading || (query.isFetching && !query.data);

  return {
    ...query,
    isLoading,
    data: query.data ? { ...query.data, isConverting } : undefined,
  };
}
