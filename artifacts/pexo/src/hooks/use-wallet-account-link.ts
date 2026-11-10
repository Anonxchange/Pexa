import { useCallback, useEffect, useState } from "react";
import { useSignMessage } from "wagmi";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";
import { useEvmWallet } from "@/lib/evm-wallet-provider";

type WalletLinkStatus = "loading" | "unlinked" | "disconnected" | "linked" | "different";

export function useWalletAccountLink() {
  const { user } = useAuth();
  const wallet = useEvmWallet();
  const { signMessageAsync } = useSignMessage();
  const [linkedAddress, setLinkedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLinkedWallet = useCallback(async () => {
    if (!user?.id) {
      setLinkedAddress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = await getSupabase();
      const { data, error: queryError } = await supabase
        .from("user_wallets")
        .select("wallet_address,is_primary")
        .eq("user_id", user.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1);
      if (queryError) throw queryError;
      setLinkedAddress(data?.[0]?.wallet_address?.toLowerCase() ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load the linked wallet.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadLinkedWallet();
  }, [loadLinkedWallet]);

  const status: WalletLinkStatus = loading
    ? "loading"
    : !linkedAddress
      ? "unlinked"
      : !wallet.isConnected || !wallet.address
        ? "disconnected"
        : linkedAddress === wallet.address.toLowerCase()
          ? "linked"
          : "different";

  const linkCurrentWallet = useCallback(async () => {
    if (!user?.id || !wallet.address || !wallet.isConnected) {
      throw new Error("Connect the wallet you want to link first.");
    }
    setLinking(true);
    setError(null);
    try {
      const timestamp = Date.now();
      const identity = user.email || user.id;
      const message = `Verify ownership of wallet ${wallet.address} for Pez account ${identity} at ${timestamp}`;
      const signature = await signMessageAsync({
        account: wallet.address,
        message,
      });

      const supabase = await getSupabase();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || authData.user?.id !== user.id) {
        throw new Error("Your Pez session changed. Sign in again and retry.");
      }

      const { error: functionError } = await supabase.functions.invoke("link-wallet", {
        body: {
          walletAddress: wallet.address,
          message,
          signature,
        },
      });
      if (functionError) throw functionError;
      await loadLinkedWallet();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not verify this wallet.";
      setError(message);
      throw reason;
    } finally {
      setLinking(false);
    }
  }, [loadLinkedWallet, signMessageAsync, user, wallet.address, wallet.isConnected]);

  return {
    linkedAddress,
    status,
    loading,
    linking,
    error,
    linkCurrentWallet,
    refresh: loadLinkedWallet,
  };
}
