import { fetchWalletRows, isActiveRow } from "./wallet-rows";
import { getSupabase, supabase } from "./supabase";
import { getWalletMonitorTargets } from "./wallet-chain-monitor";
import { monitorWithdrawal } from "./withdrawal-monitor";
import { getAssetDecimals, minConfirmationsFor } from "./chain-rules";
import {
  addLocalWithdrawalHash,
  getOnChainTransactions as readOnChainActivity,
  getPendingOutbound as readPendingOutbound,
} from "./wallet-activity";

export interface Wallet {
  id: string;
  user_id: string;
  crypto_symbol: string;
  /** Total on-chain value, including inbound value below the confirmation minimum. */
  balance: number;
  /** Inbound value that has not reached this chain's confirmation minimum. */
  unconfirmed_balance: number;
  /** Structurally unspendable value (e.g. the XRP base reserve). */
  locked_balance: number;
  /** balance - unconfirmed_balance - locked_balance. Spend flows must use this. */
  available_balance: number;
  /** True when no live chain read backed this row (never spendable). */
  is_stale: boolean;
  deposit_address: string | null;
  created_at: string;
  updated_at: string;
  isNonCustodial?: boolean;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'p2p_buy' | 'p2p_sell' | 'escrow_lock' | 'escrow_release' | 'fee';
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
  /** Confirmations required before this transaction is treated as final. */
  required_confirmations: number | null;
  created_at: string;
  completed_at: string | null;
}

function mapChainIdToSymbol(chainId: string): string {
  if (chainId === 'Ethereum (ERC-20)' || chainId === 'ethereum') return 'ETH';
  if (chainId === 'Bitcoin (SegWit)'  || chainId === 'bitcoin')  return 'BTC';
  if (chainId === 'Binance Smart Chain (BEP-20)' || chainId === 'BNB' || chainId === 'BSC') return 'BNB';
  if (chainId === 'Solana')           return 'SOL';
  if (chainId === 'Tron (TRC-20)')    return 'TRX';
  if (chainId === 'XRP')              return 'XRP';
  return chainId;
}

/**
 * Map a crypto symbol to the chain key used by the on-chain monitor.
 * Inverse of mapChainIdToSymbol: values returned here round-trip back to
 * the original symbol. Non-native assets default to the mainnet their
 * monitor scanner reads them on (USDT/USDC -> Ethereum unless token-specific).
 */
export function toMonitorChainKey(cryptoSymbol: string): string {
  const s = (cryptoSymbol || '').toUpperCase().trim();

  // Native / wrapped native assets.
  if (s === 'BTC' || s === 'WBTC' || s === 'CBTC' || s === 'XBT') return 'Bitcoin';
  if (s === 'BNB' || s === 'WBNB') return 'BSC';
  if (s === 'SOL' || s === 'WSOL') return 'Solana';
  if (s === 'TRX' || s === 'TRX_TRON') return 'Tron';
  if (s === 'XRP') return 'XRP';
  if (s === 'POL' || s === 'MATIC' || s === 'POLYGON') return 'POLYGON';
  if (s === 'BASE' || s === 'CBETH') return 'BASE';
  if (s === 'ARB' || s === 'ARBITRUM') return 'ARBITRUM';
  if (s === 'OP' || s === 'OPTIMISM') return 'OPTIMISM';

  // Everything else (ETH, USDT, USDC, DAI, LINK, ...) defaults to Ethereum.
  return 'Ethereum';
}

/* =========================================
   CONFIRMATION POLICY

   Single source of truth: ./chain-rules. This module used to keep its own
   copy of the table, which is how BTC ended up requiring 2 confirmations
   here and 1 in the activity reader. Re-exported so existing importers of
   `MIN_CONFIRMATIONS` / `minConfirmationsForChain` keep working.
========================================= */

export { MIN_CONFIRMATIONS, DEFAULT_MIN_CONFIRMATIONS, minConfirmationsFor } from "./chain-rules";

