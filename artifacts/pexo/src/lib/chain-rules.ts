/**
 * Single source of truth for chain-level rules used by the non-custodial
 * wallet: confirmation minimums and base-unit decimals.
 *
 * Nothing here touches a database. These are protocol facts, so both the
 * balance hook and the activity reader must import them instead of keeping
 * their own copies (which is how BTC ended up with two different minimums).
 */

/**
 * Minimum confirmations before an inbound/outbound transfer is treated as
 * settled for display and for spendable balance.
 *
 * Bitcoin is intentionally 1: this wallet is non-custodial, the user carries
 * their own reorg risk, and a 1-conf BTC transaction is already mined into a
 * block. Deeper waits belong to custodians who are underwriting the risk.
 */
export const MIN_CONFIRMATIONS: Record<string, number> = {
  Bitcoin: 1,
  BTC: 1,
  Ethereum: 12,
  ETH: 12,
  BSC: 15,
  BNB: 15,
  POLYGON: 30,
  POL: 30,
  MATIC: 30,
  ARBITRUM: 12,
  OPTIMISM: 12,
  BASE: 12,
  Solana: 32,
  SOL: 32,
  Tron: 19,
  TRX: 19,
  XRP: 1,
  Avalanche: 20,
  AVALANCHE: 20,
  AVAX: 20,
  // Uppercase aliases: callers pass either the monitor chain key ("Bitcoin")
  // or an already-uppercased one ("BITCOIN"), and a miss here silently fell
  // through to DEFAULT_MIN_CONFIRMATIONS.
  BITCOIN: 1,
  ETHEREUM: 12,
  SOLANA: 32,
  TRON: 19,
};

export const DEFAULT_MIN_CONFIRMATIONS = 6;

/** Confirmations required for `chainOrSymbol` (chain key or asset symbol). */
export function minConfirmationsFor(chainOrSymbol?: string | null): number {
  if (!chainOrSymbol) return DEFAULT_MIN_CONFIRMATIONS;
  const key = String(chainOrSymbol).trim();
  return (
    MIN_CONFIRMATIONS[key] ??
    MIN_CONFIRMATIONS[key.toUpperCase()] ??
    DEFAULT_MIN_CONFIRMATIONS
  );
}

/** Base-unit exponent per asset. EVM-style assets default to 18. */
export const ASSET_DECIMALS: Record<string, number> = {
  BTC: 8, LTC: 8, BCH: 8, DOGE: 8, DASH: 8, ZEC: 8,
  XRP: 6, TRX: 6, ATOM: 6, USDT: 6, USDC: 6,
  SOL: 9, TON: 9,
  ETH: 18, BNB: 18, MATIC: 18, POL: 18, AVAX: 18, ARB: 18,
  OP: 18, BASE: 18, DAI: 18, LINK: 18, UNI: 18, SHIB: 18,
};

export function getAssetDecimals(symbol?: string | null): number {
  if (!symbol) return 18;
  return ASSET_DECIMALS[symbol.toUpperCase().trim()] ?? 18;
}

/**
 * Exact base-unit -> display-unit conversion. No magnitude guessing: the
 * caller states the exponent, and integer strings are scaled with BigInt so
 * satoshi/wei values never lose precision.
 */
export function fromBaseUnits(raw: string | number | bigint, decimals: number): number {
  const text = String(raw).trim();
  if (!text) return 0;

  let units: bigint;
  try {
    units = text.startsWith("0x") || text.startsWith("0X")
      ? BigInt(text)
      : /^[+-]?\d+$/.test(text)
        ? BigInt(text)
        : BigInt(Math.trunc(Number(text)));
  } catch {
    const asNumber = Number(text);
    return Number.isFinite(asNumber) ? asNumber / Math.pow(10, decimals) : 0;
  }

  const negative = units < 0n;
  const abs = negative ? -units : units;
  const divisor = 10n ** BigInt(Math.max(0, decimals));
  const whole = abs / divisor;
  const fraction = abs % divisor;
  const value = Number(whole) + Number(fraction) / Number(divisor);
  return negative ? -value : value;
}
