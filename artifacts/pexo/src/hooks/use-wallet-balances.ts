import { useEffect } from 'react';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { resolveWalletChain } from '@/lib/wallet-chain-monitor';
import { minConfirmationsFor } from '@/lib/chain-rules';
import { fetchWalletRows, isActiveRow, walletRowsQueryOptions, type WalletRow } from '@/lib/wallet-rows';
import { useRegisterWalletQueryClient } from '@/lib/wallet-query-cache';

/* =========================================
   TYPES
========================================= */
export interface Wallet {
  id: string;
  user_id: string;
  crypto_symbol: string;
  /** Total balance reported by the chain, INCLUDING not-yet-confirmed inbound value. */
  balance: number;
  /** Inbound value that has not reached this chain's confirmation minimum. */
  unconfirmed_balance: number;
  /** Structurally unspendable value (e.g. XRP base reserve). */
  locked_balance: number;
  /** balance - unconfirmed_balance - locked_balance. THIS is what may be spent. */
  available_balance: number;
  /** True when this row came from a cache/carry-over instead of a live chain read. */
  is_stale: boolean;
  deposit_address: string | null;
  chain_id: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: 'deposit' | 'withdrawal' | 'swap';
  crypto_symbol: string;
  amount: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  tx_hash: string | null;
  from_address: string | null;
  to_address: string | null;
  reference_id: string | null;
  notes: string | null;
  confirmations: number | null;
  created_at: string;
  completed_at: string | null;
}

/* =========================================
   SESSION STORAGE CACHE
   Client-side only — never touches a server.
   Gives instant render on tab reload while the
   chain fetch is in flight.

   SECURITY: sessionStorage is user-writable, so
   anything read back from it is marked is_stale
   and available_balance is forced to 0. It is a
   *paint* hint, never a spendable number.
========================================= */

const CACHE_KEY_PREFIX = 'pexly_wallet_balances_v4';

function cacheKey(userId: string) {
  return `${CACHE_KEY_PREFIX}_${userId}`;
}

function sanitizeCachedWallet(raw: any, userId: string): Wallet | null {
  if (!raw || typeof raw !== 'object') return null;
  const symbol = String(raw.crypto_symbol ?? '').toUpperCase().trim();
  if (!symbol) return null;
  const balance = Number(raw.balance);
  return {
    id: String(raw.id ?? ''),
    user_id: userId,
    crypto_symbol: symbol,
    balance: Number.isFinite(balance) && balance >= 0 ? balance : 0,
    unconfirmed_balance: 0,
    locked_balance: 0,
    // Cached rows are never spendable.
    available_balance: 0,
    is_stale: true,
    deposit_address: typeof raw.deposit_address === 'string' ? raw.deposit_address : null,
    chain_id: String(raw.chain_id ?? ''),
    created_at: String(raw.created_at ?? new Date().toISOString()),
    updated_at: String(raw.updated_at ?? new Date().toISOString()),
  };
}

function readSessionSnapshot(userId: string): Wallet[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const wallets = parsed
      .map((row) => sanitizeCachedWallet(row, userId))
      .filter((w): w is Wallet => !!w);
    return wallets.length ? wallets : null;
  } catch {
    return null;
  }
}

function writeSessionSnapshot(userId: string, wallets: Wallet[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(cacheKey(userId), JSON.stringify(wallets));
  } catch {
    // Quota exceeded or storage disabled – non-fatal.
  }
}

/* =========================================
   PUSH REFRESH EVENT (replaces polling)

   Alchemy's Address Activity webhook is the
   trigger for a balance refresh. Whatever
   receives that push (realtime channel, SSE,
   deposit modal, manual "Refresh" button)
   dispatches this event and the hook re-reads
   the chain exactly once. No interval timer,
   so idle tabs consume zero compute units.

   BTC (Tatum + public Esplora fallback) and XRP
   (public rippled nodes) have no Alchemy Notify
   push, so they are refreshed by the same manual
   / focus / reconnect signals — still no polling.
========================================= */

export const WALLET_REFRESH_EVENT = 'pexly:wallet-refresh';

export function requestWalletRefresh(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(WALLET_REFRESH_EVENT));
}

