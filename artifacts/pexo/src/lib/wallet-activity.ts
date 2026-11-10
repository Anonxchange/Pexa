import type { WalletTransaction } from "./wallet-api";
import { getSupabase } from "./supabase";
import { getWalletMonitorTargets } from "./wallet-chain-monitor";
import { fromBaseUnits, getAssetDecimals, minConfirmationsFor } from "./chain-rules";

/**
 * Non-custodial wallet activity reader.
 *
 * Contract:
 * - No database. Nothing is selected from or written to any table. The only
 *   network call is the `monitor-deposits` chain scanner, invoked with the
 *   wallet's PUBLIC address. The chain is the sole source of truth.
 * - Never drops a transaction it cannot classify. A row with an unknown
 *   direction is still shown (as a transfer) rather than disappearing, which
 *   is what made UTXO chains like Bitcoin show an empty activity list.
 * - Pending outbound sends broadcast from this device are read from a local
 *   cache purely so they are visible until the chain indexes them.
 */

const LOCAL_WITHDRAWALS_KEY = "pexly_local_withdrawals_v1";

interface LocalWithdrawal {
  userId: string;
  cryptoSymbol: string;
  amount: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  createdAt: string;
}

interface MonitorTarget {
  address: string;
  chain: string;
}

// ── generic readers ───────────────────────────────────────────────────────────

function readString(raw: any, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = raw?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function readDate(raw: any): string {
  const value =
    raw?.created_at ?? raw?.createdAt ?? raw?.timestamp ?? raw?.time ??
    raw?.block_time ?? raw?.blockTime ?? raw?.date ??
    raw?.metadata?.blockTimestamp ?? raw?.metadata?.timestamp;

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value < 1_000_000_000_000 ? value * 1000 : value).toISOString();
  }
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
}

/**
 * Amount resolution with an explicit exponent — no magnitude heuristics.
 * `amountRaw`/`valueRaw` are base units and win when present; otherwise the
 * monitor's display-unit `amount` is used as-is.
 */
function readAmount(raw: any, symbol: string): number {
  const payloadDecimals = Number(
    raw?.decimals ?? (typeof raw?.tokenAmount === "object" ? raw.tokenAmount?.decimals : undefined),
  );
  const decimals = Number.isInteger(payloadDecimals) && payloadDecimals > 0 && payloadDecimals <= 36
    ? payloadDecimals
    : getAssetDecimals(symbol);

  const rawUnits =
    raw?.amountRaw ??
    raw?.valueRaw ??
    raw?.value_raw ??
    raw?.satoshis ??
    raw?.drops ??
    raw?.lamports ??
    (typeof raw?.tokenAmount === "object" ? raw.tokenAmount?.amount : undefined);

  if (rawUnits != null && String(rawUnits).trim() !== "") {
    const scaled = fromBaseUnits(rawUnits as any, decimals);
    if (Number.isFinite(scaled)) return scaled;
  }

  const display = raw?.amount ?? raw?.tokenAmount ?? raw?.value_decimal ?? raw?.value;
  const candidate = typeof display === "object"
    ? display?.uiAmountString ?? display?.uiAmount ?? display?.amount ?? display?.value
    : display;

  if (typeof candidate === "string" && (candidate.startsWith("0x") || /^-?\d+$/.test(candidate.trim()))) {
    // Older monitor responses exposed the raw integer in `amount`/`value`
    // without the explicit `amountRaw` field. Treat that legacy shape as base
    // units; the current monitor always includes amountRaw when it does so.
    return fromBaseUnits(candidate, decimals);
  }

  if (typeof candidate === "number" && Number.isSafeInteger(candidate)) {
    // Same compatibility path for providers that serialise the raw amount as
    // a JSON number instead of a string (for example, BTC satoshis).
    return fromBaseUnits(candidate, decimals);
  }

  const asNumber = Number(candidate);
  return Number.isFinite(asNumber) ? asNumber : 0;
}

function extractOnChainTransactions(data: any, depth = 0): any[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object" || depth > 4) return [];

  const listKeys = [
    "transactions", "activity", "activities", "operations", "history",
    "transfers", "items", "records", "results", "txs", "deposits", "events",
  ];
  for (const key of listKeys) {
    if (Array.isArray(data[key])) return data[key];
  }

  for (const key of ["data", "result", "payload", "response"]) {
    const nested = data[key];
    if (nested && nested !== data) {
      const extracted = extractOnChainTransactions(nested, depth + 1);
      if (extracted.length > 0) return extracted;
    }
  }

  const hasIdentity = [
    "hash", "txid", "txId", "txHash", "transactionHash", "tx_hash",
    "signature", "transaction_id", "transactionId",
  ].some((key) => typeof data[key] === "string" && data[key].trim());
  return hasIdentity ? [data] : [];
}

// ── normalisation ─────────────────────────────────────────────────────────────

