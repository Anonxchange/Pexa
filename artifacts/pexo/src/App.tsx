import { Switch, Route, useLocation, Redirect, Router as WouterRouter } from "wouter";
import { lazy, Suspense, useEffect, useState } from "react";
import { useHead } from "@unhead/react";
import { supabase } from "@/lib/supabase";
import i18n from "@/lib/i18n";
import { isValidLang } from "@/lib/detect-language";
import { siteMetadata, siteStructuredData } from "@/lib/site-document";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { EvmWalletProvider } from "@/lib/evm-wallet-provider";
import { CartProvider } from "@/hooks/use-shopify-cart";

// Deferred — invisible until triggered, no need to block initial paint
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const SonnerToaster = lazy(() => import("sonner").then(m => ({ default: m.Toaster })));
import { AppHeader } from "@/components/app-header";
import { PexlyFooter } from "@/components/pexly-footer";
const LiveChatWidget = lazy(() =>
  import("@/components/live-chat/LiveChatWidget").then(m => ({ default: m.LiveChatWidget })),
);
const CookieConsent = lazy(() => import("@/components/cookie-consent").then(m => ({ default: m.CookieConsent })));
import { PageSkeleton, WalletPageSkeleton } from "@/components/page-skeleton";
const PexlyHomepage = lazy(() => import("@/pages/current-html/home").then(m => ({ default: m.PexlyHomepage })));
const PhysicalProductsExport = lazy(() => import("@/pages/current-html/physical-products").then(m => ({ default: m.PhysicalProductsExport })));
const GiftCardsExport = lazy(() => import("@/pages/current-html/gift-cards").then(m => ({ default: m.GiftCardsExport })));
const AboutUsExport = lazy(() => import("@/pages/current-html/about-us").then(m => ({ default: m.AboutUsExport })));
const TeamsExport = lazy(() => import("@/pages/current-html/teams").then(m => ({ default: m.TeamsExport })));
const CareerExport = lazy(() => import("@/pages/current-html/career").then(m => ({ default: m.CareerExport })));
const BlogsExport = lazy(() => import("@/pages/current-html/blogs").then(m => ({ default: m.BlogsExport })));
const VerifyEmail = lazy(() => import("@/pages/verify-email").then(m => ({ default: m.VerifyEmail })));

const SignIn = lazy(() => import("@/pages/signin").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("@/pages/signup").then(m => ({ default: m.SignUp })));
const Wallet = lazy(() => import("@/pages/wallet"));
const MobileTopup = lazy(() => import("@/pages/mobile-topup"));
const UtilityBill = lazy(() => import("@/pages/utility-bill"));
const Support = lazy(() => import("@/pages/support"));
const SupportArticle = lazy(() => import("@/pages/support-article"));
const SupportCategory = lazy(() => import("@/pages/support-category"));
const Contact = lazy(() => import("@/pages/contact"));
const Checkout = lazy(() => import("@/pages/checkout").then(m => ({ default: m.Checkout })));
const CheckoutPayCrypto = lazy(() => import("@/pages/checkout-pay-crypto").then(m => ({ default: m.CheckoutPayCrypto })));
const GiftCardBrowse = lazy(() => import("@/pages/gift-card-browse").then(m => ({ default: m.GiftCardBrowse })));
const GiftCardDetail = lazy(() => import("@/pages/gift-card-detail").then(m => ({ default: m.GiftCardDetail })));
const ProductDetail = lazy(() => import("@/pages/product-detail").then(m => ({ default: m.ProductDetail })));
import { GiftCardCartProvider } from "@/hooks/use-gift-card-cart";

// ─── Route guard helpers ──────────────────────────────────────────────────────

type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

/** Renders a lazy component with a skeleton fallback — no auth check. */
function LazyRoute({
  component: Component,
  skeleton = <PageSkeleton />,
}: {
  component: LazyComponent;
  skeleton?: React.ReactNode;
}) {
  return (
    <Suspense fallback={skeleton}>
      <Component />
    </Suspense>
  );
}