/* =========================================
   CONFIRMATION POLICY

   Single source of truth: @/lib/chain-rules. This hook used to keep its own
   table (BTC: 2) while the activity reader used chain-rules (BTC: 1), so the
   same deposit was "confirmed" in one view and "pending" in the other.
   Re-exported so existing importers keep working.
========================================= */

export { MIN_CONFIRMATIONS, minConfirmationsFor } from '@/lib/chain-rules';

/** @deprecated Use `minConfirmationsFor` from @/lib/chain-rules. */
export const minConfirmationsForChain = minConfirmationsFor;

/* =========================================
   CHAIN RESOLVER
   Maps DB chain_id values to edge function chain keys.

   `supported` means "monitor-deposits can read this
   chain". BTC is served by Tatum with public Esplora
   fallbacks, XRP by public rippled nodes, everything
   else by Alchemy — so both are supported now.
   Unsupported chains are skipped instead of firing a
   request that is guaranteed to 400.
========================================= */

/** Native symbol fallback when the edge function response is unusable. */
const NATIVE_SYMBOL: Record<string, string> = {
  BTC: 'BTC',
  XRP: 'XRP',
  ETH: 'ETH',
  BSC: 'BNB',
  POLYGON: 'POL',
  ARBITRUM: 'ETH',
  OPTIMISM: 'ETH',
  BASE: 'ETH',
  AVAX: 'AVAX',
  SOL: 'SOL',
  TRX: 'TRX',
};

/** Chains that never carry tokens in this app — skip token matching entirely. */
const TOKENLESS_CHAINS = new Set(['BTC', 'XRP']);

/**
 * XRP base reserve fallback, in XRP, used only when the provider omits
 * `reserve`. The network value is an amendment-controlled parameter (1 XRP
 * since the 2024 reduction), so the provider value always wins.
 */
const XRP_FALLBACK_RESERVE = 1;

/** Safe numeric parse: the edge function returns decimal strings, never floats. */
function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Unique identity for a balance row. Symbols are NOT unique: ETH exists on
 * Ethereum/Arbitrum/Optimism/Base and USDT on Ethereum/Tron/BSC. Keying a
 * carry-over map by symbol alone leaks one chain's balance onto another.
 */
function walletKey(chain: string, symbol: string): string {
  return `${String(chain).toUpperCase()}:${String(symbol).toUpperCase()}`;
}

function computeAvailable(balance: number, unconfirmed: number, locked: number): number {
  const available = balance - unconfirmed - locked;
  return available > 0 ? available : 0;
}