function sameAddress(left: string | null | undefined, right: string): boolean {
  return !!left && left.toLowerCase() === right.toLowerCase();
}

function addressList(raw: any, ...keys: string[]): string[] {
  const out: string[] = [];
  for (const key of keys) {
    const value = raw?.[key];
    if (!Array.isArray(value)) continue;
    for (const entry of value) {
      if (typeof entry === "string") out.push(entry);
      else if (entry && typeof entry === "object") {
        const candidate =
          entry.address ?? entry.addr ?? entry.to ?? entry.from ??
          entry.scriptPubKey?.address ?? entry.prevout?.address;
        if (typeof candidate === "string") out.push(candidate);
        if (Array.isArray(entry.scriptPubKey?.addresses)) out.push(...entry.scriptPubKey.addresses);
        if (Array.isArray(entry.addresses)) out.push(...entry.addresses);
      }
    }
  }
  return out.filter(Boolean);
}

/** Direction from any shape the monitor can return, UTXO chains included. */
function resolveDirection(raw: any, address: string): "in" | "out" | "unknown" {
  const explicit = String(raw?.direction ?? raw?.transferType ?? raw?.txType ?? raw?.type ?? "")
    .toLowerCase();
  if (["in", "incoming", "receive", "received", "deposit", "credit"].includes(explicit)) return "in";
  if (["out", "outgoing", "send", "sent", "withdraw", "withdrawal", "debit"].includes(explicit)) return "out";

  const from = readString(raw, "from", "fromAddress", "from_address", "sender", "account");
  const to = readString(raw, "to", "toAddress", "to_address", "recipient", "destination");
  const fromMatch = sameAddress(from, address) || addressList(raw, "inputs", "vin", "senders").some((a) => sameAddress(a, address));
  const toMatch = sameAddress(to, address) || addressList(raw, "outputs", "vout", "recipients").some((a) => sameAddress(a, address));

  if (toMatch && !fromMatch) return "in";
  if (fromMatch && !toMatch) return "out";
  if (fromMatch && toMatch) return "out"; // self-transfer: the user initiated it
  return "unknown";
}

function symbolForTarget(raw: any, chain: string): string {
  const explicit = readString(raw, "crypto_symbol", "cryptoSymbol", "symbol", "tokenSymbol", "asset", "currency");
  if (explicit) return explicit.toUpperCase();
  if (chain === "BSC") return "BNB";
  if (chain === "POLYGON") return "POL";
  if (chain === "BASE" || chain === "ARBITRUM" || chain === "OPTIMISM") return "ETH";
  if (chain === "Bitcoin") return "BTC";
  if (chain === "Solana") return "SOL";
  if (chain === "Tron") return "TRX";
  if (chain === "Ethereum") return "ETH";
  return chain.toUpperCase();
}

function normalizeOnChainTransaction(
  raw: any,
  userId: string,
  target: MonitorTarget,
): WalletTransaction | null {
  const hash = readString(
    raw, "hash", "txid", "txId", "txHash", "transactionHash", "tx_hash",
    "signature", "transaction_id", "transactionId", "id",
  );
  if (!hash) return null;

  const direction = resolveDirection(raw, target.address);
  // Unknown direction is still shown. Losing the row is worse than labelling
  // it as an inbound transfer the user can open and inspect.
  const type: WalletTransaction["type"] =
    direction === "out" ? "withdrawal" : raw?.type === "swap" ? "swap" : "deposit";

  const symbol = symbolForTarget(raw, target.chain);
  const required = minConfirmationsFor(target.chain);
  const confirmationsValue = Number(
    raw?.confirmations ?? raw?.confirmationCount ?? raw?.numConfirmations,
  );
  const confirmations = Number.isFinite(confirmationsValue) ? Math.max(0, confirmationsValue) : 0;

  const rawStatus = String(raw?.status ?? "").toLowerCase();
  const failed = rawStatus === "failed" || rawStatus === "error" || raw?.success === false;
  const status: WalletTransaction["status"] = failed
    ? "failed"
    : confirmations >= required || raw?.finalized === true
      ? "completed"
      : "pending";

  // A transfer index keeps batched sends and multi-output UTXO deposits from
  // collapsing into one row.
  const index = readString(raw, "logIndex", "log_index", "vout", "outputIndex", "uniqueId", "index") ?? "0";

  return {
    id: `onchain:${target.chain}:${hash}:${symbol}:${index}`,
    user_id: userId,
    wallet_id: `onchain:${target.chain}:${target.address}`,
    type,
    crypto_symbol: symbol,
    amount: readAmount(raw, symbol),
    fee: Number(raw?.fee ?? 0) || 0,
    status,
    tx_hash: hash,
    from_address: readString(raw, "from", "fromAddress", "from_address", "sender"),
    to_address: readString(raw, "to", "toAddress", "to_address", "recipient"),
    reference_id: hash,
    notes: direction === "unknown" ? "On-chain transfer" : "On-chain transaction",
    confirmations,
    required_confirmations: required,
    created_at: readDate(raw),
    completed_at: status === "completed" ? readDate(raw) : null,
  };
}

