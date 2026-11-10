import { useHead } from "@unhead/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, MapPin, Check, X } from '@/lib/icons';
import { AuthPageShell } from "@/components/auth-page-shell";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle } from "@/lib/google-auth";
import { useReownWalletAuth } from "@/hooks/use-reown-wallet-auth";
import { resolveAccountState } from "@/lib/google-account-state";
import { useTheme } from "@/components/theme-provider";
import { amlScreening } from "@/lib/security/aml-screening";
import { deviceFingerprint } from "@/lib/security/device-fingerprint";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

const COMMON_PASSWORDS = [
  "password","password1","password123","12345678","123456789","1234567890",
  "qwerty123","iloveyou","admin123","letmein","welcome1","monkey123",
  "dragon123","master123","abc12345","passw0rd","p@ssword","p@ssw0rd",
];

function hasRepeatedChars(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
}

// Score is always a multiple of 20 (5 requirements), so map it to literal width classes.
const STRENGTH_WIDTH_CLASSES = ["w-0", "w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"] as const;

function validatePassword(password: string): { isValid: boolean; score: number; requirements: PasswordRequirement[] } {
  const requirements: PasswordRequirement[] = [
    { label: "At least 8 characters", regex: /.{8,}/, met: false },
    { label: "One uppercase letter (A-Z)", regex: /[A-Z]/, met: false },
    { label: "One lowercase letter (a-z)", regex: /[a-z]/, met: false },
    { label: "One number (0-9)", regex: /[0-9]/, met: false },
    { label: "One special character (!@#$%^&*)", regex: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/, met: false },
  ];

  requirements.forEach((req) => {
    req.met = req.regex.test(password);
  });

  const commonFail = isCommonPassword(password);
  if (commonFail) {
    requirements.forEach((req) => { req.met = false; });
  }

  const metCount = requirements.filter((r) => r.met).length;
  const score = commonFail ? 0 : Math.round((metCount / requirements.length) * 100);
  const isValid = !commonFail && requirements.every((req) => req.met);
  return { isValid, score, requirements };
}

const countries = [
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
].sort((a, b) => a.name.localeCompare(b.name));

