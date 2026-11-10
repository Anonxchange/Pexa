import type { ReactNode } from "react";

type AuthMode = "signin" | "signup";
type AuthProvider = "google" | "wallet";
type AuthStage = "methods" | "form";

interface AuthPageShellProps {
  mode: AuthMode;
  stage?: AuthStage;
  title: string;
  description?: string;
  children: ReactNode;
  onEmailClick?: () => void;
  onBackToMethods?: () => void;
  emailActionLabel?: string;
  emailActionDisabled?: boolean;
  onGoogleClick?: () => void;
  onWalletConnectClick?: () => void;
  providerError?: string;
  providerActionsDisabled?: boolean;
  providerLoading?: AuthProvider | null;
  securityChallenge?: ReactNode;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="pexly-auth-provider-mark">
      <path
        fill="#4285F4"
        d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.39a4.62 4.62 0 0 1-2 3.04v2.49h3.23c1.89-1.74 2.98-4.3 2.98-7.34Z"
      />
      <path
        fill="#34A853"
        d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.49c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.58-4.12H1.08v2.57A10 10 0 0 0 10 20Z"
      />
      <path
        fill="#FBBC05"
        d="M4.42 11.92a6.02 6.02 0 0 1 0-3.84V5.51H1.08a10 10 0 0 0 0 8.98l3.34-2.57Z"
      />
      <path
        fill="#EA4335"
        d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87C14.95.94 12.7 0 10 0a10 10 0 0 0-8.92 5.51l3.34 2.57C5.2 5.72 7.4 3.96 10 3.96Z"
      />
    </svg>
  );
}

function WalletConnectMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pexly-auth-provider-mark pexly-auth-wallet-mark"
      fill="none"
    >
      <path
        d="M4.2 7.4h13.6a2.2 2.2 0 0 1 2.2 2.2v.7h-4.2a2.7 2.7 0 0 0 0 5.4H20v.9a2 2 0 0 1-2 2H4.2a2.2 2.2 0 0 1-2.2-2.2V9.6a2.2 2.2 0 0 1 2.2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M2.4 9.2V7.7a2.1 2.1 0 0 1 2.1-2.1h12.1M15.4 10.3H21v5.4h-5.6a2.7 2.7 0 0 1 0-5.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.4" cy="13" r=".8" fill="currentColor" />
    </svg>
  );
}

export function AuthPageShell({
  mode,
  stage = "form",
  title,
  description,
  children,
  onEmailClick,
  onBackToMethods,
  emailActionLabel,
  emailActionDisabled = false,
  onGoogleClick,
  onWalletConnectClick,
  providerError,
  providerActionsDisabled = false,
  providerLoading = null,
  securityChallenge,
}: AuthPageShellProps) {
  const isSignIn = mode === "signin";
  const emailLabel = emailActionLabel ?? (isSignIn ? "Sign In With email" : "Sign Up With email");
  const hasProviderActions = Boolean(onGoogleClick || onWalletConnectClick);

  return (
    <div className="webflow-auth-shell">
      <div className="main">
        <section className="section-auth" aria-labelledby="webflow-auth-title">
          <div className="padding-global">
            <div className="auth-container">
              <div className="auth-content-wrapper">
                <div className="auth-title-block">
                  <h1 id="webflow-auth-title" className="h2-heading">{title}</h1>
                </div>
                {description && (
                  <div className="auth-description-block">
                    <p className="p-md dark-gray">{description}</p>
                  </div>
                )}

                {securityChallenge && (
                  <div className="auth-security-challenge">{securityChallenge}</div>
                )}

                {stage === "methods" ? (
                  <div className="auth-method-block" aria-label="Account options">
                    {onEmailClick && (
                      <button
                        className="auth-button w-inline-block"
                        type="button"
                        onClick={onEmailClick}
                        disabled={emailActionDisabled}
                      >
                        <span className="auth-btn-icon-block" aria-hidden="true">
                          <svg viewBox="0 0 24 24" className="auth-btn-icon" fill="none">
                            <rect x="3" y="5" width="18" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
                            <path d="m5 7 7 5 7-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="p-regular dark _w-bold">{emailLabel}</span>
                      </button>
                    )}

                    {onWalletConnectClick && (
                      <button
                        className="auth-button w-variant-d756eb77-40c1-963c-307d-7fe3300d641b w-inline-block"
                        type="button"
                        onClick={onWalletConnectClick}
                        disabled={providerActionsDisabled || providerLoading === "wallet"}
                      >
                        <span className="auth-btn-icon-block" aria-hidden="true"><WalletConnectMark /></span>
                        <span className="p-regular dark _w-bold">
                          {providerLoading === "wallet" ? "Connecting wallet…" : isSignIn ? "Continue with Wallet" : "Sign Up with Wallet"}
                        </span>
                      </button>
                    )}

                    {onGoogleClick && (
                      <button
                        className="auth-button w-variant-80454ff6-0e3c-af76-c14e-8050a4ceda86 w-inline-block"
                        type="button"
                        onClick={onGoogleClick}
                        disabled={providerActionsDisabled || providerLoading === "google"}
                      >
                        <span className="auth-btn-icon-block" aria-hidden="true"><GoogleMark /></span>
                        <span className="p-regular dark _w-bold">
                          {providerLoading === "google" ? "Connecting to Google…" : isSignIn ? "Sign In With Google" : "Sign Up With Google"}
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="auth-method-block auth-form-block">
                    {providerError && (
                      <p className="auth-provider-error" role="alert">{providerError}</p>
                    )}
                    {children}
                    {onBackToMethods && (
                      <button
                        className="auth-back-link"
                        type="button"
                        onClick={onBackToMethods}
                      >
                        Back to sign-in options
                      </button>
                    )}
                  </div>
                )}

                {stage === "methods" && providerError && (
                  <p className="auth-provider-error" role="alert">{providerError}</p>
                )}
                {stage === "methods" && hasProviderActions && (
                  <p className="auth-switch-prompt">
                    {isSignIn ? "New to Pexly?" : "Already have an account?"}{" "}
                    <a href={isSignIn ? "/signup" : "/signin"}>
                      {isSignIn ? "Open an account" : "Sign in"}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPageShell;
