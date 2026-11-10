import { useHead } from "@unhead/react";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  Wallet,
  Building2,
  ShoppingCart,
  Shield,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Tag,
  Gift,
} from '@/lib/icons';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cryptoIconUrls } from "@/lib/crypto-icons";
import { sanitizeImageUrl } from "@/lib/sanitize";
import {
  useGiftCardProduct,
  useGiftCardProducts,
  useCreateGiftCardOrder,
  type ReloadlyProduct,
} from "@/hooks/use-reloadly";
import { toast } from "sonner";
import { useGiftCardCart } from "@/hooks/use-gift-card-cart";
import { GiftCardCartSheet } from "@/components/gift-card-cart-sheet";
import { getLocalizedCheckoutPath } from "@/lib/checkout-navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  getRecipientDenominationRange,
  getSenderDenominationRange,
  getSenderPriceForRecipientAmount,
  formatDenominationRange,
} from "@/lib/gift-card-denominations";

const faqs = [
  {
    question: "What payment options do you accept?",
    answer: "We accept cryptocurrency payments including Bitcoin (BTC), Ethereum (ETH), and USDT. You can also use your Pexly balance for faster checkout.",
  },
  {
    question: "How long does it take to receive my gift card?",
    answer: "Most gift cards are delivered instantly via email after your payment is confirmed. Delivery typically takes 5–15 minutes depending on network confirmation.",
  },
  {
    question: "Can I use my Pexly balance to buy gift cards?",
    answer: "Yes! You can use your Pexly balance for instant purchases. Simply select 'Pexly balance' as your payment source at checkout.",
  },
  {
    question: "What is the maximum number of cards I can buy at once?",
    answer: "You can purchase up to 20 gift cards in a single order. For bulk orders, contact our support team.",
  },
  {
    question: "Are there any transaction fees?",
    answer: "We charge a small transaction fee when paying from an external wallet. Using your Pexly balance comes with reduced fees and faster processing.",
  },
  {
    question: "Can I refund a gift card purchase?",
    answer: "Refunds are available within 24 hours of purchase if the gift card code hasn't been redeemed. Please contact support for refund requests.",
  },
];

