// src/lib/security/login-throttle.ts
//
// Server-authoritative login throttling for password sign-in.
//
// The counter lives in Postgres (see 20260810_login_throttle.sql) and is
// mutated through SECURITY DEFINER RPCs, so it survives page refreshes,
// new tabs, private windows, cleared localStorage and different devices.
// Nothing here is trusted client state — the client only renders what the
// server reports.

import { supabase } from "@/lib/supabase";

export interface ThrottleState {
  /** Epoch ms when the account unlocks, or null when it is not locked. */
  lockedUntil: number | null;
  /** Attempts remaining before a lock kicks in, or null when unknown. */
  attemptsLeft: number | null;
}

export interface ThrottleGate extends ThrottleState {
  allowed: boolean;
}

type RpcRow = {
  allowed?: boolean;
  locked_until: string | null;
  attempts_left: number | null;
};

function toState(row: RpcRow | null | undefined): ThrottleGate {
  if (!row) {
    // Fail OPEN on transport errors so a database blip can't lock everybody
    // out, but never fail open on an explicit `allowed: false` from the server.
    return { allowed: true, lockedUntil: null, attemptsLeft: null };
  }
  const lockedUntil = row.locked_until ? new Date(row.locked_until).getTime() : null;
  const stillLocked = lockedUntil !== null && lockedUntil > Date.now();
  return {
    allowed: row.allowed !== false && !stillLocked,
    lockedUntil: stillLocked ? lockedUntil : null,
    attemptsLeft: row.attempts_left ?? null,
  };
}

async function call(fn: string, identifier: string): Promise<ThrottleGate> {
  try {
    const { data, error } = await supabase.rpc(fn, { p_identifier: identifier });
    if (error) {
      console.error(`[login-throttle] ${fn} failed:`, error.message);
      return toState(null);
    }
    return toState(Array.isArray(data) ? (data[0] as RpcRow) : (data as RpcRow));
  } catch (err) {
    console.error(`[login-throttle] ${fn} threw:`, err);
    return toState(null);
  }
}

export const loginThrottle = {
  /** Read-only check — does not count as an attempt. */
  status: (identifier: string) => call("login_throttle_status", identifier),
  /** Atomically registers an attempt and returns whether it may proceed. */
  consume: (identifier: string) => call("login_throttle_consume", identifier),
  /** Called after Supabase Auth rejects the credentials. */
  recordFailure: (identifier: string) => call("login_throttle_record_failure", identifier),
  /** Called after a successful sign-in. */
  reset: (identifier: string) => call("login_throttle_reset", identifier),
};

export function formatCooldown(lockedUntil: number | null): string {
  if (!lockedUntil) return "a moment";
  const seconds = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
