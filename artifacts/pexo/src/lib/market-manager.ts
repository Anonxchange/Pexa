import { useEffect } from "react";
import { getCountryCode } from "@/lib/geo";
import { getMarketCountry, setMarketCountry, MARKET_CHANGED_EVENT } from "@/lib/shopify-service";

export interface MarketCountry {
  code: string;
  region: string;
}

// Shopify's CountryCode input uses ISO 3166-1 alpha-2 country codes. Keep the
// complete list here so a visitor is not silently changed to US just because
// their country was missing from the old four-country market selector.
const SHOPIFY_COUNTRY_CODES = `
  AD AE AF AG AI AL AM AO AQ AS AT AU AW AX AZ
  BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
  CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
  DE DJ DK DM DO DZ
  EC EE EG EH ER ES ET
  FI FJ FK FM FO FR
  GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
  HK HM HN HR HT HU
  ID IE IL IM IN IO IQ IR IS IT
  JE JM JO JP
  KE KG KH KI KM KN KP KR KW KY KZ
  LA LB LC LI LK LR LS LT LU LV LY
  MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
  NA NC NE NF NG NI NL NO NP NR NU NZ
  OM
  PA PE PF PG PH PK PL PM PN PR PS PT PW PY
  QA
  RE RO RS RU RW
  SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
  TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
  UA UG UM US UY UZ
  VA VC VE VG VI VN VU
  WF WS
  YE YT
  ZA ZM ZW
`.trim().split(/\s+/);

function countryCodeToName(code: string): string {
  try {
    const DisplayNames = (Intl as any).DisplayNames;
    if (DisplayNames) {
      return new DisplayNames(["en"], { type: "region" }).of(code) || code;
    }
  } catch {
    // Older browsers can still use the country code and flag.
  }
  return code;
}

export const SUPPORTED_MARKETS: MarketCountry[] = SHOPIFY_COUNTRY_CODES.map((code) => ({
  code,
  region: countryCodeToName(code),
}));

const SUPPORTED_CODES = new Set(SUPPORTED_MARKETS.map((m) => m.code));

export function isSupportedCountry(code: string | null | undefined): code is string {
  return !!code && SUPPORTED_CODES.has(code);
}

export function getMarketConfig(code: string): MarketCountry | undefined {
  return SUPPORTED_MARKETS.find((m) => m.code === code);
}

/** Country to use on first render, before any async geo lookup resolves. */
export function initializeMarketCountry(): string {
  const saved = getMarketCountry();
  if (isSupportedCountry(saved)) return saved;
  return "US";
}

/**
 * IP-based detection. Never overrides a country the user already picked
 * manually. Returns the resolved code only when it actually changed
 * something (so callers know whether a reload/refetch is needed).
 */
export async function detectAndSetMarketCountry(): Promise<string | null> {
  const saved = getMarketCountry();
  if (saved && isSupportedCountry(saved)) return null;

  const detected = (await getCountryCode()).toUpperCase();
  const resolved = isSupportedCountry(detected) ? detected : "US";
  setMarketCountry(resolved);
  return resolved;
}

// Re-exported so components only ever need to import from one place.
export { getMarketCountry, setMarketCountry, MARKET_CHANGED_EVENT };

/**
 * Lets a page/component refetch its own data when the market changes,
 * instead of the whole app doing a hard window.location.reload(). Usage:
 *   useMarketChangeListener(() => fetchShopifyProducts());
 */
export function useMarketChangeListener(onChange: (countryCode: string) => void) {
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ countryCode: string }>).detail;
      onChange(detail.countryCode);
    }
    window.addEventListener(MARKET_CHANGED_EVENT, handler);
    return () => window.removeEventListener(MARKET_CHANGED_EVENT, handler);
  }, [onChange]);
}
