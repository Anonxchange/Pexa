import { useEffect, useState } from "react";
import { Check, Search, X } from "@/lib/icons";
import {
  initializeMarketCountry,
  detectAndSetMarketCountry,
  getMarketConfig,
  setMarketCountry,
  SUPPORTED_MARKETS,
} from "@/lib/market-manager";
import { shopifyService } from "@/lib/shopify-service";
import { toast } from "sonner";

const CART_ID_KEY = "shopify_cart_id";

// Real flag images instead of Unicode emoji — some Android/older devices
// render flag emoji as a blank box or a two-letter "tofu" glyph. Self-hosted
// from public/flags/ (see scripts/copy-flags.mjs — sourced from the MIT
// licensed "flag-icons" package) so no external image-src is needed in CSP.
// Falls back to the plain code if a file is ever missing.
function FlagImage({ code, className }: { code: string; className?: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span
        aria-hidden
        className={`${className ?? ""} inline-flex items-center justify-center bg-muted text-[8px] font-bold text-muted-foreground`}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      aria-hidden
      loading="lazy"
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

export function MarketSelector() {
  const [country, setCountry] = useState(initializeMarketCountry);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    detectAndSetMarketCountry().then((detected) => {
      if (!cancelled && detected) {
        setCountry(detected);
        // No reload — pages listening via useMarketChangeListener refetch
        // in place. setMarketCountry() already broadcasts the change.
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleChange(nextCountry: string) {
    if (nextCountry === country) {
      closeSheet();
      return;
    }

    const cartId = window.localStorage.getItem(CART_ID_KEY);

    // Product prices are localized by @inContext(country:), while an existing
    // Shopify cart keeps its own buyer identity. Update that identity before
    // reloading so checkout uses the same market as the product listing.
    if (cartId) {
      try {
        const result = await shopifyService.updateCartBuyerIdentity(cartId, nextCountry);
        if (!result.success) {
          throw new Error("Shopify rejected the cart market update");
        }

        if (result.checkoutUrl) {
          window.localStorage.setItem("shopify_checkout_url", result.checkoutUrl);
        }
      } catch (error) {
        console.error("Failed to update Shopify cart market:", error);
        toast.error("Could not switch shopping market", {
          description: "Your cart was not changed. Please try again.",
        });
        return;
      }
    }

    setMarketCountry(nextCountry);
    setCountry(nextCountry);
    closeSheet();
    // No reload — setMarketCountry() already broadcast the change; pages
    // listening via useMarketChangeListener refetch their own data in place.
  }

  const current = getMarketConfig(country);

  const filteredMarkets = SUPPORTED_MARKETS.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return m.code.toLowerCase().includes(q) || m.region.toLowerCase().includes(q);
  });

  function closeSheet() {
    setOpen(false);
    setSearch("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Select market"
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted/50 transition-colors"
      >
        <FlagImage code={current?.code ?? country} className="h-3.5 w-5 rounded-[2px] object-cover shrink-0" />
        <span>{current?.code ?? country}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
          onClick={closeSheet}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-sheet-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-sm bg-background rounded-t-2xl md:rounded-2xl md:shadow-xl flex flex-col max-h-[75vh]"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
              <h2 id="market-sheet-title" className="text-xs font-semibold uppercase tracking-widest text-primary">
                Shopping in
              </h2>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 pb-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search countries…"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="overflow-y-auto px-2 pb-2 flex-1">
              {filteredMarkets.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-6">
                  No countries match "{search}"
                </p>
              )}
              {filteredMarkets.map((m) => {
                const isSelected = m.code === country;
                return (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => handleChange(m.code)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <FlagImage code={m.code} className="h-3.5 w-5 rounded-[2px] object-cover shrink-0" />
                      <span className="font-semibold">{m.code}</span>
                      <span className="text-muted-foreground">— {m.region}</span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="h-2 md:hidden shrink-0" />
          </div>
        </div>
      )}
    </>
  );
}
