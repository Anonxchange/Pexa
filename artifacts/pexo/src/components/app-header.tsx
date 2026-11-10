import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Check, Search, ShoppingCart, User } from "@/lib/icons";
import { CartSheet } from "@/components/shop/CartSheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGiftCardCountries } from "@/hooks/use-reloadly";
import {
  initializeMarketCountry,
  MARKET_CHANGED_EVENT,
  setMarketCountry,
  SUPPORTED_MARKETS,
} from "@/lib/market-manager";
import {
  GIFT_CARD_MARKET_CHANGED_EVENT,
  getGiftCardMarketCountry,
  setGiftCardMarketCountry,
} from "@/lib/gift-card-market";
import { isValidLang } from "@/lib/detect-language";
import { switchLanguage } from "@/lib/language-navigation";
import i18n from "@/lib/i18n";
import "./app-header.css";

type CountryScope = "shop" | "gift-card";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ja", label: "日本語" },
  { code: "ru", label: "Русский" },
  { code: "tr", label: "Türkçe" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "yo", label: "Yorùbá" },
  { code: "ha", label: "Hausa" },
];

const marketplace = [
  { title: "Gift Cards", detail: "Shopping, gaming, streaming", href: "/gift-cards" },
  { title: "Mobile Top Up", detail: "Airtime and data, anywhere", href: "/wallet/mobile-topup" },
  { title: "Physical Products", detail: "Electronics, fashion, home", href: "/shop" },
];

const resources = [
  { title: "FAQ", detail: "Answers to common questions", href: "/support" },
  { title: "Blog", detail: "News and guides", href: "/blogs" },
];

function normalizeRoute(path: string) {
  const segments = path.split("?")[0].split("/").filter(Boolean);
  if (segments[0] && (isValidLang(segments[0]) || segments[0] === "jp")) {
    segments.shift();
  }
  return `/${segments.join("/")}` || "/";
}

function flagForCountry(countryCode?: string) {
  if (!countryCode) return "🌍";
  return countryCode
    .toUpperCase()
    .replace(/[A-Z]/g, letter =>
      String.fromCodePoint(letter.charCodeAt(0) + 127397),
    );
}

