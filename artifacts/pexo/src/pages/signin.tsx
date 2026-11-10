import { useHead } from "@unhead/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ShieldCheck, Fingerprint } from '@/lib/icons';
import { DeviceOTPVerification } from "@/components/device-otp-verification";
import { isSupabaseConfigured, supabase, getSupabase } from "@/lib/supabase";
import { AuthPageShell } from "@/components/auth-page-shell";
import { signInWithGoogle } from "@/lib/google-auth";
import { useReownWalletAuth } from "@/hooks/use-reown-wallet-auth";
import { resolveAccountState } from "@/lib/google-account-state";
import { useTheme } from "@/components/theme-provider";
import { Turnstile } from "@marsidev/react-turnstile";
import { deviceFingerprint } from "@/lib/security/device-fingerprint";
import { webAuthnService } from "@/lib/webauthn";
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog";
import { loginThrottle, formatCooldown } from "@/lib/security/login-throttle";

function friendlyAuthError(raw: string | undefined | null): string {
  if (!raw) return "Something went wrong. Please try again.";
  const msg = raw.toLowerCase();
  if (msg.includes("captcha") || msg.includes("no captcha_token") || msg.includes("request disallowed"))
    return "Please complete the security check and try again.";
  if (msg.includes("invalid login credentials") || msg.includes("invalid email or password"))
    return "Incorrect email or password. Please try again.";
  if (msg.includes("email not confirmed"))
    return "Please verify your email address before signing in.";
  if (msg.includes("too many requests") || msg.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  if (msg.includes("user not found"))
    return "No account found with that email.";
  if (msg.includes("network") || msg.includes("failed to fetch"))
    return "Network error. Please check your connection and try again.";
  return "Sign-in failed. Please try again.";
}

function normalizeAppPath(path: string): string {
  return path.replace(/^\/([a-z]{2}(?:-[a-z]{2})?)\/\1(?=\/|$)/i, "/$1");
}

export function SignIn() {
  useHead({ title: "Sign In | Pexly", meta: [{ name: "description", content: "Sign in to access your Pexly wallet, swaps, staking, gift cards, and account features." }] });
  const supabaseReady = isSupabaseConfigured();
  const [inputValue, setInputValue] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleRedirecting, setGoogleRedirecting] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const reownWalletAuth = useReownWalletAuth();
  const [show2FAInput, setShow2FAInput] = useState(false);
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [showDeviceVerification, setShowDeviceVerification] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [totpFactorId, setTotpFactorId] = useState<string | null>(null);
  const [totpChallengeId, setTotpChallengeId] = useState<string | null>(null);
  const [checking2FA, setChecking2FA] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  // --- Login throttling (server-authoritative, mirrored locally for the UI) ---
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const conditionalAbortRef = useRef<AbortController | null>(null);
  const captchaTokenRef = useRef<string | null>(null);
  const googleRedirectingRef = useRef(false);
  const googleCallbackHandledRef = useRef(false);
  const verifyInFlightRef = useRef(false);
  const { signIn, signOut, user, session, pendingOTPVerification, completeOTPVerification, cancelOTPVerification, completeTOTPSignIn, cancelTOTPSignIn, pauseSessionForTOTP, beginPasskeyAuth, releasePasskeyAuth } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const navigateSafely = useCallback(
    (path: string) => setLocation(normalizeAppPath(path)),
    [setLocation],
  );

  const isDark = theme === "dark";

  // Check passkey support and start conditional UI (autofill-assisted passkey)
  // Keep captchaTokenRef in sync so the useEffect closure always reads the latest token
  useEffect(() => {
    captchaTokenRef.current = captchaToken;
  }, [captchaToken]);

  // Start conditional UI (autofill-assisted passkey) on mount.
  // Skip entirely when Turnstile captcha is configured — Supabase requires a valid
  // captchaToken even for the challenge fetch, and no token exists yet on mount.
  // The explicit passkey button (handlePasskeySignIn) has the token and works fine.
  useEffect(() => {
    webAuthnService.isPlatformAuthenticatorAvailable().then(async (supported) => {
      setPasskeySupported(supported);
      if (!supported) return;

      // If captcha is configured, skip the background conditional flow entirely.
      if (import.meta.env.VITE_TURNSTILE_SITE_KEY) return;

      try {
        const controller = new AbortController();
        conditionalAbortRef.current = controller;

        const { nativeOptions, challengeId } = await webAuthnService.startConditionalSignIn();

        const assertion = await navigator.credentials.get({
          signal: controller.signal,
          mediation: 'conditional' as CredentialMediationRequirement,
          publicKey: nativeOptions,
        } as any) as PublicKeyCredential | null;

        if (!assertion || controller.signal.aborted) return;

        setLoading(true);
        setChecking2FA(true);
        // Park the SIGNED_IN event so user state isn't set before the AAL check.
        beginPasskeyAuth();
        try {
          // Actual auth verification — pass fresh captchaToken via ref
          await webAuthnService.finishConditionalSignIn(assertion, challengeId, captchaTokenRef.current);

          // Passkey establishes AAL1.  Check AAL level using the official
          // Supabase pattern before deciding whether to require a second factor.
          const { data: aalData, error: aalErr } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
          if (aalErr) throw new Error(aalErr.message ?? 'Failed to check 2FA status');

          if (aalData.currentLevel === 'aal1' && aalData.nextLevel === 'aal2') {
            // User has a verified TOTP factor — get the factorId for the challenge.
            const { data: factorsData, error: listErr } = await supabase.auth.mfa.listFactors();
            if (listErr) throw new Error(listErr.message ?? 'Failed to list MFA factors');

            const totpFactor = (factorsData?.totp ?? []).find((f: any) => f.status === 'verified');
            if (totpFactor) {
              const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
                factorId: totpFactor.id,
              });
              if (challengeErr || !challengeData) {
                throw challengeErr ?? new Error('Failed to start 2FA challenge');
              }
              // pauseSessionForTOTP also clears signInInProgressRef and discards
              // the deferred payload — the AAL1 session must never reach user state.
              pauseSessionForTOTP();
              setTotpFactorId(totpFactor.id);
              setTotpChallengeId(challengeData.id);
              setShow2FAInput(true);
              setChecking2FA(false);
              return;
            }
          }

          // No 2FA required — apply the deferred SIGNED_IN session.
          releasePasskeyAuth();
          setChecking2FA(false);
        } catch (err) {
          // Clear the interception gate so future events aren't blocked.
          releasePasskeyAuth();
          setChecking2FA(false);
          toast({
            title: "Passkey sign-in failed",
            description: friendlyAuthError(err instanceof Error ? err.message : null),
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } catch (err: any) {
        if (err?.name === 'AbortError' || err?.name === 'NotAllowedError') return;
        console.error('Conditional passkey error:', err);
      }
    }).catch(() => setPasskeySupported(false));

    return () => {
      conditionalAbortRef.current?.abort();
    };
  }, [toast]);

  // Tick the visible cooldown down once per second while a lock is active.
  useEffect(() => {
    if (lockedUntil === null) {
      setCooldownLeft(0);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setCooldownLeft(remaining);
      if (remaining === 0) {
        setLockedUntil(null);
        setAttemptsLeft(null);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  // When the typed email changes, ask the server whether that account is already
  // locked out, so a page refresh or a new tab can't reset the counter.
  useEffect(() => {
    const email = inputValue.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLockedUntil(null);
      setAttemptsLeft(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      void loginThrottle.status(email).then((state) => {
        if (cancelled) return;
        setLockedUntil(state.lockedUntil);
        setAttemptsLeft(state.attemptsLeft);
      });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inputValue]);

  const isLockedOut = cooldownLeft > 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isOAuthCallback = ["google", "wallet"].includes(params.get("oauth") ?? "");
    const isAuthInProgress = ["signin", "signup"].includes(
      sessionStorage.getItem("pexly.oauth.intent") ?? "",
    );

    // A Google callback briefly exposes the Supabase session before the
    // profile/MFA callback handler below has finished. Do not redirect that
    // session to the dashboard before those checks run.
    if (user && !checking2FA && !show2FAInput) {
      if (!isOAuthCallback && !isAuthInProgress) {
        navigateSafely("/dashboard");
      }
    }

    const reason = params.get('reason');
    if (reason === 'timeout') {
      toast({
        title: "Session Expired",
        description: "You were logged out due to inactivity",
        variant: "destructive",
      });
    } else if (reason === 'session_ended') {
      toast({
        title: "Session Ended",
        description: "Your session was ended because you logged in from another device",
        variant: "destructive",
      });
    } else if (reason === 'session_expired') {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
    }
  }, [user, navigateSafely, checking2FA, show2FAInput]);

  // Google OAuth returns an authenticated Supabase session before this page
  // gets a chance to apply Pexly's account and MFA rules. Keep the callback on
  // this page, reject auth users who have no Pexly profile, and require the
  // same TOTP challenge used by password sign-in.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storedIntent = sessionStorage.getItem("pexly.oauth.intent");
    const requestedProvider = params.get("oauth");
    const isWalletCallback =
      requestedProvider === "wallet" ||
      sessionStorage.getItem("pexly.oauth.provider") === "walletconnect";
    const isAuthSignInCallback =
      ((requestedProvider === "google" || requestedProvider === "wallet") &&
        params.get("intent") === "signin") ||
      storedIntent === "signin";
    if (!isAuthSignInCallback) return;
    if (!user || !session || googleCallbackHandledRef.current) return;

    googleCallbackHandledRef.current = true;
    let cancelled = false;

    const finishAuthCallback = async () => {
      setLoading(true);
      setChecking2FA(true);

      try {
        const sb = await getSupabase();
        const accountState = await resolveAccountState(user);

        if (accountState.status === "unknown") {
          if (cancelled) return;
          toast({
            title: "Couldn't verify your account",
            description: `Please try again in a moment. Your ${isWalletCallback ? "WalletConnect" : "Google"} session is still active.`,
            variant: "destructive",
          });
          setLoading(false);
          setChecking2FA(false);
          return;
        }

        if (accountState.status === "new") {
          if (cancelled) return;
          sessionStorage.setItem("pexly.oauth.intent", "signup");
          sessionStorage.setItem(
            "pexly.oauth.provider",
            isWalletCallback ? "walletconnect" : "google",
          );
          navigateSafely(
            isWalletCallback
              ? "/signup?oauth=wallet&intent=signup"
              : "/signup?oauth=google&intent=signup",
          );
          return;
        }

        const { data: aalData, error: aalError } =
          await sb.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalError) throw aalError;

        if (aalData.currentLevel === "aal1" && aalData.nextLevel === "aal2") {
          const { data: factorsData, error: factorsError } = await sb.auth.mfa.listFactors();
          if (factorsError) throw factorsError;

          const factor = (factorsData?.totp ?? []).find((item: any) => item.status === "verified");
          if (!factor) throw new Error("Your account requires 2FA, but no verified authenticator factor was found.");

          const { data: challengeData, error: challengeError } = await sb.auth.mfa.challenge({
            factorId: factor.id,
          });
          if (challengeError || !challengeData) {
            throw challengeError ?? new Error("Failed to start the 2FA challenge.");
          }

          pauseSessionForTOTP();
          setTotpFactorId(factor.id);
          setTotpChallengeId(challengeData.id);
          setShow2FAInput(true);
          setLoading(false);
          setChecking2FA(false);
          return;
        }

        if (!cancelled) {
          sessionStorage.removeItem("pexly.oauth.intent");
          sessionStorage.removeItem("pexly.oauth.provider");
          setLoading(false);
          setChecking2FA(false);
          navigateSafely("/dashboard");
        }
      } catch (error) {
        if (cancelled) return;
        // Clear the gate on every exit so a later sign-in is not mistaken for
        // an unfinished provider callback.
        sessionStorage.removeItem("pexly.oauth.intent");
        sessionStorage.removeItem("pexly.oauth.provider");
        await signOut();
        toast({
          title: `${isWalletCallback ? "WalletConnect" : "Google"} sign-in failed`,
          description: error instanceof Error
            ? error.message
            : "We couldn't verify your account security settings. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        setChecking2FA(false);
        navigateSafely("/signin");
      }
    };

    void finishAuthCallback();
    return () => {
      cancelled = true;
    };
  }, [user, session, pauseSessionForTOTP, signOut, navigateSafely, toast]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.trim());

  const handleGoogleSignIn = async () => {
    if (googleRedirectingRef.current) return;

    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken) {
      toast({
        title: "Security check required",
        description: "Complete the CAPTCHA before continuing with Google.",
        variant: "destructive",
      });
      return;
    }

    googleRedirectingRef.current = true;
    setGoogleRedirecting(true);

    try {
      sessionStorage.setItem("pexly.oauth.intent", "signin");
      sessionStorage.setItem("pexly.oauth.provider", "google");
      await signInWithGoogle(captchaToken, "/signin?oauth=google&intent=signin");
    } catch (error) {
      sessionStorage.removeItem("pexly.oauth.intent");
      sessionStorage.removeItem("pexly.oauth.provider");
      googleRedirectingRef.current = false;
      setGoogleRedirecting(false);
      if (import.meta.env.VITE_TURNSTILE_SITE_KEY) {
        setCaptchaToken(null);
        setCaptchaError(null);
        setCaptchaKey((key) => key + 1);
      }
      toast({
        title: "Google sign-in failed",
        description: friendlyAuthError(error instanceof Error ? error.message : null),
        variant: "destructive",
      });
    }
  };

  const handleWalletConnectSignIn = async () => {
    if (walletConnecting || googleRedirecting) return;

    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken) {
      toast({
        title: "Security check required",
        description: "Complete the CAPTCHA before continuing with WalletConnect.",
        variant: "destructive",
      });
      return;
    }

    setWalletError(null);
    setWalletConnecting(true);
    sessionStorage.setItem("pexly.oauth.intent", "signin");
    sessionStorage.setItem("pexly.oauth.provider", "walletconnect");

    try {
      const result = await reownWalletAuth.signIn(captchaToken);
      if (result.status === "connection-opened") {
        sessionStorage.removeItem("pexly.oauth.intent");
        sessionStorage.removeItem("pexly.oauth.provider");
        setWalletError("Connect or create a wallet, then click Continue with Wallet again.");
        return;
      }
      if (import.meta.env.VITE_TURNSTILE_SITE_KEY) {
        setCaptchaToken(null);
        setCaptchaError(null);
        setCaptchaKey((key) => key + 1);
      }
    } catch (error) {
      sessionStorage.removeItem("pexly.oauth.intent");
      sessionStorage.removeItem("pexly.oauth.provider");
      const message = error instanceof Error ? error.message : "";
      const friendlyMessage = message.toLowerCase().includes("rejected") || message.includes("4001")
        ? "Wallet sign-in was cancelled."
        : message.includes("not configured")
          ? message
          : message.toLowerCase().includes("captcha")
            ? "Please complete the security check and try again."
            : "Wallet sign-in failed. Check your wallet and try again.";
      setWalletError(friendlyMessage);
      if (import.meta.env.VITE_TURNSTILE_SITE_KEY) {
        setCaptchaToken(null);
        setCaptchaError(null);
        setCaptchaKey((key) => key + 1);
      }
      toast({
        title: "Wallet sign-in failed",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setWalletConnecting(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail) {
      toast({
        title: "Invalid email",
        description: "Enter a valid email address to sign in.",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    const identifier = inputValue.trim().toLowerCase();

    setLoading(true);
    setChecking2FA(true);

    // 1. Ask the server whether this account is allowed another attempt BEFORE
    //    spending a request on Supabase Auth. `consume` records the attempt
    //    atomically, so parallel tabs/requests can't race past the limit.
    const gate = await loginThrottle.consume(identifier);
    if (!gate.allowed) {
      setLoading(false);
      setChecking2FA(false);
      setLockedUntil(gate.lockedUntil);
      setAttemptsLeft(0);
      toast({
        title: "Too many attempts",
        description: `Account temporarily locked. Try again in ${formatCooldown(gate.lockedUntil)}.`,
        variant: "destructive",
      });
      return;
    }

    const authResult = await signIn(inputValue, password, captchaToken ?? undefined);

    if (authResult.error) {
      // 2. Record the failure. The server decides the new lock window.
      const state = await loginThrottle.recordFailure(identifier);
      setLockedUntil(state.lockedUntil);
      setAttemptsLeft(state.attemptsLeft);

      // Force a fresh captcha token — Turnstile tokens are single-use, so
      // without this every retry after the first failed with a captcha error
      // instead of a real credential check.
      if (import.meta.env.VITE_TURNSTILE_SITE_KEY) {
        setCaptchaToken(null);
        setCaptchaError(null);
        setCaptchaKey((k) => k + 1);
      }

      setLoading(false);
      setChecking2FA(false);
      toast({
        title: "Sign-in Failed",
        description: state.lockedUntil
          ? `Account temporarily locked. Try again in ${formatCooldown(state.lockedUntil)}.`
          : state.attemptsLeft !== null && state.attemptsLeft <= 2
            ? `${friendlyAuthError(authResult.error.message)} ${state.attemptsLeft} attempt${state.attemptsLeft === 1 ? "" : "s"} left before a temporary lock.`
            : friendlyAuthError(authResult.error.message),
        variant: "destructive",
      });
      return;
    }

    // 3. Credentials were correct — clear the counter for this account.
    void loginThrottle.reset(identifier);
    setLockedUntil(null);
    setAttemptsLeft(null);

    // Supabase native MFA (TOTP) — challenge already created inside signIn()
    if (authResult.requiresTOTP && authResult.totpFactorId && authResult.totpChallengeId) {
      setTotpFactorId(authResult.totpFactorId);
      setTotpChallengeId(authResult.totpChallengeId);
      setShow2FAInput(true);
      setLoading(false);
      setChecking2FA(false);
      return;
    }

    if (authResult.requiresOTP) {
      setLoading(false);
      setChecking2FA(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      setLoading(false);
      setChecking2FA(false);
      toast({
        title: "Error",
        description: "Failed to get user session",
        variant: "destructive",
      });
      return;
    }

    const deviceStatus = await deviceFingerprint.checkDeviceStatus(userId);
    if (!deviceStatus.exists || !deviceStatus.trusted) {
      const userEmail = sessionData?.session?.user?.email;
      if (userEmail) {
        setShowDeviceVerification(true);
        setLoading(false);
        setChecking2FA(false);
        return;
      }
    }

    try {
      await deviceFingerprint.registerDeviceAsTrusted(userId);
    } catch (error) {
      console.error('Error registering device during signin:', error);
    }
    setChecking2FA(false);
    toast({
      title: "Success!",
      description: "You have successfully signed in",
    });
    setTimeout(() => {
      setLoading(false);
      setLocation("/dashboard");
    }, 100);
  };

  const handleDeviceVerified = async () => {
    setLoading(true);
    
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (userId) {
      try {
        await deviceFingerprint.registerDeviceAsTrusted(userId);
      } catch (error) {
        console.error('Error registering trusted device:', error);
      }
    }
    
    setShowDeviceVerification(false);
    setLoading(false);

    toast({
      title: "Device Verified!",
      description: "This device is now trusted. Welcome back!",
    });
    setLocation("/dashboard");
  };

  const handleDeviceVerificationCancel = async () => {
    await signOut();
    setShowDeviceVerification(false);
  };

  const handlePasskeySignIn = async () => {
    conditionalAbortRef.current?.abort();
    setLoading(true);
    setChecking2FA(true);
    // Park the SIGNED_IN event so user state isn't set before the AAL check.
    beginPasskeyAuth();
    try {
      // Supabase handles the full WebAuthn ceremony and sets the session directly.
      // Pass the typed email as a hint so the browser pre-selects the matching
      // credential instead of showing every passkey stored for this domain.
      const passkeyAuth = (supabase.auth as any).signInWithPasskey;
      if (typeof passkeyAuth !== 'function') throw new Error('Passkey sign-in not supported by this Supabase build');
      const email = inputValue.trim();
      const { data, error } = await passkeyAuth.call(
        supabase.auth,
        { ...(email ? { email } : {}), ...(captchaToken ? { options: { captchaToken } } : {}) }
      );
      if (error) throw new Error(error.message ?? 'Passkey sign-in failed');
      if (!data?.session) throw new Error("No session returned");

      // Check AAL level per official Supabase docs.
      const { data: aalData, error: aalErr } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalErr) throw new Error(aalErr.message ?? 'Failed to check 2FA status');

      if (aalData.currentLevel === 'aal1' && aalData.nextLevel === 'aal2') {
        const { data: factorsData, error: listErr } = await supabase.auth.mfa.listFactors();
        if (listErr) throw new Error(listErr.message ?? 'Failed to list MFA factors');

        const totpFactor = (factorsData?.totp ?? []).find((f: any) => f.status === 'verified');
        if (totpFactor) {
          const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
            factorId: totpFactor.id,
          });
          if (challengeErr || !challengeData) {
            throw challengeErr ?? new Error('Failed to start 2FA challenge');
          }
          // pauseSessionForTOTP clears signInInProgressRef + deferred payload and
          // sets totpPendingRef so nothing can commit the AAL1 session to state.
          pauseSessionForTOTP();
          setTotpFactorId(totpFactor.id);
          setTotpChallengeId(challengeData.id);
          setShow2FAInput(true);
          setChecking2FA(false);
          setLoading(false);
          return;
        }
      }

      // No 2FA required — apply the deferred SIGNED_IN session.
      releasePasskeyAuth();
      setChecking2FA(false);
      toast({ title: "Signed in!", description: "Welcome back." });
    } catch (error: any) {
      // Clear the interception gate so future events aren't blocked.
      releasePasskeyAuth();
      setChecking2FA(false);
      if (error?.name === 'NotAllowedError') {
        toast({ title: "Cancelled", description: "Passkey sign-in was cancelled" });
        return;
      }
      toast({
        title: "Passkey sign-in failed",
        description: friendlyAuthError(error instanceof Error ? error.message : null),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous lock: setLoading(true) below is async (React state), so a
    // second Enter-key submit or duplicate event fired in the same tick
    // could otherwise slip past the `disabled={loading}` check and race two
    // concurrent mfa.verify() calls against the same challenge.
    if (verifyInFlightRef.current) return;
    verifyInFlightRef.current = true;
    setLoading(true);

    if (!totpFactorId || !totpChallengeId) {
      toast({ title: "Error", description: "Invalid session. Please sign in again.", variant: "destructive" });
      setLoading(false);
      verifyInFlightRef.current = false;
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactorId,
        challengeId: totpChallengeId,
        code: twoFactorCode,
      });

      if (verifyError) {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        verifyInFlightRef.current = false;
        return;
      }

      // Session is now AAL2.
      // completeTOTPSignIn() clears totpPendingRef and commits the AAL2 session
      // to auth-context, so route guards see the user as authenticated again.
      await completeTOTPSignIn();

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (userId) {
        try {
          await deviceFingerprint.registerDeviceAsTrusted(userId);
        } catch (error) {
          console.error('Error registering device during 2FA signin:', error);
        }
      }

      // Clear the challenge/code immediately so a stale UI or replayed
      // event can't resubmit the same (now-consumed) challenge.
      setTwoFactorCode("");
      setTotpFactorId(null);
      setTotpChallengeId(null);
      setShow2FAInput(false);
      setChecking2FA(false);
      sessionStorage.removeItem("pexly.oauth.intent");
      toast({ title: "Success!", description: "You have successfully signed in with 2FA" });

      setTimeout(() => {
        setLoading(false);
        verifyInFlightRef.current = false;
        setLocation("/dashboard");
      }, 100);
    } catch (error: any) {
      console.error('2FA verification error:', error);
      toast({ title: "Error", description: error?.message || "Failed to verify 2FA code", variant: "destructive" });
      setLoading(false);
      verifyInFlightRef.current = false;
    }
  };

  const turnstileChallenge =
    !show2FAInput && import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
      captchaError !== null ? (
        <div className="flex flex-col items-center gap-2">
          <p className={`text-sm ${isDark ? "text-red-400" : "text-red-500"}`}>
            Security check failed to load.
          </p>
          <button
            type="button"
            onClick={() => {
              setCaptchaError(null);
              setCaptchaToken(null);
              setCaptchaKey((key) => key + 1);
            }}
            className={`text-sm underline ${isDark ? "text-lime-400" : "text-lime-600"}`}
          >
            Retry
          </button>
        </div>
      ) : (
        <Turnstile
          key={captchaKey}
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          scriptOptions={{ async: true, defer: true, appendTo: "head" }}
          onSuccess={(token) => {
            setCaptchaToken(token);
            setCaptchaError(null);
          }}
          onError={(code) => {
            setCaptchaToken(null);
            setCaptchaError(code ?? "unknown error");
          }}
          onExpire={() => {
            setCaptchaToken(null);
            setCaptchaError(null);
          }}
          options={{ theme: isDark ? "dark" : "light" }}
        />
      )
    ) : undefined;

  return (
    <AuthPageShell
      mode="signin"
      stage={show2FAInput || emailFormOpen ? "form" : "methods"}
      title={show2FAInput ? "Two-factor authentication" : "Welcome back"}
      description={
        show2FAInput
          ? "Enter the 6-digit code from your authenticator app."
          : "Sign in to your Pexly account."
      }
      onEmailClick={() => setEmailFormOpen(true)}
      emailActionDisabled={!supabaseReady}
      onBackToMethods={!show2FAInput ? () => setEmailFormOpen(false) : undefined}
      onGoogleClick={show2FAInput ? undefined : handleGoogleSignIn}
      onWalletConnectClick={show2FAInput ? undefined : handleWalletConnectSignIn}
      providerError={walletError ?? undefined}
      providerActionsDisabled={
        !supabaseReady ||
        googleRedirecting ||
        walletConnecting ||
        Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken)
      }
      providerLoading={googleRedirecting ? "google" : walletConnecting ? "wallet" : null}
      securityChallenge={!emailFormOpen ? turnstileChallenge : undefined}
      isDark={isDark}
      onThemeToggle={() => setTheme(isDark ? "light" : "dark")}
    >
        {!show2FAInput ? (
            <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field-group">
              <label htmlFor="signin-email" className="auth-field-label">
                Email address<span className="text-red-500">*</span>
              </label>
              <input
                id="signin-email"
                type="email"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                autoComplete="username webauthn"
                required
                className="auth-text-field"
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-field-group">
                  <label htmlFor="signin-password" className="auth-field-label">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="auth-text-field auth-password-field"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
            </div>

            {turnstileChallenge && (
              <div className="auth-security-challenge auth-inline-security-challenge">
                {turnstileChallenge}
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          localStorage.setItem('stayLoggedIn', 'true');
                        } else {
                          localStorage.removeItem('stayLoggedIn');
                        }
                      }}
                    />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Stay logged in
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'} hover:underline`}
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </button>
            </div>

              {isLockedOut && (
                <p
                  role="alert"
                  className={`mb-4 text-center text-sm ${isDark ? 'text-red-400' : 'text-red-500'}`}
                  data-testid="text-login-lockout"
                >
                  Too many failed attempts. Try again in {cooldownLeft}s.
                </p>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  isLockedOut ||
                  (!!import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken)
                }
                className="auth-submit-button"
              >
                {loading
                  ? "Signing in..."
                  : isLockedOut
                    ? `Locked — retry in ${cooldownLeft}s`
                    : "Sign in"}
              </button>

              {/* Passkey Sign In — visible whenever device supports passkeys.
                  The browser's native WebAuthn prompt handles "no passkey found". */}
              {passkeySupported && (
                <button
                  type="button"
                  onClick={handlePasskeySignIn}
                  disabled={
                    loading ||
                    (!!import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken)
                  }
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-colors mt-3 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? 'border border-gray-700 text-gray-300 hover:enabled:bg-gray-800'
                      : 'border border-gray-200 text-gray-700 hover:enabled:bg-gray-50'
                  }`}
                >
                  <Fingerprint size={18} />
                  Sign in with Passkey
                </button>
              )}

            </form>
        ) : (
          <form onSubmit={handleVerify2FA}>
            <div className="mb-6 flex justify-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10">
                <ShieldCheck className="h-8 w-8 text-lime-400" />
              </div>
            </div>

            <div className="mb-6">
              <label className={`block mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Verification Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={8}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                className={`w-full px-4 py-4 rounded-xl text-center text-2xl tracking-widest font-mono ${
                  isDark 
                    ? 'bg-gray-900 text-white border border-gray-800 focus:border-lime-400' 
                    : 'bg-gray-50 text-black border border-gray-200 focus:border-lime-500'
                } focus:outline-none transition-colors`}
                autoFocus
              />
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} text-center mt-2`}>
                You can also use a backup code
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading || twoFactorCode.length < 6}
              className="auth-submit-button mb-4"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={async () => {
                // cancelTOTPSignIn signs out the partial AAL1 Supabase session
                // so no half-authenticated state lingers after the user backs out.
                await cancelTOTPSignIn();
                setShow2FAInput(false);
                setTwoFactorCode("");
                setTotpFactorId(null);
                setTotpChallengeId(null);
                setChecking2FA(false);
                sessionStorage.removeItem("pexly.oauth.intent");
              }}
              className={`w-full py-4 rounded-full text-base transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-900' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              Back to Login
            </button>
          </form>
        )}

      {pendingOTPVerification && (
        <DeviceOTPVerification
          isOpen={!!pendingOTPVerification}
          onClose={() => {
            cancelOTPVerification();
          }}
          onVerified={async () => {
            await completeOTPVerification();
            toast({
              title: "Device Verified!",
              description: "Your device has been verified and trusted.",
            });
            setLocation("/dashboard");
          }}
          userId={pendingOTPVerification.userId}
          email={pendingOTPVerification.email}
          accessToken={session?.access_token || ''}
          deviceInfo={pendingOTPVerification.deviceInfo}
        />
      )}

      {showDeviceVerification && session?.user?.id && session?.user?.email && session?.access_token && (
        <DeviceOTPVerification
          isOpen={showDeviceVerification}
          onClose={handleDeviceVerificationCancel}
          onVerified={handleDeviceVerified}
          userId={session.user.id}
          email={session.user.email}
          accessToken={session.access_token}
        />
      )}

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        isDark={isDark}
        defaultEmail={inputValue}
      />
    </AuthPageShell>
  );
}
