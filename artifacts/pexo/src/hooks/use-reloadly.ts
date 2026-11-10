import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { hasGiftCardDenominationRange } from "@/lib/gift-card-denominations";

export interface ReloadlyProduct {
  productId: number;
  productName: string;
  global?: boolean;
  status?: string;
  brand: { brandId: number; brandName: string };
  country: { isoName: string; name: string; flagUrl: string };
  category: { id: number; name: string };

  recipientCurrencyCode: string;
  senderCurrencyCode: string;
  recipientCurrencyToSenderCurrencyExchangeRate: number | null;

  denominationType: "FIXED" | "RANGE" | string;
  fixedRecipientDenominations: number[] | null;
  minRecipientDenomination: number | null;
  maxRecipientDenomination: number | null;
  fixedSenderDenominations: number[] | null;
  minSenderDenomination: number | null;
  maxSenderDenomination: number | null;
  fixedRecipientToSenderDenominationsMap: Record<string, number>[] | null;

  senderFee: number;
  senderFeePercentage: number;
  discountPercentage: number;
  logoUrls: string[];
  redeemInstruction: { concise: string; verbose: string };
}

export interface ProductsResponse {
  content: ReloadlyProduct[];
  totalElements: number;
  totalPages: number;
  pageable: { pageNumber: number; pageSize: number };
}

const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

async function authHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
  return {
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };
}

