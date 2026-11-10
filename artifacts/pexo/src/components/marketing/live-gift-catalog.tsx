import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { GiftCardCartSheet } from "@/components/gift-card-cart-sheet";
import { useGiftCardCart } from "@/hooks/use-gift-card-cart";
import {
  useGiftCardCategories,
  useGiftCardCountries,
  useGiftCardProducts,
  type ReloadlyCategory,
  type ReloadlyProduct,
} from "@/hooks/use-reloadly";
import { getRecipientDenominationRange } from "@/lib/gift-card-denominations";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  GIFT_CARD_MARKET_CHANGED_EVENT,
  getGiftCardMarketCountry,
  setGiftCardMarketCountry,
} from "@/lib/gift-card-market";

type GiftContextValue = {
  countries: ReturnType<typeof useGiftCardCountries>["data"];
  countryCode: string;
  setCountryCode: (code: string) => void;
  search: string;
  setSearch: (value: string) => void;
  openCart: () => void;
  cartCount: number;
  categories: ReloadlyCategory[];
  products: ReloadlyProduct[];
  browseCategory: (category: ReloadlyCategory | undefined, fallback: string) => void;
};
const GiftContext = createContext<GiftContextValue | null>(null);
const categoryPalette: Record<string, [string, string]> = {
  gaming: ["#1b2838", "#ffffff"], streaming: ["#141414", "#ffffff"],
  shopping: ["#f4c542", "#171717"], travel: ["#00a699", "#ffffff"],
  food: ["#c44253", "#ffffff"], software: ["#1769aa", "#ffffff"],
  fashion: ["#c45986", "#ffffff"], electronics: ["#17232d", "#ffffff"],
  home: ["#98754f", "#ffffff"], beauty: ["#d779a1", "#ffffff"],
};

function slugFor(name: string, id?: number) {
  const value = name.toLowerCase();
  if (/game/.test(value)) return "gaming";
  if (/entertainment|stream/.test(value)) return "streaming";
  if (/shop|market/.test(value)) return "shopping";
  if (/travel|transport/.test(value)) return "travel";
  if (/food|restaurant/.test(value)) return "food";
  if (/software|subscription/.test(value)) return "software";
  if (/fashion|clothing/.test(value)) return "fashion";
  if (/electronic|technology/.test(value)) return "electronics";
  if (/home|furniture/.test(value)) return "home";
  if (/beauty|cosmetic/.test(value)) return "beauty";
  return id ? `category-${id}` : "other";
}

function amountFrom(product: ReloadlyProduct) {
  const range = getRecipientDenominationRange(product);
  return range.fixed?.[0] ?? range.min ?? 0;
}

export function GiftExportProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [countryCode, setCountryCodeState] = useState(
    () => getGiftCardMarketCountry() ?? "NG",
  );
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useGiftCardCart();
  const enabled = isSupabaseConfigured();
  const productsQuery = useGiftCardProducts({ page: 1, size: 200, countryCode, enabled });
  const categoriesQuery = useGiftCardCategories({ enabled });
  const countriesQuery = useGiftCardCountries({ enabled });
  const products = productsQuery.data?.content ?? [];
  const countries = countriesQuery.data ?? [];

  const setCountryCode = (code: string) => {
    setCountryCodeState(code);
    setGiftCardMarketCountry(code);
  };

  useEffect(() => {
    const handleCountryChange = (event: Event) => {
      const code = (event as CustomEvent<{ countryCode?: string }>).detail?.countryCode;
      setCountryCodeState(code ?? "NG");
    };
    window.addEventListener(GIFT_CARD_MARKET_CHANGED_EVENT, handleCountryChange);
    return () => window.removeEventListener(GIFT_CARD_MARKET_CHANGED_EVENT, handleCountryChange);
  }, []);

  useEffect(() => {
    if (countries.length && !countries.some((country) => country.isoName === countryCode)) {
      const fallback = countries.find((country) => country.isoName === "NG") ?? countries[0];
      setCountryCode(fallback.isoName);
    }
  }, [countryCode, countries]);

  const categories = useMemo(() => {
    const byId = new Map<number, ReloadlyCategory>();
    for (const category of categoriesQuery.data ?? []) byId.set(category.id, category);
    for (const product of products) {
      if (product.category?.id && product.category.name && !byId.has(product.category.id)) byId.set(product.category.id, product.category);
    }
    return Array.from(byId.values());
  }, [categoriesQuery.data, products]);

  const value: GiftContextValue = {
    countries,
    countryCode,
    setCountryCode,
    search,
    setSearch,
    openCart: () => setCartOpen(true),
    cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
    categories,
    products,
    browseCategory: (category, fallback) => {
      const params = new URLSearchParams({ category: category?.name ?? fallback });
      if (category) params.set("categoryId", String(category.id));
      navigate(`/gift-cards/browse?${params.toString()}`);
    },
  };
  return (
    <GiftContext.Provider value={value}>
      {children}
      <GiftCardCartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </GiftContext.Provider>
  );
}

function useGiftPage() {
  const value = useContext(GiftContext);
  if (!value) throw new Error("Gift export controls must be inside GiftExportProvider");
  return value;
}

