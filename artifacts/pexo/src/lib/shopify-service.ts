import { toast } from "sonner";
import { getSupabase } from "./supabase";
import { devLog } from "./dev-logger";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    handle: string;
    productType: string;
    tags: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    metafields?: Array<{
      namespace: string;
      key: string;
      value: string;
      type: string;
    } | null>;
  };
}

// Shape produced by parsing the "air_reviews_product.data" metafield (Air Reviews app / CJdropshipping import)
// so it can sit alongside the Supabase `product_reviews` rows in the same UI.
export interface ImportedReview {
  id: string;
  rating: number;
  comment: string;
  displayName: string;
  createdAt: string;
  countryCode?: string;
  images: string[];
  videos: string[];
  // `verifyBuyer` (source field) vs `verified` (source field) are two distinct
  // flags in the raw Air Reviews data — see parseImportedReviews for details.
  verifiedBuyer: boolean;
  verified: boolean;
  source: "imported";
}

const REVIEWS_METAFIELD_NAMESPACE = "air_reviews_product";
const REVIEWS_METAFIELD_KEY = "data";

function parseImportedReviews(
  metafields?: Array<{ namespace: string; key: string; value: string; type: string } | null> | null
): ImportedReview[] {
  if (!metafields) return [];

  const metafield = metafields.find(
    (m) => m && m.namespace === REVIEWS_METAFIELD_NAMESPACE && m.key === REVIEWS_METAFIELD_KEY
  );
  if (!metafield?.value) return [];

  try {
    const parsed = JSON.parse(metafield.value);
    const rawReviews: any[] = Array.isArray(parsed?.reviews) ? parsed.reviews : [];

    return rawReviews
      .filter((r) => r?.status === "approved")
      .map((r) => ({
        id: String(r.id),
        rating: Number(r.rate) || 0,
        comment: typeof r.content === "string" ? r.content : "",
        displayName: r.firstName || "Verified shopper",
        createdAt: r.createdAt,
        countryCode: typeof r.countryCode === "string" ? r.countryCode.toUpperCase() : undefined,
        images: Array.isArray(r.images) ? r.images.filter((u: unknown) => typeof u === "string") : [],
        videos: Array.isArray(r.videos) ? r.videos.filter((u: unknown) => typeof u === "string") : [],
        // `verifyBuyer`: whether Air Reviews matched this reviewer to an actual
        // store purchase. `verified`: the review's own approval/verification
        // flag from the source (CJDropshipping) side. They're independent —
        // keep both rather than collapsing into one boolean.
        verifiedBuyer: Boolean(r.verifyBuyer),
        verified: Boolean(r.verified),
        source: "imported" as const,
      }));
  } catch (e) {
    devLog.error("Failed to parse air_reviews_product.data metafield:", e);
    return [];
  }
}

// Query name constants matching server-side allowlist
export const PRODUCTS_QUERY = 'getProducts';
export const PRODUCT_BY_HANDLE_QUERY = 'getProductByHandle';
export const PRODUCT_TYPES_QUERY = 'getProductTypes';
export const COLLECTIONS_QUERY = 'getCollections';
export const COLLECTION_BY_HANDLE_QUERY = 'getCollectionByHandle';
export const COLLECTION_PRODUCT_TYPES_QUERY = 'getCollectionProductTypes';
export const CART_QUERY = 'cartQuery';
export const CART_CREATE_MUTATION = 'cartCreate';
export const CART_LINES_ADD_MUTATION = 'cartLinesAdd';
export const CART_LINES_UPDATE_MUTATION = 'cartLinesUpdate';
export const CART_LINES_REMOVE_MUTATION = 'cartLinesRemove';
export const CART_BUYER_IDENTITY_UPDATE_MUTATION = 'cartBuyerIdentityUpdate';

// Selected market/country (ISO 3166-1 alpha-2). Product/collection queries
// pick this up via @inContext(country:) (see storefrontApiRequest below).
// Shopify does NOT auto-detect market from IP — without this being set
// explicitly (e.g. from a country switcher), every request resolves to the
// store's primary market regardless of who's visiting.
const MARKET_COUNTRY_STORAGE_KEY = 'pexly_market_country';

