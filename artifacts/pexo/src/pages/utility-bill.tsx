import { useState, useMemo, useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ArrowRight, Search, Zap, Bot, Check, Receipt, Filter, ShoppingCart, Gift, Star, Shield, Mail, UserCheck, ChevronUp, Share2, Heart } from '@/lib/icons';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useUtilityCountries,
  useUtilityBillers,
  payUtilityBill,
  SERVICE_TYPES,
  Biller,
} from "@/hooks/use-utility-billers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sanitizeImageUrl } from "@/lib/sanitize";
import { devLog } from "@/lib/dev-logger";
import { SYMBOL_ICON_MAP } from "@/lib/crypto-icons";

// Literal class names so Tailwind can generate them. Items past the 12th share the last delay.
const STAGGER_DELAY_CLASSES = [
  "[animation-delay:0s]",
  "[animation-delay:0.04s]",
  "[animation-delay:0.08s]",
  "[animation-delay:0.12s]",
  "[animation-delay:0.16s]",
  "[animation-delay:0.2s]",
  "[animation-delay:0.24s]",
  "[animation-delay:0.28s]",
  "[animation-delay:0.32s]",
  "[animation-delay:0.36s]",
  "[animation-delay:0.4s]",
  "[animation-delay:0.44s]",
] as const;

