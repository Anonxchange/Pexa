/**
 * Reloadly returns TWO denomination sets for every product:
 *
 *  - recipient side: fixedRecipientDenominations / min|maxRecipientDenomination,
 *    expressed in `recipientCurrencyCode`. This is the FACE VALUE of the card and
 *    it is what reloadly.com shows in its catalog (e.g. 100 - 500).
 *  - sender side: fixedSenderDenominations / min|maxSenderDenomination, expressed
 *    in `senderCurrencyCode` (your Reloadly account currency, e.g. EUR). These are
 *    already FX-converted and discount/fee adjusted, so they look nothing like the
 *    face value (e.g. 10 - 90 EUR).
 *
 * The old helper mixed the two (and silently fell back to unrelated `minAmount` /
 * `maxAmount` columns cached in the DB), which is why the UI showed "10-90 EUR"
 * for a card Reloadly lists as 100-500. Always render the face value with the
 * RECIPIENT currency, and the charge with the SENDER currency — never mix them.
 */

export interface GiftCardDenominationFields {
  denominationType?: string | null;
  recipientCurrencyCode?: string | null;
  senderCurrencyCode?: string | null;
  recipientCurrencyToSenderCurrencyExchangeRate?: unknown;

  fixedRecipientDenominations?: readonly unknown[] | null;
  minRecipientDenomination?: unknown;
  maxRecipientDenomination?: unknown;
  /** Reloadly's docs/payloads have historically shipped this lowercase typo. */
  maxrecipientDenomination?: unknown;

  fixedSenderDenominations?: readonly unknown[] | null;
  minSenderDenomination?: unknown;
  maxSenderDenomination?: unknown;

  fixedRecipientToSenderDenominationsMap?: readonly Record<string, unknown>[] | null;
}

export interface GiftCardDenominationRange {
  /** Which side of the transaction these numbers describe. */
  side: "recipient" | "sender";
  /** ISO currency code the numbers below are expressed in. */
  currencyCode: string | null;
  min: number | null;
  max: number | null;
  fixed: number[];
  isFixed: boolean;
}

function toFiniteAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function toSortedAmounts(values: readonly unknown[] | null | undefined): number[] {
  return Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map(toFiniteAmount)
        .filter((amount): amount is number => amount !== null),
    ),
  ).sort((a, b) => a - b);
}

function buildRange(
  side: "recipient" | "sender",
  currencyCode: string | null | undefined,
  fixedValues: readonly unknown[] | null | undefined,
  minValue: unknown,
  maxValue: unknown,
): GiftCardDenominationRange {
  const fixed = toSortedAmounts(fixedValues);

  if (fixed.length > 0) {
    return {
      side,
      currencyCode: currencyCode ?? null,
      min: fixed[0]!,
      max: fixed[fixed.length - 1]!,
      fixed,
      isFixed: true,
    };
  }

  return {
    side,
    currencyCode: currencyCode ?? null,
    min: toFiniteAmount(minValue),
    max: toFiniteAmount(maxValue),
    fixed,
    isFixed: false,
  };
}

/**
 * Face value of the card, in the RECIPIENT currency. This is the number to show
 * the customer as "the card is worth X" and it matches reloadly.com's catalog.
 */
export function getRecipientDenominationRange(
  card: GiftCardDenominationFields | null | undefined,
): GiftCardDenominationRange {
  const fixed = toSortedAmounts(card?.fixedRecipientDenominations);
  const denominationType = String(card?.denominationType ?? "").toUpperCase();
  const min = toFiniteAmount(card?.minRecipientDenomination);
  const max = toFiniteAmount(card?.maxRecipientDenomination ?? card?.maxrecipientDenomination);

  // Reloadly can include fixed values alongside a RANGE product when both
  // includeFixed and includeRange are requested. For RANGE products, the live
  // min/max fields are authoritative; treating the fixed array as the range
  // would incorrectly truncate values (for example, displaying 100 instead
  // of Reloadly's max of 500).
  if (denominationType !== "FIXED" && (denominationType === "RANGE" || min !== null || max !== null)) {
    return buildRange(
      "recipient",
      card?.recipientCurrencyCode,
      null,
      min,
      max,
    );
  }

  return buildRange(
    "recipient",
    card?.recipientCurrencyCode,
    fixed,
    null,
    null,
  );
}