/** Turns a request that never answers into an error, so one hung chain cannot freeze the whole query. */
function withTimeout<T>(p: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    Promise.resolve(p).then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

/**
 * Read the unconfirmed (below-minimum) inbound slice from a balances payload.
 * Providers spell this differently; anything unparsable is treated as 0
 * because the confirmed-vs-total split is verified again before any spend.
 */
function readUnconfirmed(scope: any): number {
  const value =
    scope?.unconfirmed ??
    scope?.unconfirmedBalance ??
    scope?.unconfirmed_balance ??
    scope?.pending ??
    scope?.pendingBalance ??
    scope?.incomingPending;
  const n = toNumber(value, 0);
  return n > 0 ? n : 0;
}

/* =========================================
   GET USER WALLETS (non-custodial, chain-first)

   Reads wallet *addresses* from the shared wallet
   rows (metadata only — never balances). Rows come
   from the deduplicated ['wallet-rows', userId]
   query when the caller passes them, otherwise from
   the same fetcher. Fetches live
   balances directly from each chain via the
   monitor-deposits edge function in `balances`
   mode, which returns:
     { success, chain, address,
       native: { symbol, balance, decimals },
       tokens: [{ symbol, balance, contract, decimals }],
       reserve?, accountFunded?, unconfirmed?, provider? }

   Resilience: if a chain RPC call fails, the last
   known balance is shown for continuity but flagged
   is_stale with available_balance 0, so the UI never
   collapses to zero AND never lets a user spend a
   number that was not just verified on-chain.
========================================= */

export async function getUserWallets(
  userId: string,
  previous?: Wallet[],
  rows?: WalletRow[],
): Promise<Wallet[]> {
  const client = await getSupabase();

  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("AUTH_REQUIRED");
  if (user.id !== userId) throw new Error("AUTH_USER_MISMATCH");

  // Wallet rows come from the shared get_my_wallet-backed reader (public
  // fields only). Balance reads below stay completely separate from it.
  // Explicitly-inactive rows are skipped, matching the RPC's old is_active filter.
  const dbWallets = (rows ?? (await fetchWalletRows(userId))).filter(isActiveRow);
  if (dbWallets.length === 0) return [];

  const prevById = new Map<string, Wallet>();
  const prevByKey = new Map<string, Wallet>();
  (previous ?? []).forEach((w) => {
    if (w.id) prevById.set(w.id, w);
    const resolved = resolveWalletChain(w.chain_id);
    prevByKey.set(walletKey(resolved.chain ?? w.chain_id, w.crypto_symbol), w);
  });

  const wallets: Wallet[] = [];
  const now = new Date().toISOString();

  const lookupPrev = (id: string, chain: string, symbol: string): Wallet | undefined =>
    prevById.get(id) ?? prevByKey.get(walletKey(chain, symbol));

  /** Rebuild a wallet row from the last known snapshot (unsupported / failed chain). */
  const carryOver = (
    id: string,
    symbol: string,
    address: string | null,
    chainId: string,
    chain: string,
  ): Wallet => {
    const prev = lookupPrev(id, chain, symbol);
    return {
      id,
      user_id: userId,
      crypto_symbol: prev?.crypto_symbol ?? symbol,
      balance: prev?.balance ?? 0,
      unconfirmed_balance: prev?.unconfirmed_balance ?? 0,
      locked_balance: prev?.locked_balance ?? 0,
      // Never spendable: this number was not verified on-chain in this pass.
      available_balance: 0,
      is_stale: true,
      deposit_address: address ?? prev?.deposit_address ?? null,
      chain_id: chainId,
      created_at: prev?.created_at ?? now,
      updated_at: prev?.updated_at ?? now,
    };
  };

  const seen = new Map<string, { address: string; chain: string; walletIds: string[]; chainIds: string[] }>();
  const tokenWallets: { id: string; chainId: string; address: string; tokenSymbol: string; resolvedChain: string }[] = [];

  for (const w of dbWallets) {
    const resolved = resolveWalletChain(w.chain_id);
    const address = String(w.address ?? '').trim();

    // A row with no usable address can never be read on-chain.
    if (!resolved.supported || !address) {
      wallets.push(
        carryOver(
          w.id,
          resolved.tokenSymbol ?? NATIVE_SYMBOL[resolved.chain] ?? resolved.chain,
          address || null,
          w.chain_id,
          resolved.chain,
        ),
      );
      continue;
    }

    // BTC/XRP have no token layer — a "USDT on Bitcoin" row is a data error,
    // and asking the indexer for it would waste a request.
    if (resolved.isToken && TOKENLESS_CHAINS.has(resolved.chain)) {
      wallets.push(carryOver(w.id, resolved.tokenSymbol!, address, w.chain_id, resolved.chain));
      continue;
    }

    const key = `${address}::${resolved.chain}`;

    if (resolved.isToken) {
      tokenWallets.push({ id: w.id, chainId: w.chain_id, address, tokenSymbol: resolved.tokenSymbol!, resolvedChain: resolved.chain });
      if (!seen.has(key)) {
        seen.set(key, { address, chain: resolved.chain, walletIds: [], chainIds: [] });
      }
    } else {
      if (!seen.has(key)) {
        seen.set(key, { address, chain: resolved.chain, walletIds: [w.id], chainIds: [w.chain_id] });
      } else {
        seen.get(key)!.walletIds.push(w.id);
        seen.get(key)!.chainIds.push(w.chain_id);
      }
    }
  }

  // One request per (address, chain) pair — a native wallet and its USDT/USDC
  // siblings on the same address share a single call.
  const fetchPromises = Array.from(seen.entries()).map(async ([_key, entry]) => {
    let data: any = null;
    let fetchFailed = false;

    try {
      const res = await withTimeout(client.functions.invoke('monitor-deposits', {
        body: {
          address: entry.address,
          chain: entry.chain,
          mode: 'balances',
          // Ask the monitor to split confirmed vs unconfirmed using the same
          // policy the deposit scanner applies.
          minConfirmations: minConfirmationsFor(entry.chain),
        },
      }), 20_000, 'monitor-deposits');
      if (res.error || !res.data?.success || !res.data?.native) {
        console.warn('[getUserWallets] balance read failed:', entry.chain, res.error ?? res.data?.error);
        fetchFailed = true;
      } else {
        data = res.data;
      }
    } catch (err) {
      console.error('[getUserWallets] Exception for chain:', entry.chain, err);
      fetchFailed = true;
    }

    if (entry.walletIds.length > 0) {
      const id = entry.walletIds[0];
      const nativeSymbolGuess = data?.native?.symbol ?? NATIVE_SYMBOL[entry.chain] ?? entry.chain;
      const prev = lookupPrev(id, entry.chain, nativeSymbolGuess);
      const nativeSymbol = data?.native?.symbol ?? prev?.crypto_symbol ?? nativeSymbolGuess;

      if (fetchFailed) {
        wallets.push(carryOver(id, nativeSymbol, entry.address, entry.chainIds[0], entry.chain));
      } else {
        const nativeBalance = toNumber(data.native.balance);
        // Total includes 0-conf / below-minimum inbound value on providers that
        // report mempool state (Tatum BTC, Esplora). Subtract it so a deposit
        // cannot be spent — or displayed as spendable — before it is final.
        const unconfirmed = Math.min(
          readUnconfirmed(data.native) || readUnconfirmed(data),
          nativeBalance,
        );

        // XRP keeps a base reserve that cannot be spent — surface it as locked
        // rather than pretending the full balance is withdrawable. An unfunded
        // (never-deposited) XRP account has no reserve to lock yet.
        let lockedBalance = 0;
        if (entry.chain === 'XRP') {
          lockedBalance = data?.accountFunded === false
            ? 0
            : Math.min(toNumber(data?.reserve, XRP_FALLBACK_RESERVE), nativeBalance);
        }

        wallets.push({
          id,
          user_id: userId,
          crypto_symbol: nativeSymbol,
          balance: nativeBalance,
          unconfirmed_balance: unconfirmed,
          locked_balance: lockedBalance,
          available_balance: computeAvailable(nativeBalance, unconfirmed, lockedBalance),
          is_stale: false,
          deposit_address: entry.address,
          chain_id: entry.chainIds[0],
          created_at: prev?.created_at ?? now,
          updated_at: now,
        });
      }
    }

    const tokens: any[] = Array.isArray(data?.tokens) ? data.tokens : [];
    for (const tw of tokenWallets) {
      if (tw.address !== entry.address || tw.resolvedChain !== entry.chain) continue;
      const prev = lookupPrev(tw.id, tw.resolvedChain, tw.tokenSymbol);

      if (fetchFailed) {
        wallets.push(carryOver(tw.id, tw.tokenSymbol, tw.address, tw.chainId, tw.resolvedChain));
        continue;
      }

      const match = tokens.find(
        (t: any) => String(t.symbol).toUpperCase() === tw.tokenSymbol.toUpperCase(),
      );
      // A successful read with no matching token means the balance really is 0
      // (zero balances are omitted upstream).
      const tokenBalance = match ? toNumber(match.balance) : 0;
      const tokenUnconfirmed = match ? Math.min(readUnconfirmed(match), tokenBalance) : 0;

      wallets.push({
        id: tw.id,
        user_id: userId,
        crypto_symbol: tw.tokenSymbol,
        balance: tokenBalance,
        unconfirmed_balance: tokenUnconfirmed,
        locked_balance: 0,
        available_balance: computeAvailable(tokenBalance, tokenUnconfirmed, 0),
        is_stale: false,
        deposit_address: tw.address,
        chain_id: tw.chainId,
        created_at: prev?.created_at ?? now,
        updated_at: now,
      });
    }
  });

  await Promise.all(fetchPromises);
  return wallets;
}

function markStale(w: Wallet): Wallet {
  return { ...w, is_stale: true, available_balance: 0 };
}

/* =========================================
   REACT QUERY HOOK

   Chain-first, fully non-custodial, POLL-FREE:
   1. Hydrate instantly from sessionStorage so
      the UI paints on reload with no flicker.
      Those rows are is_stale with available 0.
   2. Fetch live balances from the chain once on
      mount, then only on a real signal:
        • the Alchemy webhook push, relayed as
          WALLET_REFRESH_EVENT
        • window focus / network reconnect
        • an explicit refetch()
      There is no refetchInterval, so an open tab
      costs nothing while nothing is happening.
      BTC (Tatum) and XRP (public rippled) ride the
      same signals — no interval, no quota burn.
   3. sessionStorage is wiped at logout so
      balances never leak across sessions.
========================================= */

export function useWalletBalances() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  useRegisterWalletQueryClient();
  const userId = user?.id;

  // Keep the in-memory query key in sync with the cache key used below
  // so any invalidation from elsewhere correctly targets the right entry.
  const queryKey = ['wallet-balances', userId ?? 'anon'] as const;

  // Push-driven refresh: this is what replaces the old 90 s interval.
  // Dispatch WALLET_REFRESH_EVENT from wherever the Alchemy webhook lands.
  useEffect(() => {
    if (!userId) return;
    if (typeof window === 'undefined') return;

    const onRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balances', userId] });
    };

    window.addEventListener(WALLET_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(WALLET_REFRESH_EVENT, onRefresh);
  }, [userId, queryClient]);

  return useQuery<Wallet[]>({
    queryKey,
    enabled: !!userId,
    // Hydrate immediately from the client-side session cache so the
    // first render shows real numbers without waiting for the chain.
    // updatedAt 0 marks it stale, so a live read still runs on mount.
    initialData: () => (userId ? readSessionSnapshot(userId) ?? undefined : undefined),
    initialDataUpdatedAt: 0,
    queryFn: async () => {
      if (!userId) return [];

      const inMem = queryClient.getQueryData<Wallet[]>([...queryKey]);
      const cached = inMem ?? readSessionSnapshot(userId) ?? undefined;

      // Fetch live balances from the chain (non-custodial, no server balance store).
      // Awaited: returning early with stale data made the query settle before the
      // real numbers arrived, so a failed chain read looked like a successful one.
      //
      // Wallet rows are resolved through the shared query cache (deduplicated
      // with every other consumer). retry is off here: this query already
      // retries as a whole, and stacking retries would multiply the delay.
      const fresh = await (async () => {
        const rows = await queryClient.fetchQuery({
          ...walletRowsQueryOptions(userId),
          retry: false,
        });
        return getUserWallets(userId, cached, rows);
      })().catch((err) => {
        if (import.meta.env.DEV) {
          console.warn('[wallet-balances] chain refresh failed:', err);
        }
        // Preserve a previously verified snapshot for continuity, but keep the
        // query in an error state when there is no cache. This prevents a failed
        // RPC from looking like a confirmed empty wallet.
        if (cached && cached.length > 0) return cached.map(markStale);
        throw err;
      });

      writeSessionSnapshot(userId, fresh);
      return fresh;
    },
    // Cached rows stay on screen while the live read is in flight.
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchInterval: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
  });
}

/* =========================================
   HELPERS
========================================= */

export async function getWalletBalance(userId: string, cryptoSymbol: string): Promise<Wallet | null> {
  const wallets = await getUserWallets(userId);
  return wallets.find((w) => w.crypto_symbol === cryptoSymbol) || null;
}

/**
 * Spendable amount for a symbol. Returns 0 when the row is stale (no verified
 * chain read) or when the confirmed balance is fully reserved/unconfirmed.
 * Spend flows must use this, never `wallet.balance`.
 */
export async function getSpendableBalance(userId: string, cryptoSymbol: string): Promise<number> {
  const wallet = await getWalletBalance(userId, cryptoSymbol);
  if (!wallet || wallet.is_stale) return 0;
  return wallet.available_balance;
}

export async function getDepositAddress(userId: string, cryptoSymbol: string): Promise<string> {
  const wallets = await getUserWallets(userId);
  const wallet = wallets.find((w) => w.crypto_symbol === cryptoSymbol);
  if (wallet?.deposit_address) return wallet.deposit_address;
  throw new Error('No deposit address found for this wallet.');
}