/** @deprecated Use `minConfirmationsFor` from ./chain-rules. */
export const minConfirmationsForChain = minConfirmationsFor;

/**
 * XRP base reserve fallback (XRP). The live network value is an
 * amendment-controlled parameter — the provider value always wins; this is
 * only used when the provider omits it.
 */
const XRP_FALLBACK_RESERVE = 1;

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : fallback;
}

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

/**
 * Live balance read for one (address, chain) pair.
 * Returns null when the chain could not be read — callers must treat that as
 * "unknown", never as zero and never as "the cached number is fine to spend".
 */
async function readAddressBalances(
  client: any,
  address: string,
  chain: string,
): Promise<any | null> {
  try {
    const res = await client.functions.invoke('monitor-deposits', {
      body: {
        address,
        chain,
        mode: 'balances',
        minConfirmations: minConfirmationsFor(chain),
      },
    });
    if (res.error || !res.data?.success || !res.data?.native) return null;
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Wallets for a user.
 *
 * Addresses come from the server-backed public wallet rows (get_my_wallet).
 * The local browser cache is NOT consulted, not even as a fallback: this
 * function feeds balance/spend logic, and cached addresses must never decide
 * what is monitored or spendable. BALANCES ARE NEVER read from local storage
 * either: that value is user-writable and cannot be trusted for anything
 * financial. Every balance below is read live from the
 * chain, split into confirmed / unconfirmed / locked, and any chain that could
 * not be read is returned as is_stale with available_balance 0.
 */
export async function getUserWallets(userId: string): Promise<Wallet[]> {
  try {
    const serverRows = (await fetchWalletRows(userId)).filter(isActiveRow);

    const client = await getSupabase();
    const now = new Date().toISOString();

    // Deduplicate the chain reads: several wallet rows can share one address.
    const balanceCache = new Map<string, Promise<any | null>>();
    const readCached = (address: string, chain: string) => {
      const key = `${address}::${chain}`;
      if (!balanceCache.has(key)) balanceCache.set(key, readAddressBalances(client, address, chain));
      return balanceCache.get(key)!;
    };

    return await Promise.all(
      serverRows.map(async (w): Promise<Wallet> => {
        const symbol = mapChainIdToSymbol(w.chain_id);
        const address = typeof w.address === 'string' ? w.address.trim() : '';
        const chain = toMonitorChainKey(symbol);

        const base: Wallet = {
          id: w.id,
          user_id: userId,
          crypto_symbol: symbol,
          balance: 0,
          unconfirmed_balance: 0,
          locked_balance: 0,
          available_balance: 0,
          is_stale: true,
          deposit_address: address || null,
          created_at: now,
          updated_at: now,
          isNonCustodial: true,
        };

        if (!address) return base;

        const data = await readCached(address, chain);
        if (!data) return base;

        const isNative = String(data?.native?.symbol ?? '').toUpperCase() === symbol.toUpperCase();
        const token = Array.isArray(data?.tokens)
          ? data.tokens.find((t: any) => String(t?.symbol ?? '').toUpperCase() === symbol.toUpperCase())
          : undefined;
        const scope = isNative ? data.native : token;

        // A successful read with no matching asset means the balance is 0.
        const total = scope ? toNumber(scope.balance) : 0;
        const unconfirmed = Math.min(
          scope ? (readUnconfirmed(scope) || (isNative ? readUnconfirmed(data) : 0)) : 0,
          total,
        );

        let locked = 0;
        if (chain === 'XRP' && isNative) {
          locked = data?.accountFunded === false
            ? 0
            : Math.min(toNumber(data?.reserve, XRP_FALLBACK_RESERVE), total);
        }

        const available = Math.max(0, total - unconfirmed - locked);

        return {
          ...base,
          balance: total,
          unconfirmed_balance: unconfirmed,
          locked_balance: locked,
          available_balance: available,
          is_stale: false,
          updated_at: now,
        };
      }),
    );
  } catch (e) {
    console.error(`[getUserWallets] Error fetching wallets:`, e);
    return [];
  }
}

export async function getWalletBalance(userId: string, cryptoSymbol: string): Promise<Wallet | null> {
  const wallets = await getUserWallets(userId);
  return wallets.find(w => w.crypto_symbol === cryptoSymbol) || null;
}

/**
 * Spendable amount for a symbol. 0 when the chain read failed (is_stale) or
 * when everything held is unconfirmed / reserved. Never use `wallet.balance`
 * to authorise a send, swap or escrow lock.
 */
export async function getSpendableBalance(userId: string, cryptoSymbol: string): Promise<number> {
  const wallet = await getWalletBalance(userId, cryptoSymbol);
  if (!wallet || wallet.is_stale) return 0;
  return wallet.available_balance;
}

/* Base-unit exponents live in ./chain-rules; re-exported for existing importers. */
export { ASSET_DECIMALS, getAssetDecimals, fromBaseUnits } from "./chain-rules";

/**
 * Display value for an amount that is ALREADY expressed in display units.
 *
 * The previous implementation guessed whether an integer was base units by
 * comparing it against a per-decimals threshold. That guess is unsound in both
 * directions: `5` on BTC is 5 satoshis or 5 BTC depending on the source, and a
 * legitimate round amount got divided by 1e8. Unit conversion now happens only
 * where an explicit base-unit field and an explicit exponent are available
 * (see `fromBaseUnits`) — nothing is inferred from magnitude.
 */
export function normalizeWalletDisplayAmount(
  amount: number | string | null | undefined,
  _symbol?: string | null,
): number {
  // Pure pass-through: amounts reaching this function are already display
  // units. Real base-unit conversion happens in `fromBaseUnits` with an
  // explicit exponent (./chain-rules).
  return Number(amount) || 0;
}

/**
 * Format a crypto amount without dropping leading fractional zeroes.
 * The maximum precision follows the asset's protocol decimals so values such
 * as 0.0000467 BTC stay readable instead of becoming scientific notation.
 */
export function formatCryptoAmount(
  amount: number | string | null | undefined,
  symbol?: string | null,
): string {
  const value = normalizeWalletDisplayAmount(amount, symbol);
  if (!Number.isFinite(value)) return "—";

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(getAssetDecimals(symbol), 18),
    useGrouping: false,
  });
}

