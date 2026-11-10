import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useGiftCardCart } from "@/hooks/use-gift-card-cart";
import { placeReloadlyOrder } from "@/hooks/use-utility-billers";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PexlyIcon } from "@/components/pexly-icon";
import {
  Lock,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ChevronDown,
  ShieldCheck,
  Zap,
  Mail,
  Gift,
  TicketPercent,
  Smartphone,
  CheckCircle2,
  Loader2,
} from '@/lib/icons';

// ── Nigeria region detection (timezone-based, client-side, no API call) ──────
function detectNigeriaRegion(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Africa/Lagos") return true;
    if (navigator.language === "en-NG") return true;
    return false;
  } catch {
    return false;
  }
}
import { getExchangeRates } from "@/lib/crypto-prices";
import NowPaymentsCheckout from "@/components/nowpayments-checkout";
import { SYMBOL_ICON_MAP } from "@/lib/crypto-icons";
// ── Fee config — all service fees defined in one place ────────────────────────
import { calcServiceFee } from "@/lib/checkout-config";

type PaymentMethod = "card" | "crypto";
type CheckoutStep = "contact" | "payment" | "paying";

// ── Payment method type ────────────────────────────────────────────────────
type PaymentMethodDef = {
  id: string;
  label: string;
  symbol: string;
  networkBadge?: string;
  kind: "crypto" | "paypal" | "card" | "gift";
};

// ── Stablecoin network option ──────────────────────────────────────────────
type StablecoinNetwork = {
  id: string;        // NOWPayments currency code (e.g. "usdttrc20")
  label: string;     // Display name (e.g. "TRC20")
  badge: string;     // Short badge (e.g. "TRC20")
};

// ── Primary coins — always shown, always the main list ────────────────────
const PRIMARY_PAYMENT_METHODS: PaymentMethodDef[] = [
  { id: "btc",    label: "Bitcoin",          symbol: "BTC", kind: "crypto" },
  { id: "eth",    label: "Ethereum",         symbol: "ETH", networkBadge: "ERC20", kind: "crypto" },
  { id: "trx",    label: "Tron",             symbol: "TRX", kind: "crypto" },
  { id: "bnbbsc", label: "Binance Coin",     symbol: "BNB", networkBadge: "BSC",  kind: "crypto" },
  { id: "sol",    label: "Solana",           symbol: "SOL", kind: "crypto" },
];

// ── Stablecoin groups — each has a network sub-dropdown ───────────────────
const USDT_NETWORKS: StablecoinNetwork[] = [
  { id: "usdterc20",  label: "ERC20",        badge: "ERC20" },
  { id: "usdttrc20",  label: "TRC20",        badge: "TRC20" },
  { id: "usdtbsc",    label: "BSC (BEP20)",  badge: "BSC" },
  { id: "usdtarb",    label: "Arbitrum One", badge: "ARB" },
  { id: "usdtop",     label: "Optimism",     badge: "OP" },
  { id: "usdtmatic",  label: "Polygon",      badge: "POL" },
];

const USDC_NETWORKS: StablecoinNetwork[] = [
  { id: "usdcerc20",  label: "ERC20",        badge: "ERC20" },
  { id: "usdctrc20",  label: "TRC20",        badge: "TRC20" },
  { id: "usdcbsc",    label: "BSC (BEP20)",  badge: "BSC" },
  { id: "usdcarb",    label: "Arbitrum One", badge: "ARB" },
  { id: "usdcop",     label: "Optimism",     badge: "OP" },
  { id: "usdcmatic",  label: "Polygon",      badge: "POL" },
];

// Keep for legacy lookup in the "paying" step
const PAYMENT_METHODS_FALLBACK: PaymentMethodDef[] = PRIMARY_PAYMENT_METHODS;

