import { getSupabase } from "@/lib/supabase";

/**
 * Supabase does not accept a CAPTCHA token on signInWithOAuth itself, so the
 * client-side check below is UX only, NOT a security boundary. Real abuse
 * control for OAuth belongs in Supabase rate limits / the callback handler.
 *
 * IMPORTANT: the app router is mounted with a language base ("/en", "/fr", ...).
 * A redirect to a bare "/signin?..." matches no route under that base, so the
 * sign-in page — and with it the AAL/2FA enforcement in its OAuth callback —
 * never mounts, while Supabase has already established an AAL1 session. That is
 * exactly how Google sign-in ended up bypassing 2FA. Always send the provider
 * back to a language-prefixed path.
 *
 * The same failure happens silently in production if the language-prefixed URL
 * is NOT in Supabase Auth -> URL Configuration -> Redirect URLs: Supabase falls
 * back to the Site URL, the callback effect never mounts, and the AAL1 session
 * walks straight into the app. Register wildcards for every locale:
 *
 *   https://pexly.com/*\/signin*
 *   https://pexly.com/*\/signup*
 *   https://pexly.com/signin*
 *   https://pexly.com/signup*
 */
function currentLangBase(): string {
  const first = window.location.pathname.split("/")[1] ?? "";
  return /^[a-z]{2}(-[A-Za-z]{2})?$/.test(first) ? `/${first}` : "";
}

/** Guard against a caller passing an absolute or protocol-relative URL. */
function assertLocalPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("redirectPath must be a same-origin path starting with '/'");
  }
  return path;
}

export function buildOAuthRedirectUrl(redirectPath: string): string {
  return `${window.location.origin}${currentLangBase()}${assertLocalPath(redirectPath)}`;
}

export async function signInWithGoogle(
  captchaToken?: string | null,
  redirectPath = "/signin?oauth=google&intent=signin",
): Promise<void> {
  const captchaRequired = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);
  if (captchaRequired && !captchaToken) {
    throw new Error("Please complete the CAPTCHA before continuing with Google.");
  }

  const supabase = await getSupabase();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildOAuthRedirectUrl(redirectPath),
      queryParams: { prompt: "select_account" },
    },
  });

  if (error) {
    throw error;
  }
}