// Fired whenever the market changes (manual selection or IP detection).
// Any page/component can listen instead of forcing a full window.location.reload().
export const MARKET_CHANGED_EVENT = 'pexly:market-changed';

export function getMarketCountry(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const stored = window.localStorage.getItem(MARKET_COUNTRY_STORAGE_KEY);
    return stored && /^[A-Z]{2}$/.test(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}

export function setMarketCountry(countryCode: string) {
  if (typeof window === 'undefined') return;
  const normalized = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return;
  try {
    window.localStorage.setItem(MARKET_COUNTRY_STORAGE_KEY, normalized);
  } catch {
    // localStorage unavailable (e.g. private browsing) — silently no-op,
    // requests just fall back to IP-based market detection.
  }
  window.dispatchEvent(new CustomEvent(MARKET_CHANGED_EVENT, { detail: { countryCode: normalized } }));
}

export async function storefrontApiRequest(queryName: string, variables: Record<string, unknown> = {}) {
  try {
    const supabase = await getSupabase();
    const requestVariables = { country: getMarketCountry(), ...variables };
    const { data, error } = await supabase.functions.invoke('shopify-storefront', {
      body: { queryName, variables: requestVariables }
    });

    if (error) {
      if ((error as any).status === 402) {
        toast.error("Shopify: Payment required", {
          description: "Your store needs an active billing plan. Visit https://admin.shopify.com to upgrade.",
        });
        return;
      }
      const errorMessage = error.message || "Failed to process request";
      devLog.error('Supabase function error:', error);
      throw new Error(errorMessage);
    }

    if (data?.errors) {
      throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    return data;
  } catch (err: any) {
    devLog.error('Storefront API error:', err);
    throw err;
  }
}

export function formatPrice(amount: string | number, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(Number(amount));
}

export function formatCheckoutUrl(checkoutUrl: string): string {
  return checkoutUrl;
}

function isCartNotFoundError(userErrors: Array<{ field: string[] | null; message: string }>): boolean {
  return userErrors.some(e => e.message.toLowerCase().includes('cart not found') || e.message.toLowerCase().includes('does not exist'));
}

export const shopifyService = {
  async getProducts(first: number = 250, after?: string, query?: string) {
    const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, after, query });
    return {
      products: data?.data?.products?.edges || [],
      pageInfo: data?.data?.products?.pageInfo
    };
  },

  async getProductTypes(first: number = 250) {
    const data = await storefrontApiRequest(PRODUCT_TYPES_QUERY, { first });
    const edges = data?.data?.productTypes?.edges || data?.data?.products?.edges || [];
    return edges
      .map((edge: any) => typeof edge.node === 'string' ? edge.node : edge.node?.productType)
      .filter((type: unknown): type is string => typeof type === 'string' && type.trim().length > 0);
  },

  async getCollections(first: number = 50, after?: string) {
    const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first, after });
    return {
      collections: data?.data?.collections?.edges || [],
      pageInfo: data?.data?.collections?.pageInfo,
    };
  },

  async getCollectionProductTypes(handle: string, first: number = 250) {
    const data = await storefrontApiRequest(COLLECTION_PRODUCT_TYPES_QUERY, { handle, first });
    const edges = data?.data?.collectionByHandle?.products?.edges || [];
    const productTypes = new Map<string, Set<string>>();
    for (const edge of edges) {
      const pt: string = edge.node?.productType?.trim() || '';
      const tags: string[] = Array.isArray(edge.node?.tags) ? edge.node.tags : [];
      if (!pt) continue;
      if (!productTypes.has(pt)) productTypes.set(pt, new Set());
      tags.forEach((t: string) => { if (t.trim()) productTypes.get(pt)!.add(t.trim()); });
    }
    return productTypes;
  },

  async getCollectionProducts(handle: string, first: number = 250, after?: string, productType?: string, tag?: string) {
    const data = await storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, {
      handle, first, after,
      ...(productType ? { productType } : {}),
      ...(tag ? { tag } : {}),
    });
    const col = data?.data?.collectionByHandle;
    return {
      collection: col ? { id: col.id, title: col.title, handle: col.handle, description: col.description, image: col.image } : null,
      products: col?.products?.edges || [],
      pageInfo: col?.products?.pageInfo,
    };
  },

  async getProductByHandle(handle: string) {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    const product = data?.data?.productByHandle;
    if (!product) return product;

    // Attach reviews imported via the Air Reviews app metafield so pages can
    // pass them straight into <ReviewSection importedReviews={...} />.
    return {
      ...product,
      importedReviews: parseImportedReviews(product.metafields),
    };
  },

  async getCart(cartId: string) {
    const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
    const cart = data?.data?.cart;
    if (!cart) return null;

    const lines = cart.lines?.edges || [];
    const items = lines.map((edge: any) => {
      const node = edge.node;
      const variant = node.merchandise;
      const product = variant?.product;

      // cost.totalAmount is the Storefront API 2022-01+ field; fall back to variant price
      const costAmount = node.cost?.totalAmount?.amount;
      const costCurrency = node.cost?.totalAmount?.currencyCode;

      return {
        id: node.id,
        variantId: variant?.id || '',
        title: node.title || (product?.title || 'Product') + (variant?.title && variant.title !== 'Default Title' ? ` - ${variant.title}` : ''),
        price: costAmount ? parseFloat(costAmount) : (variant?.price?.amount ? parseFloat(variant.price.amount) : 0),
        currency: costCurrency || variant?.price?.currencyCode || 'USD',
        quantity: node.quantity,
        image: node.image?.url || product?.images?.edges?.[0]?.node?.url || product?.images?.nodes?.[0]?.url || ''
      };
    });

    return {
      id: cart.id,
      totalQuantity: cart.totalQuantity,
      checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
      items
    };
  },

  async createCart(item: { variantId: string; quantity: number }) {
    const country = getMarketCountry();
    const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
      input: {
        lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
        // Cart localization ignores @inContext entirely — it has to be set
        // via buyerIdentity, here or through cartBuyerIdentityUpdate later.
        ...(country ? { buyerIdentity: { countryCode: country } } : {}),
      },
    });

    if (data?.data?.cartCreate?.userErrors?.length > 0) {
      devLog.error('Cart creation failed:', data.data.cartCreate.userErrors);
      return null;
    }

    const cart = data?.data?.cartCreate?.cart;
    if (!cart?.checkoutUrl) return null;

    const lineId = cart.lines?.edges?.[0]?.node?.id;
    if (!lineId) {
      devLog.warn('Cart created but no line ID found in response');
    }

    return { 
      cartId: cart.id, 
      checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), 
      lineId: lineId || cart.id // Fallback to cart ID if line ID is missing
    };
  },

  async addLineToCart(cartId: string, item: { variantId: string; quantity: number }) {
    const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
      cartId,
      lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
    });

    const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
    if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
    if (userErrors.length > 0) return { success: false };

    const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
    const newLine = lines.find((l: any) => l.node.merchandise.id === item.variantId);
    return { success: true, lineId: newLine?.node?.id };
  },

  async updateCartLine(cartId: string, lineId: string, quantity: number) {
    const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
      cartId,
      lines: [{ id: lineId, quantity }],
    });

    const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
    if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
    if (userErrors.length > 0) return { success: false };
    return { success: true };
  },

  async removeLineFromCart(cartId: string, lineId: string) {
    const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
      cartId,
      lineIds: [lineId],
    });

    const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
    if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
    if (userErrors.length > 0) return { success: false };
    return { success: true };
  },

  // Re-localizes an existing cart to a country — needed if a market switcher
  // changes the country AFTER a cart already exists, since the cart's pricing
  // otherwise stays locked to whatever country it was created under.
  async updateCartCountry(cartId: string, countryCode: string) {
    const data = await storefrontApiRequest(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
      cartId,
      buyerIdentity: { countryCode },
    });

    const userErrors = data?.data?.cartBuyerIdentityUpdate?.userErrors || [];
    if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
    if (userErrors.length > 0) return { success: false };
    return { success: true };
  }
};

// Keep legacy named exports for backward compatibility with existing imports
export const createShopifyCart = shopifyService.createCart;
export const addLineToShopifyCart = shopifyService.addLineToCart;
export const updateShopifyCartLine = shopifyService.updateCartLine;
export const removeLineFromShopifyCart = shopifyService.removeLineFromCart;