export function SignUp() {
  const reownWalletAuth = useReownWalletAuth();
  useHead({ title: "Create Account | Pexly", meta: [{ name: "description", content: "Create a free Pexly account and get access to crypto swaps, staking, gift cards, and more." }] });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [detectingCountry, setDetectingCountry] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleRedirecting, setGoogleRedirecting] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [step, setStep] = useState<"methods" | "email" | "details" | "email_verify" | "wallet_profile">("methods");
  const [walletSignupUserId, setWalletSignupUserId] = useState<string | null>(null);
  const [emailOtp, setEmailOtp] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [otpCountdown, setOtpCountdown] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [signupInProgress, setSignupInProgress] = useState(false);
  const googleRedirectingRef = useRef(false);
  const googleCallbackHandledRef = useRef(false);
  const { signIn, user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const passwordValidation = useMemo(() => validatePassword(password), [password]);

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
      sessionStorage.setItem("pexly.oauth.intent", "signup");
      await signInWithGoogle(captchaToken, "/signup?oauth=google&intent=signup");
    } catch (error) {
      sessionStorage.removeItem("pexly.oauth.intent");
      googleRedirectingRef.current = false;
      setGoogleRedirecting(false);
      toast({
        title: "Google sign-in failed",
        description: error instanceof Error
          ? "We couldn't connect to Google. Please try again."
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWalletConnectSignup = async () => {
    if (walletConnecting || googleRedirecting) return;

    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken) {
      toast({
        title: "Security check required",
        description: "Complete the CAPTCHA before continuing with WalletConnect.",
        variant: "destructive",
      });
      return;
    }

    setWalletConnecting(true);
    setProviderError(null);
    setSignupInProgress(true);

    try {
      const walletResult = await reownWalletAuth.signIn(captchaToken);
      if (walletResult.status === "connection-opened") {
        setProviderError("Connect or create a wallet, then click Sign Up with Wallet again.");
        setSignupInProgress(false);
        return;
      }
      const walletUser = walletResult.user;
      const accountState = await resolveAccountState(walletUser);

      if (accountState.status === "unknown") {
        throw new Error("We couldn't check your wallet account. Please try again.");
      }

      if (accountState.status === "complete") {
        sessionStorage.removeItem("pexly.oauth.intent");
        setSignupInProgress(false);
        setLocation("/dashboard");
        return;
      }

      setWalletSignupUserId(walletUser.id);
      setStep("wallet_profile");
      toast({
        title: "Wallet connected",
        description: "Add your name and country to finish creating your account.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wallet sign-up failed. Check your wallet and try again.";
      setProviderError(message);
      setSignupInProgress(false);
      toast({
        title: "WalletConnect sign-up failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setWalletConnecting(false);
      if (import.meta.env.VITE_TURNSTILE_SITE_KEY) {
        setCaptchaToken(null);
        setCaptchaError(false);
        setCaptchaKey((key) => key + 1);
      }
    }
  };

  const handleWalletProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!walletSignupUserId) {
      setProviderError("Your wallet session expired. Connect your wallet again to continue.");
      return;
    }

    if (!fullName.trim() || !country) {
      toast({
        title: "Profile details required",
        description: "Enter your full name and country to finish creating your account.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProviderError(null);
    try {
      const sanctions = await amlScreening.screenUser(walletSignupUserId, fullName, country);
      if (sanctions.length > 0) {
        throw new Error("We cannot create an account at this time. Please contact support if you believe this is an error.");
      }

      const { error: profileError } = await supabase.from("user_profiles").upsert({
        id: walletSignupUserId,
        full_name: fullName.trim(),
        country,
        preferred_currency: "usd",
      }, { onConflict: "id" });
      if (profileError) throw profileError;

      const { error: completeError } = await supabase.rpc("complete_registration", {
        p_phone_number: null,
      });
      if (completeError) throw completeError;

      try {
        await deviceFingerprint.registerDeviceAsTrusted(walletSignupUserId);
      } catch (error) {
        console.error("Error trusting device after wallet signup:", error);
      }

      sessionStorage.removeItem("pexly.oauth.intent");
      setSignupInProgress(false);
      setWalletSignupUserId(null);
      toast({ title: "Account created", description: "Your Pexly account is ready." });
      setLocation("/dashboard");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "We couldn't finish creating your account. Please try again.";
      setProviderError(message);
      toast({ title: "Couldn't finish signup", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelWalletProfile = async () => {
    await supabase.auth.signOut();
    setSignupInProgress(false);
    setWalletSignupUserId(null);
    setStep("methods");
    setFullName("");
    setCountry("");
  };

  // Auto-detect country on mount
  useEffect(() => {
    detectCountry();
  }, []);

  const detectCountry = async () => {
    setDetectingCountry(true);
    try {
      const { getCountryCode } = await import("@/lib/geo");
      const iso = await getCountryCode();
      const detectedCountry = countries.find(c => c.code === iso);
      if (detectedCountry) setCountry(iso);
    } catch (error) {
      console.error('Failed to detect country:', error);
    } finally {
      setDetectingCountry(false);
    }
  };

  useEffect(() => {
    // Hold the session while a provider or email registration flow is finishing.
    if (signupInProgress) return;

    const params = new URLSearchParams(window.location.search);
    const storedIntent = sessionStorage.getItem("pexly.oauth.intent");
    const isGoogleSignupCallback =
      (params.get("oauth") === "google" && params.get("intent") === "signup") ||
      storedIntent === "signup";
    if (isGoogleSignupCallback) {
      if (!authLoading && user && step === "methods" && !googleCallbackHandledRef.current) {
        googleCallbackHandledRef.current = true;
        setSignupInProgress(true);
        setLoading(true);

        void (async () => {
          try {
            const accountState = await resolveAccountState(user);

            if (accountState.status === "unknown") {
              toast({
                title: "Couldn't check your account",
                description: "Please try again in a moment. Your Google session is still active.",
                variant: "destructive",
              });
              setSignupInProgress(false);
              setGoogleRedirecting(false);
              googleCallbackHandledRef.current = false;
              return;
            }

            if (accountState.status === "complete") {
              sessionStorage.removeItem("pexly.oauth.intent");
              setLocation("/dashboard");
              return;
            }

            // Google has verified the identity, but the Pexly profile still
            // needs to be created.
            const metadata = user.user_metadata ?? {};
            // Only non-privileged display fields may be written from the browser.
            // email / email_verified / phone_verified / registration_completed are
            // revoked for the `authenticated` role and are set exclusively by
            // start_google_signup(), which reads the verified identity from the JWT.
            const { error: upsertError } = await supabase
              .from("user_profiles")
              .upsert({
                id: user.id,
                full_name: metadata.full_name ?? metadata.name ?? "",
                preferred_currency: "usd",
              }, { onConflict: "id" });

            if (upsertError) throw upsertError;

            const { error: startError } = await supabase.rpc("start_google_signup");
            if (startError) throw startError;

            const { error: completeError } = await supabase.rpc("complete_registration", {
              p_phone_number: null,
            });
            if (completeError) throw completeError;

            sessionStorage.removeItem("pexly.oauth.intent");
            setSignupInProgress(false);
            toast({ title: "Success!", description: "Your account is ready." });
            setLocation("/dashboard");
          } catch (error) {
            toast({
              title: "Google sign-up failed",
              description: error instanceof Error
                ? error.message
                : "We couldn't finish creating your account. Please try again.",
              variant: "destructive",
            });
            setSignupInProgress(false);
            setGoogleRedirecting(false);
            googleCallbackHandledRef.current = false;
          } finally {
            setLoading(false);
          }
        })();
        return;
      }
      return;
    }

    if (!authLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation, signupInProgress, step, toast]);

  // Countdown timer for OTP expiry and resend cooldown
  useEffect(() => {
    if (step !== "email_verify") return;

    const timer = setInterval(() => {
      setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  const handleEmailContinue = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast({
        title: "Enter a valid email",
        description: "Use an email address where you can receive a verification code.",
        variant: "destructive",
      });
      return;
    }
    setEmail(normalizedEmail);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        toast({
          title: "Error",
          description: "Email is required",
          variant: "destructive",
        });
        return;
      }

      // Check the account store before starting AML screening or sending the
      // signup OTP. The verification endpoint intentionally accepts an email
      // before an auth session exists, so this guard must happen first.
      // This also catches casing differences such as User@Example.com vs
      // user@example.com.
      //
      // email_exists_for_signup is SECURITY DEFINER and internally checks
      // both auth.users (registered emails) and user_profiles.username
      // (legacy accounts whose email was stored as their username), so it is
      // the single source of truth here. user_profiles has no anon SELECT
      // policy anymore (profile-leak fix), so querying it directly from this
      // logged-out flow would always fail — do not add those calls back.

      // The RPC is EXECUTE-granted to anon so logged-out visitors can reach
      // it, which also means it's the one endpoint on this page a bot could
      // hammer to enumerate registered emails. Require the Turnstile token
      // first so every call to it is already rate-limited by the captcha.
      if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken) {
        toast({
          title: "Security check required",
          description: "Complete the CAPTCHA before continuing.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      const { data: authAccountExists, error: rpcError } = await supabase.rpc(
        "email_exists_for_signup",
        { p_email: normalizedEmail },
      );

      if (rpcError) {
        setLoading(false);
        toast({
          title: "Unable to check account",
          description: "We couldn't verify whether this email is available. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (authAccountExists === true) {
        setLoading(false);
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
        });
        return;
      }

      if (password !== confirmPassword) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (!passwordValidation.isValid) {
        setLoading(false);
        const missingReqs = passwordValidation.requirements
          .filter((r) => !r.met)
          .map((r) => r.label)
          .join(", ");
        toast({
          title: "Weak Password",
          description: `Password must have: ${missingReqs}`,
          variant: "destructive",
        });
        return;
      }

      setSignupInProgress(true);
      
      // Basic AML screening before account creation
      try {
        const sanctions = await amlScreening.screenUser(
          "pending",
          fullName,
          country
        );

        if (sanctions.length > 0) {
          setLoading(false);
          toast({
            title: "Account Registration Blocked",
            description: "We cannot create an account at this time. Please contact support if you believe this is an error.",
            variant: "destructive",
          });
          setSignupInProgress(false);
          return;
        }
      } catch (error) {
        // Fail closed: a network blip must not wave a sanctioned user through.
        console.error("AML screening error:", error);
        setLoading(false);
        setSignupInProgress(false);
        toast({
          title: "Couldn't complete checks",
          description: "We couldn't run the required compliance checks. Please try again shortly.",
          variant: "destructive",
        });
        return;
      }

      // Send OTP email
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email: normalizedEmail, type: 'signup' }),
      });

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Send verification error:", response.status, errorData);
        setSignupInProgress(false);
        toast({
          title: "Error",
          description: errorData.error || "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Check your email!",
        description: "We've sent a 6-digit verification code to your email.",
      });
      
    setStep("email_verify");
    setEmail(normalizedEmail);
  };

  const handleEmailOtpVerify = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          otp: emailOtp,
          password,
          fullName,
          country,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast({
          title: "Verification Failed",
          description: data.error || "Invalid verification code",
          variant: "destructive",
        });
        return;
      }

      // Sign in the user — capture result so we can use it directly
      const { data: signInData } = await signIn(email, password);

      toast({
        title: "Success!",
        description: "Email verified! Account created successfully!",
      });

      // Prefer user from signIn result (already in memory).
      // Fall back to getSession() which reads localStorage — no extra network
      // call, and more reliable than getUser() which hits the server.
      const signedInUserId =
        signInData?.user?.id ??
        (await supabase.auth.getSession()).data.session?.user?.id;

      if (signedInUserId) {
        const { error: completeError } = await supabase.rpc("complete_registration", {
          p_phone_number: null,
        });
        if (completeError) throw completeError;

        try {
          await deviceFingerprint.registerDeviceAsTrusted(signedInUserId);
        } catch (error) {
          console.error('Error auto-trusting device during signup:', error);
        }

        await supabase.auth.signOut();
        setSignupInProgress(false);
        toast({
          title: "Account Created!",
          description: "Your account is ready. Please sign in to continue.",
        });
        setLocation("/signin");
      } else {
        // Email was verified but sign-in couldn't produce a session
        // (e.g. captcha required on sign-in). Account exists — send to /signin.
        setSignupInProgress(false);
        toast({
          title: "Account Created!",
          description: "Please sign in to continue.",
        });
        setLocation("/signin");
      }
    } catch (error) {
      console.error("Email OTP verify error:", error);
      toast({
        title: "Verification Failed",
        description: "Something went wrong. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, type: 'signup' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to resend verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setOtpCountdown(300);
      setResendCooldown(60);
      setEmailOtp("");
      toast({
        title: "Code resent!",
        description: "We've sent a new 6-digit verification code to your email.",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthPageShell
      mode="signup"
      stage={step === "methods" ? "methods" : "form"}
      title={
        step === "methods"
          ? "Next, sign up for an account"
          : step === "email"
            ? "What’s your email?"
            : step === "email_verify"
              ? "Verify your email"
              : step === "wallet_profile"
                ? "Finish your account"
                : "Finish your account"
      }
      description={
        step === "methods"
          ? "By signing up, I agree to the Terms and Conditions and acknowledge I have read the Privacy Policy."
          : step === "email"
            ? "We’ll use this to create your account."
            : step === "email_verify"
              ? `Enter the 6-digit code sent to ${email}.`
              : step === "wallet_profile"
                ? "Add your name and country to finish setting up your wallet account."
                : "Add a few details to finish creating your Pexly account."
      }
      onEmailClick={() => setStep("email")}
      onBackToMethods={step === "email" ? () => setStep("methods") : undefined}
      onGoogleClick={step === "methods" ? handleGoogleSignIn : undefined}
      onWalletConnectClick={step === "methods" ? handleWalletConnectSignup : undefined}
      providerError={providerError ?? undefined}
      providerActionsDisabled={
        walletConnecting ||
        googleRedirecting ||
        Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken)
      }
      providerLoading={googleRedirecting ? "google" : walletConnecting ? "wallet" : null}
      securityChallenge={
        (step === "methods" || step === "email" || step === "details") && import.meta.env.VITE_TURNSTILE_SITE_KEY ? (
          captchaError ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-destructive">Security check failed to load.</p>
              <button
                type="button"
                onClick={() => {
                  setCaptchaError(false);
                  setCaptchaToken(null);
                  setCaptchaKey((key) => key + 1);
                }}
                className="text-sm underline text-primary"
              >
                Retry
              </button>
            </div>
          ) : (
            <Turnstile
              key={captchaKey}
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={(token) => { setCaptchaToken(token); setCaptchaError(false); }}
              onError={() => { setCaptchaToken(null); setCaptchaError(true); }}
              onExpire={() => { setCaptchaToken(null); setCaptchaError(false); }}
              options={{ theme: theme === "dark" ? "dark" : "light" }}
            />
          )
        ) : undefined
      }
      isDark={theme === "dark"}
      onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
        {step === "email" ? (
          <form className="auth-form" onSubmit={handleEmailContinue}>
            <div className="auth-field-group">
              <input
                className="auth-text-field"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-label="Email address"
                required
              />
            </div>
            <button className="auth-submit-button" type="submit">
              Continue
            </button>
          </form>
        ) : step === "email_verify" ? (
          <div className="rounded-2xl p-6 bg-card border border-border">
            <h2 className="text-2xl mb-2 text-foreground font-extralight">
              Verify Your Email
            </h2>
            <p className="text-sm mb-6 text-muted-foreground">
              We've sent a 6-digit code to {email}
            </p>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm text-muted-foreground">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                className="auth-text-field auth-code-field"
                autoFocus
              />
            </div>

            {/* Countdown Timer */}
            <div className="mb-4 text-center">
              <p className={`text-sm ${otpCountdown > 30 ? 'text-muted-foreground' : 'text-red-500 font-medium'}`}>
                Code expires in: <span className="font-mono font-bold">{Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}</span>
              </p>
            </div>

            <button
              onClick={handleEmailOtpVerify}
              disabled={loading || emailOtp.length !== 6}
              className="auth-submit-button mb-3"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            {/* Resend Button */}
            <button
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isResending}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-colors mb-4 ${
                resendCooldown > 0 || isResending
                  ? 'text-muted-foreground bg-muted cursor-not-allowed'
                  : 'text-primary hover:text-primary/80 hover:bg-muted'
              }`}
            >
              {isResending ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
            </button>

            <button
              onClick={() => {
                setStep("details");
                setEmailOtp("");
                setOtpCountdown(300);
              }}
              className="w-full py-3 rounded-xl text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Back
            </button>
          </div>
        ) : step === "wallet_profile" ? (
          <form className="auth-form" onSubmit={handleWalletProfileSubmit}>
            <div className="mb-5">
              <label className="auth-field-label">
                Full name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="auth-text-field"
              />
            </div>
            <div className="mb-6">
              <label className="auth-field-label">
                Country<span className="text-red-500">*</span>
              </label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="auth-select-field">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select your country" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              type="submit"
              disabled={loading || !country || !fullName.trim()}
              className="auth-submit-button"
            >
              {loading ? "Finishing account..." : "Finish account"}
            </button>
            <button
              type="button"
              onClick={() => void handleCancelWalletProfile()}
              className="mt-3 w-full rounded-full py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Cancel wallet signup
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="mb-6">
                <label className="auth-field-label">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="auth-text-field"
                />
              </div>

              {/* Country Selection */}
              <div className="mb-6">
                  <label className="auth-field-label">
                  Country<span className="text-red-500">*</span>
                  {detectingCountry && (
                    <span className="ml-2 text-xs text-lime-400">Detecting...</span>
                  )}
                </label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-full h-12 bg-background text-foreground border border-input">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                  <label className="auth-field-label">
                  Email address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="auth-text-field"
                />
              </div>

              <>
                  <div className="mb-6">
                    <label className="auth-field-label">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-text-field auth-password-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength + Requirements */}
                    {password.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-muted">
                        {/* Strength bar */}
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Strength</span>
                          <span className={
                            passwordValidation.score >= 100 ? 'text-green-500 font-semibold' :
                            passwordValidation.score >= 60  ? 'text-yellow-500 font-semibold' :
                            'text-red-500 font-semibold'
                          }>
                            {passwordValidation.score >= 100 ? 'Strong' :
                             passwordValidation.score >= 60  ? 'Fair' : 'Weak'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full mb-3 overflow-hidden bg-muted-foreground/20">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              STRENGTH_WIDTH_CLASSES[Math.min(5, Math.round(passwordValidation.score / 20))]
                            } ${
                              passwordValidation.score >= 100 ? 'bg-green-500' :
                              passwordValidation.score >= 60  ? 'bg-yellow-400' :
                              'bg-red-400'
                            }`}
                          />
                        </div>
                        <p className="text-xs font-medium mb-2 text-foreground">
                          Requirements:
                        </p>
                        <ul className="space-y-1">
                          {passwordValidation.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2 text-xs">
                              {req.met ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <X className="w-3 h-3 text-red-400" />
                              )}
                              <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                                {req.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6">
                    <label className="auth-field-label">
                      Confirm Password<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="auth-text-field auth-password-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
              </>

              {/* Terms and Conditions */}
              <div className="text-xs mb-6 text-muted-foreground">
                By continuing, you acknowledge that you have read and agree to Pexly's{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms and conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy policy
                </a>
              </div>

              <button 
                type="submit"
                disabled={loading || (!!import.meta.env.VITE_TURNSTILE_SITE_KEY && !captchaToken)}
                className="auth-submit-button"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
        )}
    </AuthPageShell>
  );
}
