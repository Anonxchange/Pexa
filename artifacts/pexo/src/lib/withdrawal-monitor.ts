import { getSupabase } from "@/lib/supabase";

export interface MonitorWithdrawalParams {
  chain: string;
  txHash: string;
  fromAddress?: string;
  broadcastAt?: number;
  expected?: {
    toAddress?: string;
    amount?: string;
    asset?: string;
    contract?: string;
    destinationTag?: number;
  };
}

function normalizeChain(value: string): string {
  const chain = value.trim().toUpperCase();

  if (chain.includes("BITCOIN") || chain === "BTC") return "BTC";
  if (chain.includes("ETHEREUM") || chain === "ETH" || chain.includes("ERC-20")) return "ETH";
  if (chain.includes("BINANCE") || chain === "BNB" || chain === "BSC" || chain.includes("BEP-20")) return "BSC";
  if (chain.includes("POLYGON") || chain === "MATIC" || chain === "POL") return "POLYGON";
  if (chain.includes("ARBITRUM") || chain === "ARB") return "ARBITRUM";
  if (chain.includes("OPTIMISM") || chain === "OP") return "OPTIMISM";
  if (chain.includes("BASE")) return "BASE";
  if (chain.includes("AVALANCHE") || chain === "AVAX") return "AVAX";
  if (chain.includes("SOLANA") || chain === "SOL" || chain.includes("SPL")) return "SOL";
  if (chain.includes("TRON") || chain === "TRX" || chain.includes("TRC-20")) return "TRX";
  if (chain.includes("RIPPLE") || chain === "XRP" || chain.includes("XRPL")) return "XRP";

  return chain;
}

/**
 * Ask the withdrawal edge function for the first on-chain status after a
 * signed transaction has been broadcast.
 *
 * Monitoring is deliberately separate from broadcasting: a monitor outage
 * must not make an already-broadcast withdrawal look like it failed.
 */
export async function monitorWithdrawal(params: MonitorWithdrawalParams): Promise<any> {
  const client = await getSupabase();
  const { data, error } = await client.functions.invoke("monitor-withdrawal", {
    body: {
      ...params,
      chain: normalizeChain(params.chain),
    },
  });

  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error ?? "Withdrawal monitor returned an invalid response");
  return data;
}