/* Payload parsing (readAmount / readDate / extractOnChainTransactions /
   normalizeOnChainTransaction) lives in ./wallet-activity, which is the single
   on-chain activity reader. The duplicates that used to sit here drifted apart
   from it — most visibly by dropping transactions whose direction could not be
   resolved, which emptied Bitcoin activity. */

async function refreshWithdrawalStatus(
  transaction: WalletTransaction,
  target: { address: string; chain: string },
): Promise<WalletTransaction> {
  if (transaction.type !== "withdrawal" || !transaction.tx_hash || transaction.status !== "pending") {
    return transaction;
  }

  try {
    const result = await monitorWithdrawal({
      chain: target.chain,
      txHash: transaction.tx_hash,
      fromAddress: target.address,
      expected: {
        toAddress: transaction.to_address ?? undefined,
        amount: String(transaction.amount),
        asset: transaction.crypto_symbol,
      },
    });

    const terminalFailure = result?.terminalFailure === true;
    const settled = result?.settled === true;
    const status: WalletTransaction["status"] = terminalFailure
      ? "failed"
      : settled
        ? "completed"
        : "pending";

    return {
      ...transaction,
      status,
      confirmations: Number.isFinite(Number(result?.confirmations))
        ? Number(result.confirmations)
        : transaction.confirmations,
      to_address: transaction.to_address ?? result?.recipient ?? null,
      completed_at: status === "completed" ? new Date().toISOString() : transaction.completed_at,
      notes: result?.status
        ? `Withdrawal monitor: ${String(result.status)}`
        : transaction.notes,
    };
  } catch (error) {
    // The chain activity row remains useful when the withdrawal monitor is
    // temporarily unavailable. Never turn a monitor outage into a failure.
    if (import.meta.env.DEV) {
      console.warn("[wallet-activity] withdrawal status refresh failed:", error);
    }
    return transaction;
  }
}

