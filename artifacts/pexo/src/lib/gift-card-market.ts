const GIFT_CARD_COUNTRY_STORAGE_KEY = "pexly_gift_card_country";
export const GIFT_CARD_MARKET_CHANGED_EVENT = "pexly:gift-card-market-changed";

export function getGiftCardMarketCountry(): string | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const countryCode = window.localStorage
      .getItem(GIFT_CARD_COUNTRY_STORAGE_KEY)
      ?.trim()
      .toUpperCase();
    return countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : undefined;
  } catch {
    return undefined;
  }
}

export function setGiftCardMarketCountry(countryCode: string | undefined) {
  if (typeof window === "undefined") return;

  const normalized = countryCode?.trim().toUpperCase();
  if (normalized && !/^[A-Z]{2}$/.test(normalized)) return;

  try {
    if (normalized) {
      window.localStorage.setItem(GIFT_CARD_COUNTRY_STORAGE_KEY, normalized);
    } else {
      window.localStorage.removeItem(GIFT_CARD_COUNTRY_STORAGE_KEY);
    }
  } catch {
    // Continue for this session if browser storage is unavailable.
  }

  window.dispatchEvent(
    new CustomEvent(GIFT_CARD_MARKET_CHANGED_EVENT, {
      detail: { countryCode: normalized },
    }),
  );
}