/**
 * Checks the user's presence AND their Authenticator Assurance Level.
 *
 * Returns:
 *   'pending'   — still resolving (show skeleton)
 *   'authed'    — fully authenticated (AAL2, or no 2FA enrolled)
 *   'needs-mfa' — AAL1 session exists but a verified TOTP factor is enrolled;
 *                 the user must complete the second factor before proceeding
 *   'unauthed'  — no session at all
 *
 * Per Supabase docs (supabase.com/docs/guides/auth/auth-mfa), the recommended
 * gate check is getAuthenticatorAssuranceLevel() — "very fast (microseconds),
 * rarely uses the network" — not listFactors() + status check.
 */
function useAuthGuard() {
  const { user, loading } = useAuth();
  const [state, setState] = useState<'pending' | 'authed' | 'needs-mfa' | 'unauthed'>('pending');

  useEffect(() => {
    if (loading) { setState('pending'); return; }
    if (!user)   { setState('unauthed'); return; }

    let cancelled = false;
    supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data?.currentLevel) {
        // Unknown/malformed assurance-level response — do not default to
        // "authed". Treat exactly like a failed check (see .catch below).
        setState('unauthed');
        return;
      }
      if (data.currentLevel === 'aal1' && data.nextLevel === 'aal2') {
        setState('needs-mfa');
      } else if (data.currentLevel === 'aal2' && data.nextLevel === 'aal2') {
        setState('authed'); // fully assured
      } else if (data.currentLevel === 'aal1' && data.nextLevel === 'aal1') {
        setState('authed'); // no 2FA enrolled — AAL1 is the max for this account
      } else {
        // Any other combination is an assurance state we don't recognize —
        // fail closed rather than assume it's safe.
        setState('unauthed');
      }
    }).catch(() => {
      // Fail CLOSED: if the AAL check itself errors (network blip, stale
      // client, Supabase outage), never treat that as "authenticated". An
      // unknown assurance level must not grant access to protected routes.
      if (!cancelled) setState('unauthed');
    });
    return () => { cancelled = true; };
  }, [user, loading]);

  return state;
}

/**
 * Requires an authenticated session with sufficient AAL.
 * - While auth is resolving → shows skeleton.
 * - Unauthenticated or needs-mfa → redirects to /signin (preserving return URL).
 * - Authenticated (AAL2 or no 2FA enrolled) → renders the page.
 */
function ProtectedRoute({
  component: Component,
  skeleton = <PageSkeleton />,
}: {
  component: LazyComponent;
  skeleton?: React.ReactNode;
}) {
  const guard = useAuthGuard();
  const [location] = useLocation();

  if (guard === 'pending') return <>{skeleton}</>;

  if (guard !== 'authed') {
    const returnTo = encodeURIComponent(location);
    return <Redirect to={`/signin?redirect=${returnTo}`} />;
  }

  return (
    <Suspense fallback={skeleton}>
      <Component />
    </Suspense>
  );
}

/**
 * Redirects already-authenticated users away from auth pages (signin / signup).
 * - While loading → shows skeleton so there's no flash of the auth form.
 * - Authenticated (AAL2) → redirects to /wallet (or the ?redirect param).
 * - Unauthenticated or needs-mfa → renders the auth page (user must complete TOTP).
 */
