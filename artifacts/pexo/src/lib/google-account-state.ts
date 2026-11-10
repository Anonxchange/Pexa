// src/lib/google-account-state.ts
//
// Single source of truth for "does this authenticated user already have a
// completed Pexly account?". Both signin.tsx and signup.tsx MUST use this —
// the old code asked the question two different ways, which is why an existing
// Google user got bounced signin -> signup -> "check your email".
//
// Hard rules encoded here:
//   1. A missing profile row is INCONCLUSIVE, not "unregistered". The auth
//      trigger creates the row asynchronously; right after the OAuth redirect
//      the SELECT can legitimately return null. Retry before deciding.
//   2. A query error is INCONCLUSIVE. Never sign the user out on a transient
//      read failure.
//   3. Legacy rows (created before `registration_completed` existed) count as
//      complete when there is other positive evidence, and get repaired.

import type { User } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

export type AccountState =
  | { status: "complete"; profile: ProfileRow | null }
  | { status: "new" }            // positively a brand-new OAuth identity
  | { status: "unknown"; error?: unknown }; // could not determine — do NOT sign out

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  registration_completed: boolean | null;
}

const PROFILE_COLUMNS =
  "id, email, full_name, username, email_verified, phone_verified, registration_completed";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** True when the auth user has only ever existed for a few seconds. */
function looksLikeFirstEverSignIn(user: User): boolean {
  const created = Date.parse(user.created_at ?? "");
  const lastSignIn = Date.parse(user.last_sign_in_at ?? user.created_at ?? "");
  if (Number.isNaN(created) || Number.isNaN(lastSignIn)) return false;
  return Math.abs(lastSignIn - created) < 10_000;
}

function isComplete(profile: ProfileRow | null): boolean {
  if (!profile) return false;
  return (
    profile.registration_completed === true ||
    profile.email_verified === true ||
    profile.phone_verified === true ||
    (typeof profile.username === "string" && profile.username.trim().length > 0)
  );
}

/**
 * Resolve the account state, retrying the profile read so the trigger race
 * cannot be mistaken for "no account".
 */
export async function resolveAccountState(
  user: User,
  { attempts = 4, delayMs = 400 }: { attempts?: number; delayMs?: number } = {},
): Promise<AccountState> {
  const sb = await getSupabase();
  let lastError: unknown = null;

  for (let i = 0; i < attempts; i++) {
    const { data, error } = await sb
      .from("user_profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    if (error) {
      lastError = error;
    } else if (data) {
      if (isComplete(data)) {
        // Repair legacy rows so the next sign-in is a single fast read.
        if (data.registration_completed !== true) {
          void sb
            .from("user_profiles")
            .update({ registration_completed: true })
            .eq("id", user.id);
        }
        return { status: "complete", profile: data };
      }
      // Row exists but onboarding is genuinely unfinished.
      return looksLikeFirstEverSignIn(user)
        ? { status: "new" }
        : { status: "complete", profile: data };
      // ^ A returning user whose row is incomplete must NOT be pushed through
      //   signup again; let the app's normal onboarding banners handle it.
    }

    if (i < attempts - 1) await sleep(delayMs * (i + 1));
  }

  // No row after retries. Only call it "new" if the auth user was just created.
  if (!lastError && looksLikeFirstEverSignIn(user)) return { status: "new" };
  return { status: "unknown", error: lastError };
}