// Swaps to a fallback icon in React state when the image fails (no DOM style changes).
function LogoWithFallback({
  src,
  alt,
  fallback,
  crossOrigin,
}: {
  src?: string | null;
  alt: string;
  fallback: ReactNode;
  crossOrigin?: "anonymous" | "use-credentials";
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  if (!src || failed) {
    return <div className="w-full h-full flex items-center justify-center">{fallback}</div>;
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain"
      crossOrigin={crossOrigin}
      onError={() => setFailed(true)}
    />
  );
}

// ── Crypto icons for the detail view ──────────────────────────────────────
const UTILITY_CRYPTO_ICONS = [
  { label: "Bitcoin", symbol: "BTC" },
  { label: "USDT",    symbol: "USDT" },
  { label: "USDC",    symbol: "USDC" },
  { label: "Ethereum",symbol: "ETH" },
  { label: "Solana",  symbol: "SOL" },
  { label: "Tron",    symbol: "TRX" },
];

function CryptoIconImg({ symbol, label }: { symbol: string; label: string }) {
  const [failed, setFailed] = useState(false);
  const src = SYMBOL_ICON_MAP[symbol];
  if (!src || failed) {
    return (
      <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center shadow-sm">
        <span className="text-[10px] font-bold text-muted-foreground">{symbol.slice(0, 3)}</span>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden shadow-sm p-1.5">
      <img src={src} alt={label} className="w-full h-full object-contain" onError={() => setFailed(true)} />
    </div>
  );
}

const UTIL_FEATURES = [
  { icon: UserCheck, label: "No Account Required" },
  { icon: Mail,      label: "Instant Processing" },
  { icon: Shield,    label: "Private and Secure" },
];

const UtilityDetailView = ({
  selectedProvider,
  currentCountry,
  accountNumber,
  setAccountNumber,
  amount,
  setAmount,
  selectedCountry,
  onBack,
}: {
  selectedProvider: Biller;
  currentCountry: { isoName: string; name: string } | undefined;
  accountNumber: string;
  setAccountNumber: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  selectedCountry: string;
  onBack: () => void;
}) => {
  const [descOpen, setDescOpen] = useState(true);
  const [liked, setLiked] = useState(false);

  const currency = selectedProvider.localTransactionCurrencyCode || "USD";
  const isFixed = selectedProvider.denominationType === "FIXED";
  const fixedAmounts = selectedProvider.fixedAmounts || [];
  const minAmt = selectedProvider.minLocalTransactionAmount ?? "";
  const maxAmt = selectedProvider.maxLocalTransactionAmount ?? "";
  const rangePlaceholder = minAmt && maxAmt ? `${minAmt} – ${maxAmt}` : "Enter amount";

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: selectedProvider.name, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const handleCheckout = () => {
    if (!amount || !accountNumber) {
      toast.error("Please enter account number and amount");
      return;
    }
    localStorage.setItem("pexly_pending_order", JSON.stringify({
      type: "utility",
      title: `${selectedProvider.name} Bill Payment`,
      description: `Utility bill — ${selectedProvider.name}`,
      amount: Number(amount),
      currency: currency.toLowerCase(),
      metadata: {
        service: "utility-bill",
        billerId: selectedProvider.id,
        accountNumber,
        countryCode: selectedProvider.countryCode,
        providerName: selectedProvider.name,
      },
    }));
    devLog.info("Redirecting to checkout for utility bill");
    const seg = window.location.pathname.split("/")[1];
    const langBase = seg && seg.length === 2 ? `/${seg}` : "/en";
    window.open(`${langBase}/checkout`, "_blank");
  };

  const safeLogo = sanitizeImageUrl((selectedProvider as any).logoUrls?.[0] || (selectedProvider as any).logo);

  return (
    <div className="animate-fade-in max-w-xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
        <button onClick={onBack} className="hover:text-foreground underline underline-offset-2 transition-colors">
          {currentCountry?.name || selectedCountry}
        </button>
        <span>›</span>
        <span className="text-foreground font-medium">
          {selectedProvider.serviceType?.replace(/_/g, " ") || "Utility"}
        </span>
      </nav>

      {/* Provider logo + action icons */}
      <div className="relative flex justify-center mb-5">
        <div className="absolute right-0 top-0 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors shadow-sm"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLiked(v => !v)}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center transition-colors shadow-sm hover:bg-muted"
            aria-label="Save"
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>
        </div>
        <div className="w-28 h-28 bg-card rounded-2xl border border-border flex items-center justify-center p-3 shadow-sm overflow-hidden">
          <LogoWithFallback src={safeLogo} alt={selectedProvider.name} crossOrigin="anonymous" fallback={<Zap className="w-12 h-12 text-muted-foreground" />} />
        </div>
      </div>

      {/* Title + rating */}
      <h2 className="text-2xl font-bold text-foreground text-center mb-1">{selectedProvider.name}</h2>
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        <span className="text-sm text-muted-foreground ml-1">4.8 (182)</span>
      </div>

      {/* Description blurb */}
      <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed px-2">
        Pay your {selectedProvider.name} bill instantly using Bitcoin, USDT, and other cryptocurrencies.
        Accepted in {currentCountry?.name || selectedCountry} with instant confirmation.
      </p>

      {/* Account number input */}
      <div className="mb-5">
        <p className="text-base font-semibold text-foreground mb-2">Account or meter number</p>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="e.g. 1234567890"
          className="w-full border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground text-base py-4 px-4 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      {/* Amount input — shown for RANGE or FIXED with no pre-set amounts */}
      {(!isFixed || fixedAmounts.length === 0) && (
        <div className="mb-5">
          <p className="text-base font-semibold text-foreground mb-2">Enter amount</p>
          <div className="flex items-stretch border border-border rounded-xl overflow-hidden bg-card focus-within:ring-2 focus-within:ring-primary/40 transition-all">
            <div className="flex items-center px-4 border-r border-border bg-muted/40">
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{currency}</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={rangePlaceholder}
              min={selectedProvider.minLocalTransactionAmount ?? undefined}
              max={selectedProvider.maxLocalTransactionAmount ?? undefined}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base py-4 px-4 outline-none min-w-0"
            />
          </div>
          {minAmt && maxAmt && (
            <p className="text-xs text-muted-foreground mt-1.5 px-1">
              Range: {currency} {minAmt} – {maxAmt}
            </p>
          )}
        </div>
      )}

      {/* Fixed amount quick-select (when pre-set amounts exist) */}
      {fixedAmounts.length > 0 && (
        <div className="mb-5">
          <p className="text-base font-semibold text-foreground mb-2">Select amount</p>
          <div className="grid grid-cols-3 gap-2">
            {fixedAmounts.slice(0, 9).map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`py-2.5 px-2 rounded-xl border transition-all flex flex-col items-center gap-0.5 text-sm font-semibold ${
                  amount === amt.toString()
                    ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/50 text-foreground hover:bg-muted/30"
                }`}
              >
                {currency} {amt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div className="space-y-3 mb-8">
        <button
          disabled={!amount || !accountNumber}
          onClick={handleCheckout}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#FFC439] hover:bg-[#f0b429] active:bg-[#e0a420] disabled:opacity-50 disabled:cursor-not-allowed text-[#003087] font-bold text-base transition-colors shadow-md"
        >
          <span>Proceed to checkout</span>
          <div className="flex items-center gap-1">
            {[
              { symbol: "BTC", label: "Bitcoin" },
              { symbol: "USDT", label: "USDT" },
              { symbol: "USDC", label: "USDC" },
              { symbol: "SOL", label: "Solana" },
            ].map(({ symbol, label }) => (
              <div
                key={label}
                className="h-6 w-6 rounded-full bg-white flex items-center justify-center overflow-hidden ring-1 ring-black/5"
              >
                <img src={SYMBOL_ICON_MAP[symbol]} alt={label} className="h-4 w-4 object-contain" />
              </div>
            ))}
          </div>
        </button>
        <button
          disabled={!amount || !accountNumber}
          onClick={handleCheckout}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-muted hover:bg-muted/70 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold text-base transition-all active:scale-[0.98] border border-border"
        >
          <Gift className="w-5 h-5" />
          Send as gift
        </button>
      </div>

      {/* Crypto payment icons */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {UTILITY_CRYPTO_ICONS.map((c) => (
          <CryptoIconImg key={c.label} symbol={c.symbol} label={c.label} />
        ))}
      </div>

      <div className="border-t border-border mb-6" />

      {/* Feature list */}
      <ul className="space-y-4 mb-6">
        {UTIL_FEATURES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-border mb-5" />

      {/* Description accordion */}
      <div>
        <button
          onClick={() => setDescOpen(o => !o)}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="font-semibold text-foreground">Description</span>
          {descOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>
        {descOpen && (
          <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed pb-2">
            <p>
              {selectedProvider.name} allows you to pay your utility bills instantly with cryptocurrency.
            </p>
            <p>
              Pay {selectedProvider.name} bills with crypto such as Bitcoin, Ethereum, USDT, USDC, Solana, and many more.
            </p>
          </div>
        )}
      </div>

      <div className="h-10" />
    </div>
  );
};

const FALLBACK_COUNTRIES = [
  { isoName: "NG", name: "Nigeria" },
  { isoName: "KE", name: "Kenya" },
  { isoName: "GH", name: "Ghana" },
  { isoName: "ZA", name: "South Africa" },
  { isoName: "GB", name: "United Kingdom" },
  { isoName: "US", name: "United States" },
  { isoName: "IN", name: "India" },
  { isoName: "BR", name: "Brazil" },
  { isoName: "MX", name: "Mexico" },
  { isoName: "PH", name: "Philippines" },
];

const ProviderCard = ({
  name,
  logo,
  priceRange,
  onClick,
}: {
  name: string;
  logo?: string;
  priceRange: string;
  onClick?: () => void;
}) => {
  const safeLogo = sanitizeImageUrl(logo);
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative bg-card rounded-3xl aspect-[4/3] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg overflow-hidden border border-border p-4">
        <LogoWithFallback src={safeLogo} alt={name} crossOrigin="anonymous" fallback={<Zap className="w-12 h-12 text-muted-foreground" />} />
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-semibold text-foreground truncate text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{priceRange}</p>
      </div>
    </div>
  );
};

const UtilityBill = () => {
  const [, setLocation] = useLocation();
  useEffect(() => { localStorage.removeItem("pexly_pending_order"); }, []);

  const [accountNumber, setAccountNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("ALL");
  const [selectedProvider, setSelectedProvider] = useState<Biller | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [view, setView] = useState<"countries" | "providers" | "pay">("countries");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: countriesData, isLoading: isLoadingCountries } = useUtilityCountries();
  const { data: billersData, isLoading: isLoadingBillers } = useUtilityBillers(
    selectedCountry || undefined,
    selectedService && selectedService !== "ALL" ? selectedService : undefined
  );
  const countries = useMemo(() => {
    if (countriesData && Array.isArray(countriesData) && countriesData.length > 0) {
      return countriesData.map((c: any) => ({ isoName: c.isoName, name: c.name }));
    }
    return FALLBACK_COUNTRIES;
  }, [countriesData]);

  const currentCountry = useMemo(
    () => countries.find((c) => c.isoName === selectedCountry),
    [countries, selectedCountry]
  );

  const filteredCountries = useMemo(
    () =>
      countries.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.isoName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [countries, searchQuery]
  );

  const providers = billersData?.content || [];
  const filteredProviders = useMemo(
    () => providers.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [providers, searchQuery]
  );

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSearchQuery("");
    setView("providers");
  };

  const handleProviderClick = (provider: Biller) => {
    setSelectedProvider(provider);
    setSearchQuery("");
    setView("pay");
    setAmount("");
  };

  const handlePayment = async () => {
    if (!amount || !accountNumber || !selectedProvider) {
      toast.error("Please enter both account number and amount");
      return;
    }
    setIsSubmitting(true);
    try {
      await payUtilityBill({
        subscriberAccountNumber: accountNumber,
        amount: Number(amount),
        billerId: selectedProvider.id,
        billerName: selectedProvider.name,
        countryCode: selectedProvider.countryCode,
      });
      // Save to My Orders history
      try {
        const saved = JSON.parse(localStorage.getItem("pexly_digital_orders") || "[]");
        saved.unshift({
          id: `util_${Date.now()}`,
          type: "utility",
          title: `${selectedProvider.name} Bill Payment`,
          amount: Number(amount),
          currency: "USD",
          paypalOrderId: "",
          placedAt: new Date().toISOString(),
          status: "fulfilled",
        });
        localStorage.setItem("pexly_digital_orders", JSON.stringify(saved.slice(0, 100)));
      } catch {}
      toast.success("Utility bill payment processed successfully!");
      setView("providers");
      setAmount("");
      setAccountNumber("");
    } catch (error: any) {
      toast.error(error.message || "Failed to process utility payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero (hidden when a provider is selected) ── */}
      {view !== "pay" && <section className="relative pt-8 pb-16 px-4 bg-[linear-gradient(135deg,#0a0a0a_0%,#0f1208_50%,#0a1400_100%)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#B4F22E]/10 blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#B4F22E]/6 blur-3xl" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
            Pay Utility Bills with Crypto
          </h1>
          <p className="text-white/55 text-base mb-6">
            Pay electricity, water, TV, and more in 100+ countries using Bitcoin, USDT, and more.
          </p>
        </div>

        {/* Floating account input */}
        <div className="absolute left-4 right-4 -bottom-6 z-20">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <button
                className="flex items-center gap-2 px-4 py-4 border-r border-border text-foreground font-semibold text-sm shrink-0 hover:bg-muted transition-colors"
                onClick={() => { setSelectedCountry(""); setView("countries"); }}
              >
                {selectedCountry ? (
                  <>
                    <img
                      src={`https://flagcdn.com/w40/${selectedCountry.toLowerCase()}.png`}
                      alt=""
                      className="w-5 h-3.5 object-cover rounded-sm"
                    />
                    <span>{selectedCountry}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Country</span>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account or Meter Number"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base py-4 px-4 min-w-0"
              />
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-4 font-bold text-sm shrink-0 transition-all active:scale-95"
                onClick={() => { if (selectedCountry) setView("providers"); else setView("countries"); }}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>}

      {/* ── Main Content ── */}
      <section className={`${view !== "pay" ? "pt-16" : "pt-6"} pb-10 px-4 md:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">

          {/* Countries view */}
          {view === "countries" && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-foreground">Select Country</h2>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search countries..."
                    className="pl-10 h-11 rounded-2xl bg-card border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {isLoadingCountries ? (
                  Array(18).fill(0).map((_, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-border bg-card space-y-2">
                      <Skeleton className="h-5 w-9 rounded" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-3.5 rounded-sm" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                  ))
                ) : filteredCountries.map((c) => (
                  <button
                    key={c.isoName}
                    onClick={() => handleCountrySelect(c.isoName)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      selectedCountry === c.isoName
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={`https://flagcdn.com/w40/${c.isoName.toLowerCase()}.png`}
                        alt=""
                        className="w-6 h-4 object-cover rounded-sm shadow-sm"
                        loading="lazy"
                      />
                      <span className="font-bold text-sm text-foreground">{c.isoName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate block">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Providers view */}
          {view === "providers" && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedCountry(""); setSelectedProvider(null); setSearchQuery(""); setView("countries"); }}
                    className="rounded-full hover:bg-muted shrink-0"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </Button>
                  <h2 className="text-xl font-bold text-foreground">
                    Providers in {currentCountry?.name || "Selected Country"}
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-2xl bg-card border-border">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Service Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search providers..."
                      className="pl-10 h-11 rounded-2xl bg-card border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                {isLoadingBillers ? (
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                  ))
                ) : filteredProviders.length > 0 ? (
                  filteredProviders.map((provider, index) => (
                    <div key={provider.id} className={`animate-fade-in ${STAGGER_DELAY_CLASSES[Math.min(index, STAGGER_DELAY_CLASSES.length - 1)]}`}>
                      <ProviderCard
                        name={provider.name}
                        priceRange={
                          provider.denominationType === "FIXED"
                            ? `${provider.fixedAmounts?.[0] || "Fixed"} ${provider.localTransactionCurrencyCode}`
                            : `${provider.minLocalTransactionAmount ?? 0} – ${provider.maxLocalTransactionAmount ?? "Any"} ${provider.localTransactionCurrencyCode}`
                        }
                        onClick={() => handleProviderClick(provider)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                    <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground font-medium">No providers found for the selected criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pay view — Bitrefill-style detail */}
          {view === "pay" && selectedProvider && (
            <UtilityDetailView
              selectedProvider={selectedProvider}
              currentCountry={currentCountry}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              amount={amount}
              setAmount={setAmount}
              selectedCountry={selectedCountry}
              onBack={() => setView("providers")}
            />
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-14 px-4 md:px-6 lg:px-8 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">How utility payments work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "1",
                title: "Select provider & enter details",
                desc: "Choose your utility provider and enter your account or meter number.",
              },
              {
                icon: "2",
                title: "Pay with crypto",
                desc: "Send the required amount using Bitcoin, USDT, or any supported cryptocurrency.",
              },
              {
                icon: "3",
                title: "Instant confirmation",
                desc: "Your bill is paid instantly once the transaction is confirmed on-chain.",
              },
            ].map((step) => (
              <div key={step.icon} className="bg-card border border-border rounded-3xl p-6 text-center">
                <div className="w-10 h-10 bg-primary/10 text-primary font-bold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default UtilityBill;
