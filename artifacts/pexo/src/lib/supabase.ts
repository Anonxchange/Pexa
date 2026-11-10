import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "";
const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export function isSupabaseConfigured(): boolean {
  return supabaseConfigured;
}

let _client: SupabaseClient | null = null;
let _promise: Promise<SupabaseClient> | null = null;

/**
 * Async getter — always safe.
 * Triggers a one-time dynamic import of @supabase/ssr so the entire
 * Supabase SDK is excluded from the initial eager bundle.
 */
export async function getSupabase(): Promise<SupabaseClient> {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Sign-in and live data are unavailable until it is connected.",
    );
  }

  if (_client) return _client;
  if (!_promise) {
    _promise = import("@supabase/ssr").then(({ createBrowserClient }) => {
      _client = createBrowserClient(supabaseUrl, supabaseKey, {
        auth: { experimental: { passkey: true } as any },
      });
      return _client;
    });
  }
  return _promise;
}

/** True once the real client exists. Use this to gate any sync access. */
export function isSupabaseReady(): boolean {
  return _client !== null;
}

/**
 * WHY THIS NO LONGER RETURNS SILENT NO-OPS
 * ----------------------------------------
 * The previous version answered every property with a stub that resolved to
 * `{ data: null, error: null }`, and answered `auth` with a fallback whose
 * `getSession()`/`getUser()` resolved to `null`. That turned "the SDK chunk
 * has not downloaded yet" into "this user is signed out and has no profile
 * row" — indistinguishable from a real answer, and the callers acted on it:
 *
 *   - signin.tsx read `profile?.registration_completed === true` from a
 *     no-op result, concluded the account was unregistered, called
 *     cleanup-abandoned-oauth-user, and DELETED a legitimate account.
 *   - route guards read `getSession() -> null` and redirected to /signin.
 *   - `auth` had no `mfa` key at all, so `supabase.auth.mfa.getAuthenticator...`
 *     threw a synchronous TypeError that `.catch()` on the promise chain
 *     could never see.
 *
 * A race that resolves to a plausible-but-wrong value is far worse than one
 * that throws. Anything reached before the client is ready now throws a named
 * error, so the bug surfaces at the call site instead of deleting accounts.
 */
function notReady(prop: string | symbol): never {
  throw new Error(
    `SupabaseNotReady: accessed supabase.${String(prop)} before the client finished loading. ` +
      `Await getSupabase() first (or gate on isSupabaseReady()).`,
  );
}

function makeProxy(): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_, prop) {
      if (_client) return (_client as any)[prop];
      // Thenable check by await/Promise.resolve — must stay falsy.
      if (prop === "then") return undefined;
      if (supabaseConfigured) {
        // Start the lazy import for the next attempt without creating an
        // unhandled rejection if the client cannot be initialized.
        void getSupabase().catch(() => {});
      }
      return notReady(prop);
    },
  });
}

/**
 * Synchronous factory kept for lazy-loaded pages that call createClient() in
 * their component body. By the time any lazy page can be visited, auth-context
 * will have already resolved getSupabase(), so _client is normally set.
 */
export function createClient(): SupabaseClient {
  if (_client) return _client;
  if (supabaseConfigured) {
    void getSupabase().catch(() => {});
  }
  return makeProxy();
}

/**
 * Singleton Proxy over the SAME underlying client as getSupabase().
 * There is exactly one GoTrue instance in the app — do not create another,
 * or two clients will race to consume the single-use PKCE code on the OAuth
 * callback and the loser will report "code verifier should be non-empty".
 */
export const supabase: SupabaseClient = makeProxy();
