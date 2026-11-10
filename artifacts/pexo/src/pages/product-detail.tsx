import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { useParams, useLocation } from "wouter";
import { useHead } from "@unhead/react";
import { useSchema, createProductSchema } from "@/hooks/use-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import parse, { domToReact } from "html-react-parser";
import { 
  ShoppingCart, 
  Star, 
  Package, 
  Store, 
  Loader2,
  Share2,
  Heart,
  PlayCircle,
  Flag,
  Minus,
  Plus,
  ChevronRight,
} from '@/lib/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSupabase } from "@/lib/supabase";
import { MARKET_CHANGED_EVENT, shopifyService } from "@/lib/shopify-service";
import type { ImportedReview } from "@/lib/shopify-service";
import { devLog } from "@/lib/dev-logger";
import { resolveCjVid } from "@/lib/cj-vid";
import { useCart } from "@/hooks/use-shopify-cart";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { CartSheet } from "@/components/shop/CartSheet";
import { ShippingEstimator } from "@/components/shop/ShippingEstimator";
import { ReviewSection } from "@/components/shop/ReviewSection";
import { ShopItemCard } from "@/components/shop/ShopItemCard";
import type { ShippingInfo } from "@/components/shop/shipping-types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/** Strip <img> tags, CJ boilerplate, and any fixed-width/nowrap styling that
 *  breaks mobile layout. CJ/Alibaba scraped description HTML frequently
 *  contains things like <table width="800"> or
 *  style="width:800px;white-space:nowrap". A single such element, anywhere
 *  inside the description, is wider than the phone screen and has nothing
 *  constraining it — so the mobile browser widens its layout viewport to
 *  fit it and zooms the ENTIRE page out to compensate (not just the
 *  description block). Stripping fixed widths/nowrap here, at the source,
 *  prevents that regardless of what markup a given listing happens to ship.
 *  This is plain string/regex sanitization — no eval, no dynamic <style> or
 *  <script> injection — so it's safe under a strict CSP. */
function stripImgTags(html: string): string {
  return html
    // Remove all img tags
    .replace(/<img\b[^>]*\/?>/gi, '')
    // Remove standalone "Product Image:" label paragraphs (CJ/Alibaba boilerplate)
    .replace(/<(p|div|span)[^>]*>\s*(?:<(?:strong|b|em|u)[^>]*>)?\s*Product\s+Image\s*:?\s*(?:<\/(?:strong|b|em|u)>)?\s*<\/\1>/gi, '')
    // Collapse 3+ consecutive <br> tags into two
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br /><br />')
    // Collapse 3+ consecutive empty <p> tags into one
    .replace(/(<p[^>]*>\s*<\/p>\s*){3,}/gi, '<p></p>')
    // Strip HTML width/height attributes (e.g. <table width="800">, <td width="200">)
    .replace(/\s(?:width|height)=["']?\d+(?:px)?["']?/gi, '')
    // Strip fixed pixel width/min-width/height declarations from inline styles
    .replace(/\b(?:min-)?(?:width|height)\s*:\s*\d+(?:px|pt)\s*;?/gi, '')
    // Strip white-space:nowrap, which keeps long text/table rows from wrapping
    .replace(/white-space\s*:\s*nowrap\s*;?/gi, '');
}

/* ────────────────────────────────────────────────────────────────────────
 * Description / Specifications sections (Shop-app style)
 *
 * Scraped listings (CJ / AliExpress) ship specs either as an HTML <table> or
 * as plain "Label: Value" lines mixed into the description. splitSpecs()
 * pulls those out so they can render as their own collapsible
 * "Specifications" section, leaving the rest as the "Description".
 * ──────────────────────────────────────────────────────────────────────── */
interface SpecRow {
  label: string;
  value: string;
}

function htmlToText(html: string): string {
  if (typeof DOMParser === "undefined") return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

const SPEC_LINE_RE = /^([^:：]{2,40}?)\s*[:：]\s*(.+)$/;
const SPEC_HEADING_RE = /^(product\s+)?specifications?\s*:?$/i;

function isSpecLine(text: string): SpecRow | null {
  const m = SPEC_LINE_RE.exec(text);
  if (!m) return null;
  const label = m[1].trim();
  const value = m[2].trim();
  if (!label || !value) return null;
  if (/https?|www\./i.test(label)) return null; // "Note: see http://..." etc.
  if (label.split(/\s+/).length > 6) return null; // a sentence, not a label
  if (value.length > 300) return null;
  return { label, value };
}

function splitSpecs(html: string): { descriptionHtml: string; specs: SpecRow[] } {
  if (!html || typeof DOMParser === "undefined") return { descriptionHtml: html || "", specs: [] };

  const specs: SpecRow[] = [];

  // 1) Real tables: every row with a label cell + value cell becomes a spec.
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.body.querySelectorAll("table").forEach((table) => {
    const rows: SpecRow[] = [];
    table.querySelectorAll("tr").forEach((tr) => {
      const cells = Array.from(tr.children).filter((c) => /^(td|th)$/i.test(c.tagName));
      if (cells.length < 2) return;
      const label = (cells[0].textContent || "").replace(/\s+/g, " ").trim().replace(/[:：]\s*$/, "");
      const value = cells.slice(1).map((c) => (c.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean).join(" ");
      if (label && value) rows.push({ label, value });
    });
    if (rows.length >= 1) {
      specs.push(...rows);
      table.remove();
    } else if (!(table.textContent || "").trim()) {
      table.remove(); // empty table — would otherwise render as a blank box
    }
  });
  let working = doc.body.innerHTML;

  // 2) "Label: Value" lines. Split into segments at block/line boundaries,
  //    then treat any run of 3+ consecutive matching segments as a spec list.
  const tokens = working.split(/(<br\s*\/?>|<\/?(?:p|li|div|h[1-6]|ul|ol|tr|td|th)\b[^>]*>|\r?\n)/i);
  const segInfo: { idx: number; text: string; spec: SpecRow | null }[] = [];
  for (let i = 0; i < tokens.length; i += 2) {
    const text = htmlToText(tokens[i]);
    segInfo.push({ idx: i, text, spec: text ? isSpecLine(text) : null });
  }

  const removeIdx = new Set<number>();
  let run: typeof segInfo = [];
  const flush = () => {
    if (run.length >= 3) {
      run.forEach((r) => {
        specs.push(r.spec as SpecRow);
        removeIdx.add(r.idx);
      });
    }
    run = [];
  };
  for (const seg of segInfo) {
    if (!seg.text) continue; // blank segments don't break a run
    if (seg.spec) run.push(seg);
    else flush();
  }
  flush();

  // Drop a leftover "SPECIFICATIONS" heading once we've extracted specs.
  if (specs.length > 0) {
    segInfo.forEach((seg) => {
      if (SPEC_HEADING_RE.test(seg.text)) removeIdx.add(seg.idx);
    });
  }

  removeIdx.forEach((i) => { tokens[i] = ""; });
  working = tokens.join("");

  // Tidy up the empty wrappers / stray breaks the removals leave behind.
  for (let pass = 0; pass < 3; pass += 1) {
    working = working.replace(/<(p|div|li|span|strong|b|em|u|ul|ol|h[1-6])\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "");
  }
  working = working.replace(/(<br\s*\/?>\s*){2,}/gi, "<br />").trim();

  return { descriptionHtml: working, specs };
}

/** Fallback for tables we could not read as label/value rows. */
const descriptionParseOptions = {
  replace: (domNode: any) => {
    if (domNode.type === "tag" && domNode.name === "table") {
      return (
        <div className="not-prose my-3 overflow-x-auto">
          <table className="w-full table-fixed border-collapse [&_td]:whitespace-normal [&_td]:break-words [&_td]:py-2 [&_td]:pr-3 [&_td]:align-top [&_tr]:border-b [&_tr]:border-border/60">
            {domToReact(domNode.children as any, descriptionParseOptions)}
          </table>
        </div>
      );
    }
  },
};

/** Collapses tall content to a fixed height with a transparent fade at the
 *  bottom and a "View All" / "View Less" button (AliExpress style). The
 *  button only appears when the content actually overflows. */
function FadeCollapse({
  children,
  tall = false,
}: {
  children: ReactNode;
  tall?: boolean;
}) {
  // Static Tailwind classes only (no inline style attributes) so this works
  // under a strict style-src CSP. max-h-56 = 224px, max-h-72 = 288px.
  const collapsedHeight = tall ? 288 : 224;
  const collapsedClass = tall ? "max-h-72" : "max-h-56";
  const innerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setOverflowing(el.scrollHeight > collapsedHeight + 24);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsedHeight, children]);

  const collapsed = overflowing && !expanded;

  return (
    <div>
      <div
        className={`relative overflow-hidden ${collapsed ? collapsedClass : ""}`}
      >
        <div ref={innerRef}>{children}</div>
        {collapsed && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent"
          />
        )}
        {collapsed && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="absolute inset-x-0 bottom-0 py-2 text-center text-sm font-semibold text-blue-600 dark:text-blue-400"
          >
            View All
          </button>
        )}
      </div>
      {overflowing && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-2 w-full py-2 text-center text-sm font-semibold text-blue-600 dark:text-blue-400"
        >
          View Less
        </button>
      )}
    </div>
  );
}

function InfoSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-border/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-lg font-bold text-foreground">{title}</span>
        <ChevronRight
          className={`h-5 w-5 text-foreground transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function ProductInfoSections({ html }: { html?: string }) {
  const { descriptionHtml, specs } = useMemo(() => splitSpecs(stripImgTags(html || "")), [html]);
  const hasDescription = useMemo(() => htmlToText(descriptionHtml).length > 0, [descriptionHtml]);
  const hasSpecs = specs.length > 0;

  // Both sections are open by default; long content is trimmed by FadeCollapse.
  const [descOpen, setDescOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(true);

  if (!hasDescription && !hasSpecs) {
    return <p className="text-sm text-muted-foreground">No description provided for this item.</p>;
  }

  return (
    <div>
      {hasDescription && (
        <InfoSection title="Description" open={descOpen} onToggle={() => setDescOpen((v) => !v)}>
          <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-headings:text-foreground prose-strong:text-foreground overflow-x-auto [&_*]:!max-w-full [&_*]:!box-border [&_p]:!whitespace-normal [&_div]:!whitespace-normal [&_p]:!my-3">
            <FadeCollapse>{parse(descriptionHtml, descriptionParseOptions)}</FadeCollapse>
          </div>
        </InfoSection>
      )}
      {hasSpecs && (
        <InfoSection title="Specifications" open={specsOpen} onToggle={() => setSpecsOpen((v) => !v)}>
          <FadeCollapse tall>
          <dl>
            {specs.map((row, i) => (
              <div key={`${row.label}-${i}`} className="py-3 border-b border-border/60 last:border-b-0">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="mt-0.5 text-base text-foreground break-words">{row.value}</dd>
              </div>
            ))}
          </dl>
          </FadeCollapse>
        </InfoSection>
      )}
    </div>
  );
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type MediaItem =
  | { type: 'image'; url: string; altText?: string }
  | { type: 'video'; sources: { url: string; mimeType: string }[]; previewUrl?: string }
  | { type: 'external'; embedUrl: string; previewUrl?: string };

interface Listing {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  media?: MediaItem[];
  location: string;
  user_id: string;
  status: string;
  tags?: string[];
  variantId?: string;
  availableForSale?: boolean;
  inventoryQuantity?: number;
  shipping?: ShippingInfo;
  cjVid?: string;
  importedReviews?: ImportedReview[];
}

function parseMedia(p: any): MediaItem[] | undefined {
  const edges = p?.media?.edges;
  if (!Array.isArray(edges) || edges.length === 0) return undefined;
  const items: MediaItem[] = [];
  for (const edge of edges) {
    const node = edge?.node;
    if (!node) continue;
    const contentType: string = node.mediaContentType || '';
    if (contentType === 'IMAGE' && node.image?.url) {
      items.push({ type: 'image', url: node.image.url, altText: node.image.altText ?? undefined });
    } else if (contentType === 'VIDEO') {
      // Shopify's Video type returns sources on the node itself, but depending on
      // how the query was written this can also come back nested (e.g. node.video.sources)
      // or as a single object instead of an array. Accept all of those shapes so a
      // video isn't silently dropped just because the query result shape differs.
      const rawSources = node.sources ?? node.video?.sources ?? node.file?.sources;
      const sources = Array.isArray(rawSources)
        ? rawSources
        : rawSources
          ? [rawSources]
          : [];
      if (sources.length > 0) {
        items.push({ type: 'video', sources, previewUrl: node.previewImage?.url });
      } else {
        // No usable source URLs came back for this video node at all — this almost
        // always means the GraphQL query fetching this product isn't requesting
        // `sources { url mimeType }` on VIDEO media, not a player bug.
        devLog?.warn?.('[parseMedia] VIDEO media node has no sources — check that the product query requests `sources { url mimeType }`.', node);
      }
    } else if (contentType === 'EXTERNAL_VIDEO' && node.embeddedUrl) {
      items.push({ type: 'external', embedUrl: node.embeddedUrl, previewUrl: node.previewImage?.url });
    }
  }
  return items.length > 0 ? items : undefined;
}

// Gallery order: Shopify-hosted videos first, then external (YouTube/Vimeo), then images.
// Array.sort is stable, so Shopify's own order is kept within each group.
const mediaRank = (m: MediaItem) => (m.type === 'video' ? 0 : m.type === 'external' ? 1 : 2);

// Source order inside one <video>: mp4 first (plays everywhere), then HLS (.m3u8,
// Safari/mobile only), then anything else (e.g. the original .mov upload).
const sourceRank = (s: { mimeType: string }) =>
  s.mimeType === 'video/mp4' ? 0 : /mpegurl/i.test(s.mimeType) ? 1 : 2;

// Star-rating fill widths as complete class names (no inline style="" needed, so it
// works under style-src-attr 'none'). 41 steps of 2.5% -> rating precision ~0.06.
const STAR_FILL_WIDTH = [
  "w-0", "w-[2.5%]", "w-[5%]", "w-[7.5%]", "w-[10%]", "w-[12.5%]", "w-[15%]", "w-[17.5%]",
  "w-[20%]", "w-[22.5%]", "w-[25%]", "w-[27.5%]", "w-[30%]", "w-[32.5%]", "w-[35%]", "w-[37.5%]",
  "w-[40%]", "w-[42.5%]", "w-[45%]", "w-[47.5%]", "w-[50%]", "w-[52.5%]", "w-[55%]", "w-[57.5%]",
  "w-[60%]", "w-[62.5%]", "w-[65%]", "w-[67.5%]", "w-[70%]", "w-[72.5%]", "w-[75%]", "w-[77.5%]",
  "w-[80%]", "w-[82.5%]", "w-[85%]", "w-[87.5%]", "w-[90%]", "w-[92.5%]", "w-[95%]", "w-[97.5%]",
  "w-full",
];
const starFillWidth = (rating: number) => {
  const r = Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  return STAR_FILL_WIDTH[Math.round((r / 5) * 40)];
};

const DEFAULT_SHIPPING_INFO: ShippingInfo = {
  shipTo: "Worldwide",
  shipsFrom: "China",
  method: "Standard Shipping",
  processingTime: "1–3 business days",
  deliveryTime: "7–20 business days",
  fee: "Calculated at checkout",
};

function getMetafieldValue(productData: any, keys: string[]) {
  const metafields = Array.isArray(productData?.metafields) ? productData.metafields : [];
  const keySet = new Set(keys);
  const match = metafields.find((field: any) => {
    if (!field) return false;
    if (!keySet.has(field.key)) return false;
    if (typeof field.value !== "string" || !field.value.trim()) return false;
    // Skip metaobject references — their value is a Shopify GID, not the actual content.
    // Use a plain single_line_text_field metafield instead.
    if (field.value.startsWith("gid://shopify/") || field.type === "metaobject_reference" || field.type === "list.metaobject_reference") return false;
    return true;
  });
  return match?.value?.trim();
}

function buildShippingInfo(productData: any, fallback?: Partial<ShippingInfo>): ShippingInfo {
  return {
    shipTo: getMetafieldValue(productData, ["ship_to", "ships_to"]) || fallback?.shipTo || DEFAULT_SHIPPING_INFO.shipTo,
    shipsFrom: getMetafieldValue(productData, ["ships_from", "shipping_from", "origin"]) || fallback?.shipsFrom || DEFAULT_SHIPPING_INFO.shipsFrom,
    method: getMetafieldValue(productData, ["shipping_method", "method"]) || fallback?.method || DEFAULT_SHIPPING_INFO.method,
    processingTime: getMetafieldValue(productData, ["processing_time", "estimate_processing_time"]) || fallback?.processingTime || DEFAULT_SHIPPING_INFO.processingTime,
    deliveryTime: getMetafieldValue(productData, ["delivery_time", "estimated_delivery", "estimate_delivery"]) || fallback?.deliveryTime || DEFAULT_SHIPPING_INFO.deliveryTime,
    fee: getMetafieldValue(productData, ["shipping_fee", "fee"]) || fallback?.fee || DEFAULT_SHIPPING_INFO.fee,
  };
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [product, setProduct] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [marketRevision, setMarketRevision] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("counterfeit");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [productOptions, setProductOptions] = useState<{ name: string; values: string[] }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [relatedProducts, setRelatedProducts] = useState<Listing[]>([]);
  const [quantity, setQuantity] = useState(1);
  // Mobile-only Description/Reviews tab switch, shown under the
  // "You may also like" carousel (see the !isDesktopLayout block near the
  // bottom of the JSX). Desktop keeps its own separate, always-visible
  // description + reviews layout untouched.
  const [mobileInfoTab, setMobileInfoTab] = useState<'description' | 'reviews'>('description');
  // Pinned to 768px (Tailwind's `md`) to match every other desktop/mobile
  // split already in this component (md:grid-cols-2, md:hidden, etc).
  // Deliberately not the shared useIsMobile hook, which trips at 640px —
  // that would misclassify 640-767px tablets as "not mobile" while the
  // grid here is still single-column, reintroducing the original bug.
  const [isDesktopLayout, setIsDesktopLayout] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = () => setIsDesktopLayout(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  
  useEffect(() => {
    const handleMarketChange = () => setMarketRevision(revision => revision + 1);
    window.addEventListener(MARKET_CHANGED_EVENT, handleMarketChange);
    return () => window.removeEventListener(MARKET_CHANGED_EVENT, handleMarketChange);
  }, []);

  // Store the raw Shopify product data so we don't re-fetch on add-to-cart
  const shopifyDataRef = useRef<any>(null);
  // Mobile Description/Reviews tabs no longer swap content — both sections
  // stay mounted and visible, and the tabs just smooth-scroll to whichever
  // one was tapped (reviews are always reachable by scrolling down too).
  const mobileDescRef = useRef<HTMLDivElement>(null);
  const mobileReviewsRef = useRef<HTMLDivElement>(null);
  
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const { user } = useAuth();

  const productUrl = `https://www.pexly.app/shop/product/${id}`;
  const productDescription = product?.description
    ? product.description.replace(/<[^>]+>/g, '').trim().slice(0, 155)
    : "View this product in the Pexly shop and complete your purchase using cryptocurrency.";

  useHead({
    title: product ? `${product.title} | Pexly Shop` : "Product | Pexly Shop",
    meta: [
      { name: "description", content: productDescription },
      { property: "og:type", content: "product" },
      { property: "og:title", content: product ? `${product.title} | Pexly Shop` : "Product | Pexly Shop" },
      { property: "og:description", content: productDescription },
      { property: "og:image", content: product?.images?.[0] || "" },
      { property: "og:url", content: productUrl },
    ],
    link: [{ rel: "canonical", href: productUrl }],
  });

  const productSchema = useMemo(
    () => product ? createProductSchema(product, id || '') : {},
    [product, id]
  );
  useSchema(productSchema, 'product-schema');

  // Average rating + count derived from imported reviews, for the star
  // display below. Defensive about shape since ImportedReview's exact
  // fields aren't guaranteed here — falls back to a full 5-star display
  // with no count badge when nothing usable is present.
  const ratingSummary = useMemo(() => {
    const reviews = product?.importedReviews;
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    const values = reviews
      .map((r: any) => Number(r?.rating))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (values.length === 0) return null;
    const avg = values.reduce((sum, n) => sum + n, 0) / values.length;
    return { avg: Math.min(5, Math.max(0, avg)), count: values.length };
  }, [product?.importedReviews]);
  const displayRating = ratingSummary?.avg ?? 5;

  // Images pulled from the description HTML (or the media carousel as a
  // fallback) shown in the "Product Details" showcase strip. Computed once
  // here so it can be rendered in two different spots in the JSX below
  // (desktop: under the main image; mobile: under the description) without
  // duplicating the parsing logic.
  const productShowcase = useMemo(() => {
    if (!product) return null;
    const seen = new Set<string>();
    const descImages: string[] = [];

    const normSrc = (raw: string): string | null => {
      if (!raw || raw.startsWith('data:') || raw.length < 8) return null;
      return raw.startsWith('http://') ? raw.replace('http://', 'https://') : raw;
    };

    if (product.descriptionHtml) {
      const tagRe = /<img[^>]+>/gi;
      let tagMatch: RegExpExecArray | null;
      while ((tagMatch = tagRe.exec(product.descriptionHtml)) !== null) {
        const tag = tagMatch[0];
        const dataSrcMatch = /data-src=["']([^"']+)["']/i.exec(tag);
        const srcMatch = /\bsrc=["']([^"']+)["']/i.exec(tag);
        const raw = dataSrcMatch?.[1] || srcMatch?.[1] || '';
        const src = normSrc(raw);
        if (src && !seen.has(src)) {
          seen.add(src);
          descImages.push(src);
        }
      }
    }

    const carouselImages: string[] = [];
    const candidates = product.media && product.media.length > 0
      ? product.media.filter(m => m.type === 'image').map(m => (m as any).url as string)
      : product.images;
    for (const url of candidates) {
      const src = normSrc(url);
      if (src && !seen.has(src)) {
        seen.add(src);
        carouselImages.push(src);
      }
    }

    const hasDescImages = descImages.length > 0;
    const showcaseImages = hasDescImages ? descImages : carouselImages;
    if (showcaseImages.length === 0) return null;
    const sectionLabel = hasDescImages ? 'Product Details' : 'Product Images';
    return { showcaseImages, sectionLabel };
  }, [product]);

  // Renders the "Product Details" divider + flush image stack. `topMarginClass`
  // sets the spacing above it, which differs by placement (see call sites below).
  const renderProductShowcase = (topMarginClass: string) => {
    if (!productShowcase) return null;
    const { showcaseImages, sectionLabel } = productShowcase;
    return (
      <div className={topMarginClass}>
        <div className="flex items-center gap-4 mb-0">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex items-center gap-2 px-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              {sectionLabel}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
        </div>

        {/* Flush stack — zero gap between images, same on every breakpoint */}
        <div className="-mx-4 sm:mx-0 overflow-hidden rounded-none sm:rounded-2xl mt-5">
          {showcaseImages.map((url, idx) => (
            <div key={idx} className="w-full block leading-[0]">
              <img
                src={url}
                alt={`${product?.title} – detail ${idx + 1}`}
                className="w-full h-auto block select-none"
                loading={idx === 0 ? "eager" : "lazy"}
                draggable={false}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const wrapper = (e.currentTarget as HTMLImageElement).parentElement;
                  if (wrapper) wrapper.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Decorative end mark */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-8 h-px bg-border/60" />
          <div className="w-1 h-1 rounded-full bg-primary/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-1 h-1 rounded-full bg-primary/50" />
          <div className="w-8 h-px bg-border/60" />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    // Cleanup: if id changes mid-fetch, the stale flag prevents state updates
    return () => {
      shopifyDataRef.current = null;
    };
  }, [id, marketRevision]);

  // Gallery index 0 is now usually a video — always start there for each product.
  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  // Record view in shop history for authenticated users
  useEffect(() => {
    if (!user || !product) return;
    const record = async () => {
      try {
        const supabase = await getSupabase();
        await supabase.from("shop_history").insert({
          user_id: user.id,
          product_id: product.id,
          product_title: product.title,
          product_image: product.images[0] || null,
          price: product.price,
          currency: product.currency,
        });
      } catch {
        // silently ignore — history is non-critical
      }
    };
    record();
  }, [user?.id, product?.id]);

  // Derive the selected variant from cached Shopify data + selected options
  const selectedVariant = useMemo(() => {
    const shopifyProduct = shopifyDataRef.current;
    if (!shopifyProduct) return null;

    const variants = shopifyProduct.variants?.edges || [];

    // If no options to select, return first variant
    if (productOptions.length === 0) {
      return variants[0]?.node || null;
    }

    const match = variants.find((edge: any) => {
      const opts: { name: string; value: string }[] = edge.node.selectedOptions || [];
      return opts.every(opt => {
        const chosen = selectedOptions[opt.name];
        return !chosen || chosen === opt.value;
      });
    });

    return match?.node || null;
  }, [selectedOptions, productOptions]);

  // Resolve cjVid safely: variant metafield → product-level fallback → variant SKU.
  // Never passes an empty string to the shipping estimator.
  const resolvedCjVid = useMemo(
    () => resolveCjVid(selectedVariant, product?.cjVid),
    [selectedVariant, product?.cjVid]
  );

  // Update price and availability when variant changes
  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : product?.price ?? 0;
  const currentCurrency = selectedVariant
    ? selectedVariant.price.currencyCode
    : product?.currency ?? 'USD';
  const isAvailable = selectedVariant
    ? selectedVariant.availableForSale
    : product?.availableForSale ?? true;

  const applyShopifyProduct = (p: any) => {
    shopifyDataRef.current = p;

    const options: { name: string; values: string[] }[] = (p.options || []).filter(
      (opt: any) => Array.isArray(opt.values) && opt.values.length > 0 &&
        !(opt.values.length === 1 && opt.values[0] === 'Default Title')
    );

    setProductOptions(options);
    // Pre-select first value for each option
    const defaults: Record<string, string> = {};
    options.forEach((opt) => { defaults[opt.name] = opt.values[0]; });
    setSelectedOptions(defaults);

    setProduct({
      id: p.id,
      title: p.title,
      description: p.descriptionHtml || p.description,
      descriptionHtml: p.descriptionHtml,
      price: parseFloat(p.priceRange.minVariantPrice.amount),
      currency: p.priceRange.minVariantPrice.currencyCode,
      category: p.productType || "Shopify",
      tags: Array.isArray(p.tags) ? p.tags.filter((t: string) => t.trim().length > 0) : [],
      images: p.images.edges.map((e: any) => e.node.url),
      media: parseMedia(p),
      location: "Online",
      user_id: "shopify",
      status: "active",
      variantId: p.variants.edges[0]?.node?.id,
      availableForSale: p.variants.edges[0]?.node?.availableForSale,
      shipping: buildShippingInfo(p),
      cjVid: getMetafieldValue(p, ["cj_vid", "cj_variant_id", "cj_sku"]),
      importedReviews: Array.isArray(p.importedReviews) ? p.importedReviews : [],
    });
  };

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const fetchProduct = async () => {
    setIsLoading(true);
    shopifyDataRef.current = null;
    
    // Stale closure guard
    const fetchId = id;
    // Always decode — URL params may be percent-encoded (e.g. gid%3A%2F%2F...)
    const decodedId = decodeURIComponent(fetchId || '');

    try {
      // --- Path 1: Shopify handle (preferred, most efficient) ---
      if (!decodedId.startsWith('gid://') && !UUID_RE.test(decodedId)) {
        const p = await shopifyService.getProductByHandle(decodedId);

        if (fetchId !== id) return;

        if (p) {
          applyShopifyProduct(p);
          setIsLoading(false);

          // Fetch related products in the background (same product type for relevance)
          const typeQuery = p.productType ? `product_type:${p.productType}` : undefined;
          shopifyService.getProducts(16, undefined, typeQuery).then(({ products }) => {
            if (fetchId !== id) return;
            const related = shuffleArray(
              products.filter((edge: any) => edge.node.handle !== decodedId)
            )
              .slice(0, 12)
              .map((edge: any) => {
                const rp = edge.node;
                return {
                  id: rp.handle ?? rp.id,
                  title: rp.title,
                  description: rp.description,
                  price: parseFloat(rp.priceRange.minVariantPrice.amount),
                  currency: rp.priceRange.minVariantPrice.currencyCode,
                  category: "Shopify",
                  images: rp.images.edges.map((e: any) => e.node.url),
                  location: "Online",
                  user_id: "shopify",
                  status: "active",
                  variantId: rp.variants.edges[0]?.node?.id,
                };
              });
            setRelatedProducts(related);
          }).catch(() => { /* non-critical — silently ignore */ });

          return;
        }

        toast.error("Product not found");
        navigate("/shop");
        return;
      }

      // --- Path 2: Legacy Shopify GID (backward compat for old URLs) ---
      if (decodedId.startsWith('gid://shopify/Product/')) {
        const result = await shopifyService.getProducts(250);

        if (fetchId !== id) return;

        const found = result.products.find((edge: any) => edge.node.id === decodedId);

        if (found) {
          applyShopifyProduct(found.node);

          const related = shuffleArray(result.products.filter((edge: any) => edge.node.id !== decodedId))
            .slice(0, 12)
            .map((edge: any) => {
              const rp = edge.node;
              return {
                id: rp.id,
                title: rp.title,
                description: rp.description,
                price: parseFloat(rp.priceRange.minVariantPrice.amount),
                currency: rp.priceRange.minVariantPrice.currencyCode,
                category: "Shopify",
                images: rp.images.edges.map((e: any) => e.node.url),
                location: "Online",
                user_id: "shopify",
                status: "active",
                variantId: rp.variants.edges[0]?.node?.id,
              };
            });
          setRelatedProducts(related);
          setIsLoading(false);
          return;
        }

        // GID not found in first 250 — don't fall through to Supabase
        toast.error("Product not found");
        navigate("/shop");
        return;
      }

      // --- Path 3: Supabase marketplace listing (UUID) ---
      if (fetchId !== id) return;

      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('shop_listings')
        .select('*')
        .eq('id', fetchId)
        .maybeSingle();

      if (fetchId !== id) return;
      if (error) throw error;

      if (data) {
        let imageUrls: string[] = [];
        if (Array.isArray(data.images)) {
          imageUrls = data.images.filter((img: any) => typeof img === 'string' && img.startsWith('http'));
        } else if (typeof data.images === 'string') {
          try {
            const parsed = JSON.parse(data.images);
            imageUrls = Array.isArray(parsed) ? parsed : [data.images];
          } catch {
            imageUrls = [data.images];
          }
        }
        setProduct({ ...data, images: imageUrls, shipping: buildShippingInfo(data, data.shipping) });
      } else {
        toast.error("Product not found");
        navigate("/shop");
      }
    } catch (error) {
      devLog.error('Error fetching product:', error);
      if (fetchId === id) {
        toast.error("Error loading product");
        navigate("/shop");
      }
    } finally {
      if (fetchId === id) {
        setIsLoading(false);
      }
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = product?.title ? `${product.title} on Pexly` : "Pexly product";
    const text = product?.title ? `Check out ${product.title} on Pexly` : "Check out this product on Pexly";
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title, text, url });
        return;
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleSubmitReport = async () => {
    if (!product) return;
    setIsSubmittingReport(true);
    try {
      devLog.info("[product-report] submitted", {
        productId: product.id,
        reason: reportReason,
        details: reportDetails,
      });
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Report submitted. Our team will review this listing.");
      setReportOpen(false);
      setReportDetails("");
      setReportReason("counterfeit");
    } catch {
      toast.error("Could not submit report. Please try again.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.user_id !== 'shopify') {
      toast.info("Marketplace checkout coming soon.");
      return;
    }

    // Use cached variant data instead of re-fetching
    const targetVariantId = selectedVariant?.id || product.variantId;

    if (!targetVariantId) {
      toast.error("Please select all required options");
      return;
    }

    if (selectedVariant && !selectedVariant.availableForSale) {
      toast.error("This item is currently out of stock");
      return;
    }

    const optionLabel = Object.values(selectedOptions).filter(Boolean).join(' / ');

    await addToCart(targetVariantId, {
      variantId: targetVariantId,
      title: product.title + (optionLabel ? ` - ${optionLabel}` : ''),
      price: currentPrice,
      currency: currentCurrency,
      image: product.images[0],
    });
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!product) return;
    if (product.user_id !== 'shopify') {
      toast.info("Marketplace checkout coming soon.");
      return;
    }

    const targetVariantId = selectedVariant?.id || product.variantId;
    if (!targetVariantId) {
      toast.error("Please select all required options");
      return;
    }
    if (selectedVariant && !selectedVariant.availableForSale) {
      toast.error("This item is currently out of stock");
      return;
    }

    setIsCheckingOut(true);
    try {
      const result = await shopifyService.createCart({ variantId: targetVariantId, quantity });
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        toast.error("Could not initiate checkout. Please try again.");
      }
    } catch {
      toast.error("Could not initiate checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto pt-0 sm:pt-3 pb-8 md:py-8 max-w-6xl px-4">
        {/* Top bar removed — back navigation no longer shown here */}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size={40} color="hsl(var(--primary))" />
          </div>
        )}

        {!isLoading && product && <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 lg:gap-12">
          {/* Left: Media (images + video) */}
          {(() => {
            const mediaItems: MediaItem[] = (
              product.media && product.media.length > 0
                ? [...product.media]
                : product.images.map(url => ({ type: 'image' as const, url }))
            ).sort((a, b) => mediaRank(a) - mediaRank(b));
            const selected = mediaItems[selectedImage] ?? mediaItems[0];

            // First real photo = cover for the video(s), instead of Shopify's auto-generated frame
            const coverImage =
              mediaItems.find((m): m is Extract<MediaItem, { type: 'image' }> => m.type === 'image')?.url
              ?? product.images[0];

            return (
              <div className="space-y-4">
                <div className="relative -mx-4 sm:mx-0 aspect-square rounded-none sm:rounded-xl overflow-hidden bg-muted">
                  {mediaItems.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  ) : selected?.type === 'video' ? (
                    <video
                      key={selectedImage}
                      className="w-full h-full object-contain bg-white"
                      controls
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      disableRemotePlayback
                      onContextMenu={(e) => e.preventDefault()}
                      playsInline
                      preload="metadata"
                      poster={coverImage ?? selected.previewUrl}
                    >
                      {[...selected.sources]
                        .sort((a, b) => sourceRank(a) - sourceRank(b))
                        .map((s, i) => (
                          <source
                            key={i}
                            src={s.url}
                            type={s.mimeType}
                            onError={() => console.error('Video source failed', s.url, s.mimeType)}
                          />
                        ))}
                      Your browser doesn't support embedded videos.
                    </video>
                  ) : selected?.type === 'external' ? (
                    <iframe
                      key={selectedImage}
                      src={selected.embedUrl}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={(selected as any).url ?? product.images[selectedImage]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {mediaItems.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {mediaItems.map((item, idx) => {
                      const thumbSrc = item.type === 'image' ? item.url
                        : item.type === 'video' ? (coverImage ?? item.previewUrl)
                        : item.type === 'external' ? item.previewUrl
                        : undefined;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                            selectedImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          {thumbSrc ? (
                            <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          {(item.type === 'video' || item.type === 'external') && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <PlayCircle className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

              {/* Description + store — desktop only, lives under images in col 1 */}
              <div className="hidden md:block space-y-4 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <p className="text-base font-bold">Item description</p>
                    <button
                      onClick={() => setReportOpen(true)}
                      className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                    >
                      report
                    </button>
                  </div>
                  <ProductInfoSections key={product.id} html={product.description} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Store</p>
                      <p className="text-muted-foreground">{product.user_id === 'shopify' ? 'Verified Store' : 'Marketplace'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-muted-foreground">Fast Delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product image showcase — desktop/tablet only here, part of
                  this left column's flow so the sticky buy box (right
                  column) has something to track alongside. Gated on
                  isDesktopLayout (768px, matching this component's other
                  md: breakpoints) so only one copy ever renders — otherwise
                  we'd eager-load the first image twice. On phones this same
                  content renders further down, under the description. */}
              {isDesktopLayout && renderProductShowcase("mt-10")}
            </div>
            );
          })()}


          {/* Right: Info — outer div stretches to match the left column's
              height (default grid behavior); the inner div is what actually
              sticks and tracks alongside it while scrolling, same pattern
              as the gift-card detail page's purchase card. */}
          <div>
            <div className="md:sticky md:top-20 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    aria-label="Share product"
                    title="Share product"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setReportOpen(true)}
                    aria-label="Report product"
                    title="Report product"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                  <CartSheet />
                </div>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>

              <div className="flex items-center gap-2">
                <div className="relative inline-flex leading-[0]">
                  {/* Track: five outlined stars in a soft neutral tone */}
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={`track-${i}`} className="h-4 w-4 text-muted-foreground/25" strokeWidth={1.5} />
                    ))}
                  </div>
                  {/* Fill: same five stars, gradient-filled, clipped to the
                      rating percentage so partial ratings render as a
                      partial last star — no extra assets, pure CSS width. */}
                  <div
                    className={`absolute inset-0 flex items-center gap-0.5 overflow-hidden ${starFillWidth(displayRating)}`}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={`fill-${i}`}
                        className="h-4 w-4 flex-shrink-0 fill-[url(#pexly-star-gradient)] text-amber-500 drop-shadow-[0_1px_1.5px_rgba(180,83,9,0.35)]"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  {/* Gradient definition referenced by the fill above.
                      0×0 and aria-hidden — contributes no layout, no
                      network request, just an inline SVG def. */}
                  <svg width="0" height="0" className="absolute" aria-hidden="true">
                    <defs>
                      <linearGradient id="pexly-star-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="55%" stopColor="#f5b942" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {ratingSummary && (
                  <span className="flex items-baseline gap-1 text-sm">
                    <span className="font-bold text-foreground">{ratingSummary.avg.toFixed(1)}</span>
                    <span className="text-muted-foreground">({ratingSummary.count})</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  {currentCurrency} {currentPrice.toLocaleString()}
                </span>
                {product.user_id === 'shopify' && (
                  <span className="text-lg text-muted-foreground line-through">
                    {currentCurrency} {(currentPrice * 1.2).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-5">
              {/* Options selection — all product options rendered generically */}
              {productOptions.length > 0 && (
                <div className="space-y-4">
                  {productOptions.map((opt) => {
                    const isSizeOption = opt.name.toLowerCase().includes('size') || opt.name.toLowerCase() === 'taille';
                    return (
                      <div key={opt.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{opt.name}</p>
                          {isSizeOption && (
                            <span className="text-xs text-muted-foreground cursor-pointer hover:underline">Size Guide</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map((val) => (
                            <button
                              key={val}
                              onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}
                              className={`h-10 min-w-[3rem] px-3 rounded-lg text-sm font-bold border-2 transition-all ${
                                selectedOptions[opt.name] === val
                                  ? 'bg-foreground text-background border-foreground shadow-md'
                                  : 'bg-background text-foreground border-border/40 hover:border-primary/50'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-3">
                {/* Quantity selector + Add to Cart */}
                <div className="flex gap-3 items-stretch">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden h-12 shrink-0">
                    <button
                      className="px-3 h-full flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums select-none">
                      {quantity}
                    </span>
                    <button
                      className="px-3 h-full flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setQuantity(q => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    className="flex-1 h-12 text-base"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !isAvailable}
                  >
                    {isAddingToCart ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : !isAvailable ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>

                {/* Checkout button — only for Shopify products. Card marks are inline SVG
                    (no external image hosts) so they render even with a strict CSP. */}
                {product.user_id === 'shopify' && isAvailable && (
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut || !isAvailable}
                      className="w-full h-12 rounded-lg bg-[#FFC439] hover:bg-[#f0b429] active:bg-[#e0a420] transition-colors flex items-center justify-center gap-2 font-semibold text-[#003087] disabled:opacity-60 disabled:cursor-not-allowed"
                      aria-label="Checkout"
                    >
                      {isCheckingOut ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#003087]" />
                      ) : (
                        <>
                          <span>Checkout</span>
                          <div className="flex items-center gap-1">
                            {/* Visa */}
                            <svg viewBox="0 0 48 32" className="h-5 w-8" aria-label="Visa" role="img">
                              <rect width="48" height="32" rx="4" fill="#fff" />
                              <path d="M20.5 21.5h-2.9l1.8-11h2.9l-1.8 11Zm-6.9-11-2.8 7.6-.3-1.6-1-5.1s-.1-.9-1.2-.9H4l-.1.3s1.5.3 3.2 1.3l2.5 9.4h3l4.6-11H14.1Zm23.1 11H40l-2.4-11h-2.6c-1.1 0-1.4.9-1.4.9l-4.3 10.1h3l.6-1.7h3.7l.4 1.7Zm-4.2-4 1.5-4.2.9 4.2h-2.4Zm-8.6-3.7c0-1 .8-1.3 2.1-1.3.9 0 1.9.2 1.9.2l.5-2.3s-1.1-.4-2.3-.4c-2.7 0-4.6 1.4-4.6 3.5 0 1.9 1.7 2.4 2.8 3 1.1.6 1.5.9 1.5 1.4 0 .8-1 1.1-1.8 1.1-1.3 0-2.6-.5-2.6-.5l-.5 2.3s1.3.5 3 .5c2.7 0 4.7-1.3 4.7-3.6 0-2.7-3.7-2.8-3.7-4Z" fill="#1434CB"/>
                            </svg>
                            {/* Mastercard */}
                            <svg viewBox="0 0 48 32" className="h-5 w-8" aria-label="Mastercard" role="img">
                              <rect width="48" height="32" rx="4" fill="#fff" />
                              <circle cx="20" cy="16" r="9" fill="#EB001B" />
                              <circle cx="28" cy="16" r="9" fill="#F79E1B" />
                              <path d="M24 9.5a9 9 0 0 1 0 13 9 9 0 0 1 0-13Z" fill="#FF5F00" />
                            </svg>
                            {/* American Express */}
                            <svg viewBox="0 0 48 32" className="h-5 w-8" aria-label="American Express" role="img">
                              <rect width="48" height="32" rx="4" fill="#016FD0" />
                              <text x="24" y="20" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">AMEX</text>
                            </svg>
                            {/* Discover */}
                            <svg viewBox="0 0 48 32" className="h-5 w-8" aria-label="Discover" role="img">
                              <rect width="48" height="32" rx="4" fill="#1a1a1a" />
                              <text x="21" y="20" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">DISC</text>
                              <circle cx="40" cy="16" r="6" fill="#FF6600" />
                            </svg>
                          </div>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      More payment options
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className={isAvailable ? 'text-green-600' : 'text-destructive'}>
                    {isAvailable ? 'In Stock & Ready to Deliver' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="-mx-4 sm:mx-0 sm:hidden h-2 bg-muted/60" />
              <Separator className="hidden sm:block" />

              {product.user_id === 'shopify' ? (
                <ShippingEstimator
                  shipping={product.shipping}
                  productPrice={currentPrice}
                  currency={currentCurrency}
                  variantId={selectedVariant?.id || product.variantId}
                  productTitle={product.title}
                  productImage={product.images[0]}
                  cjVid={resolvedCjVid}
                />
              ) : (
                <div className="rounded-2xl border border-border/70 bg-card/60 overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                    <div className="p-4 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Processing</p>
                      <p className="text-sm font-semibold">{product.shipping?.processingTime || DEFAULT_SHIPPING_INFO.processingTime}</p>
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Delivery</p>
                      <p className="text-sm font-semibold">{product.shipping?.deliveryTime || DEFAULT_SHIPPING_INFO.deliveryTime}</p>
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Shipping fee</p>
                      <p className="text-sm font-semibold">{product.shipping?.fee || DEFAULT_SHIPPING_INFO.fee}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
            </div>
          </div>
        </div>}

        {/* ───────── Desktop: unchanged — related products, then reviews,
            each in their own always-visible section below the grid. ───────── */}
        {isDesktopLayout && relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl font-bold">You may also like</h2>
            <div className="md:grid md:grid-cols-4 md:gap-4">
              <div className="md:contents">
                {relatedProducts.map((related) => (
                  <div key={related.id} className="md:contents">
                    <ShopItemCard
                      product={related}
                      onViewDetails={() => navigate(`/shop/product/${encodeURIComponent(related.id)}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isDesktopLayout && !isLoading && product && (
          <ReviewSection productId={product.id} importedReviews={product.importedReviews} />
        )}

        {/* ───────── Mobile: "You may also like" now sits ABOVE the
            description, and description/reviews are switched via tabs
            (Description | Reviews), matching the reference layout. Gated
            on !isDesktopLayout (rather than a CSS-only "md:hidden") so this
            never mounts on desktop — avoids double-loading the related
            product images and the showcase images below. ───────── */}
        {!isDesktopLayout && !isLoading && product && (
          <div className="mt-10 space-y-8">
            {relatedProducts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">You may also like</h2>
                {/* Horizontal scroll row — each card a fixed width, snapping
                    into place. -mx-4 + matching px-4 lets the row bleed to
                    the screen edges while the first/last card still lines
                    up with the page's normal content padding. */}
                <div className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {relatedProducts.map((related) => (
                    <div key={related.id} className="w-[42%] min-w-[150px] max-w-[190px] flex-shrink-0 snap-start">
                      <ShopItemCard
                        product={related}
                        onViewDetails={() => navigate(`/shop/product/${encodeURIComponent(related.id)}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description / Reviews tabs — both sections stay mounted;
                tapping a tab just smooth-scrolls down to it, like a
                same-page jump link, rather than swapping content out. */}
            <div className="space-y-0">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="text-base font-bold">{product.title}</h2>
                {/* Tag-style pill container around the tab pair — light,
                    transparent background with a thin border, same visual
                    language as the outline Badge tags elsewhere on the page. */}
                <div className="flex items-center gap-1 rounded-full border border-border/60 bg-transparent p-1">
                  <button
                    onClick={() => {
                      setMobileInfoTab('description');
                      mobileDescRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      mobileInfoTab === 'description'
                        ? 'font-bold text-foreground bg-muted'
                        : 'font-medium text-muted-foreground'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => {
                      setMobileInfoTab('reviews');
                      mobileReviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      mobileInfoTab === 'reviews'
                        ? 'font-bold text-foreground bg-muted'
                        : 'font-medium text-muted-foreground'
                    }`}
                  >
                    Reviews
                  </button>
                </div>
              </div>

              <div ref={mobileDescRef} className="space-y-3 scroll-mt-4">
                <ProductInfoSections key={product.id} html={product.description} />

                {/* Product image showcase — phones only. Only one copy of
                    this ever mounts (see the isDesktopLayout gate above it,
                    and this whole block is itself gated on !isDesktopLayout). */}
                {renderProductShowcase("mt-4")}

                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Store</p>
                      <p className="text-muted-foreground">{product.user_id === 'shopify' ? 'Verified Store' : 'Marketplace'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-muted-foreground">Fast Delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews — always rendered below the description, not
                  conditionally swapped in. The "Reviews" tab above just
                  scrolls the page down to this block. */}
              <div ref={mobileReviewsRef} className="mt-4 scroll-mt-4">
                <ReviewSection productId={product.id} importedReviews={product.importedReviews} compact />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report listing dialog */}
      <AlertDialog open={reportOpen} onOpenChange={setReportOpen}>
        <AlertDialogContent
          className="
            inset-x-0 bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0
            w-full max-w-full rounded-t-2xl rounded-b-none border-b-0
            max-h-[88vh] overflow-y-auto
            pb-[max(1.5rem,env(safe-area-inset-bottom))]
            data-[state=open]:slide-in-from-bottom data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0
            data-[state=closed]:slide-out-to-bottom data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0
            sm:inset-auto sm:left-[50%] sm:right-auto sm:top-[50%] sm:bottom-auto
            sm:translate-x-[-50%] sm:translate-y-[-50%]
            sm:w-full sm:max-w-lg sm:rounded-lg sm:border sm:max-h-none sm:overflow-visible sm:pb-6
            sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%] sm:data-[state=open]:slide-in-from-bottom-0
            sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] sm:data-[state=closed]:slide-out-to-bottom-0
          "
        >
          {/* Drag-handle bar — bottom-sheet affordance, mobile only */}
          <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-muted sm:hidden" />

          <AlertDialogHeader>
            <AlertDialogTitle>Report this listing</AlertDialogTitle>
            <AlertDialogDescription>
              Help us keep Pexly safe. Tell us what's wrong with this product and our trust &amp; safety team will review it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <RadioGroup value={reportReason} onValueChange={setReportReason} className="space-y-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="counterfeit" id="report-counterfeit" />
                <Label htmlFor="report-counterfeit" className="font-normal cursor-pointer">Counterfeit or fake item</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="prohibited" id="report-prohibited" />
                <Label htmlFor="report-prohibited" className="font-normal cursor-pointer">Prohibited or illegal item</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="misleading" id="report-misleading" />
                <Label htmlFor="report-misleading" className="font-normal cursor-pointer">Misleading description or images</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="scam" id="report-scam" />
                <Label htmlFor="report-scam" className="font-normal cursor-pointer">Scam or fraudulent seller</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="ip" id="report-ip" />
                <Label htmlFor="report-ip" className="font-normal cursor-pointer">Intellectual property infringement</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="other" id="report-other" />
                <Label htmlFor="report-other" className="font-normal cursor-pointer">Other</Label>
              </div>
            </RadioGroup>

            <div className="space-y-1.5">
              <Label htmlFor="report-details" className="text-sm">Additional details (optional)</Label>
              <Textarea
                id="report-details"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Add any context that will help us review this listing…"
                rows={4}
                maxLength={1000}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmittingReport}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitReport} disabled={isSubmittingReport}>
              {isSubmittingReport ? "Submitting…" : "Submit report"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
