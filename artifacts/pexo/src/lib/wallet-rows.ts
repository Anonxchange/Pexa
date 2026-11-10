import { queryOptions } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";

/**
 * Public address metadata only. Private keys and recovery phrases are never
 * part of the wallet row model or query cache.
 */
export interface WalletRow {
  id: string;
  chain_id: string;
  address: string;
  wallet_type?: string | null;
  is_active?: boolean | string | null;
  is_backed_up?: boolean | string | null;
  created_at?: string | null;
}

export const walletRowsQueryKey = (userId: string | undefined) =>
  ["wallet-rows", userId] as const;

const WALLET_ROWS_TIMEOUT_MS = 15_000;

/** A row is active unless the server explicitly says otherwise. */
export function isActiveRow(row: Pick<WalletRow, "is_active">): boolean {
  return row.is_active !== false && row.is_active !== "false";
}

function toPublicRow(raw: any): WalletRow {
  return {
    id: String(raw?.id ?? ""),
    chain_id: String(raw?.chain_id ?? raw?.chain_type ?? "evm").trim(),
    address: String(raw?.wallet_address ?? raw?.address ?? "").trim(),
    wallet_type: raw?.wallet_type ?? raw?.chain_type ?? "evm",
    is_active: true,
    is_backed_up: null,
    created_at: raw?.created_at ?? null,
  };
}

async function loadRows(userId: string): Promise<WalletRow[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("user_wallets")
    .select("id,wallet_address,chain_type,is_primary,created_at")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toPublicRow);
}

/**
 * The ONLY place wallet rows are read from the server. Never touches balances.
 * Times out so a hung request becomes an error (and a retry button) instead of
 * an endless spinner.
 */
export async function fetchWalletRows(userId: string): Promise<WalletRow[]> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("WALLET_ROWS_TIMEOUT")), WALLET_ROWS_TIMEOUT_MS);
  });
  try {
    return await Promise.race([loadRows(userId), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Shared query options. Use with `useQuery` (via useWalletRows) or with
 * `queryClient.fetchQuery(...)` from non-React code so every consumer hits
 * the same cache entry and in-flight request.
 */
export function walletRowsQueryOptions(userId: string | undefined) {
  return queryOptions({
    queryKey: walletRowsQueryKey(userId),
    queryFn: () => (userId ? fetchWalletRows(userId) : Promise.resolve<WalletRow[]>([])),
    staleTime: 60_000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
