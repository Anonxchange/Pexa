import { resolveWalletChain } from "@/lib/wallet-chain-monitor";

/** Minimal shape needed to pick a deposit address. No secrets involved. */
export interface WalletAddressRow {
  chainId: string;
  address: string;
}

/**
 * L2s that reuse the Ethereum key/address. Kept from the previous matching
 * behaviour so users who only have an "ethereum" row still get an address for
 * these networks. BSC and AVAX intentionally do NOT fall back.
 */
const CHAIN_FALLBACK: Record<string, string> = {
  POLYGON: "ETH",
  ARBITRUM: "ETH",
  OPTIMISM: "ETH",
};

/**
 * Pick the wallet row whose chain matches the selected network.
 *
 * Uses resolveWalletChain, the same resolver the balance/monitor code uses, so
 * "what address we show" and "what address we watch" cannot drift apart.
 * Matches on chainId + address only.
 */
export function findWalletForNetwork<T extends WalletAddressRow>(
  rows: readonly T[],
  cryptoSymbol: string,
  network: string,
): T | null {
  const target = resolveWalletChain(network);
  if (!target.supported) return null;

  const symbol = String(cryptoSymbol ?? "").toUpperCase();

  const candidates = rows
    .filter((r) => typeof r?.chainId === "string" && typeof r?.address === "string" && r.address.trim() !== "")
    .map((row) => ({ row, resolved: resolveWalletChain(row.chainId) }))
    .filter((c) => c.resolved.supported);

  const pickOnChain = (chain: string): T | null => {
    const onChain = candidates.filter((c) => c.resolved.chain === chain);
    // 1) A token row for exactly this token (e.g. usdt-erc20 for USDT).
    const token = onChain.find((c) => c.resolved.isToken && c.resolved.tokenSymbol === symbol);
    if (token) return token.row;
    // 2) The chain's native row: same address receives native + tokens.
    const native = onChain.find((c) => !c.resolved.isToken);
    if (native) return native.row;
    // 3) Any other row on this chain.
    return onChain[0]?.row ?? null;
  };

  const direct = pickOnChain(target.chain);
  if (direct) return direct;

  const fallbackChain = CHAIN_FALLBACK[target.chain];
  return fallbackChain ? pickOnChain(fallbackChain) : null;
}