export function useGiftCardProducts(params: {
  page?: number;
  size?: number;
  countryCode?: string;
  productName?: string;
  categoryId?: number;
  enabled?: boolean;
}) {
  const { enabled = true, ...requestParams } = params;

  return useQuery<ProductsResponse>({
    queryKey: ["gift-card-products", requestParams],
    enabled,
    queryFn: async () => {
      const url = new URL(`${FUNCTIONS_BASE}/reloadly-products`);
      url.searchParams.set("page", String(requestParams.page || 1));
      url.searchParams.set("size", String(requestParams.size || 20));
      if (requestParams.countryCode) url.searchParams.set("countryCode", requestParams.countryCode);
      if (requestParams.productName) url.searchParams.set("productName", requestParams.productName);
      if (requestParams.categoryId) url.searchParams.set("categoryId", String(requestParams.categoryId));

      const res = await fetch(url.toString(), { headers: await authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
}

/**
 * Fetch one gift-card product directly from Reloadly.
 *
 * Checkout uses this instead of the cached product list so the selected
 * denomination is validated against Reloadly immediately before ordering.
 */
export async function fetchGiftCardProductFromReloadly(productId: string): Promise<ReloadlyProduct> {
  const url = new URL(`${FUNCTIONS_BASE}/reloadly-products`);
  url.searchParams.set("productId", String(productId));
  url.searchParams.set("_t", String(Date.now()));

  const res = await fetch(url.toString(), {
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to refresh gift card ${productId} from Reloadly`);

  const data = await res.json();
  const match = (p: ReloadlyProduct) => String(p.productId) === String(productId);
  const product = Array.isArray(data)
    ? (data as ReloadlyProduct[]).find(match)
    : Array.isArray(data?.content)
      ? (data.content as ReloadlyProduct[]).find(match)
      : String(data?.productId) === String(productId)
        ? (data as ReloadlyProduct)
        : undefined;

  if (!product) throw new Error(`Reloadly returned no product for ${productId}`);
  if (!hasGiftCardDenominationRange(product)) {
    throw new Error(`Reloadly returned no valid denominations for gift card ${productId}`);
  }
  return product;
}

export function useGiftCardProduct(productId: string | undefined) {
  return useQuery<ReloadlyProduct>({
    queryKey: ["gift-card-product", productId],
    enabled: !!productId,
    queryFn: async () => {
      const headers = await authHeaders();

      const extractProduct = (data: unknown): ReloadlyProduct | undefined => {
        if (!data) return undefined;
        const match = (p: ReloadlyProduct) => String(p.productId) === String(productId);
        if (Array.isArray(data)) return (data as ReloadlyProduct[]).find(match);
        const obj = data as { content?: ReloadlyProduct[]; productId?: number };
        if (Array.isArray(obj.content)) return obj.content.find(match);
        if (String(obj.productId) === String(productId)) return data as ReloadlyProduct;
        return undefined;
      };

      // GET /products/{id} is the ONLY authoritative source for denominations.
      // Never overwrite it with a row scraped from a cached/partial list — that
      // was how stale or mismatched min/max values leaked into the UI.
      const res = await fetch(
        `${FUNCTIONS_BASE}/reloadly-products?productId=${encodeURIComponent(String(productId))}`,
        { headers },
      );
      if (res.ok) {
        const direct = extractProduct(await res.json());
        if (direct) {
          if (!hasGiftCardDenominationRange(direct)) {
            console.warn(
              `[reloadly] product ${productId} returned no recipient denominations`,
              direct,
            );
          }
          return direct;
        }
      }

      // Fallback only when the single-product endpoint returns nothing at all.
      const url = new URL(`${FUNCTIONS_BASE}/reloadly-products`);
      url.searchParams.set("page", "1");
      url.searchParams.set("size", "200");
      const listRes = await fetch(url.toString(), { headers });
      if (!listRes.ok) throw new Error("Failed to fetch product");
      const listData: ProductsResponse = await listRes.json();
      const product = (listData.content ?? []).find(
        (p) => String(p.productId) === String(productId),
      );
      if (product) return product;
      throw new Error("Failed to fetch product");
    },
  });
}

interface OrderParams {
  productId: number;
  /** Face value in the RECIPIENT currency — what Reloadly's /orders expects. */
  unitPrice: number;
  quantity?: number;
  recipientEmail?: string;
  recipientPhone?: string;
}

export function useCreateGiftCardOrder() {
  return useMutation({
    mutationFn: async (params: OrderParams) => {
      const { data, error } = await supabase.functions.invoke("reloadly-order", {
        body: params,
      });
      if (error) throw error;
      return data;
    },
  });
}

export interface ReloadlyCategory {
  id: number;
  name: string;
}

export interface ReloadlyCountry {
  isoName: string;
  name: string;
  flag: string;
}

function isoToFlag(iso: string): string {
  return iso.toUpperCase().replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397));
}

export function useGiftCardCountries(options: { enabled?: boolean } = {}) {
  return useQuery<ReloadlyCountry[]>({
    queryKey: ["gift-card-countries"],
    enabled: options.enabled ?? true,
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const headers = await authHeaders();

      try {
        const res = await fetch(`${FUNCTIONS_BASE}/reloadly-countries`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data
              .filter((c: { isoName?: string; name?: string }) => c.isoName && c.name)
              .map((c: { isoName: string; name: string }) => ({
                isoName: c.isoName,
                name: c.name,
                flag: isoToFlag(c.isoName),
              }))
              .sort((a, b) => a.name.localeCompare(b.name));
          }
        }
      } catch {
        /* fall through */
      }

      const url = new URL(`${FUNCTIONS_BASE}/reloadly-products`);
      url.searchParams.set("page", "1");
      url.searchParams.set("size", "200");
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error("Failed to fetch products for countries");
      const data: ProductsResponse = await res.json();

      const seen = new Map<string, string>();
      for (const p of data.content ?? []) {
        const iso = p.country?.isoName;
        const name = p.country?.name;
        if (iso && name && !seen.has(iso)) seen.set(iso, name);
      }

      return Array.from(seen.entries())
        .map(([isoName, name]) => ({ isoName, name, flag: isoToFlag(isoName) }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}

export function useGiftCardCategories(options: { enabled?: boolean } = {}) {
  return useQuery<ReloadlyCategory[]>({
    queryKey: ["gift-card-categories"],
    enabled: options.enabled ?? true,
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      const headers = await authHeaders();

      try {
        const res = await fetch(`${FUNCTIONS_BASE}/reloadly-categories`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch {
        /* fall through */
      }

      const url = new URL(`${FUNCTIONS_BASE}/reloadly-products`);
      url.searchParams.set("page", "1");
      url.searchParams.set("size", "200");
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error("Failed to fetch products for categories");
      const data: ProductsResponse = await res.json();

      const seen = new Map<number, string>();
      for (const p of data.content ?? []) {
        const id = p.category?.id;
        const name = p.category?.name;
        if (id && name && !seen.has(id)) seen.set(id, name);
      }

      return Array.from(seen.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}
