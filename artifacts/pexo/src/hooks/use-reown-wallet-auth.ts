import { useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { useEvmWallet } from "@/lib/evm-wallet-provider";

type WalletAuthResult =
  | { status: "connection-opened" }
  | { status: "signed-in"; user: User };

/**
 * Uses Reown for wallet connection/signing and Supabase's native SIWE verifier
 * for authentication. Pez never receives or stores a wallet private key.
 */
export function useReownWalletAuth() {
  const wallet = useEvmWallet();
  const account = useAccount();
  const { signMessageAsync } = useSignMessage();

  const signIn = useCallback(
    async (captchaToken: string | null): Promise<WalletAuthResult> => {
      if (!wallet.configured) {
        throw new Error("Wallet connection is not configured. Add VITE_REOWN_PROJECT_ID to the app environment.");
      }

      if (!account.isConnected || !account.address) {
        wallet.openConnect();
        return { status: "connection-opened" };
      }

      const origin = window.location.origin;
      const message = createSiweMessage({
        address: account.address,
        chainId: account.chainId ?? 1,
        domain: window.location.host,
        nonce: generateSiweNonce(),
        uri: `${origin}/`,
        version: "1",
        statement: "Sign in to Pexly. This message does not authorize a transaction.",
        issuedAt: new Date().toISOString(),
      });
      const signature = await signMessageAsync({
        account: account.address,
        message,
      });

      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: "ethereum",
        message,
        signature,
        options: {
          captchaToken: captchaToken ?? undefined,
          url: `${origin}${window.location.pathname}`,
        },
      });

      if (error) throw error;
      if (!data.user || !data.session) {
        throw new Error("Wallet sign-in did not create an active Supabase session.");
      }
      return { status: "signed-in", user: data.user };
    },
    [account.address, account.chainId, account.isConnected, signMessageAsync, wallet],
  );

  return { signIn, isConnected: account.isConnected, address: account.address };
}
