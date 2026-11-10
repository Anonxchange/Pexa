/**
 * chain-gateway — frontend client for the Supabase `chain-gateway` edge function.
 *
 * All direct calls to public blockchain nodes (mempool.space, blockstream.info,
 * publicnode.com, drpc.org, api.mainnet-beta.solana.com, trongrid.io, …) are
 * replaced with calls to this module, which proxies them through the secure
 * edge function backed by Alchemy + authenticated Supabase RLS.
 *
 * Supported actions (mirror the edge function router):
 *   rpc        — EVM (ETH/ARB/POL/BASE/OP/BNB) + SOL + BTC JSON-RPC (Alchemy)
 *   btc_fees   — Bitcoin fee estimate (sat/vB) via Alchemy estimatesmartfee
 *   btc_utxos  — Bitcoin UTXO set for an address (via BTC indexer on the server)
 *   btc_balance— Bitcoin balance for an address (via BTC indexer on the server)
 *   xrp        — XRPL JSON-RPC commands
 *   xrp_fees   — XRP fee estimate (drops)
 *   xrp_balance— XRP balance (drops)
 *   tron       — TronGrid API proxy
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';
const GATEWAY_URL = `${SUPABASE_URL}/functions/v1/chain-gateway`;

function formatGatewayError(value: unknown): string {
  if (value instanceof Error && value.message) return value.message;
  if (typeof value === 'string' && value.trim()) return value;
  if (value && typeof value === 'object') {
    const error = value as Record<string, unknown>;
    const nested = error.error;
    if (nested && nested !== value) return formatGatewayError(nested);
    const message = error.message ?? error.msg ?? error.detail ?? error.reason;
    if (typeof message === 'string' && message.trim()) {
      return message.replace(/\s*\(code\s+[-\d]+\)\s*$/i, '').trim();
    }
    try {
      return JSON.stringify(value);
    } catch {
      return 'Unknown gateway error';
    }
  }
  return String(value || 'Unknown gateway error');
}

// ── Auth ─────────────────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const { getSupabase } = await import('./supabase');
    const supabase = await getSupabase();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

// ── Core fetch ───────────────────────────────────────────────────────────────

async function gatewayPost(body: Record<string, unknown>, withAuth = false): Promise<any> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'chain-gateway: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.',
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
  };

  if (withAuth) {
    const token = await getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Gateway returned non-JSON (HTTP ${res.status})`);
  }

  if (!res.ok || data?.error) {
    throw new Error(formatGatewayError(data?.error ?? data?.message ?? `Gateway HTTP ${res.status}`));
  }

  return data;
}

// ── EVM / SOL / BTC RPC ──────────────────────────────────────────────────────

/**
 * Read-only JSON-RPC call to an Alchemy-backed node.
 * Supported chains: ETH, ARB, POL, MATIC, OP, BASE, BNB, SOL, BTC.
 */
/**
 * Read-only JSON-RPC call to an Alchemy-backed node.
 * Returns the JSON-RPC `.result` value directly (not the full {result,jsonrpc,id} envelope),
 * so callers can use the return value as a hex string without extracting .result themselves.
 */
export function chainRpc(chain: string, method: string, params: unknown[] = []): Promise<any> {
  return gatewayPost({ action: 'rpc', chain: chain.toUpperCase(), method, params })
    .then((data) => data?.result ?? data);
}

/**
 * Broadcast a signed raw transaction. Requires the user to be authenticated.
 * Uses `eth_sendRawTransaction` for EVM, `sendTransaction` for SOL,
 * and `sendrawtransaction` for BTC.
 */
export function chainBroadcast(chain: string, method: string, params: unknown[]): Promise<any> {
  return gatewayPost({ action: 'rpc', chain: chain.toUpperCase(), method, params }, true);
}

// ── Bitcoin helpers ───────────────────────────────────────────────────────────

/** Estimate Bitcoin fees → { fast, normal, slow, minimum } in sat/vB */
export function btcFees(): Promise<{
  fast: number;
  normal: number;
  slow: number;
  minimum: number;
  unit: string;
  source: string;
}> {
  return gatewayPost({ action: 'btc_fees' });
}

/** UTXO set for a Bitcoin address */
export function btcUtxos(address: string): Promise<{
  address: string;
  utxos: Array<{
    txid: string;
    vout: number;
    value: number | string;
    confirmed: boolean;
    confirmations?: number;
    spendable?: boolean;
    blockHeight: number | null;
  }>;
  spendableUtxos?: Array<{
    txid: string;
    vout: number;
    value: number | string;
    confirmed: boolean;
    confirmations?: number;
    spendable?: boolean;
    blockHeight: number | null;
  }>;
  total: number;
}> {
  return gatewayPost({ action: 'btc_utxos', address });
}

/** Balance summary for a Bitcoin address → raw amount in satoshis */
export function btcBalance(address: string): Promise<{
  address: string;
  raw: string;
  decimals: number;
  symbol: string;
}> {
  return gatewayPost({ action: 'btc_balance', address });
}

// ── XRP helpers ───────────────────────────────────────────────────────────────

/** Read-only XRPL command */
export function xrpRpc(command: string, params: Record<string, unknown> = {}): Promise<any> {
  return gatewayPost({ action: 'xrp', command, params });
}

/** Submit a signed XRPL transaction (tx_blob). Requires authentication. */
export function xrpBroadcast(txBlob: string): Promise<any> {
  return gatewayPost({ action: 'xrp', command: 'submit', params: { tx_blob: txBlob } }, true);
}

/** XRP fee estimate → { fast, normal, slow, minimum } in drops */
export function xrpFees(): Promise<{
  fast: number;
  normal: number;
  slow: number;
  minimum: number;
  unit: string;
}> {
  return gatewayPost({ action: 'xrp_fees' });
}

/** XRP account balance → raw amount in drops */
export function xrpBalance(address: string): Promise<{
  address: string;
  raw: string;
  decimals: number;
  symbol: string;
  sequence?: number;
  funded: boolean;
}> {
  return gatewayPost({ action: 'xrp_balance', address });
}

// ── Tron helpers ──────────────────────────────────────────────────────────────

/** Read-only TronGrid GET request */
export function tronGet(path: string): Promise<any> {
  return gatewayPost({ action: 'tron', path, method: 'GET' });
}

/** TronGrid POST request (read-only — use tronBroadcast for broadcasting) */
export function tronPost(path: string, body: unknown): Promise<any> {
  return gatewayPost({ action: 'tron', path, method: 'POST', body });
}

/** Broadcast a signed Tron transaction. Requires authentication. */
export function tronBroadcast(tx: unknown): Promise<any> {
  return gatewayPost(
    { action: 'tron', path: '/wallet/broadcasttransaction', method: 'POST', body: tx },
    true,
  );
}