// Parse a NOWPayments currency code into display info.
function parseCurrencyCode(code: string): PaymentMethodDef {
  const c = code.toLowerCase();

  const netFromSuffix = (s: string): string | undefined => {
    if (s.includes("trc20") || s.includes("trx")) return "TRC20";
    if (s.includes("erc20") || s.includes("mainnet") || s.endsWith("eth")) return "ERC20";
    if (s.includes("bsc") || s.includes("bnb")) return "BEP20";
    if (s.includes("matic") || s.includes("pol")) return "Polygon";
    if (s.includes("sol")) return "Solana";
    if (s.includes("ton")) return "TON";
    if (s.includes("avax")) return "Avalanche";
    if (s.includes("arb")) return "Arbitrum";
    if (s.includes("op")) return "Optimism";
    if (s.includes("base")) return "Base";
    return undefined;
  };

  const mk = (sym: string, baseName: string, net?: string): PaymentMethodDef => ({
    id: code,
    symbol: sym,
    label: net ? `${baseName} ${net}` : baseName,
    networkBadge: net,
    kind: "crypto",
  });

  if (c.startsWith("usdt")) {
    const net = netFromSuffix(c.slice(4));
    return mk("USDT", "USDT", net);
  }
  if (c.startsWith("usdc")) {
    const net = netFromSuffix(c.slice(4));
    return mk("USDC", "USDC", net);
  }
  if (c.startsWith("dai")) {
    const net = netFromSuffix(c.slice(3));
    return mk("DAI", "DAI", net);
  }

  const knownMap: Record<string, [string, string, string?]> = {
    btc:    ["BTC",  "Bitcoin"],
    btcln:  ["BTC",  "Bitcoin",     "Lightning"],
    eth:    ["ETH",  "Ethereum",    "ERC20"],
    ltc:    ["LTC",  "Litecoin"],
    sol:    ["SOL",  "Solana"],
    bnbbsc: ["BNB",  "BNB",         "BEP20"],
    bnb:    ["BNB",  "BNB"],
    trx:    ["TRX",  "Tron"],
    ton:    ["TON",  "TON"],
    xrp:    ["XRP",  "XRP"],
    doge:   ["DOGE", "Dogecoin"],
    ada:    ["ADA",  "Cardano"],
    matic:  ["MATIC","Polygon"],
    dot:    ["DOT",  "Polkadot"],
    avax:   ["AVAX", "Avalanche"],
    near:   ["NEAR", "NEAR"],
    xlm:    ["XLM",  "Stellar"],
    algo:   ["ALGO", "Algorand"],
    ftm:    ["FTM",  "Fantom"],
    bch:    ["BCH",  "Bitcoin Cash"],
    etc:    ["ETC",  "Ethereum Classic"],
    link:   ["LINK", "Chainlink"],
    zec:    ["ZEC",  "Zcash"],
    dash:   ["DASH", "Dash"],
    atom:   ["ATOM", "Cosmos"],
    hbar:   ["HBAR", "Hedera"],
    xlmx:   ["XLM",  "Stellar"],
  };
  const known = knownMap[c];
  if (known) return mk(known[0], known[1], known[2]);

  const sym = c.replace(/[^a-z]/g, "").slice(0, 6).toUpperCase();
  return { id: code, symbol: sym, label: sym, kind: "crypto" };
}

// Tiny icon component — resolves real logo from SYMBOL_ICON_MAP
function CryptoMethodIcon({ symbol, size = "h-9 w-9" }: { symbol: string; size?: string }) {
  const [failed, setFailed] = useState(false);
  const src = SYMBOL_ICON_MAP[symbol];
  if (!src || failed) {
    return (
      <div className={`${size} rounded-full bg-muted border border-border flex items-center justify-center shrink-0`}>
        <span className="text-[10px] font-bold text-muted-foreground">{symbol.slice(0, 3)}</span>
      </div>
    );
  }
  return (
    <div className={`${size} rounded-full bg-card border border-border flex items-center justify-center overflow-hidden shrink-0 p-1.5`}>
      <img src={src} alt={symbol} className="w-full h-full object-contain" onError={() => setFailed(true)} />
    </div>
  );
}

// Keep a stable fallback PAYMENT_METHODS const for the "paying" step lookup
const PAYMENT_METHODS = PAYMENT_METHODS_FALLBACK;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

