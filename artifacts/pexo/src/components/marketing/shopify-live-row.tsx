import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-shopify-cart";
import { isSupabaseConfigured } from "@/lib/supabase";
import { shopifyService } from "@/lib/shopify-service";
import { useMarketChangeListener } from "@/lib/market-manager";

type Product = {
  id: string;
  handle: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  variantId: string;
  tags: string[];
};

type Props = { sectionTitle: string; rowId: string; rowClass: string };

export function ShopifyLiveRow({ sectionTitle, rowId, rowClass }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "unavailable">(
    isSupabaseConfigured() ? "loading" : "unavailable",
  );
  const [filter, setFilter] = useState("all");
  const [shuffle, setShuffle] = useState(0);
  const [busyId, setBusyId] = useState("");
  const { addToCart } = useCart();
  const [, navigate] = useLocation();

  const load = useCallback(() => {
    if (!isSupabaseConfigured()) {
      setStatus("unavailable");
      return;
    }
    setStatus("loading");
    shopifyService.getProducts(250).then((result) => {
      const byId = new Map<string, Product>();
      (result.products || []).forEach((edge: any) => {
        const product = edge?.node;
        const variant = product?.variants?.edges?.find((entry: any) =>
          entry?.node?.availableForSale && typeof entry.node.id === "string",
        )?.node;
        const amount = Number(variant?.price?.amount ?? product?.priceRange?.minVariantPrice?.amount);
        const image = product?.images?.edges?.[0]?.node?.url;
        if (!product?.id || !product?.handle || !product?.title || !variant?.id ||
            !Number.isFinite(amount) || !variant?.price?.currencyCode) return;
        byId.set(product.id, {
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: amount,
          currency: variant.price.currencyCode,
          image: typeof image === "string" ? image : "",
          variantId: variant.id,
          tags: Array.isArray(product.tags) ? product.tags.map((tag: unknown) => String(tag).toLowerCase()) : [],
        });
      });
      setProducts(Array.from(byId.values()));
      setStatus("ready");
    }).catch(() => setStatus("error"));
  }, []);

  useEffect(() => { load(); }, [load]);
  useMarketChangeListener(load);

  useEffect(() => {
    if (rowId !== "sprow") return;
    const onFilter = (event: Event) => setFilter((event as CustomEvent<string>).detail || "all");
    window.addEventListener("pexly-shop-filter", onFilter);
    return () => window.removeEventListener("pexly-shop-filter", onFilter);
  }, [rowId]);

  useEffect(() => {
    if (rowId !== "hotrow") return;
    const onShuffle = () => setShuffle((value) => value + 1);
    window.addEventListener("pexly-shop-shuffle", onShuffle);
    return () => window.removeEventListener("pexly-shop-shuffle", onShuffle);
  }, [rowId]);

  const visibleProducts = useMemo(() => {
    let selected = products;
    if (sectionTitle.toLowerCase().includes("under $25")) selected = selected.filter((product) => product.price < 25);
    if (filter === "under50") selected = selected.filter((product) => product.price < 50);
    if (filter === "popular") selected = selected.filter((product) => product.tags.some((tag) => tag.includes("popular") || tag.includes("best")));
    if (filter === "fast") selected = selected.filter((product) => product.tags.some((tag) => tag.includes("fast") || tag.includes("ship")));
    if (filter === "new") selected = selected.filter((product) => product.tags.some((tag) => tag.includes("new")));
    if (rowId === "hotrow" && selected.length > 1) {
      const offset = shuffle % selected.length;
      selected = [...selected.slice(offset), ...selected.slice(0, offset)];
    }
    return selected.slice(0, sectionTitle === "Picked just for you" ? 6 : 8);
  }, [filter, products, rowId, sectionTitle, shuffle]);

  const openProduct = (product: Product) => navigate(`/shop/product/${encodeURIComponent(product.handle)}`);
  const addProduct = async (product: Product) => {
    setBusyId(product.id);
    try {
      await addToCart(product.variantId, {
        variantId: product.variantId,
        title: product.title,
        price: product.price,
        currency: product.currency,
        image: product.image,
        availableForSale: true,
      });
    } finally {
      setBusyId("");
    }
  };

  return (
    <div id={rowId || undefined} className={rowClass} aria-live="polite">
      {status === "loading" && <div className="sp-live-state" role="status">Loading products from Shopify…</div>}
      {status === "unavailable" && <div className="sp-live-state" role="status">The live product catalog is not configured.</div>}
      {status === "error" && (
        <div className="sp-live-state" role="alert">
          Products could not be loaded. <button type="button" onClick={load}>Try again</button>
        </div>
      )}
      {status === "ready" && visibleProducts.map((product) => (
        <article
          className={`sp-card${sectionTitle === "Picked just for you" ? " big" : ""}`}
          key={product.id}
          data-shopify-product={product.id}
          onClick={() => openProduct(product)}
          onKeyDown={(event) => { if (event.key === "Enter") openProduct(product); }}
          role="link"
          tabIndex={0}
          data-testid={`card-shop-product-${product.id}`}
        >
          <div className="sp-img">
            <div className="sp-pr">
              {product.image ? <img src={product.image} alt={product.title} loading="lazy" decoding="async" /> : <span className="sp-product-mark">{product.title.slice(0, 1)}</span>}
            </div>
            <button
              className="sp-plus"
              type="button"
              aria-label={`Add ${product.title} to cart`}
              disabled={busyId === product.id}
              data-testid={`button-add-shop-product-${product.id}`}
              onClick={(event) => {
                event.stopPropagation();
                void addProduct(product);
              }}
            >{busyId === product.id ? "…" : "+"}</button>
          </div>
          <h3>{product.title}</h3>
          <p className="sp-price"><b>{new Intl.NumberFormat(undefined, { style: "currency", currency: product.currency }).format(product.price)}</b></p>
        </article>
      ))}
      {status === "ready" && visibleProducts.length === 0 && (
        <div className="sp-live-state" role="status">No live products match this section yet.</div>
      )}
    </div>
  );
}
