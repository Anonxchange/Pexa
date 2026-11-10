// checkout-config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central place for all checkout fee settings.
// Change values here — they take effect everywhere automatically
// (cart sheet, product page, checkout summary).
// ─────────────────────────────────────────────────────────────────────────────

// Gift card service fee
export const GIFT_CARD_FEE_RATE = 0.065; // 6.5% — change this to adjust the %
export const GIFT_CARD_FEE_FLAT = 0;     // No flat fee

// Top-up / airtime service fee
export const TOPUP_FEE_RATE = 0.03;       // 3%
export const TOPUP_FEE_FLAT = 0.99;       // $0.99 flat

// Utility bill service fee
export const UTILITY_FEE_RATE = 0.03;     // 3%
export const UTILITY_FEE_FLAT = 0.99;     // $0.99 flat

// Virtual number service fee (crypto only)
export const VIRTUAL_NUMBER_FEE_RATE = 0.05;  // 5%
export const VIRTUAL_NUMBER_FEE_FLAT = 0.99;  // $0.99 flat

/** Returns the service fee for a gift card order given a USD subtotal. */
export function calcGiftCardFee(subtotalUsd: number): number {
  return subtotalUsd * GIFT_CARD_FEE_RATE + GIFT_CARD_FEE_FLAT;
}

/** Returns the service fee for a top-up order given a USD subtotal. */
export function calcTopupFee(subtotalUsd: number): number {
  return subtotalUsd * TOPUP_FEE_RATE + TOPUP_FEE_FLAT;
}

/** Returns the service fee for a utility order given a USD subtotal. */
export function calcUtilityFee(subtotalUsd: number): number {
  return subtotalUsd * UTILITY_FEE_RATE + UTILITY_FEE_FLAT;
}

/** Returns the service fee for a virtual number order given a USD subtotal. */
export function calcVirtualNumberFee(subtotalUsd: number): number {
  return subtotalUsd * VIRTUAL_NUMBER_FEE_RATE + VIRTUAL_NUMBER_FEE_FLAT;
}

/** Generic dispatcher — picks the right calculator by order type. */
export function calcServiceFee(
  subtotalUsd: number,
  orderType: "giftcard" | "topup" | "utility" | "virtual-number" | string
): number {
  switch (orderType) {
    case "giftcard":        return calcGiftCardFee(subtotalUsd);
    case "topup":           return calcTopupFee(subtotalUsd);
    case "utility":         return calcUtilityFee(subtotalUsd);
    case "virtual-number":  return calcVirtualNumberFee(subtotalUsd);
    default:                return 0;
  }
}