/**
 * Index a broadcast non-custodial withdrawal so outbound activity can be
 * displayed alongside deposits. The blockchain monitor remains authoritative
 * for the status of this record.
 */
export async function recordWithdrawalTransaction(params: {
  userId: string;
  cryptoSymbol: string;
  amount: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  createdAt?: string;
}): Promise<void> {
  // Non-custodial: nothing is written to a database. The broadcast hash is
  // cached locally so outbound activity can be shown until the chain indexes
  // it; the chain remains the only source of truth.
  addLocalWithdrawalHash(params);
}

/* The local broadcast cache (LOCAL_WITHDRAWALS_KEY, readLocalWithdrawalCache,
   addLocalWithdrawalHash, readLocalWithdrawals) lives in ./wallet-activity.
   Two copies meant two storage readers over the same key. */

/**
 * Read wallet activity from the same public-address monitor used for balances.
 * Deposits come from the chain scanner. Withdrawals come from the chain too
 * (outbound transfers the monitor reports) and are merged with the local
 * broadcast index, which only covers the window before the chain indexes them.
 */
export async function getOnChainTransactions(userId: string, limit: number = 200): Promise<WalletTransaction[]> {
  // The chain read itself (deposits + outbound + local pending merge + dedupe)
  // is owned by ./wallet-activity. This wrapper only adds the withdrawal
  // monitor pass, which is specific to outbound sends broadcast from here.
  const transactions = await readOnChainActivity(userId, limit);
  const targets = await getWalletMonitorTargets(userId);

  // Keep monitor calls bounded: completed historical withdrawals already have
  // their final state, while pending rows need the dedicated withdrawal
  // monitor for terminal/replacement detection.
  const pendingWithdrawals = transactions
    .filter((tx) => tx.type === "withdrawal" && tx.status === "pending")
    .slice(0, 25);

  if (pendingWithdrawals.length === 0) return transactions;

  const refreshed = new Map(
    await Promise.all(
      pendingWithdrawals.map(async (tx) => {
        const target =
          targets.find((candidate: { address: string; chain: string }) =>
            !!tx.from_address && candidate.address.toLowerCase() === tx.from_address.toLowerCase(),
          ) ??
          targets.find((candidate: { address: string; chain: string }) =>
            tx.wallet_id === `onchain:${candidate.chain}:${candidate.address}`,
          );
        return [tx.id, target ? await refreshWithdrawalStatus(tx, target) : tx] as const;
      }),
    ),
  );

  return transactions.map((tx) => refreshed.get(tx.id) ?? tx);
}

/**
 * Total outbound value that has been broadcast but is not yet confirmed.
 * The chain's balance endpoint still counts these coins on account-model
 * chains until the tx is mined, so subtract this from the spendable amount
 * before allowing another send.
 */
export function getPendingOutbound(userId: string, cryptoSymbol: string): number {
  const symbol = cryptoSymbol.toUpperCase().trim();
  return readPendingOutbound(userId)
    .filter((w) => w.cryptoSymbol.toUpperCase() === symbol)
    .reduce((sum, w) => sum + (Number.isFinite(Number(w.amount)) ? Number(w.amount) : 0), 0);
}

export async function sendCrypto(
  userId: string,
  cryptoSymbol: string,
  toAddress: string,
  amount: number,
  notes?: string
): Promise<WalletTransaction> {
  // Custodial withdrawal replaced with local placeholder or signing logic

  throw new Error("Withdrawal must be initiated via wallet signing");
}

