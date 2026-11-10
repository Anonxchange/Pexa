import { getSupabase } from './supabase';

export interface WebAuthnCredential {
  id: string;
  credential_id: string;
  public_key: string;
  counter: number;
  device_name: string;
  credential_type: 'hardware_key' | 'passkey';
  created_at: string;
}

export interface PasskeyListItem {
  id: string;
  friendly_name?: string;
  created_at: string;
  last_used_at?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

function edgeFunctionUrl(name: string): string {
  return `${SUPABASE_URL}/functions/v1/${name}`;
}

async function callEdgeFunction(name: string, body: unknown, token?: string): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return fetch(edgeFunctionUrl(name), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

// ── base64url helpers ─────────────────────────────────────────────────────────

function base64urlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(s: string): ArrayBuffer {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (padded.length % 4)) % 4;
  const b64 = padded + '='.repeat(pad);
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
}

class WebAuthnService {
  async isSupported(): Promise<boolean> {
    return !!window.PublicKeyCredential;
  }

  async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    if (!await this.isSupported()) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }

  getDeviceName(): string {
    const ua = navigator.userAgent;
    let browser = 'Browser';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/Chrome\//.test(ua)) browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Safari\//.test(ua)) browser = 'Safari';

    let os = 'Device';
    if (/iPhone/.test(ua)) os = 'iPhone';
    else if (/iPad/.test(ua)) os = 'iPad';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/Windows/.test(ua)) os = 'Windows';
    else if (/Mac OS X/.test(ua)) os = 'Mac';
    else if (/Linux/.test(ua)) os = 'Linux';