function SectionTitle({ step, title, sub }: { step: number; title: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold flex-shrink-0">
        {step}
      </div>
      <div>
        <h2 className="text-lg font-bold leading-tight">{title}</h2>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

type PendingOrder = {
  type: "topup" | "utility" | "giftcard" | "virtual-number";
  title: string;
  description: string;
  amount: number;
  currency: string;
  image?: string;
  metadata: Record<string, any>;
};

// Keep the metadata sent to NOWPayments explicit and consistent with the IPN
// webhook. Gift cards need an email and product details, but do not need a
// phone number or user ID. Top-ups and utility payments require an
// authenticated user's UUID.
function buildPaymentMetadata(
  order: PendingOrder,
  deliveryEmail: string,
  authenticatedUserId?: string,
): Record<string, unknown> {
  const metadata = { ...(order.metadata || {}) };
  const userId =
    metadata.userId ??
    metadata.user_id ??
    authenticatedUserId ??
    undefined;

  if (order.type === "giftcard") {
    const {
      userId: _userId,
      user_id: _user_id,
      recipientPhone: _recipientPhone,
      recipient_phone: _recipient_phone,
      ...giftMetadata
    } = metadata;

    return {
      ...giftMetadata,
      service: "gift_card",
      recipientEmail:
        metadata.recipientEmail ??
        metadata.recipient_email ??
        deliveryEmail ??
        undefined,
    };
  }

  if (order.type === "topup") {
    return {
      ...metadata,
      service: "mobile_topup",
      operatorId: metadata.operatorId ?? metadata.operator_id,
      operatorName: metadata.operatorName ?? metadata.operator_name,
      phone:
        metadata.phone ??
        metadata.recipientPhone ??
        metadata.recipient_phone,
      countryCode: metadata.countryCode ?? metadata.country_code,
      amount: metadata.amount ?? order.amount,
      userId,
    };
  }

  if (order.type === "utility") {
    return {
      ...metadata,
      service: "utility_payment",
      billerId: metadata.billerId ?? metadata.biller_id,
      billerName: metadata.billerName ?? metadata.biller_name,
      billerType: metadata.billerType ?? metadata.biller_type,
      accountNumber:
        metadata.accountNumber ??
        metadata.account_number ??
        metadata.subscriberAccountNumber ??
        metadata.subscriber_account_number,
      countryCode: metadata.countryCode ?? metadata.country_code,
      amount: metadata.amount ?? order.amount,
      userId,
    };
  }

  if (order.type === "virtual-number") {
    return {
      ...metadata,
      service: "virtual_number",
      userId,
    };
  }

  return metadata;
}

// ── KoraPay inline script loader ──────────────────────────────────────────────
function loadKoraPayScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).Korapay) return resolve();
    const script = document.createElement("script");
    script.src =
      "https://korahq.github.io/kora-inline-checkout/dist/kora-inline.min.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

// KoraPay logo badge
function KoraPayBadge({ size = "h-9 w-9" }: { size?: string }) {
  return (
    <div className={`${size} rounded-full bg-[#0B6AFA]/15 border border-[#0B6AFA]/30 flex items-center justify-center shrink-0 font-black text-[#0B6AFA] text-xs`}>
      K
    </div>
  );
}

// KoraPay inline payment trigger button
function KoraPayTrigger({
  amountKobo,
  email,
  onSuccess,
}: {
  amountKobo: number;
  email: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const pk = import.meta.env.VITE_KORAPAY_PUBLIC_KEY as string;
    if (!pk) {
      alert("KoraPay is not configured yet. Please use crypto payment or contact support.");
      return;
    }
    setLoading(true);
    try {
      await loadKoraPayScript();
      const Korapay = (window as any).Korapay;
      if (!Korapay) throw new Error("KoraPay script failed to load");
      const reference = `pexly_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      Korapay.initialize({
        key: pk,
        reference,
        amount: amountKobo,
        currency: "NGN",
        customer: { email, name: email },
        onSuccess: () => { setLoading(false); onSuccess(); },
        onFailed: () => { setLoading(false); },
        onClose: () => { setLoading(false); },
      });
    } catch {
      setLoading(false);
    }
  };

  const displayNgn = (amountKobo / 100).toLocaleString("en-NG");

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full bg-[#0B6AFA] hover:bg-[#0B6AFA]/90 disabled:opacity-60 text-white font-bold text-base transition-all active:scale-[0.98] shadow-md mb-3"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Pay ₦${displayNgn} with KoraPay`}
    </button>
  );
}

