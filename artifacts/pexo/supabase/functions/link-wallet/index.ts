import { createClient } from "npm:@supabase/supabase-js@2";
import { getAddress, isAddress, verifyMessage } from "npm:viem@2";
import { parseSiweMessage } from "npm:viem@2/siwe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const authorization = request.headers.get("Authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) return jsonResponse({ error: "Sign in before linking a wallet." }, 401);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return jsonResponse({ error: "The wallet-link function is not configured." }, 500);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: authData, error: authError } = await userClient.auth.getUser(accessToken);
    const user = authData.user;
    if (authError || !user) return jsonResponse({ error: "Your Pez session is invalid." }, 401);

    const body = await request.json();
    const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
    const message = typeof body.message === "string" ? body.message : "";
    const signature = typeof body.signature === "string" ? body.signature : "";
    const flow = body.flow === "siwe" ? "siwe" : "link";
    if (!isAddress(walletAddress) || !signature) {
      return jsonResponse({ error: "A valid EVM address and wallet signature are required." }, 400);
    }

    const address = getAddress(walletAddress);
    if (flow === "siwe") {
      const siwe = parseSiweMessage(message);
      const origin = request.headers.get("Origin");
      const expectedDomain = origin ? new URL(origin).host : "";
      const issuedAt = siwe.issuedAt ? Date.parse(siwe.issuedAt) : NaN;
      const ageMs = Date.now() - issuedAt;
      if (
        !siwe.address ||
        siwe.address.toLowerCase() !== address.toLowerCase() ||
        siwe.domain !== expectedDomain ||
        !siwe.nonce ||
        siwe.version !== "1" ||
        !Number.isFinite(issuedAt) ||
        ageMs < -60_000 ||
        ageMs > 5 * 60_000
      ) {
        return jsonResponse({ error: "The SIWE message is invalid or expired." }, 400);
      }
    } else {
      const identity = user.email || user.id;
      const messageMatch = message.match(/ at (\d{13})$/);
      const issuedAt = messageMatch ? Number(messageMatch[1]) : 0;
      const ageMs = Date.now() - issuedAt;
      const expectedMessage = `Verify ownership of wallet ${address} for Pez account ${identity} at ${issuedAt}`;
      if (
        !messageMatch ||
        message !== expectedMessage ||
        !Number.isFinite(ageMs) ||
        ageMs < -60_000 ||
        ageMs > 5 * 60_000
      ) {
        return jsonResponse({ error: "The wallet verification message is invalid or expired." }, 400);
      }
    }

    const valid = await verifyMessage({
      address,
      message,
      signature: signature as `0x${string}`,
    });
    if (!valid) return jsonResponse({ error: "The wallet signature could not be verified." }, 403);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: existing, error: existingError } = await admin
      .from("user_wallets")
      .select("wallet_address,is_primary")
      .eq("user_id", user.id);
    if (existingError) throw existingError;

    const { error: clearPrimaryError } = await admin
      .from("user_wallets")
      .update({ is_primary: false })
      .eq("user_id", user.id);
    if (clearPrimaryError) throw clearPrimaryError;

    const { error: upsertError } = await admin.from("user_wallets").upsert(
      {
        user_id: user.id,
        wallet_address: address.toLowerCase(),
        chain_type: "evm",
        is_primary: true,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,wallet_address" },
    );
    if (upsertError) throw upsertError;

    return jsonResponse({ ok: true, walletAddress: address.toLowerCase() });
  } catch (error) {
    console.error("link-wallet failed", error);
    return jsonResponse({ error: "Wallet verification could not be completed." }, 500);
  }
});
