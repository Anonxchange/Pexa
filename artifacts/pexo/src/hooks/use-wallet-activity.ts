import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { getOnChainTransactions, type WalletTransaction } from "@/lib/wallet-api";
import { WALLET_REFRESH_EVENT } from "@/hooks/use-wallet-balances";

export const WALLET_ACTIVITY_QUERY_KEY = "wallet-on-chain-transactions";

/**
 * Reads the non-custodial wallet activity from the same monitor used by the
 * wallet UI. All consumers share this cache so a page with multiple activity
 * surfaces still makes only one monitor request per address/chain.
 */
export function useWalletActivity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;
  const queryKey = [WALLET_ACTIVITY_QUERY_KEY, userId] as const;

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;

    const onRefresh = () => {
      queryClient.invalidateQueries({ queryKey });
    };

    window.addEventListener(WALLET_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(WALLET_REFRESH_EVENT, onRefresh);
  }, [queryClient, userId]);

  return useQuery<WalletTransaction[]>({
    queryKey,
    enabled: !!userId,
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return getOnChainTransactions(userId, 200);
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    // Returning to the app is a real user signal, not a polling timer.
    // TanStack Query still respects staleTime and will not refetch more than
    // once per minute unless an explicit refresh event is dispatched.
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}