const networkOptions = [
  { id: "usdt-tron", name: "USDT (Tron)", symbol: "USDT", network: "TRX" },
  { id: "usdt-bsc", name: "USDT (BSC/BEP-20)", symbol: "USDT", network: "BSC" },
  { id: "usdt-ethereum", name: "USDT (Ethereum)", symbol: "USDT", network: "ETH" },
  { id: "btc", name: "Bitcoin", symbol: "BTC", network: "Bitcoin" },
  { id: "eth", name: "Ethereum", symbol: "ETH", network: "Ethereum" },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/60 last:border-none">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

function RedeemInstructions({ text }: { text: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <h3 className="font-semibold text-sm">How to redeem</h3>
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary/70 text-muted-foreground">
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </div>
      </button>
      {open && (
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">{text}</p>
      )}
    </div>
  );
}

function RelatedProductCard({
  product,
  onSelect,
}: {
  product: ReloadlyProduct;
  onSelect: (id: string) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = sanitizeImageUrl(product.logoUrls?.[0]);
  // Face value (recipient side) — the same numbers Reloadly's catalog shows.
  const denominationRange = getRecipientDenominationRange(product);
  const rangeCurrency = denominationRange.currencyCode ?? product.recipientCurrencyCode;
  const priceRange =
    denominationRange.min != null && denominationRange.max != null
      ? formatDenominationRange(denominationRange)
      : `Flexible value · ${rangeCurrency}`;

  return (
    <button
      type="button"
      data-testid={`button-related-gift-card-${product.productId}`}
      aria-label={`View ${product.productName} gift card`}
      onClick={() => onSelect(String(product.productId))}
      className="group w-full self-start text-left rounded-3xl focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {/* Image box only — matches the mobile top-up operator cards: bordered
          rounded-3xl box, no outer card padding/border, text sits below it.
          The logo is absolutely filled (inset-0) rather than flex-centered
          so the discount badge — also absolute — can never be pulled into
          flex layout alongside it and bleed past the box's edge. */}
      <div className="relative bg-card rounded-3xl aspect-[4/3] overflow-hidden border border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        {product.discountPercentage > 0 && (
          <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-[#B4F22E] px-2 py-0.5 text-[10px] font-bold text-black shadow-sm">
            Save {product.discountPercentage}%
          </span>
        )}
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={product.productName}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-contain p-4"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Gift className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <p
          data-testid={`text-related-product-name-${product.productId}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground"
        >
          {product.productName}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-muted-foreground">{priceRange}</p>
          {product.country?.isoName && (
            <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/75">
              {product.country.isoName}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function RelatedGiftCards({
  products,
  isLoading,
  onSelect,
}: {
  products: ReloadlyProduct[];
  isLoading: boolean;
  onSelect: (id: string) => void;
}) {
  if (!isLoading && products.length === 0) return null;

  return (
    <section
      aria-labelledby="related-gift-cards-heading"
      data-testid="section-related-gift-cards"
      className="space-y-5"
    >
      <div className="text-center">
        <h3 id="related-gift-cards-heading" className="text-2xl font-bold">
          Similar Gift Cards you'll love
        </h3>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 items-start">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-secondary" />
              <div className="space-y-2">
                <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 items-start">
          {products.map((product) => (
            <RelatedProductCard
              key={product.productId}
              product={product}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function GiftCardDetail() {
  useHead({
    title: "Gift Card | Pexly",
    meta: [{ name: "description", content: "View and purchase this digital gift card with cryptocurrency. Instant delivery after payment." }],
    // TrustBox script: loads the Trustpilot widget runtime once for the page.
    script: [
      {
        src: "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js",
        async: true,
      },
    ],
  });

  // Trustpilot config comes from env vars — never hardcode a business's
  // review identifiers in source. The widget section simply doesn't render
  // if these aren't configured.
  const trustpilotBusinessUnitId = import.meta.env.VITE_TRUSTPILOT_BUSINESS_UNIT_ID as string | undefined;
  const trustpilotProfileUrl = import.meta.env.VITE_TRUSTPILOT_PROFILE_URL as string | undefined;
  // These two have Trustpilot-documented public defaults (not business-specific),
  // but can still be overridden per deployment.
  const trustpilotTemplateId = (import.meta.env.VITE_TRUSTPILOT_TEMPLATE_ID as string | undefined) || "5419b6ffb0d04a076446a9af";
  const trustpilotLocale = (import.meta.env.VITE_TRUSTPILOT_LOCALE as string | undefined) || "en-US";
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/gift-cards/:id");
  const [cardValue, setCardValue] = useState("");
  useEffect(() => { localStorage.removeItem("pexly_pending_order"); }, []);

  const MAX_GIFT_CARD_QUANTITY = 999;
  const [numberOfCards, setNumberOfCards] = useState("1");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showExternalWalletDialog, setShowExternalWalletDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("usdt-tron");

  const cardId = params?.id;
  const { data: card, isLoading, error } = useGiftCardProduct(cardId);
  const {
    data: relatedProductsData,
    isLoading: relatedProductsLoading,
  } = useGiftCardProducts({ page: 1, size: 200 });
  const { mutate: createOrder, isPending: isOrdering } = useCreateGiftCardOrder();
  const { items: cartItems, addToCart, isLoading: isAddingToCart } = useGiftCardCart();
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const [cartOpen, setCartOpen] = useState(false);

  const [valueTouched, setValueTouched] = useState(false);

  useEffect(() => {
    if (card && !valueTouched && !cardValue) {
      // Never fall back to a hardcoded 10: use the product's real face-value
      // denominations (first fixed value, else the recipient minimum).
      const initial = getRecipientDenominationRange(card);
      const initialValue = initial.fixed[0] ?? initial.min;
      if (initialValue != null) setCardValue(String(initialValue));
    }
  }, [card, cardValue, valueTouched]);

  const handleBuyCard = () => {
    if (!card || !isValueValid) return;
    localStorage.setItem("pexly_pending_order", JSON.stringify({
      type: "giftcard",
      title: `${card.productName} Gift Card`,
      description: `${qty}x ${card.productName} Gift Card`,
      amount: totalFinalPrice,
      // What the customer is charged is in the SENDER (account) currency.
      currency: (getSenderDenominationRange(card).currencyCode || card.recipientCurrencyCode || "usd").toLowerCase(),
      image: sanitizeImageUrl(card.logoUrls?.[0]),
      metadata: {
        service: "gift-card",
        productId: String(card.productId),
        productName: card.productName,
        quantity: qty,
        unitPrice: unitFinalPrice,
        cardValue: value,
      },
    }));
    window.open(getLocalizedCheckoutPath(), "_blank");
  };

  const handleContinueOrder = () => {
    if (!card) return;
    createOrder(
      {
        productId: card.productId,
        unitPrice: parseFloat(cardValue),
        quantity: parseInt(numberOfCards),
        recipientEmail: email,
      },
      {
        onSuccess: () => {
          toast.success("Order placed successfully!");
          setShowExternalWalletDialog(false);
        },
        onError: (err) => {
          toast.error("Failed to place order: " + (err as Error).message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size={40} color="hsl(var(--primary))" />
          <p className="text-muted-foreground text-sm">Loading gift card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Gift Card Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error ? (error as Error).message : "The requested gift card could not be found."}
          </p>
          <Button onClick={() => setLocation("/gift-cards")}>Back to Gift Cards</Button>
        </div>
      </div>
    );
  }

  const discountPercentage = card?.discountPercentage || 0;
  const denominationRange = getRecipientDenominationRange(card);
  const senderRange = getSenderDenominationRange(card);
  const rangeCurrency = denominationRange.currencyCode ?? card.recipientCurrencyCode;
  const qty = parseInt(numberOfCards) || 1;
  const value = parseFloat(cardValue) || 0;
  const discountAmount = value * (discountPercentage / 100);
  // Reloadly gives the real charge for a face value via the recipient->sender
  // map / exchange rate; fall back to the discounted face value when absent.
  const senderPrice = getSenderPriceForRecipientAmount(card, value);
  const unitFinalPrice = senderPrice ?? value - discountAmount;
  const totalFinalPrice = unitFinalPrice * qty;
  // Pre-discount price expressed in the SAME currency as the total above.
  const unitOriginalPrice =
    senderPrice != null && discountPercentage < 100
      ? senderPrice / (1 - discountPercentage / 100)
      : value;
  const totalOriginalPrice = unitOriginalPrice * qty;

  // Card value must stay inside the product's allowed range.
  const minValue = denominationRange.min ?? 0;
  const maxValue = denominationRange.max ?? Infinity;
  const hasValue = cardValue.trim() !== "" && Number.isFinite(parseFloat(cardValue));
  const isValueValid = hasValue && (
    denominationRange.isFixed
      ? denominationRange.fixed.includes(value)
      : value >= minValue && value <= maxValue
  );
  const valueError = !hasValue
    ? "Enter a card value"
    : !isValueValid
      ? denominationRange.isFixed
        ? `Choose one of the available values: ${denominationRange.fixed.join(", ")} ${rangeCurrency ?? ""}`
        : `Value must be between ${minValue} and ${maxValue} ${rangeCurrency ?? ""}`
      : null;

  const handleAddToCart = async () => {
    if (!card || !isValueValid) return;
    addToCart({
      productId: String(card.productId),
      title: card.productName,
      price: unitFinalPrice,
      currency: senderRange.currencyCode ?? card.recipientCurrencyCode,
      recipientAmount: value,
      recipientCurrency: rangeCurrency ?? card.recipientCurrencyCode,
      image: sanitizeImageUrl(card.logoUrls?.[0]),
    });
    setCartOpen(true);
  };

  const briefDescription = card.redeemInstruction?.concise;
  const fullInstructions = card.redeemInstruction?.verbose || card.redeemInstruction?.concise;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setLocation("/gift-cards")}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Gift Cards
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_420px] gap-6 lg:gap-8">

          {/* ── LEFT COLUMN TOP (Hero, Title, Trust badges) ──────── */}
          {/* On mobile: renders 1st. On tablet/desktop: col-1 row-1 */}
          <div className="space-y-6 md:col-start-1 md:row-start-1">

            {/* Hero card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/60 to-secondary/20 border border-border/60 shadow-sm">
              <div className="flex items-center justify-center p-10 min-h-[260px]">
                <img
                  src={sanitizeImageUrl(card.logoUrls?.[0])}
                  alt={card.productName}
                  className="max-h-44 max-w-full object-contain drop-shadow-xl"
                />
              </div>
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-500 text-white border-none px-3 py-1 text-xs font-bold shadow">
                    <Tag className="h-3 w-3 mr-1" />
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
            </div>

            {/* Title + country */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold">{card.productName}</h1>
                {card.country?.isoName && (
                  <Badge variant="secondary" className="mt-1 flex-shrink-0">
                    {card.country.isoName}
                  </Badge>
                )}
              </div>
              {briefDescription && (
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  {briefDescription}
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">

              {/* Instant delivery */}
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center space-y-1.5">
                <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7 mx-auto" aria-hidden="true">
                  {/* Speed arcs */}
                  <path d="M5 20C3.2 17.8 2.5 15 3 12.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-primary opacity-30"/>
                  <path d="M7 22C4.5 19.2 3.5 15.5 4.2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-primary opacity-20"/>
                  {/* Spark dots */}
                  <circle cx="21" cy="5" r="1.4" fill="currentColor" className="text-primary opacity-60"/>
                  <circle cx="24" cy="9" r="1" fill="currentColor" className="text-primary opacity-40"/>
                  <circle cx="23" cy="4" r="0.7" fill="currentColor" className="text-primary opacity-30"/>
                  {/* Outer glow ring */}
                  <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="0.8" className="text-primary opacity-10"/>
                  {/* Lightning bolt */}
                  <path d="M16 3L7 15.5H13.5L12 25L21 12.5H14.5L16 3Z" fill="currentColor" className="text-primary"/>
                  {/* Inner highlight */}
                  <path d="M16 3L14.5 12.5H18L16 3Z" fill="white" opacity="0.18"/>
                </svg>
                <p className="text-xs font-semibold">Instant delivery</p>
                <p className="text-xs text-muted-foreground">5–15 min</p>
              </div>

              {/* Secure payment */}
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center space-y-1.5">
                <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7 mx-auto" aria-hidden="true">
                  {/* Corner circuit dots */}
                  <circle cx="4" cy="4" r="1" fill="currentColor" className="text-primary opacity-30"/>
                  <circle cx="24" cy="4" r="1" fill="currentColor" className="text-primary opacity-30"/>
                  <circle cx="4" cy="24" r="1" fill="currentColor" className="text-primary opacity-20"/>
                  <circle cx="24" cy="24" r="1" fill="currentColor" className="text-primary opacity-20"/>
                  {/* Shield fill */}
                  <path d="M14 2.5L5 6V13C5 18.5 8.8 23.5 14 25C19.2 23.5 23 18.5 23 13V6L14 2.5Z" fill="currentColor" className="text-primary opacity-15"/>
                  {/* Shield outline */}
                  <path d="M14 2.5L5 6V13C5 18.5 8.8 23.5 14 25C19.2 23.5 23 18.5 23 13V6L14 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-primary"/>
                  {/* Lock shackle */}
                  <path d="M10.5 12.5V10.5C10.5 8.6 12.1 7 14 7C15.9 7 17.5 8.6 17.5 10.5V12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-primary"/>
                  {/* Lock body */}
                  <rect x="10" y="12.5" width="8" height="6" rx="1.5" fill="currentColor" className="text-primary"/>
                  {/* Keyhole */}
                  <circle cx="14" cy="15" r="1.2" fill="white" opacity="0.5"/>
                  <rect x="13.4" y="15" width="1.2" height="2" rx="0.6" fill="white" opacity="0.5"/>
                </svg>
                <p className="text-xs font-semibold">Secure payment</p>
                <p className="text-xs text-muted-foreground">Encrypted</p>
              </div>

              {/* 24/7 support */}
              <div className="rounded-xl border border-border/60 bg-card p-4 text-center space-y-1.5">
                <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7 mx-auto" aria-hidden="true">
                  {/* Outer pulse rings */}
                  <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="0.8" className="text-primary opacity-15"/>
                  <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="0.8" className="text-primary opacity-25"/>
                  {/* Headband arc */}
                  <path d="M6.5 14C6.5 9.8 9.8 6.5 14 6.5C18.2 6.5 21.5 9.8 21.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary"/>
                  {/* Left ear cup */}
                  <rect x="4.5" y="13.5" width="3.5" height="6" rx="1.75" fill="currentColor" className="text-primary"/>
                  {/* Right ear cup */}
                  <rect x="20" y="13.5" width="3.5" height="6" rx="1.75" fill="currentColor" className="text-primary"/>
                  {/* Mic arm */}
                  <path d="M20 19.5C20 21.5 17.5 23 14 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary"/>
                  {/* Mic dot */}
                  <circle cx="14" cy="23.5" r="1.2" fill="currentColor" className="text-primary"/>
                  {/* Ear cup inner highlights */}
                  <rect x="5.3" y="14.8" width="1.8" height="2.5" rx="0.9" fill="white" opacity="0.25"/>
                  <rect x="20.8" y="14.8" width="1.8" height="2.5" rx="0.9" fill="white" opacity="0.25"/>
                </svg>
                <p className="text-xs font-semibold">24/7 support</p>
                <p className="text-xs text-muted-foreground">Always on</p>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN (Purchase card + Security note) ─────── */}
          {/* On mobile: renders 2nd (after trust badges, before     */}
          {/* how-to-redeem). On tablet/desktop: col-2 spanning rows.*/}
          <div className="space-y-4 md:col-start-2 md:row-start-1 md:row-span-2">
            <div className="sticky top-20 space-y-4">

              {/* Purchase card */}
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-5 space-y-5">

                {/* Value input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Card value ({rangeCurrency})
                  </label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder={`${denominationRange.min ?? "?"} – ${denominationRange.max ?? "?"}`}
                    value={cardValue}
                    onChange={(e) => {
                      setValueTouched(true);
                      setCardValue(e.target.value);
                    }}
                    min={denominationRange.min ?? undefined}
                    max={denominationRange.max ?? undefined}
                    aria-invalid={!!valueError}
                    className={`h-12 text-base font-semibold ${valueError ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                  />
                  {valueError ? (
                    <p className="text-xs text-destructive">{valueError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {denominationRange.isFixed
                        ? `Available values: ${denominationRange.fixed.join(", ")} ${rangeCurrency ?? ""}`
                        : `Range: ${formatDenominationRange(denominationRange)}`}
                    </p>
                  )}
                  {denominationRange.isFixed && denominationRange.fixed.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {denominationRange.fixed.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            setValueTouched(true);
                            setCardValue(String(amount));
                          }}
                          className={`px-3 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                            value === amount
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background hover:bg-secondary"
                          }`}
                        >
                          {amount} {rangeCurrency}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNumberOfCards((p) => String(Math.max(1, (parseInt(p, 10) || 1) - 1)))}
                      className="h-12 w-12 flex-shrink-0 rounded-xl border border-border bg-background hover:bg-secondary transition-colors text-lg font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={MAX_GIFT_CARD_QUANTITY}
                      value={numberOfCards}
                      onChange={(e) => {
                        const nextQuantity = e.target.value;
                        if (nextQuantity === "") {
                          setNumberOfCards("");
                          return;
                        }
                        setNumberOfCards(String(Math.min(
                          MAX_GIFT_CARD_QUANTITY,
                          Math.max(1, parseInt(nextQuantity, 10) || 1),
                        )));
                      }}
                      className="flex-1 h-12 text-center text-base font-semibold bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      onClick={() => setNumberOfCards((p) => String(Math.min(
                        MAX_GIFT_CARD_QUANTITY,
                        (parseInt(p, 10) || 1) + 1,
                      )))}
                      disabled={parseInt(numberOfCards, 10) >= MAX_GIFT_CARD_QUANTITY}
                      aria-label={`Increase quantity, maximum ${MAX_GIFT_CARD_QUANTITY}`}
                      className="h-12 w-12 flex-shrink-0 rounded-xl border border-border bg-background hover:bg-secondary transition-colors text-lg font-bold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Separator />

                {/* Price summary */}
                <div className="space-y-2">
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original price</span>
                      <span className="line-through text-muted-foreground">
                        {totalOriginalPrice.toFixed(2)} {senderRange.currencyCode ?? card.recipientCurrencyCode}
                      </span>
                    </div>
                  )}
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">Discount ({discountPercentage}%)</span>
                      <span className="text-green-600 font-medium">
                        − {(totalOriginalPrice - totalFinalPrice).toFixed(2)} {senderRange.currencyCode ?? card.recipientCurrencyCode}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      {totalFinalPrice.toFixed(2)} {senderRange.currencyCode ?? card.recipientCurrencyCode}
                    </span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="space-y-2.5 pt-1">
                  {/* Buy Now — styled like the Shopify checkout button (label + inline
                      payment marks). Crypto icons are the existing <img> sources from
                      cryptoIconUrls already used below in "Pay with crypto", so nothing
                      new is introduced under the CSP. */}
                  <button
                    onClick={handleBuyCard}
                    disabled={!isValueValid}
                    className="w-full h-12 rounded-xl bg-[#FFC439] hover:bg-[#f0b429] active:bg-[#e0a420] transition-colors flex items-center justify-center gap-2 font-bold text-base text-[#003087] shadow-lg shadow-[#FFC439]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Buy Now"
                  >
                    <span>Buy Now</span>
                    <div className="flex items-center gap-1">
                      {[
                        { src: cryptoIconUrls.BTC, alt: "Bitcoin" },
                        { src: cryptoIconUrls.USDT, alt: "USDT" },
                        { src: cryptoIconUrls.USDC, alt: "USDC" },
                        { src: cryptoIconUrls.SOL, alt: "Solana" },
                      ].map(({ src, alt }) => (
                        <div
                          key={alt}
                          className="h-6 w-6 rounded-full bg-white flex items-center justify-center overflow-hidden ring-1 ring-black/5"
                        >
                          <img src={src} alt={alt} className="h-4 w-4" />
                        </div>
                      ))}
                    </div>
                  </button>
                  <Button
                    variant="outline"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !isValueValid}
                    className="w-full h-12 text-base font-semibold rounded-xl"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2.5 rounded-xl bg-secondary/40 border border-border/40 px-4 py-3">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your payment is protected by end-to-end encryption. Gift card codes are delivered securely to your email.
                </p>
              </div>
            </div>
          </div>

          {/* ── LEFT COLUMN BOTTOM (How to redeem, Networks, FAQ) ─── */}
          {/* On mobile: renders 3rd (after purchase card).           */}
          {/* On tablet/desktop: col-1 row-2, below trust badges.     */}
          <div className="space-y-6 md:col-start-1 md:row-start-2">

            {/* Customer reviews (Trustpilot TrustBox) — rendered only when
                the business unit id + profile url are configured via env */}
            {trustpilotBusinessUnitId && trustpilotProfileUrl && (
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
                <h3 className="font-semibold text-sm">Customer reviews</h3>
                {/* TrustBox widget */}
                <div
                  className="trustpilot-widget"
                  data-locale={trustpilotLocale}
                  data-template-id={trustpilotTemplateId}
                  data-businessunit-id={trustpilotBusinessUnitId}
                  data-style-height="150px"
                  data-style-width="100%"
                >
                  <a href={trustpilotProfileUrl} target="_blank" rel="noopener noreferrer">
                    Trustpilot
                  </a>
                </div>
                {/* End TrustBox widget */}
              </div>
            )}

            {/* How to redeem */}
            {fullInstructions && <RedeemInstructions text={fullInstructions} />}

            {/* Accepted networks */}
            <div className="space-y-3">
              <p className="text-sm font-semibold">Pay with crypto</p>
              <div className="flex items-center gap-3">
                {[
                  { src: cryptoIconUrls.BTC, alt: "Bitcoin" },
                  { src: cryptoIconUrls.ETH, alt: "Ethereum" },
                  { src: cryptoIconUrls.USDT, alt: "USDT" },
                ].map(({ src, alt }) => (
                  <div key={alt} className="flex items-center gap-1.5 bg-secondary/60 rounded-full px-3 py-1.5">
                    <img src={src} alt={alt} className="h-5 w-5 rounded-full" />
                    <span className="text-xs font-medium">{alt}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 bg-secondary/60 rounded-full px-3 py-1.5">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">+</div>
                  <span className="text-xs font-medium">More</span>
                </div>
              </div>
            </div>

            <RelatedGiftCards
              products={(relatedProductsData?.content ?? [])
                .filter((product) => String(product.productId) !== String(card.productId))
                .sort((a, b) => {
                  const score = (product: ReloadlyProduct) =>
                    (product.category?.id === card.category?.id ? 2 : 0) +
                    (product.country?.isoName === card.country?.isoName ? 1 : 0);
                  return score(b) - score(a);
                })
                .slice(0, 6)}
              isLoading={relatedProductsLoading}
              onSelect={(id) => setLocation(`/gift-cards/${id}`)}
            />

            {/* FAQ */}
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-semibold mb-1">Frequently asked questions</h3>
              <div className="divide-y divide-border/60">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <GiftCardCartSheet open={cartOpen} onOpenChange={setCartOpen} />

      {/* Payment source sheet */}
      <Sheet open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
            <SheetTitle className="text-center text-2xl">Choose payment source</SheetTitle>
            <SheetDescription className="text-center">
              Purchase using your Pexly balance or fund from an external wallet.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3 mt-6">
            <Button
              variant="outline"
              className="w-full h-12 justify-start px-4 border-border hover:bg-secondary"
              onClick={() => {
                setShowPaymentDialog(false);
                setShowExternalWalletDialog(true);
              }}
            >
              <Building2 className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">External wallet</span>
            </Button>
            <Button
              className="w-full h-12 justify-start px-4 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setShowPaymentDialog(false);
                handleContinueOrder();
              }}
            >
              <Wallet className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">Pexly balance</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* External wallet sheet */}
      <Sheet open={showExternalWalletDialog} onOpenChange={setShowExternalWalletDialog}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-2xl">Email & network</SheetTitle>
            <SheetDescription>
              Enter your email to receive{" "}
              {qty > 1 ? `${qty}x ` : ""}
              {cardValue} {card?.recipientCurrencyCode} {card?.productName}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <Input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Network</label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {networkOptions.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => setShowExternalWalletDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!email || isOrdering}
                onClick={handleContinueOrder}
              >
                {isOrdering ? "Processing..." : "Continue"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