export function AppHeader() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const routePath = normalizeRoute(location);
  const isHomePage = routePath === "/";
  const isGiftCardsPage = routePath.startsWith("/gift-cards");
  const isGiftCardBrowsePage = routePath === "/gift-cards/browse";
  const isShopPage = routePath === "/shop" || routePath.startsWith("/shop/");
  const giftCountriesQuery = useGiftCardCountries({
    enabled: isHomePage || isGiftCardsPage,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [shopCountry, setShopCountry] = useState(initializeMarketCountry);
  const [giftCardCountry, setGiftCardCountry] = useState(getGiftCardMarketCountry);
  const [homeCountryScope, setHomeCountryScope] = useState<CountryScope>("gift-card");
  const openCartFromUrl = new URLSearchParams(window.location.search).get("openCart") === "1";
  const walletHref = user ? "/wallet" : "/signin?redirect=%2Fwallet";
  const activeCountryScope: CountryScope = isGiftCardsPage
    ? "gift-card"
    : isShopPage
      ? "shop"
      : isHomePage
        ? homeCountryScope
        : "shop";
  const displayedGiftCardCountry =
    giftCardCountry ?? (isGiftCardBrowsePage ? undefined : "NG");
  const activeCountryFlag =
    activeCountryScope === "shop"
      ? flagForCountry(shopCountry)
      : giftCountriesQuery.data?.find(
          country => country.isoName === displayedGiftCardCountry,
        )?.flag ?? flagForCountry(displayedGiftCardCountry);
  const normalizedSearch = countrySearch.trim().toLocaleLowerCase();
  const filteredShopCountries = SUPPORTED_MARKETS.filter(country =>
    `${country.region} ${country.code}`.toLocaleLowerCase().includes(normalizedSearch),
  );
  const filteredGiftCountries = (giftCountriesQuery.data ?? []).filter(country =>
    `${country.name} ${country.isoName}`.toLocaleLowerCase().includes(normalizedSearch),
  );
  const currentLanguage = i18n.language?.split("-")[0] || "en";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const handleShopCountryChange = (event: Event) => {
      const countryCode = (event as CustomEvent<{ countryCode?: string }>).detail?.countryCode;
      if (countryCode) setShopCountry(countryCode);
    };
    const handleGiftCardCountryChange = (event: Event) => {
      const countryCode = (event as CustomEvent<{ countryCode?: string }>).detail?.countryCode;
      setGiftCardCountry(countryCode);
    };

    window.addEventListener(MARKET_CHANGED_EVENT, handleShopCountryChange);
    window.addEventListener(GIFT_CARD_MARKET_CHANGED_EVENT, handleGiftCardCountryChange);
    return () => {
      window.removeEventListener(MARKET_CHANGED_EVENT, handleShopCountryChange);
      window.removeEventListener(GIFT_CARD_MARKET_CHANGED_EVENT, handleGiftCardCountryChange);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
    setCountryOpen(false);
    setCountrySearch("");
  }, [location]);

  useEffect(() => {
    if (!openCartFromUrl) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("openCart");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, [openCartFromUrl]);

  const closeCountryPicker = () => {
    setCountryOpen(false);
    setCountrySearch("");
  };

  const selectShopCountry = (countryCode: string) => {
    setShopCountry(countryCode);
    setMarketCountry(countryCode);
    closeCountryPicker();
  };

  const selectGiftCardCountry = (countryCode?: string) => {
    setGiftCardCountry(countryCode);
    setGiftCardMarketCountry(countryCode);
    closeCountryPicker();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
  };
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    const searchingGiftCards =
      isGiftCardsPage || (isHomePage && activeCountryScope === "gift-card");
    const searchPath = searchingGiftCards ? "/gift-cards/browse" : "/shop";
    const searchParam = searchingGiftCards ? "q" : "search";
    setLocation(query ? `${searchPath}?${searchParam}=${encodeURIComponent(query)}` : searchPath);
    closeMenu();
  };
  const searchLabel =
    isGiftCardsPage || (isHomePage && activeCountryScope === "gift-card")
      ? "Search gift cards"
      : "Search products";

  const dropdown = (name: string, links: typeof marketplace) => (
    <div className={`px-dd${openDropdown === name ? " open" : ""}`} key={name}>
      <button
        className="px-dd-t"
        type="button"
        aria-expanded={openDropdown === name}
        onClick={() => setOpenDropdown(current => current === name ? null : name)}
      >
        {name}<i aria-hidden="true" />
      </button>
      <div className="px-dd-l">
        {links.map(link => (
          <Link key={link.title} href={link.href} onClick={closeMenu}>
            <b>{link.title}</b><small>{link.detail}</small>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <header
      className={`px-nav px-nav-with-tools${isHomePage ? " home-hero-header" : ""}${scrolled ? " scrolled" : ""}`}
      id="pxnav"
    >
      <div className="px-nav-in">
        <button
          className="px-burger"
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setSearchOpen(false);
            setMenuOpen(open => !open);
          }}
        >
          <span /><span /><span />
        </button>
        <Link className="px-logo" href="/" onClick={closeMenu} data-testid="link-home-header">
          <span className="px-logo-mark">p</span><span>pexly</span>
        </Link>
        <nav className={`px-menu${menuOpen ? " open" : ""}`} id="pxmenu" aria-label="Main">
          {dropdown("Marketplace", marketplace)}
          <Link className="px-l" href="/#how-it-works" onClick={closeMenu}>How it works</Link>
          <Link className="px-l" href="/gift-cards" onClick={closeMenu}>Categories</Link>
          {dropdown("Resources", resources)}
          <button
            className="px-menu-search"
            type="button"
            aria-expanded={searchOpen}
            aria-controls="px-mobile-search-panel"
            onClick={() => setSearchOpen(open => !open)}
          >
            <Search aria-hidden="true" />
            <span>{searchLabel}</span>
          </button>
          {searchOpen && (
            <form
              className="px-mobile-search-form"
              id="px-mobile-search-panel"
              role="search"
              aria-label={searchLabel}
              onSubmit={submitSearch}
            >
              <Search aria-hidden="true" />
              <input
                autoFocus
                type="search"
                aria-label={searchLabel}
                placeholder={`${searchLabel}...`}
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
              <button className="px-search-submit" type="submit">Search</button>
            </form>
          )}
          <div className="px-mob-btns">
            <Link className="px-btn ghost" href={walletHref} onClick={closeMenu}>
              {user ? "My Wallet" : "Connect Wallet"}
            </Link>
            <Link className="px-btn solid" href="/gift-cards" onClick={closeMenu}>Start Shopping</Link>
          </div>
        </nav>
        <Popover
          open={countryOpen}
          onOpenChange={open => {
            setCountryOpen(open);
            if (!open) setCountrySearch("");
          }}
        >
          <PopoverTrigger asChild>
            <button
              className="px-country-trigger"
              type="button"
              aria-label="Choose country and language"
              title="Country and language"
            >
              <span className="px-country-flag" aria-hidden="true">{activeCountryFlag}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="px-country-popover" align="end" sideOffset={8}>
            <div className="px-country-heading">
              <strong>Region &amp; language</strong>
              <span>
                {activeCountryScope === "shop" ? "Shop country" : "Gift Cards country"}
              </span>
            </div>
            {isHomePage && (
              <div className="px-country-store-tabs" role="tablist" aria-label="Choose store">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCountryScope === "shop"}
                  className={activeCountryScope === "shop" ? "active" : ""}
                  onClick={() => {
                    setHomeCountryScope("shop");
                    setCountrySearch("");
                  }}
                >
                  Shop
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCountryScope === "gift-card"}
                  className={activeCountryScope === "gift-card" ? "active" : ""}
                  onClick={() => {
                    setHomeCountryScope("gift-card");
                    setCountrySearch("");
                  }}
                >
                  Gift Cards
                </button>
              </div>
            )}
            <div className="px-country-list-section">
              <label className="sr-only" htmlFor="px-country-search">Search countries</label>
              <input
                id="px-country-search"
                className="px-country-search"
                type="search"
                placeholder="Search countries"
                value={countrySearch}
                onChange={event => setCountrySearch(event.target.value)}
              />
              <div className="px-country-options" role="listbox" aria-label="Available countries">
                {activeCountryScope === "shop" ? (
                  filteredShopCountries.length > 0 ? filteredShopCountries.map(country => (
                    <button
                      key={country.code}
                      className="px-country-option"
                      type="button"
                      role="option"
                      aria-selected={shopCountry === country.code}
                      onClick={() => selectShopCountry(country.code)}
                    >
                      <span className="px-country-option-flag" aria-hidden="true">{flagForCountry(country.code)}</span>
                      <span className="px-country-option-name">{country.region}</span>
                      <span className="px-country-option-code">{country.code}</span>
                      {shopCountry === country.code && <Check aria-hidden="true" />}
                    </button>
                  )) : <p className="px-country-empty">No countries match that search.</p>
                ) : (
                  <>
                    {isGiftCardBrowsePage && (
                      <button
                        className="px-country-option"
                        type="button"
                        role="option"
                        aria-selected={!giftCardCountry}
                        onClick={() => selectGiftCardCountry(undefined)}
                      >
                        <span className="px-country-option-flag" aria-hidden="true">🌍</span>
                        <span className="px-country-option-name">All countries</span>
                        {!giftCardCountry && <Check aria-hidden="true" />}
                      </button>
                    )}
                    {giftCountriesQuery.isLoading && (
                      <p className="px-country-empty" role="status">Loading countries…</p>
                    )}
                    {giftCountriesQuery.isError && (
                      <div className="px-country-empty" role="alert">
                        <span>Couldn’t load Gift Cards countries.</span>
                        <button type="button" onClick={() => void giftCountriesQuery.refetch()}>
                          Try again
                        </button>
                      </div>
                    )}
                    {!giftCountriesQuery.isLoading && !giftCountriesQuery.isError && (
                      filteredGiftCountries.length > 0 ? filteredGiftCountries.map(country => (
                        <button
                          key={country.isoName}
                          className="px-country-option"
                          type="button"
                          role="option"
                          aria-selected={displayedGiftCardCountry === country.isoName}
                          onClick={() => selectGiftCardCountry(country.isoName)}
                        >
                          <span className="px-country-option-flag" aria-hidden="true">{country.flag}</span>
                          <span className="px-country-option-name">{country.name}</span>
                          <span className="px-country-option-code">{country.isoName}</span>
                          {displayedGiftCardCountry === country.isoName && <Check aria-hidden="true" />}
                        </button>
                      )) : <p className="px-country-empty">No countries match that search.</p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="px-language-control">
              <label htmlFor="px-header-language">Language</label>
              <select
                id="px-header-language"
                value={currentLanguage}
                onChange={event => switchLanguage(event.target.value)}
              >
                {languages.map(language => (
                  <option key={language.code} value={language.code}>{language.label}</option>
                ))}
              </select>
            </div>
          </PopoverContent>
        </Popover>
        <div className="px-tools" aria-label="Shopping tools">
          <button
            className="px-tool-search"
            type="button"
            aria-label="Search products"
            aria-expanded={searchOpen}
            aria-controls="px-header-search-panel"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(open => !open);
            }}
          >
            <Search aria-hidden="true" />
            <span>Search</span>
          </button>
          <CartSheet
            initiallyOpen={openCartFromUrl}
            renderTrigger={(itemCount) => (
              <button
                className="px-tool-cart"
                type="button"
                aria-label={`Open shop cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              >
                <ShoppingCart aria-hidden="true" />
                <span className="px-tool-cart-count" aria-hidden="true">{itemCount}</span>
              </button>
            )}
          />
        </div>
        {user && (
          <Link className="px-profile-mobile" href="/wallet" aria-label="Your account and wallet">
            <User aria-hidden="true" />
          </Link>
        )}
        <div className="px-right">
          {user ? (
            <Link className="px-profile-link" href="/wallet" aria-label="Your account and wallet">
              <User aria-hidden="true" />
            </Link>
          ) : (
            <Link className="px-btn ghost" href={walletHref}>Connect Wallet</Link>
          )}
          <Link className="px-btn solid" href="/gift-cards">Start Shopping</Link>
        </div>
      </div>
      {searchOpen && (
        <div className="px-search-panel" id="px-header-search-panel">
          <form className="px-search-form" role="search" aria-label={searchLabel} onSubmit={submitSearch}>
            <Search aria-hidden="true" />
            <input
              autoFocus
              type="search"
              aria-label={searchLabel}
              placeholder={`${searchLabel}...`}
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
            />
            <button className="px-search-submit" type="submit">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}