export async function getDepositAddress(userId: string, cryptoSymbol: string): Promise<string> {
  const wallets = await getUserWallets(userId);

  let wallet = wallets.find(w => w.crypto_symbol === cryptoSymbol);

  if (wallet?.deposit_address) {
    return wallet.deposit_address;
  }

  if ((cryptoSymbol === 'USDT' || cryptoSymbol === 'USDC') && !cryptoSymbol.includes('-')) {
    wallet = wallets.find(w => w.crypto_symbol.startsWith(`${cryptoSymbol}-`));
    if (wallet?.deposit_address) {
      return wallet.deposit_address;
    }
  }

  const anyWallet = wallets.find(w => w.isNonCustodial);
  if (anyWallet?.deposit_address) {
    return anyWallet.deposit_address;
  }

  throw new Error('No deposit address found for this wallet.');
}

export async function monitorDeposits(userId: string, cryptoSymbol: string): Promise<{
  detected: boolean;
  transactions?: any[];
  message?: string;
}> {
  return { detected: false, message: 'Non-custodial monitoring handled on-client' };
}

export async function createCDPSession(
  address: string,
  assets: string[],
  paymentAmount?: string,
  paymentCurrency?: string,
  options?: { network?: string; paymentMethod?: string }
): Promise<{ onrampUrl: string | null; sessionToken: string | null }> {
  if (import.meta.env.DEV) console.log("[createCDPSession] Initiating cdp-create-session");

  const { data: { session } } = await supabase.auth.getSession();
  const access_token = session?.access_token;

  const purchaseCurrency = (assets[0] || 'USDC').toUpperCase() === 'MATIC'
    ? 'POL'
    : (assets[0] || 'USDC').toUpperCase();

  // Both edge functions validate `address` with /^0x[a-fA-F0-9]{40}$/ (EVM only).
  // Network mapping must therefore be EVM-compatible:
  //   BTC  → 'base'  (Coinbase delivers cbBTC on Base to any EVM address)
  //   everything else → 'ethereum' or the caller-supplied network
  let destinationNetwork = options?.network;
  if (!destinationNetwork) {
    if (purchaseCurrency === 'BTC') destinationNetwork = 'base';
    else destinationNetwork = 'ethereum'; // ETH, USDC, USDT, SOL not EVM-supported
  }

  // Edge fn only accepts these four values; default to CARD.
  const VALID_PAYMENT_METHODS = new Set(['CARD', 'ACH_BANK_ACCOUNT', 'APPLE_PAY', 'FIAT_WALLET']);
  const paymentMethod = (options?.paymentMethod && VALID_PAYMENT_METHODS.has(options.paymentMethod))
    ? options.paymentMethod
    : 'CARD';

  const { data, error } = await supabase.functions.invoke('cdp-create-session', {
    body: {
      address,
      destinationNetwork,
      purchaseCurrency,
      paymentAmount,
      paymentCurrency,
      paymentMethod,
    },
    headers: access_token ? { Authorization: `Bearer ${access_token}` } : undefined,
  });

  if (error) {
    console.error("[createCDPSession] Error response:", error);
    throw new Error(error.message || 'Failed to create CDP session');
  }

  if (import.meta.env.DEV) console.log("[createCDPSession] Session created successfully");

  const result = data as any;
  const onrampUrl: string | null = result?.onrampUrl ?? null;
  const sessionToken: string | null = result?.sessionToken ?? null;

  return { onrampUrl, sessionToken };
}

