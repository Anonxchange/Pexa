import { useEffect } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

/**
 * Every wallet-related React Query key prefix. Anything that can hold wallet
 * identity (addresses), balances, or derived wallet data must be listed here.
 */
export const WALLET_QUERY_KEYS = [
  ["wallet-rows"],
  ["wallet-balances"],
  ["wallet-data"],
  ["deposit-address"],
] as const;

let registeredClient: QueryClient | null = null;

/**
 * Call from any component/hook that runs wallet queries. Wallet data can only
 * exist in a client that some wallet consumer has registered, so the sign-out
 * path can clear it without needing a global queryClient import.
 */
export function useRegisterWalletQueryClient(): void {
  const queryClient = useQueryClient();
  useEffect(() => {
    registeredClient = queryClient;
  }, [queryClient]);
}

/**
 * Cancels in-flight wallet queries and removes their cached data.
 * Used on sign-out and on user switch.
 */
export async function clearWalletQueryCaches(): Promise<void> {
  const client = registeredClient;
  if (!client) return;
  for (const queryKey of WALLET_QUERY_KEYS) {
    try {
      await client.cancelQueries({ queryKey: [...queryKey] });
    } catch {
      // cancellation failure must not stop removal
    }
    client.removeQueries({ queryKey: [...queryKey] });
  }
}