function AuthRoute({
  component: LazyComponent,
  skeleton = <PageSkeleton />,
}: {
  component: LazyComponent;
  skeleton?: React.ReactNode;
}) {
  const guard = useAuthGuard();
  const [location] = useLocation();
  const oauthProvider = new URLSearchParams(location.split("?")[1] ?? "").get("oauth");
  const isOAuthCallback = oauthProvider === "google" || oauthProvider === "wallet";
  const isSignInInProgress = (() => {
    try {
      return sessionStorage.getItem("pexly.oauth.intent") === "signin";
    } catch {
      return false;
    }
  })();

  if (guard === 'pending') return <>{skeleton}</>;

  // OAuth callbacks must render the auth page long enough to validate the
  // provider account and complete MFA. Redirecting immediately here would
  // bypass the callback page before it can reject an account that has not
  // completed Pexly registration.
  if (guard === 'authed' && !isOAuthCallback && !isSignInInProgress) {
    const params = new URLSearchParams(location.split("?")[1] ?? "");
    const raw = params.get("redirect") ?? "/wallet";
    const redirect = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/wallet";
    return <Redirect to={redirect} />;
  }

  return (
    <Suspense fallback={skeleton}>
      <LazyComponent />
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Switch>
      <Route path="/">{() => <LazyRoute component={PexlyHomepage} />}</Route>
      <Route path="/gift-cards/browse">{() => <LazyRoute component={GiftCardBrowse} />}</Route>
      <Route path="/gift-cards/:id">{() => <LazyRoute component={GiftCardDetail} />}</Route>
      <Route path="/gift-cards">{() => <LazyRoute component={GiftCardsExport} />}</Route>
      <Route path="/shop/product/:id">{() => <LazyRoute component={ProductDetail} />}</Route>
      <Route path="/shop">{() => <LazyRoute component={PhysicalProductsExport} />}</Route>
      <Route path="/about-us">{() => <LazyRoute component={AboutUsExport} />}</Route>
      <Route path="/about-us.html">{() => <Redirect to="/about-us" />}</Route>
      <Route path="/about">{() => <Redirect to="/about-us" />}</Route>
      <Route path="/teams">{() => <LazyRoute component={TeamsExport} />}</Route>
      <Route path="/teams.html">{() => <Redirect to="/teams" />}</Route>
      <Route path="/team">{() => <Redirect to="/teams" />}</Route>
      <Route path="/career">{() => <LazyRoute component={CareerExport} />}</Route>
      <Route path="/career.html">{() => <Redirect to="/career" />}</Route>
      <Route path="/careers">{() => <Redirect to="/career" />}</Route>
      <Route path="/blogs">{() => <LazyRoute component={BlogsExport} />}</Route>
      <Route path="/blogs.html">{() => <Redirect to="/blogs" />}</Route>
      <Route path="/blog">{() => <Redirect to="/blogs" />}</Route>
      <Route path="/support">{() => <LazyRoute component={Support} />}</Route>
      <Route path="/support/article/:slug">{() => <LazyRoute component={SupportArticle} />}</Route>
      <Route path="/support/:category">{() => <LazyRoute component={SupportCategory} />}</Route>
      <Route path="/contact">{() => <LazyRoute component={Contact} />}</Route>
      <Route path="/verify-email">{() => <LazyRoute component={VerifyEmail} />}</Route>

      <Route path="/signin">{() => <AuthRoute component={SignIn} />}</Route>
      <Route path="/signup">{() => <AuthRoute component={SignUp} />}</Route>

      <Route path="/dashboard">{() => <Redirect to="/wallet" />}</Route>
      <Route path="/wallet">{() => <LazyRoute component={Wallet} skeleton={<WalletPageSkeleton />} />}</Route>
      <Route path="/wallet/mobile-topup">{() => <LazyRoute component={MobileTopup} />}</Route>
      <Route path="/mobile-topup">{() => <Redirect to="/wallet/mobile-topup" />}</Route>
      <Route path="/mobile-top-up">{() => <Redirect to="/wallet/mobile-topup" />}</Route>
      <Route path="/utility">{() => <LazyRoute component={UtilityBill} />}</Route>
      <Route path="/wallet/utility-bill">{() => <LazyRoute component={UtilityBill} />}</Route>
      <Route path="/wallet/utility">{() => <Redirect to="/utility" />}</Route>
      <Route path="/utility-bill">{() => <Redirect to="/utility" />}</Route>
      <Route path="/checkout">{() => <LazyRoute component={Checkout} />}</Route>
      <Route path="/checkout/pay/crypto">{() => <LazyRoute component={CheckoutPayCrypto} />}</Route>
      <Route><Redirect to="/" /></Route>
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isHomepage = location === "/";
  const isPhysicalProductsPage = location === "/shop";
  const isGiftCardsTemplatePage = location === "/gift-cards";
  const showMarketplaceChat = isPhysicalProductsPage || isGiftCardsTemplatePage;
  const isStandaloneCompanyPage = [
    "/about", "/about-us", "/about-us.html",
    "/blogs", "/blogs.html", "/blog",
    "/career", "/career.html", "/careers",
    "/teams", "/teams.html", "/team",
  ].includes(location);
  const hideShell = isHomepage || isStandaloneCompanyPage || isPhysicalProductsPage || isGiftCardsTemplatePage;
  const isAuthPage = /(?:^|\/)(?:signin|signup)\/?$/.test(location);
  return (
    <div className="flex min-h-[100dvh] w-full flex-col pt-[58px] max-[991px]:pt-[44px]">
      {/* The shared header is the single source of truth on every route. */}
      <div className="export-page app-header-scope"><AppHeader /></div>
      <main className="flex-1 flex flex-col">
        <AppRoutes />
      </main>
      {!hideShell && !isAuthPage && <PexlyFooter />}
      {showMarketplaceChat && (
        <Suspense fallback={null}>
          <LiveChatWidget />
        </Suspense>
      )}

      <Suspense fallback={null}><Toaster /></Suspense>
      <Suspense fallback={null}><SonnerToaster position="top-center" richColors /></Suspense>
      {!hideShell && !isAuthPage && <Suspense fallback={null}><CookieConsent /></Suspense>}
    </div>
  );
}

function getInitialLangBase(): string | null {
  const seg = window.location.pathname.split("/").filter(Boolean)[0];
  if (seg === "jp") return "/jp";
  return isValidLang(seg) ? `/${seg}` : null;
}

function App() {
  useHead({
    title: siteMetadata.title,
    htmlAttrs: { lang: "en-US" },
    meta: [
      { name: "description", content: siteMetadata.description },
      { name: "color-scheme", content: "light" },
      { property: "og:title", content: siteMetadata.title },
      {
        property: "og:description",
        content: "A non-custodial crypto marketplace for digital services. Pay with your own wallet.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteMetadata.url },
      { property: "og:image", content: siteMetadata.image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: siteMetadata.imageAlt },
      { property: "og:site_name", content: siteMetadata.siteName },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteMetadata.title },
      {
        name: "twitter:description",
        content: "A non-custodial crypto marketplace for digital services. Pay with your own wallet.",
      },
      { name: "twitter:image", content: siteMetadata.image },
      { name: "twitter:image:alt", content: siteMetadata.imageAlt },
    ],
    link: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: `${import.meta.env.BASE_URL}favicon.svg`,
      },
    ],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(siteStructuredData),
      },
    ],
  });

  const [langBase, setLangBase] = useState<string>(() => getInitialLangBase() ?? "/en");

  useEffect(() => {
    const initial = getInitialLangBase();
    if (initial) {
      i18n.changeLanguage(initial === "/jp" ? "ja" : initial.slice(1));
    } else {
      const rest = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      window.history.replaceState(
        null,
        "",
        `/en${rest === "/" ? "" : rest}${search}${hash}`,
      );
      i18n.changeLanguage("en");
      setLangBase("/en");
    }
  }, []);

  const isHelp = window.location.hostname === "help.pexly.app";

  return (
    <WouterRouter base={langBase}>
      <QueryClientProvider client={queryClient}>
        <EvmWalletProvider>
          <ThemeProvider>
            <AuthProvider>
              <GiftCardCartProvider>
                <CartProvider>
                  <TooltipProvider>
                    {isHelp ? (
                      <div className="flex min-h-[100dvh] w-full flex-col pt-[58px] max-[991px]:pt-[44px]">
                        <div className="export-page app-header-scope"><AppHeader /></div>
                        <main className="flex flex-1 flex-col">
                          <Suspense fallback={<PageSkeleton />}><Support /></Suspense>
                        </main>
                        <PexlyFooter />
                      </div>
                    ) : (
                      <>
                        <AppContent />
                      </>
                    )}
                  </TooltipProvider>
                </CartProvider>
              </GiftCardCartProvider>
            </AuthProvider>
          </ThemeProvider>
        </EvmWalletProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
