/**
 * Safe helper to resolve a CJ Dropshipping variant identifier from available sources.
 *
 * The CJ freight edge function accepts BOTH:
 *   - CJ VIDs  (UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
 *   - Shopify SKUs — the edge function resolves SKU → VID via CJ's product API automatically
 *
 * Resolution priority:
 *   1. Variant-level `cj_vid` metafield (most specific; future-proof)
 *   2. Product-level cjVid from Shopify product metafields (current primary source)
 *   3. Variant SKU (the CJ edge function handles SKU→VID lookup, so this is a valid fallback)
 *
 * Returns `undefined` — never an empty string — so callers can use a simple truthiness check.
 * The CJ API must NEVER be called with "", null, or undefined.
 */

export interface CjVidVariantShape {
  metafields?: Array<{ namespace?: string; key: string; value: string } | null> | null;
  sku?: string | null;
}

/**
 * Shopify metafield keys that contain a CJ *variant* VID — the exact value the CJ freight API expects.
 * DO NOT include generic product-level identifiers like "vid" (CJ SPU/product VID).
 * A product VID bypasses the edge function's SKU→variantVID resolution and causes "product not found".
 * Use the Shopify variant SKU instead — the edge function resolves SKU to the correct variant VID.
 */
const CJ_METAFIELD_KEYS = new Set([
  "cj_vid",
  "cj_variant_id",
  "cj_sku",
]);

export function resolveCjVid(
  variant: CjVidVariantShape | null | undefined,
  productCjVid: string | undefined
): string | undefined {
  // 1. Variant-level metafield — most specific, checked first
  if (variant?.metafields) {
    for (const m of variant.metafields) {
      if (
        m &&
        CJ_METAFIELD_KEYS.has(m.key) &&
        typeof m.value === "string" &&
        m.value.trim() &&
        !m.value.startsWith("gid://shopify/")
      ) {
        return m.value.trim();
      }
    }
  }

  // 2. Product-level cjVid already resolved from Shopify product metafields
  if (productCjVid && productCjVid.trim()) {
    return productCjVid.trim();
  }

  // 3. Variant SKU — the CJ edge function can resolve SKU → VID automatically,
  //    so any non-empty SKU is a valid input to send to the freight API.
  const sku = variant?.sku;
  if (sku && sku.trim()) {
    return sku.trim();
  }

  return undefined;
}

/**
 * Returns true if the value is a valid, non-empty identifier that can be sent to the CJ freight API.
 * Guards against "", null, and undefined reaching the API.
 */
export function isValidCjVid(vid: string | undefined | null): vid is string {
  return typeof vid === "string" && vid.trim().length > 0;
}