/**
 * What YOU get charged, in the SENDER (account) currency. Use this for pricing,
 * never as the advertised card value.
 */
export function getSenderDenominationRange(
  card: GiftCardDenominationFields | null | undefined,
): GiftCardDenominationRange {
  const range = buildRange(
    "sender",
    card?.senderCurrencyCode,
    card?.fixedSenderDenominations,
    card?.minSenderDenomination,
    card?.maxSenderDenomination,
  );

  if (range.min !== null && range.max !== null) return range;

  // Derive from the recipient side when Reloadly omits the sender numbers.
  const rate = toFiniteAmount(card?.recipientCurrencyToSenderCurrencyExchangeRate);
  if (!rate) return range;

  const recipient = getRecipientDenominationRange(card);
  return {
    side: "sender",
    currencyCode: card?.senderCurrencyCode ?? null,
    min: recipient.min === null ? null : recipient.min * rate,
    max: recipient.max === null ? null : recipient.max * rate,
    fixed: recipient.fixed.map((amount) => amount * rate),
    isFixed: recipient.isFixed,
  };
}

/** Sender-currency price for one specific recipient-currency denomination. */
export function getSenderPriceForRecipientAmount(
  card: GiftCardDenominationFields | null | undefined,
  recipientAmount: number,
): number | null {
  const map = Array.isArray(card?.fixedRecipientToSenderDenominationsMap)
    ? card.fixedRecipientToSenderDenominationsMap
    : [];

  for (const entry of map) {
    for (const [key, value] of Object.entries(entry ?? {})) {
      if (Number(key) === recipientAmount) {
        const price = toFiniteAmount(value);
        if (price !== null) return price;
      }
    }
  }

  const rate = toFiniteAmount(card?.recipientCurrencyToSenderCurrencyExchangeRate);
  return rate ? recipientAmount * rate : null;
}

/** Recover a recipient face value from a previously stored sender-side price. */
export function getRecipientAmountForSenderPrice(
  card: GiftCardDenominationFields | null | undefined,
  senderAmount: number,
): number | null {
  const target = toFiniteAmount(senderAmount);
  if (target === null) return null;

  const map = Array.isArray(card?.fixedRecipientToSenderDenominationsMap)
    ? card.fixedRecipientToSenderDenominationsMap
    : [];

  for (const entry of map) {
    for (const [key, value] of Object.entries(entry ?? {})) {
      const recipient = toFiniteAmount(key);
      const sender = toFiniteAmount(value);
      if (recipient !== null && sender !== null && Math.abs(sender - target) < 0.01) {
        return recipient;
      }
    }
  }

  const rate = toFiniteAmount(card?.recipientCurrencyToSenderCurrencyExchangeRate);
  return rate ? target / rate : null;
}

/**
 * Backwards-compatible default: the RECIPIENT (face value) range.
 * Existing callers keep working, but now get the same numbers Reloadly shows.
 */
export function getGiftCardDenominationRange(
  card: GiftCardDenominationFields | null | undefined,
): GiftCardDenominationRange {
  return getRecipientDenominationRange(card);
}

export function hasGiftCardDenominationRange(card: unknown): boolean {
  const range = getRecipientDenominationRange(card as GiftCardDenominationFields | null);
  return range.min !== null && range.max !== null;
}

export function formatDenominationRange(range: GiftCardDenominationRange): string {
  if (range.min === null || range.max === null) return "—";
  const currency = range.currencyCode ?? "";
  const fmt = (n: number) =>
    currency
      ? new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
          maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
        }).format(n)
      : String(n);
  return range.min === range.max ? fmt(range.min) : `${fmt(range.min)} - ${fmt(range.max)}`;
}