export async function createCDPOfframpSession(
  address: string,
  assets: string[],
  _sellAmount: string | undefined,   // kept for call-site compat; edge fn does not use it
  fiatCurrency?: string,
  options?: { network?: string; cashoutMethod?: string }
): Promise<{ offrampUrl: string | null }> {
  if (import.meta.env.DEV) console.log("[createCDPOfframpSession] Initiating cdp-offramp-session");

  const { data: { session } } = await supabase.auth.getSession();
  const access_token = session?.access_token;

  const sellCurrency = (assets[0] || 'USDC').toUpperCase() === 'MATIC'
    ? 'POL'
    : (assets[0] || 'USDC').toUpperCase();

  // Derive network from currency when not provided.
  let sellNetwork = options?.network;
  if (!sellNetwork) {
    if (sellCurrency === 'BTC') sellNetwork = 'bitcoin';
    else if (sellCurrency === 'SOL') sellNetwork = 'solana';
    else sellNetwork = 'ethereum';
  }

  // Edge fn accepts: BANK_ACCOUNT | ACH_BANK_ACCOUNT | PAYPAL | FIAT_WALLET
  const VALID_CASHOUT_METHODS = new Set(['BANK_ACCOUNT', 'ACH_BANK_ACCOUNT', 'PAYPAL', 'FIAT_WALLET']);
  const cashoutMethod = (options?.cashoutMethod && VALID_CASHOUT_METHODS.has(options.cashoutMethod))
    ? options.cashoutMethod
    : 'BANK_ACCOUNT';

  const { data, error } = await supabase.functions.invoke('cdp-create-offramp-session', {
    body: {
      sourceAddress: address,
      sellCurrency,
      sellNetwork,
      cashoutCurrency: fiatCurrency || 'USD',
      cashoutMethod,
    },
    headers: access_token ? { Authorization: `Bearer ${access_token}` } : undefined,
  });

  if (error) {
    console.error("[createCDPOfframpSession] Error response:", error);
    throw new Error(error.message || 'Failed to create CDP offramp session');
  }

  const result = data as any;
  // The edge fn returns { success, offrampUrl } — no session token.
  const offrampUrl: string | null = result?.offrampUrl ?? null;
  return { offrampUrl };
}

export function startDepositMonitoring(
  userId: string,
  cryptoSymbol: string,
  onDeposit: (transactions: any[]) => void,
  intervalMs: number = 30000
): () => void {
  const checkDeposits = async () => {
    try {
      const result = await monitorDeposits(userId, cryptoSymbol);
      if (result.detected && result.transactions && result.transactions.length > 0) {
        onDeposit(result.transactions);
      }
    } catch (error) {
      console.error('Deposit monitoring error:', error);
    }
  };

  const intervalId = setInterval(checkDeposits, intervalMs);
  checkDeposits();

  return () => clearInterval(intervalId);
}

export async function monitorWithdrawals(userId: string): Promise<{
  updated: any[];
  message?: string;
}> {
  const transactions = await getOnChainTransactions(userId);
  const updated = transactions
    .filter((transaction) => transaction.type === "withdrawal")
    .map((transaction) => ({
      transactionId: transaction.id,
      status: transaction.status,
      confirmations: transaction.confirmations,
      requiredConfirmations: transaction.required_confirmations,
      txHash: transaction.tx_hash,
    }));

  return {
    updated,
    message: "Withdrawal statuses checked",
  };
}

export function startWithdrawalMonitoring(
  userId: string,
  onUpdate: (transactions: any[]) => void,
  intervalMs: number = 30000
): () => void {
  const checkWithdrawals = async () => {
    try {
      const result = await monitorWithdrawals(userId);
      if (result.updated && result.updated.length > 0) {
        onUpdate(result.updated);
      }
    } catch (error) {
      console.error('Withdrawal monitoring error:', error);
    }
  };

  const intervalId = setInterval(checkWithdrawals, intervalMs);
  checkWithdrawals();

  return () => clearInterval(intervalId);
}

export async function sendPexlyPayment(
  senderId: string,
  recipientId: string,
  amount: number,
  cryptoSymbol: string = 'USDT',
  note?: string
): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('pexly-pay-send', {
      body: {
        sender_id: senderId,
        recipient_id: recipientId,
        amount,
        crypto_symbol: cryptoSymbol,
        note: note || null,
      },
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process transfer'
      };
    }

    const result = data as any;
    return {
      success: true,
      transactionId: result.transaction_id || result.transactionId,
    };
  } catch (error) {
    console.error('❌ Error in sendPexlyPayment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