// ── local pending outbound cache (visibility only) ─────────────────────────────

function readLocalWithdrawalCache(): LocalWithdrawal[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_WITHDRAWALS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addLocalWithdrawalHash(params: {
  userId: string;
  cryptoSymbol: string;
  amount: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  createdAt?: string;
}): void {
  if (typeof localStorage === "undefined") return;
  const entry: LocalWithdrawal = {
    userId: params.userId,
    cryptoSymbol: params.cryptoSymbol.toUpperCase(),
    amount: params.amount,
    txHash: params.txHash,
    fromAddress: params.fromAddress,
    toAddress: params.toAddress,
    createdAt: params.createdAt ?? new Date().toISOString(),
  };
  const next = [entry, ...readLocalWithdrawalCache().filter((w) => w.txHash !== entry.txHash)].slice(0, 200);
  try {
    localStorage.setItem(LOCAL_WITHDRAWALS_KEY, JSON.stringify(next));
  } catch {
    // Cache only; the chain stays authoritative.
  }
}

/** Broadcast-but-unindexed sends, for subtraction from spendable balance. */
export function getPendingOutbound(userId: string): { cryptoSymbol: string; amount: number }[] {
  return readLocalWithdrawalCache()
    .filter((w) => w.userId === userId)
    .map((w) => ({ cryptoSymbol: w.cryptoSymbol, amount: w.amount }));
}

function readLocalWithdrawals(userId: string, limit: number): WalletTransaction[] {
  return readLocalWithdrawalCache()
    .filter((w) => w.userId === userId)
    .slice(0, limit)
    .map((w) => ({
      id: `local:${w.txHash}`,
      user_id: userId,
      wallet_id: `withdrawal:${w.txHash}`,
      type: "withdrawal" as const,
      crypto_symbol: w.cryptoSymbol,
      amount: w.amount,
      fee: 0,
      status: "pending" as const,
      tx_hash: w.txHash,
      from_address: w.fromAddress,
      to_address: w.toAddress,
      reference_id: w.txHash,
      notes: "Broadcast from this device, waiting for the chain",
      confirmations: 0,
      required_confirmations: null,
      created_at: w.createdAt,
      completed_at: null,
    }));
}

// ── public reader ─────────────────────────────────────────────────────────────

async function readTargetActivity(
  client: any,
  target: MonitorTarget,
  userId: string,
  limit: number,
  mode: string,
): Promise<WalletTransaction[]> {
  const { data, error } = await client.functions.invoke("monitor-deposits", {
    body: {
      address: target.address,
      chain: target.chain,
      mode,
      limit,
      minConfirmations: minConfirmationsFor(target.chain),
    },
  });
  if (error) throw new Error(`${target.chain}: ${error.message}`);

  return extractOnChainTransactions(data)
    .map((raw: any) => normalizeOnChainTransaction(raw, userId, target))
    .filter((tx): tx is WalletTransaction => !!tx);
}

/**
 * All wallet operations (inbound and outbound) for every monitored address.
 * Reads the chain only. A single failing chain never blanks the whole list.
 */
export async function getOnChainTransactions(
  userId: string,
  limit: number = 200,
): Promise<WalletTransaction[]> {
  const local = readLocalWithdrawals(userId, limit);
  if (!userId) return local;

  const client = await getSupabase();
  const targets = (await getWalletMonitorTargets(userId)) as MonitorTarget[];

  if (!targets || targets.length === 0) return local;

  let failedTargets = 0;
  const results = await Promise.all(
    targets.map(async (target) => {
      // "all" returns inbound + outbound on monitor builds that support it;
      // "deposits" is the guaranteed fallback. Both are merged and deduped,
      // so an older monitor still yields the full deposit history.
      const collected: WalletTransaction[] = [];
      let sawSuccess = false;

      for (const mode of ["all", "deposits"]) {
        try {
          collected.push(...await readTargetActivity(client, target, userId, limit, mode));
          sawSuccess = true;
          if (mode === "all" && collected.length > 0) break;
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("[wallet-activity] read failed:", target.chain, mode, error);
          }
        }
      }

      if (!sawSuccess) failedTargets += 1;
      return collected;
    }),
  );

  const unique = new Map<string, WalletTransaction>();
  for (const tx of results.flat()) unique.set(tx.id, tx);

  // Drop a local pending row once the chain has that hash.
  const chainHashes = new Set(
    Array.from(unique.values()).map((tx) => (tx.tx_hash ?? "").toLowerCase()),
  );
  for (const tx of local) {
    if (!chainHashes.has((tx.tx_hash ?? "").toLowerCase())) unique.set(tx.id, tx);
  }

  if (failedTargets === targets.length && unique.size === 0) {
    throw new Error("Unable to read on-chain wallet activity");
  }

  return Array.from(unique.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