export function GiftHeaderSearch() {
  const { search, setSearch } = useGiftPage();
  const [, navigate] = useLocation();
  const submit = () => {
    const query = search.trim();
    if (!query) return;
    if (/^\+?\d[\d\s()-]{5,}$/.test(query)) {
      try { localStorage.setItem("px_num", query); } catch { /* storage may be unavailable */ }
      navigate("/wallet/mobile-topup");
      return;
    }
    setSearch(query);
    document.getElementById("g-shelf")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="g-search">
      <input id="g-q" aria-label="Search gift cards or phone number" placeholder="Brand or phone number" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} />
      <button id="g-go" type="button" aria-label="Search" onClick={submit}><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg></button>
    </div>
  );
}

export function GiftCountrySelect() {
  const { countries, countryCode, setCountryCode } = useGiftPage();
  return (
    <select className="g-sel" id="g-country" aria-label="Country" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
      {(countries?.length ? countries : [{ isoName: "NG", name: "Nigeria" }]).map((country) => (
        <option value={country.isoName} key={country.isoName}>{country.isoName}</option>
      ))}
    </select>
  );
}

export function GiftCartButton() {
  const { cartCount, openCart } = useGiftPage();
  return (
    <button className="g-cart" type="button" aria-label={`Cart, ${cartCount} items`} onClick={openCart}>
      <svg viewBox="0 0 24 24"><path d="M2 3h3l2.5 12h11L21 7H6" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></svg>
      <i>{cartCount}</i>
    </button>
  );
}

function giftRange(product: ReloadlyProduct) {
  const denomination = getRecipientDenominationRange(product);
  if (denomination.fixed.length) {
    const min = denomination.fixed[0];
    return `From ${product.recipientCurrencyCode ?? "USD"} ${min}`;
  }
  return `From ${product.recipientCurrencyCode ?? "USD"} ${denomination.min ?? amountFrom(product)}`;
}

export function LiveGiftCatalog() {
  const page = useGiftPage();
  const [, navigate] = useLocation();
  const enabled = isSupabaseConfigured();
  const { isLoading, isError, data } = useGiftCardProducts({
    page: 1,
    size: 200,
    countryCode: page.countryCode,
    enabled,
  });
  const products = data?.content ?? page.products;
  const normalizedSearch = page.search.trim().toLowerCase();
  const visible = products.filter((product) =>
    (product.global || !product.country?.isoName || product.country.isoName === page.countryCode) &&
    (!normalizedSearch || (product.productName ?? product.brand?.brandName ?? "").toLowerCase().includes(normalizedSearch)),
  );
  const categories = page.categories;
  const loadingMessage = !enabled
    ? "The live gift-card catalog is not configured."
    : isLoading
      ? "Loading live gift cards…"
      : isError
        ? "Gift cards could not be loaded right now."
        : "";

  const shelf = (category: ReloadlyCategory, productsForCategory: ReloadlyProduct[]) => {
    if (!productsForCategory.length) return null;
    const slug = slugFor(category.name, category.id);
    const [background, foreground] = categoryPalette[slug.split("-")[0]] ?? ["#263d3a", "#fff"];
    return (
      <section className="g-shelf" id={`s-${slug}`} key={category.id}>
        <div className="g-sh">
          <h2>{category.name}</h2><small>{productsForCategory.length} {productsForCategory.length === 1 ? "card" : "cards"}</small><span className="sp" />
          <button className="lk" type="button" onClick={() => page.browseCategory(category, "All Gift Cards")}>See all</button>
        </div>
        <div className="g-rail"><div className="g-trk">
          {productsForCategory.map((product) => {
            const id = String(product.productId);
            const title = product.productName || product.brand?.brandName || "Gift card";
            return (
              <button className="t" type="button" data-id={id} key={id} onClick={() => navigate(`/gift-cards/${encodeURIComponent(id)}`)} data-testid={`card-gift-${id}`}>
                <span className={`cd ${background === "#141414" || background === "#1b2838" ? "" : "lt"}`} style={{ background, color: foreground }}>
                  <span className="nm">{title}</span><span className="ro"><span className="ch" /><span className="vl">{giftRange(product)}</span></span>
                </span>
                <span className="tm"><b>{title}</b><span>from <em>{giftRange(product).replace(/^From\s*/, "")}</em></span></span>
              </button>
            );
          })}
        </div></div>
      </section>
    );
  };

  const shownCategories = categories.map((category) => ({
    category,
    products: visible.filter((product) => product.category?.id === category.id),
  })).filter((row) => row.products.length);

  return (
    <>
      {loadingMessage ? <div className="g-empty" role={isError ? "alert" : "status"}>{loadingMessage}</div> : null}
      {!loadingMessage && visible.length === 0 && <div className="g-empty" role="status">{normalizedSearch ? "No live gift cards match your search." : "No gift cards are available for this country yet."}</div>}
      {shownCategories.map(({ category, products: categoryProducts }) => shelf(category, categoryProducts))}
      {!loadingMessage && shownCategories.length === 0 && visible.length > 0 && shelf(
        { id: 0, name: "Gift cards" } as ReloadlyCategory,
        visible,
      )}
      {categories.length > 5 && (
        <div id="g-more">
          <div className="g-sh" style={{ paddingTop: 44 }}><h2>More categories</h2></div>
          {shownCategories.slice(5).map(({ category, products: categoryProducts }) => shelf(category, categoryProducts))}
        </div>
      )}
    </>
  );
}