export function Checkout() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { clearCart } = useGiftCardCart();
  const [activePayment, setActivePayment] = useState<PaymentMethod>("card");
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("contact");
  const [sendAsGift, setSendAsGift] = useState(false);
  const [promoToggle, setPromoToggle] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(PRIMARY_PAYMENT_METHODS[0].id);
  const [usdtExpanded, setUsdtExpanded] = useState(false);
  const [usdcExpanded, setUsdcExpanded] = useState(false);
  const [selectedUsdtNetwork, setSelectedUsdtNetwork] = useState<StablecoinNetwork>(USDT_NETWORKS[0]);
  const [selectedUsdcNetwork, setSelectedUsdcNetwork] = useState<StablecoinNetwork>(USDC_NETWORKS[0]);
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [pendingOrder] = useState<PendingOrder | null>(() => {
    try {
      const raw = localStorage.getItem("pexly_pending_order");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [pendingDeliveryEmail, setPendingDeliveryEmail] = useState("");
  const [pendingGiftDelivery, setPendingGiftDelivery] = useState<"self" | "gift">("self");
  const [pendingGiftRecipientEmail, setPendingGiftRecipientEmail] = useState("");
  const [pendingGiftRecipientName, setPendingGiftRecipientName] = useState("");
  const [pendingGiftMessageText, setPendingGiftMessageText] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getExchangeRates()
      .then((r) => { if (!cancelled) setRates(r); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const buyerEmail = user?.email || "";

  if (!pendingOrder) {
    return (
      <BrandShell>
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-5">
            <ShoppingBag className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Nothing to check out</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Browse our gift card catalog to get started.
          </p>
          <Button className="mt-6" onClick={() => setLocation("/gift-cards")}>
            Browse gift cards
          </Button>
        </div>
      </BrandShell>
    );
  }

  if (pendingOrder) {
    const pendingAmountUsd = pendingOrder.currency.toUpperCase() === "USD"
      ? pendingOrder.amount
      : rates[pendingOrder.currency.toUpperCase()]
        ? pendingOrder.amount / rates[pendingOrder.currency.toUpperCase()]
        : null;
    // ── Service fee — driven by checkout-config.ts ────────────────────────────
    const feeBase = pendingAmountUsd ?? pendingOrder.amount;
    const processingFee = calcServiceFee(feeBase, pendingOrder.type);
    const pendingTotal = pendingOrder.amount + processingFee;
    const pendingTotalUsd = (pendingAmountUsd ?? pendingOrder.amount) + processingFee;

    const contactEmail = pendingDeliveryEmail || buyerEmail;
    const paymentMetadata = buildPaymentMetadata(
      pendingOrder,
      contactEmail,
      user?.id,
    );

    // KoraPay only for virtual-number orders AND Nigeria/Lagos timezone
    const showKoraPay = pendingOrder.type === "virtual-number" && detectNigeriaRegion();

    const handleOrderSuccess = async () => {
      // ── Virtual number: call Fleexa to assign a number after payment ──
      if (pendingOrder.type === "virtual-number") {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
        const EDGE = `${SUPABASE_URL}/functions/v1/fleexa`;
        const { getSupabase } = await import("@/lib/supabase");
        try {
          const sb = await getSupabase();
          const { data } = await sb.auth.getSession();
          const token = data.session?.access_token ?? "";
          const meta = pendingOrder.metadata;
          const server = meta.server ?? "2";

          // Build buy body — server 3 must NOT include projectId
          const buyBody: Record<string, unknown> = {
            countryName: meta.countryName,
            appName: meta.service,
            countryId: meta.countryId,
          };
          if (server !== "3") {
            buyBody.projectId = meta.projectId ?? meta.service?.toLowerCase().slice(0, 5);
          }

          const res = await fetch(`${EDGE}?action=buy&server=${server}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(buyBody),
          });
          const result = await res.json();

          // Explicit failure
          if (result.success === false) {
            throw new Error(result.message ?? result.error ?? "Failed to assign number");
          }

          // Server 1 wraps in { success, data: {...} }; servers 2/3 return flat root
          const payload = (result.data && typeof result.data === "object") ? result.data : result;
          const { number, requestId } = payload;

          if (!number || !requestId) {
            throw new Error(result.message ?? "Failed to assign number — no requestId returned");
          }

          localStorage.removeItem("pexly_pending_order");
          const params = new URLSearchParams({
            number,
            requestId,
            service: payload.service ?? meta.service,
            country: payload.country ?? meta.countryName,
            server,
          });
          toast({ title: "Payment confirmed!", description: "Your virtual number is ready." });
          setLocation(`/wallet/virtual-numbers?${params}`);
          return;
        } catch (e: any) {
          toast({ title: "Payment confirmed, but number assignment failed", description: e.message ?? "Please contact support." });
          localStorage.removeItem("pexly_pending_order");
          setLocation("/account-settings?section=shop-history");
          return;
        }
      }

      // ── Standard order success ─────────────────────────────────────────────
      localStorage.removeItem("pexly_pending_order");
      // Bundled cart checkouts (metadata.fromCart) leave the cart items intact
      // in storage until payment actually succeeds — clear them now.
      if (pendingOrder.metadata?.fromCart) {
        clearCart();
      }
      try {
        const saved = JSON.parse(localStorage.getItem("pexly_digital_orders") || "[]");
        saved.unshift({
          id: `${pendingOrder.type}_${Date.now()}`,
          type: pendingOrder.type,
          title: pendingOrder.title,
          amount: pendingTotal,
          currency: pendingOrder.currency.toUpperCase(),
          placedAt: new Date().toISOString(),
          status: "fulfilled",
          ...pendingOrder.metadata,
        });
        localStorage.setItem("pexly_digital_orders", JSON.stringify(saved.slice(0, 100)));
      } catch {}
      toast({ title: "Payment confirmed!", description: "Your order has been placed successfully." });
      setLocation("/account-settings?section=shop-history");
    };

    // Display label for amount
    const displayCurrency = pendingOrder.currency.toUpperCase();
    const displayAmount = pendingOrder.amount;
    const displayTotal = pendingTotalUsd;

    // A cart bundled into one order carries metadata.items — show the item
    // count instead of a single quantity in that case.
    const cartItemCount = Array.isArray(pendingOrder.metadata?.items)
      ? pendingOrder.metadata.items.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0)
      : 0;

    // Sub-line shown under product name in summary (phone / account / qty)
    const orderSubline = pendingOrder.metadata?.recipientPhone
      || pendingOrder.metadata?.accountNumber
      || (cartItemCount > 1 ? `${cartItemCount} gift cards` : "")
      || (pendingOrder.metadata?.quantity > 1 ? `Qty: ${pendingOrder.metadata.quantity}` : "")
      || "";

    return (
      <BrandShell>
        <main className="max-w-md mx-auto px-4 py-8 space-y-5">

          {/* ── Step: Contact ── */}
          {checkoutStep === "contact" && (
            <>
              <h1 className="text-2xl font-extrabold text-foreground">
                Where should we send your order?
              </h1>

              {/* Email block */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Email</p>
                  <Input
                    type="email"
                    value={pendingDeliveryEmail || buyerEmail}
                    onChange={(e) => setPendingDeliveryEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 text-base bg-background border-border rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span>We'll send your order and receipt here</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>No account needed</span>
                  </div>
                </div>
              </div>

              {/* Send as gift toggle */}
              <div className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-medium text-foreground">Send as gift</span>
                </div>
                <button
                  onClick={() => setSendAsGift(v => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    sendAsGift ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      sendAsGift ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Gift recipient fields */}
              {sendAsGift && (
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">Recipient email</p>
                    <Input
                      type="email"
                      value={pendingGiftRecipientEmail}
                      onChange={(e) => setPendingGiftRecipientEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className="h-11 bg-background border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">Recipient name (optional)</p>
                    <Input
                      value={pendingGiftRecipientName}
                      onChange={(e) => setPendingGiftRecipientName(e.target.value)}
                      placeholder="Their name"
                      className="h-11 bg-background border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1.5">Personal message (optional)</p>
                    <Textarea
                      value={pendingGiftMessageText}
                      onChange={(e) => setPendingGiftMessageText(e.target.value)}
                      placeholder="Add a note…"
                      className="resize-none bg-background border-border rounded-xl"
                      rows={3}
                      maxLength={250}
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{pendingGiftMessageText.length}/250</p>
                  </div>
                </div>
              )}

              {/* Continue CTA */}
              <button
                onClick={() => setCheckoutStep("payment")}
                disabled={!contactEmail}
                className="w-full py-4 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold text-base transition-all active:scale-[0.98] shadow-md"
              >
                Continue
              </button>

              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                By clicking 'Continue', you agree to our{" "}
                <a href="/terms" className="underline hover:text-foreground">Terms &amp; Conditions</a>
                {" "}and{" "}
                <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>
              </p>

              {/* Summary accordion */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setShowOrderSummary(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <span className="font-semibold text-foreground">Summary</span>
                  {showOrderSummary
                    ? <ChevronDown className="h-5 w-5 text-muted-foreground rotate-180 transition-transform" />
                    : <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                  }
                </button>

                {showOrderSummary && (
                  <div className="px-5 pb-5 space-y-4">
                    {/* Item row */}
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        {pendingOrder.image
                          ? <img src={pendingOrder.image} alt={pendingOrder.title} className="w-full h-full object-contain p-1.5" />
                          : <Zap className="h-6 w-6 text-primary" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug">{pendingOrder.title}</p>
                        {orderSubline ? (
                          <p className="text-xs text-muted-foreground mt-0.5">{orderSubline}</p>
                        ) : null}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {displayCurrency} {displayAmount.toFixed(2)} value
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1 text-sm font-medium text-foreground">
                        <span>1</span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <button
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => {
                          localStorage.removeItem("pexly_pending_order");
                          setLocation("/");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Per-item total */}
                    <div className="flex justify-end">
                      <span className="text-sm font-semibold text-foreground">
                        {displayCurrency !== "USD" && pendingAmountUsd !== null
                          ? `${pendingAmountUsd.toFixed(2)}`
                          : `${displayAmount.toFixed(2)}`
                        }
                      </span>
                    </div>

                    <Separator />

                    {/* Promo code toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TicketPercent className="h-4 w-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">Enter a Promo Code</span>
                      </div>
                      <button
                        onClick={() => setPromoToggle(v => !v)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          promoToggle ? "bg-primary" : "bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            promoToggle ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {promoToggle && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false); }}
                          className="h-10 bg-background border-border rounded-xl"
                        />
                        <Button
                          variant="outline"
                          className="h-10 shrink-0"
                          disabled={!promoCode.trim() || promoApplied}
                          onClick={() => setPromoApplied(true)}
                        >
                          {promoApplied ? "Applied ✓" : "Apply"}
                        </Button>
                      </div>
                    )}

                    <Separator />

                    {/* Fee + Total */}
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Service fee</span>
                        <span>+${processingFee.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-foreground">Total</span>
                      <span className="text-xl font-extrabold text-foreground">
                        ${displayTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Step: Payment method selection ── */}
          {checkoutStep === "payment" && (
            <>
              {/* Sticky total + continue row */}
              <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-5 py-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total</p>
                  <p className="text-xl font-extrabold text-foreground">${displayTotal.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setCheckoutStep("paying")}
                  className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all active:scale-[0.98]"
                >
                  Continue
                </button>
              </div>

              {/* Method selection */}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-1">Payment method</h2>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                  Choose a payment method
                </p>

                <div className="space-y-2">
                    {/* ── Primary coins ── */}
                    {PRIMARY_PAYMENT_METHODS.map((method) => {
                      const selected = selectedMethodId === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => {
                            setSelectedMethodId(method.id);
                            setUsdtExpanded(false);
                            setUsdcExpanded(false);
                          }}
                          className={`w-full flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all text-left ${
                            selected
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                          }`}
                        >
                          <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                            selected ? "border-primary" : "border-muted-foreground/40"
                          }`}>
                            {selected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                          </div>
                          <CryptoMethodIcon symbol={method.symbol} />
                          <div className="flex-1 min-w-0">
                            <span className="text-base font-semibold text-foreground">{method.label}</span>
                            {method.networkBadge && (
                              <span className="ml-2 text-xs bg-muted text-muted-foreground font-medium px-1.5 py-0.5 rounded-md">{method.networkBadge}</span>
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {/* ── USDT with network dropdown ── */}
                    {(() => {
                      const usdtSelected = USDT_NETWORKS.some(n => n.id === selectedMethodId);
                      return (
                        <div className={`rounded-2xl border transition-all ${
                          usdtSelected ? "border-primary bg-primary/5" : "border-border bg-card"
                        }`}>
                          <button
                            onClick={() => {
                              setUsdtExpanded(v => !v);
                              setUsdcExpanded(false);
                              if (!usdtSelected) setSelectedMethodId(selectedUsdtNetwork.id);
                            }}
                            className="w-full flex items-center gap-4 px-5 py-4 text-left"
                          >
                            <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                              usdtSelected ? "border-primary" : "border-muted-foreground/40"
                            }`}>
                              {usdtSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                            </div>
                            <CryptoMethodIcon symbol="USDT" />
                            <div className="flex-1 min-w-0">
                              <span className="text-base font-semibold text-foreground">USDT</span>
                              {usdtSelected && (
                                <span className="ml-2 text-xs bg-muted text-muted-foreground font-medium px-1.5 py-0.5 rounded-md">{selectedUsdtNetwork.badge}</span>
                              )}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${usdtExpanded ? "rotate-180" : ""}`} />
                          </button>
                          {usdtExpanded && (
                            <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                              {USDT_NETWORKS.map((net) => {
                                const active = selectedMethodId === net.id;
                                return (
                                  <button
                                    key={net.id}
                                    onClick={() => { setSelectedMethodId(net.id); setSelectedUsdtNetwork(net); }}
                                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                                      active ? "border-primary bg-primary/10 text-foreground font-semibold" : "border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground"
                                    }`}
                                  >
                                    <div className={`h-3.5 w-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? "border-primary" : "border-muted-foreground/40"}`}>
                                      {active && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                    </div>
                                    {net.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* ── USDC with network dropdown ── */}
                    {(() => {
                      const usdcSelected = USDC_NETWORKS.some(n => n.id === selectedMethodId);
                      return (
                        <div className={`rounded-2xl border transition-all ${
                          usdcSelected ? "border-primary bg-primary/5" : "border-border bg-card"
                        }`}>
                          <button
                            onClick={() => {
                              setUsdcExpanded(v => !v);
                              setUsdtExpanded(false);
                              if (!usdcSelected) setSelectedMethodId(selectedUsdcNetwork.id);
                            }}
                            className="w-full flex items-center gap-4 px-5 py-4 text-left"
                          >
                            <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                              usdcSelected ? "border-primary" : "border-muted-foreground/40"
                            }`}>
                              {usdcSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                            </div>
                            <CryptoMethodIcon symbol="USDC" />
                            <div className="flex-1 min-w-0">
                              <span className="text-base font-semibold text-foreground">USDC</span>
                              {usdcSelected && (
                                <span className="ml-2 text-xs bg-muted text-muted-foreground font-medium px-1.5 py-0.5 rounded-md">{selectedUsdcNetwork.badge}</span>
                              )}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${usdcExpanded ? "rotate-180" : ""}`} />
                          </button>
                          {usdcExpanded && (
                            <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                              {USDC_NETWORKS.map((net) => {
                                const active = selectedMethodId === net.id;
                                return (
                                  <button
                                    key={net.id}
                                    onClick={() => { setSelectedMethodId(net.id); setSelectedUsdcNetwork(net); }}
                                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                                      active ? "border-primary bg-primary/10 text-foreground font-semibold" : "border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground"
                                    }`}
                                  >
                                    <div className={`h-3.5 w-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? "border-primary" : "border-muted-foreground/40"}`}>
                                      {active && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                    </div>
                                    {net.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                    {/* ── KoraPay — virtual numbers + Nigeria only ── */}
                    {showKoraPay && (
                    <div className="mt-2">
                      <div className="relative flex items-center gap-3 my-3">
                        <div className="flex-1 border-t border-border" />
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0">or pay with</span>
                        <div className="flex-1 border-t border-border" />
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMethodId("korapay");
                          setUsdtExpanded(false);
                          setUsdcExpanded(false);
                        }}
                        className={`w-full flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all text-left ${
                          selectedMethodId === "korapay"
                            ? "border-[#0B6AFA] bg-[#0B6AFA]/5"
                            : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                          selectedMethodId === "korapay" ? "border-[#0B6AFA]" : "border-muted-foreground/40"
                        }`}>
                          {selectedMethodId === "korapay" && <div className="h-2.5 w-2.5 rounded-full bg-[#0B6AFA]" />}
                        </div>
                        <KoraPayBadge />
                        <div className="flex-1 min-w-0">
                          <span className="text-base font-semibold text-foreground">KoraPay</span>
                          <span className="ml-2 text-xs bg-muted text-muted-foreground font-medium px-1.5 py-0.5 rounded-md">Card / Bank Transfer</span>
                        </div>
                      </button>
                    </div>
                    )}
              </div>

              {/* Summary accordion */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setShowOrderSummary(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <span className="font-semibold text-foreground">Summary</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showOrderSummary ? "rotate-180" : ""}`} />
                </button>

                {showOrderSummary && (
                  <div className="px-5 pb-5 space-y-4">
                    {/* Item row */}
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        {pendingOrder.image
                          ? <img src={pendingOrder.image} alt={pendingOrder.title} className="w-full h-full object-contain p-1.5" />
                          : <Zap className="h-6 w-6 text-primary" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug">{pendingOrder.title}</p>
                        {orderSubline ? <p className="text-xs text-muted-foreground mt-0.5">{orderSubline}</p> : null}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {displayCurrency} {displayAmount.toFixed(2)} value
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1 text-sm font-medium text-foreground shrink-0">
                        <span>1</span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <button
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => { localStorage.removeItem("pexly_pending_order"); setLocation("/"); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <span className="text-sm font-semibold text-foreground">
                        ${(pendingAmountUsd ?? displayAmount).toFixed(2)}
                      </span>
                    </div>

                    <Separator />

                    {/* Send as gift toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Gift className="h-4 w-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">Send as gift</span>
                      </div>
                      <button
                        onClick={() => setSendAsGift(v => !v)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sendAsGift ? "bg-primary" : "bg-border"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${sendAsGift ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </div>

                    {/* Promo code toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TicketPercent className="h-4 w-4 text-foreground" />
                        <span className="text-sm font-medium text-foreground">Enter a Promo Code</span>
                      </div>
                      <button
                        onClick={() => setPromoToggle(v => !v)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${promoToggle ? "bg-primary" : "bg-border"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${promoToggle ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </div>

                    {promoToggle && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false); }}
                          className="h-10 bg-background border-border rounded-xl"
                        />
                        <Button variant="outline" className="h-10 shrink-0" disabled={!promoCode.trim() || promoApplied} onClick={() => setPromoApplied(true)}>
                          {promoApplied ? "Applied ✓" : "Apply"}
                        </Button>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Service fee</span>
                        <span>+${processingFee.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-foreground">Total</span>
                      <span className="text-xl font-extrabold text-foreground">${displayTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom continue */}
              <button
                onClick={() => setCheckoutStep("paying")}
                className="w-full py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all active:scale-[0.98] shadow-md"
              >
                Continue
              </button>
            </>
          )}

          {/* ── Step: Actual payment widget ── */}
          {checkoutStep === "paying" && (() => {
            // ── KoraPay path ───────────────────────────────────────────────
            if (selectedMethodId === "korapay") {
              const ngnAmount = pendingOrder.metadata?.price_ngn
                ? Number(pendingOrder.metadata.price_ngn)
                : Math.round(pendingTotalUsd * 1600);
              return (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setCheckoutStep("payment")} className="text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    <div className="flex items-center gap-2">
                      <KoraPayBadge size="h-7 w-7" />
                      <h1 className="text-xl font-extrabold text-foreground">Pay with KoraPay</h1>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-5 space-y-3 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order</span>
                      <span className="font-semibold text-foreground truncate max-w-[55%]">{pendingOrder.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-bold text-foreground">₦{ngnAmount.toLocaleString("en-NG")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Method</span>
                      <span className="font-medium text-foreground">Card / Bank Transfer</span>
                    </div>
                  </div>

                  <KoraPayTrigger
                    amountKobo={Math.round(ngnAmount * 100)}
                    email={contactEmail}
                    onSuccess={handleOrderSuccess}
                  />

                  <p className="text-center text-xs text-muted-foreground pb-4">
                    By placing your order you agree to our{" "}
                    <a href="/terms" className="underline hover:text-foreground">Terms of service</a>{" "}
                    and <a href="/privacy" className="underline hover:text-foreground">Privacy policy</a>
                  </p>
                </>
              );
            }

            // ── Crypto path ────────────────────────────────────────────────
            const allStableNetworks = [...USDT_NETWORKS, ...USDC_NETWORKS];
            const stableNet = allStableNetworks.find(n => n.id === selectedMethodId);
            const method: PaymentMethodDef = stableNet
              ? {
                  id: stableNet.id,
                  label: `${stableNet.id.startsWith("usdt") ? "USDT" : "USDC"} ${stableNet.label}`,
                  symbol: stableNet.id.startsWith("usdt") ? "USDT" : "USDC",
                  networkBadge: stableNet.badge,
                  kind: "crypto",
                }
              : (PRIMARY_PAYMENT_METHODS.find(m => m.id === selectedMethodId) ?? PRIMARY_PAYMENT_METHODS[0]);
            return (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setCheckoutStep("payment")} className="text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronDown className="h-5 w-5 rotate-90" />
                  </button>
                  <div className="flex items-center gap-2">
                    <CryptoMethodIcon symbol={method.symbol} size="h-7 w-7" />
                    <h1 className="text-xl font-extrabold text-foreground">Pay with {method.label}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-2.5">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Sending to <strong className="text-foreground">{contactEmail || "your email"}</strong></span>
                </div>

                {method.kind === "crypto" && pendingOrder.currency.toUpperCase() !== "USD" && pendingAmountUsd === null && (
                  <div className="flex flex-col items-center justify-center gap-3 py-12">
                    <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading exchange rate for {pendingOrder.currency.toUpperCase()}…</p>
                  </div>
                )}

                {method.kind === "crypto" && (pendingOrder.currency.toUpperCase() === "USD" || pendingAmountUsd !== null) && (
                  <NowPaymentsCheckout
                    amount={pendingTotalUsd}
                    currency="usd"
                    payCurrency={method.id}
                    description={pendingOrder.description}
                    metadata={paymentMetadata}
                    onPaymentSuccess={handleOrderSuccess}
                    onChangeMethod={() => setCheckoutStep("payment")}
                    onChangeEmail={() => setCheckoutStep("contact")}
                    methodLabel={method.label}
                    networkName={method.networkBadge}
                    email={contactEmail}
                    orderTitle={pendingOrder.title}
                    orderSubline={orderSubline}
                    orderCurrency={displayCurrency}
                    orderAmount={displayAmount}
                    orderImage={pendingOrder.image}
                  />
                )}

                <p className="text-center text-xs text-muted-foreground pb-4">
                  By placing your order you agree to our{" "}
                  <a href="/terms" className="underline hover:text-foreground">Terms of service</a>{" "}
                  and <a href="/privacy" className="underline hover:text-foreground">Privacy policy</a>
                </p>
              </>
            );
          })()}
        </main>
      </BrandShell>
    );
  }

  // Unreachable — the guard above already redirects away when there is no
  // pending order — but keep an explicit fallback rather than assume it.
  return null;
}

/* ── Slim brand-only shell (no marketing nav, no footer) ──────────── */
function BrandShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <PexlyIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Pexly</span>
          </a>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Secure checkout
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}


export default Checkout;
