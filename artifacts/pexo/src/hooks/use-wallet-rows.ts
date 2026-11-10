import { useQuery } from "@tanstack/react-query";
import { walletRowsQueryOptions } from "@/lib/wallet-rows";
import { useRegisterWalletQueryClient } from "@/lib/wallet-query-cache";

export type { WalletRow } from "@/lib/wallet-rows";

/**
 * Shared, deduplicated read of the user's wallet rows (public fields only).
 * Every consumer that calls this with the same userId shares one request and
 * one cache entry. Live balances are a separate query (useWalletBalances).
 */
export function useWalletRows(userId?: string) {
  useRegisterWalletQueryClient();
  return useQuery({
    ...walletRowsQueryOptions(userId),
    enabled: !!userId,
  });
}