    return `${browser} on ${os}`;
  }

  // ── Passkey — email lookup ────────────────────────────────────────────────

  /**
   * Returns true if the given email address has at least one passkey registered.
   * Calls the `check_email_has_passkey` Supabase RPC (SECURITY DEFINER) so the
   * anon role can query auth.mfa_factors and webauthn_credentials without
   * needing the service-role key.
   */
  async checkEmailHasPasskey(email: string): Promise<boolean> {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.rpc('check_email_has_passkey', {
        p_email: email.trim().toLowerCase(),
      });
      if (error) return false;
      return data === true;
    } catch {
      return false;
    }
  }

  // ── Passkey — Supabase built-in ───────────────────────────────────────────

  /**
   * Register a passkey for the currently signed-in user.
   * Uses Supabase's native WebAuthn ceremony — no Edge Functions needed.
   */
  async registerPasskey(_userId: string, _email: string): Promise<PasskeyListItem> {
    if (!await this.isPlatformAuthenticatorAvailable()) {
      throw new Error('Passkeys are not supported on this device');
    }
    const supabase = await getSupabase();
    const { data, error } = await (supabase.auth as any).registerPasskey();
    if (error) throw new Error(error.message ?? 'Passkey registration failed');
    return data as PasskeyListItem;
  }

  /**
   * Sign in with a passkey (discoverable credentials).
   * Uses Supabase's native ceremony — returns the session directly.
   * No tokenHash exchange step required.
   */
  async signInWithPasskey(signal?: AbortSignal): Promise<{ session: any; user: any }> {
    if (!await this.isSupported()) {
      throw new Error('WebAuthn is not supported on this browser');
    }
    const supabase = await getSupabase();
    const { data, error } = await (supabase.auth as any).signInWithPasskey(
      signal ? { options: { signal } } : undefined
    );
    if (error) throw new Error(error.message ?? 'Passkey sign-in failed');
    return data;
  }

  /**
   * Start the conditional (autofill-assisted) passkey flow.
   * Fetches a Supabase-generated challenge and returns native options
   * ready to pass to navigator.credentials.get({ mediation: 'conditional' }).
   */
  async startConditionalSignIn(): Promise<{
    nativeOptions: PublicKeyCredentialRequestOptions;
    challengeId: string;
  }> {
    const supabase = await getSupabase();
    // No captchaToken here — startAuthentication only generates a challenge,
    // not an authentication. Passing the token here burns it before verifyAuthentication.
    const passkeyApi = (supabase.auth as any).passkey;
    if (!passkeyApi) throw new Error('Supabase passkey API unavailable');
    const { data, error } = await passkeyApi.startAuthentication();
    if (error) throw new Error(error.message ?? 'Failed to start conditional sign-in');

    const opts = data.options;
    const nativeOptions: PublicKeyCredentialRequestOptions = {
      challenge: base64urlDecode(opts.challenge),
      allowCredentials: (opts.allowCredentials ?? []).map((c: any) => ({
        type: c.type ?? 'public-key',
        id: base64urlDecode(c.id),
        transports: c.transports,
      })),
      userVerification: opts.userVerification ?? 'required',
      timeout: opts.timeout ?? 300000,
    };

    return { nativeOptions, challengeId: data.challenge_id };
  }

  /**
   * Complete the conditional sign-in after the user selects a passkey.
   * Serializes the assertion and calls Supabase's verify endpoint.
   * Returns { session, user } directly — no tokenHash step.
   */
  async finishConditionalSignIn(
    assertion: PublicKeyCredential,
    challengeId: string,
    captchaToken?: string | null
  ): Promise<{ session: any; user: any }> {
    const supabase = await getSupabase();
    const authResponse = assertion.response as AuthenticatorAssertionResponse;

    const credential = {
      id: assertion.id,
      rawId: base64urlEncode(assertion.rawId),
      response: {
        clientDataJSON: base64urlEncode(authResponse.clientDataJSON),
        authenticatorData: base64urlEncode(authResponse.authenticatorData),
        signature: base64urlEncode(authResponse.signature),
        userHandle: authResponse.userHandle
          ? base64urlEncode(authResponse.userHandle)
          : undefined,
      },
      clientExtensionResults: (assertion.getClientExtensionResults?.() as any) ?? {},
      type: assertion.type,
    };

    const passkeyApi = (supabase.auth as any).passkey;
    if (!passkeyApi) throw new Error('Supabase passkey API unavailable');
    const { data, error } = await passkeyApi.verifyAuthentication({
      challengeId,
      credential,
      ...(captchaToken ? { options: { captchaToken } } : {}),
    });
    if (error) throw new Error(error.message ?? 'Passkey authentication failed');
    return data;
  }

  /**
   * List all passkeys for the signed-in user (Supabase native).
   */
  async listPasskeys(): Promise<PasskeyListItem[]> {
    const supabase = await getSupabase();
    const { data, error } = await (supabase.auth as any).passkey.list();
    if (error) throw new Error(error.message ?? 'Failed to list passkeys');
    return (data as PasskeyListItem[]) ?? [];
  }

  /**
   * Delete a passkey by its Supabase-assigned UUID (Supabase native).
   */
  async removePasskey(passkeyId: string): Promise<void> {
    const supabase = await getSupabase();
    const { error } = await (supabase.auth as any).passkey.delete({ passkeyId });
    if (error) throw new Error(error.message ?? 'Failed to remove passkey');
  }

  // ── Hardware security key — manual WebAuthn ceremony ─────────────────────
  // Hardware keys (cross-platform, e.g. YubiKey) are NOT handled by Supabase's
  // native passkey API, which targets platform authenticators only.
  // These methods still use the custom Edge Functions + webauthn_credentials table.

  async register(userId: string, deviceName: string): Promise<void> {
    await this._registerHardwareKey(deviceName);
  }

  private async _registerHardwareKey(deviceName: string): Promise<void> {
    if (!await this.isSupported()) {
      throw new Error('WebAuthn is not supported on this browser');
    }

    const supabase = await getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('Not authenticated');

    const startRes = await callEdgeFunction(
      'webauthn-register-start',
      { credentialType: 'hardware_key' },
      session.access_token
    );
    if (!startRes.ok) {
      const err = await startRes.json().catch(() => ({ error: 'Failed to start registration' }));
      throw new Error(err.error ?? 'Failed to start registration');
    }
    const options = await startRes.json();
    const { challengeId, challenge, rp, user, pubKeyCredParams, authenticatorSelection,
      excludeCredentials, timeout, attestation } = options;

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: base64urlDecode(challenge),
        rp,
        user: { ...user, id: base64urlDecode(user.id) },
        pubKeyCredParams,
        authenticatorSelection: {
          ...authenticatorSelection,
          authenticatorAttachment: 'cross-platform',
        },
        excludeCredentials: (excludeCredentials ?? []).map((c: any) => ({
          ...c,
          id: base64urlDecode(c.id),
        })),
        timeout,
        attestation,
      },
    }) as PublicKeyCredential | null;

    if (!credential) throw new Error('Security key registration was cancelled');

    const attestationResponse = credential.response as AuthenticatorAttestationResponse;

    const finishRes = await callEdgeFunction(
      'webauthn-register-finish',
      {
        challengeId,
        deviceName,
        credentialType: 'hardware_key',
        response: {
          id: credential.id,
          rawId: base64urlEncode(credential.rawId),
          clientDataJSON: base64urlEncode(attestationResponse.clientDataJSON),
          attestationObject: base64urlEncode(attestationResponse.attestationObject),
          type: credential.type,
        },
      },
      session.access_token
    );

    if (!finishRes.ok) {
      const err = await finishRes.json().catch(() => ({ error: 'Registration verification failed' }));
      throw new Error(err.error ?? 'Registration verification failed');
    }
  }

  async authenticate(userId: string): Promise<boolean> {
    if (!await this.isSupported()) {
      throw new Error('WebAuthn is not supported on this browser');
    }

    const supabase = await getSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    const startRes = await callEdgeFunction('webauthn-authenticate-start', { userId });
    if (!startRes.ok) throw new Error('Failed to start authentication');
    const { challengeId, challenge, allowCredentials, userVerification, timeout } =
      await startRes.json();

    if (!allowCredentials || allowCredentials.length === 0) {
      throw new Error('No security keys registered');
    }

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: base64urlDecode(challenge),
        allowCredentials: allowCredentials.map((c: any) => ({
          ...c,
          id: base64urlDecode(c.id),
        })),
        userVerification,
        timeout,
      },
    }) as PublicKeyCredential | null;

    if (!assertion) return false;

    const assertionResponse = assertion.response as AuthenticatorAssertionResponse;

    const finishRes = await callEdgeFunction(
      'webauthn-authenticate-finish',
      {
        challengeId,
        response: {
          id: assertion.id,
          rawId: base64urlEncode(assertion.rawId),
          clientDataJSON: base64urlEncode(assertionResponse.clientDataJSON),
          authenticatorData: base64urlEncode(assertionResponse.authenticatorData),
          signature: base64urlEncode(assertionResponse.signature),
          userHandle: assertionResponse.userHandle
            ? base64urlEncode(assertionResponse.userHandle)
            : null,
          type: assertion.type,
        },
      },
      session?.access_token
    );

    if (!finishRes.ok) {
      const err = await finishRes.json().catch(() => ({ error: 'Verification failed' }));
      throw new Error(err.error ?? 'Passkey verification failed');
    }

    return true;
  }

  // ── Hardware key management (custom table) ───────────────────────────────

  async listCredentials(userId: string): Promise<WebAuthnCredential[]> {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from('webauthn_credentials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  }

  async listHardwareKeys(userId: string): Promise<WebAuthnCredential[]> {
    const supabase = await getSupabase();
    const { data } = await supabase
      .from('webauthn_credentials')
      .select('*')
      .eq('user_id', userId)
      .eq('credential_type', 'hardware_key')
      .order('created_at', { ascending: false });
    return data || [];
  }

  async removeCredential(credentialId: string): Promise<void> {
    const supabase = await getSupabase();
    await supabase
      .from('webauthn_credentials')
      .delete()
      .eq('id', credentialId);
  }

  // ── Wallet PRF — manual WebAuthn with PRF extension ──────────────────────
  // The WebAuthn PRF extension derives a deterministic 32-byte encryption key
  // from a passkey assertion. Supabase's native passkey API does not expose
  // extension results, so wallet PRF must remain a manual ceremony.

  async isWalletPRFSupported(): Promise<boolean> {
    return this.isPlatformAuthenticatorAvailable();
  }

  async registerWalletPasskey(
    userId: string,
    email: string
  ): Promise<{ credentialId: string; prfSalt: string } | null> {
    if (!await this.isSupported()) throw new Error('WebAuthn is not supported on this browser');
    if (!await this.isPlatformAuthenticatorAvailable()) {
      throw new Error('Passkeys are not supported on this device');
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const prfSalt = crypto.getRandomValues(new Uint8Array(32));

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'Pexly', id: window.location.hostname },
        user: {
          id: new TextEncoder().encode(userId + '-wallet'),
          name: email,
          displayName: email,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'required',
          requireResidentKey: true,
        },
        timeout: 60000,
        attestation: 'none',
        extensions: {
          prf: { eval: { first: prfSalt.buffer } },
        } as any,
      },
    }) as PublicKeyCredential | null;

    if (!credential) throw new Error('Passkey creation was cancelled');

    const ext = (credential.getClientExtensionResults() as any);
    if (!ext?.prf?.enabled) return null;

    const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
    const prfSaltB64 = btoa(String.fromCharCode(...prfSalt));
    return { credentialId, prfSalt: prfSaltB64 };
  }

  async getWalletDecryptionKey(
    credentialId: string,
    prfSaltBase64: string
  ): Promise<ArrayBuffer | null> {
    if (!await this.isSupported()) return null;

    const credentialIdBytes = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0));
    const prfSalt = Uint8Array.from(atob(prfSaltBase64), c => c.charCodeAt(0));
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ type: 'public-key', id: credentialIdBytes }],
        userVerification: 'required',
        timeout: 60000,
        extensions: {
          prf: { eval: { first: prfSalt.buffer } },
        } as any,
      },
    }) as PublicKeyCredential | null;

    if (!assertion) return null;
    const ext = (assertion.getClientExtensionResults() as any);
    const prfResult = ext?.prf?.results?.first;
    return prfResult ?? null;
  }
}

export const webAuthnService = new WebAuthnService();
