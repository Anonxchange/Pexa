import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Truck, Clock, Loader2, Package, AlertCircle, ChevronRight, RotateCcw, ShieldCheck } from '@/lib/icons';
import { formatPrice } from "@/lib/shopify-service";
import { getCountryCode } from "@/lib/geo";
import { useShippingRates } from "@/hooks/use-shipping-rates";
import { isValidCjVid } from "@/lib/cj-vid";
import type { ShippingInfo } from "./shipping-types";

// ─── Country list ─────────────────────────────────────────────────────────────
const ALL_COUNTRIES: { code: string; name: string }[] = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" }, { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" }, { code: "AU", name: "Australia" }, { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" }, { code: "BR", name: "Brazil" }, { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" }, { code: "CN", name: "China" }, { code: "CO", name: "Colombia" },
  { code: "HR", name: "Croatia" }, { code: "CZ", name: "Czech Republic" }, { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" }, { code: "FI", name: "Finland" }, { code: "FR", name: "France" },
  { code: "DE", name: "Germany" }, { code: "GH", name: "Ghana" }, { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" }, { code: "HU", name: "Hungary" }, { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" }, { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" }, { code: "JP", name: "Japan" }, { code: "JO", name: "Jordan" },
  { code: "KE", name: "Kenya" }, { code: "KW", name: "Kuwait" }, { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" }, { code: "MA", name: "Morocco" }, { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" }, { code: "NG", name: "Nigeria" }, { code: "NO", name: "Norway" },
  { code: "PK", name: "Pakistan" }, { code: "PH", name: "Philippines" }, { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" }, { code: "QA", name: "Qatar" }, { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" }, { code: "SA", name: "Saudi Arabia" }, { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" }, { code: "KR", name: "South Korea" }, { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" }, { code: "CH", name: "Switzerland" }, { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" }, { code: "TR", name: "Turkey" }, { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" }, { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" }, { code: "VN", name: "Vietnam" },
];

// ─── Metafield parser ─────────────────────────────────────────────────────────
function parseMultiValue(raw: string | undefined): string[] {
  if (!raw) return [];
  raw = raw.trim();
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {}
  }
  return raw.split(/[,|;]+/).map((s) => s.trim()).filter(Boolean);
}

function parseFee(raw: string | undefined): number | null {
  if (!raw) return null;
  if (raw.startsWith("{")) {
    try {
      const obj = JSON.parse(raw);
      const first = Object.values(obj)[0];
      const n = parseFloat(String(first));
      return isNaN(n) ? null : n;
    } catch {}
  }
  const match = raw.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

interface ParsedShipping {
  methods: string[];
  processingTimes: string[];
  deliveryTimes: string[];
  fees: (number | null)[];
  availableCountryCodes: string[];
  shipsFrom: string;
}

function parseShipping(shipping: ShippingInfo | undefined): ParsedShipping {
  const methods = parseMultiValue(shipping?.method);
  const processingTimes = parseMultiValue(shipping?.processingTime);
  const deliveryTimes = parseMultiValue(shipping?.deliveryTime);
  const rawFees = parseMultiValue(shipping?.fee);
  const fees = rawFees.length ? rawFees.map((f) => parseFee(f)) : [parseFee(shipping?.fee)];

  const shipToRaw = shipping?.shipTo || "";
  let availableCountryCodes: string[] = [];
  if (
    shipToRaw.toLowerCase() === "worldwide" ||
    shipToRaw.toLowerCase() === "select at checkout" ||
    shipToRaw === ""
  ) {
    availableCountryCodes = ALL_COUNTRIES.map((c) => c.code);
  } else {
    const tokens = parseMultiValue(shipToRaw);
    availableCountryCodes = tokens
      .map((t) => {
        const upper = t.toUpperCase().trim();
        if (ALL_COUNTRIES.some((c) => c.code === upper)) return upper;
        const byName = ALL_COUNTRIES.find(
          (c) => c.name.toLowerCase() === t.toLowerCase()
        );
        return byName?.code || null;
      })
      .filter((c): c is string => c !== null);
    if (availableCountryCodes.length === 0) {
      availableCountryCodes = ALL_COUNTRIES.map((c) => c.code);
    }
  }

  return {
    methods: methods.length ? methods : ["Standard Shipping"],
    processingTimes,
    deliveryTimes,
    fees,
    availableCountryCodes,
    shipsFrom: shipping?.shipsFrom || "Supplier warehouse",
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface ShippingEstimatorProps {
  shipping: ShippingInfo | undefined;
  productPrice: number;
  currency: string;
  variantId: string | undefined;
  productTitle: string;
  productImage?: string;
  cjVid?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ShippingEstimator({
  shipping,
  currency,
  cjVid,
}: ShippingEstimatorProps) {
  const parsed = useMemo(() => parseShipping(shipping), [shipping]);
  const availableCountries = ALL_COUNTRIES.filter((c) =>
    parsed.availableCountryCodes.includes(c.code)
  );

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedMethodIdx, setSelectedMethodIdx] = useState(0);
  const [shippingExpanded, setShippingExpanded] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);

  const { rates, isLoading: isLoadingRates, error: ratesError, calculate, reset } = useShippingRates();

  // Auto-detect user's country via IP on mount, fall back to US then first available
  useEffect(() => {
    let cancelled = false;
    async function detectCountry() {
      const code = await getCountryCode(); // reads CF edge tag → ipapi.co JSON → "US"
      if (cancelled) return;
      const match = availableCountries.find((c) => c.code === code);
      // If detected country isn't in the available list, fall back to US or first entry
      const fallback =
        availableCountries.find((c) => c.code === "US") ??
        availableCountries[0];
      setSelectedCountry(match?.code ?? fallback?.code ?? "");
    }
    detectCountry();
    return () => { cancelled = true; };
  }, []);

  // Fetch live rates whenever country or cjVid changes.
  // CJ is OPTIONAL — only called when a valid, non-empty cjVid is available.
  // Never sends empty string, undefined, or null to the CJ freight API.
  useEffect(() => {
    if (!isValidCjVid(cjVid) || !selectedCountry) {
      reset();
      return;
    }
    calculate({
      endCountryCode: selectedCountry,
      products: [{ vid: cjVid, quantity: 1 }],
    });
  }, [selectedCountry, cjVid]);

  // Reset method selection when live rates change
  useEffect(() => {
    setSelectedMethodIdx(0);
  }, [rates]);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
  };

  // ─── Resolve display values from live rates or static data ───────────────
  const useLiveRates = rates.length > 0;

  const displayMethods = useLiveRates
    ? rates.map((r) => r.logisticAftName || r.logisticName)
    : parsed.methods;

  const selectedRate = useLiveRates ? rates[selectedMethodIdx] ?? rates[0] : null;

  const deliveryTime = useLiveRates && selectedRate
    ? selectedRate.minDeliveryTime != null && selectedRate.maxDeliveryTime != null
      ? `${selectedRate.minDeliveryTime}–${selectedRate.maxDeliveryTime} days`
      : "Varies by carrier"
    : parsed.deliveryTimes[selectedMethodIdx] ?? parsed.deliveryTimes[0] ?? "Calculated at checkout";

  const processingTime = parsed.processingTimes[selectedMethodIdx] ?? parsed.processingTimes[0] ?? "Calculated at checkout";

  const fee = useLiveRates && selectedRate
    ? selectedRate.logisticPrice
    : parsed.fees[selectedMethodIdx] ?? parsed.fees[0];

  const feeCurrency = useLiveRates && selectedRate
    ? (selectedRate.logisticPriceCur || currency)
    : currency;

  const shippingCostDisplay =
    fee === null || fee === undefined
      ? "Calculated at checkout"
      : fee === 0
      ? "Free"
      : formatPrice(fee as number, feeCurrency);

  return (
    <div className="-mx-4 sm:mx-0 border-b sm:border sm:rounded-2xl border-border/70 bg-card overflow-hidden space-y-0 sm:shadow-sm">
      {/* Section label */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          Service commitment
        </p>
      </div>

      {/* Trust & info bar */}
      <div className="px-4 pb-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold text-foreground">
            Est. delivery: 7–20 business days, with tracking
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-[1.375rem] text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            Secure checkout via Shopify
          </span>
          <button
            type="button"
            onClick={() => setRefundOpen(true)}
            className="flex items-center gap-1.5 hover:text-foreground underline decoration-dotted underline-offset-2"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            Easy returns &amp; refunds
          </button>
        </div>
      </div>

      {/* Shipping — tap to expand destination & method */}
      <button
        type="button"
        onClick={() => setShippingExpanded((v) => !v)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0">
          <Truck className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="min-w-0">
            {isLoadingRates ? (
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-sm font-semibold truncate">
                Shipping: {shippingCostDisplay}
              </p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isLoadingRates ? "Calculating…" : "Tap to choose destination & method"}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`h-4 w-4 mt-0.5 text-muted-foreground shrink-0 transition-transform ${
            shippingExpanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {shippingExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/60 bg-muted/20">
          {/* Country */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Ship to
            </label>
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[min(13rem,60%)] h-10 text-sm">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {availableCountries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shipping Method */}
          {isLoadingRates ? (
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching shipping rates…
            </div>
          ) : ratesError && isValidCjVid(cjVid) ? (
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
              <span>Could not load live rates. Showing estimated data.</span>
            </div>
          ) : !isValidCjVid(cjVid) && parsed.methods.length === 1 && parsed.methods[0] === "Standard Shipping" && !parsed.fees[0] ? (
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span>Shipping estimate not available for this product.</span>
            </div>
          ) : displayMethods.length > 1 ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Shipping method
              </label>
              <div className="flex flex-wrap gap-2">
                {displayMethods.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMethodIdx(i)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                      selectedMethodIdx === i
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-border/40 hover:border-primary/50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Shipping method
              </p>
              <p className="text-sm font-semibold">{displayMethods[0]}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Delivery: {deliveryTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Processing: {processingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Ships from {parsed.shipsFrom}
            </span>
            {useLiveRates && (
              <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                Live rates
              </span>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Security & Privacy */}
      <div className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Security &amp; Privacy</span>{" "}
            <span className="text-muted-foreground">secure personal details</span>
          </p>
        </div>
        <div className="mt-2 ml-7 space-y-1 text-xs text-muted-foreground">
          <p>Safe payments: We do not share your personal details with third parties.</p>
          <p>Secure personal details: We protect your privacy and keep your data safe.</p>
        </div>
      </div>

      {/* Return & refund — bottom sheet on mobile, centered popup from sm breakpoint up */}
      {refundOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          onClick={() => setRefundOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="refund-sheet-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl p-5 max-h-[80vh] overflow-y-auto sm:shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 id="refund-sheet-title" className="text-sm font-bold flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Returns &amp; refunds
              </h2>
              <button
                type="button"
                onClick={() => setRefundOpen(false)}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground text-lg leading-none px-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">You're covered if:</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Your order isn't delivered within the stated delivery window</li>
                  <li>You receive the wrong item or one that doesn't match the listing</li>
                  <li>The item arrives damaged or defective — report it within 7 days of delivery</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Not covered:</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Change of mind after an order has shipped</li>
                  <li>Custom, personalised, or made-to-order items (unless defective)</li>
                </ul>
              </div>

              <p>
                To request a refund, open the order in your dashboard and submit a request with photos of the issue. Most decisions are made within 10 business days (up to 21 for complex or cross-border cases), and approved refunds are processed within 3 business days of that decision.
              </p>
              <p>
                If a return is required, ship the item back within 14 days of approval; a restocking fee of up to 15% may apply to non-defective returns.
              </p>

              <a
                href="https://www.pexly.app/en/refund-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-primary font-medium hover:underline underline-offset-2 pt-1"
              >
                View full refund policy →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
