import DOMPurify from "dompurify";

const SAFE_URL_PATTERN = /^(?:(?:https?:|mailto:|tel:)|\/(?!\/)|#)/i;
const SAFE_IMAGE_URL_PATTERN = /^(?:(?:https?:)|\/(?!\/))/i;

function withNoopenerHook<T>(fn: () => T): T {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  try {
    return fn();
  } finally {
    DOMPurify.removeHook("afterSanitizeAttributes");
  }
}

export function sanitizeText(value: string): string {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function sanitizeRichText(
  html: string,
  allowedTags = ["p", "br", "strong", "em", "a", "ul", "ol", "li", "code"]
): string {
  return withNoopenerHook(() =>
    DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: ["href", "rel"],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: SAFE_URL_PATTERN,
    })
  );
}

export function sanitizeBlogHtml(html: string): string {
  return withNoopenerHook(() =>
    DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "a", "ul", "ol", "li", "code", "h2", "h3", "img"],
      ALLOWED_ATTR: ["href", "src", "alt", "rel", "class"],
      ALLOW_DATA_ATTR: false,
      FORCE_BODY: false,
      ALLOWED_URI_REGEXP: SAFE_IMAGE_URL_PATTERN,
    })
  );
}

export function sanitizeUrl(url: string): string {
  const purified = DOMPurify.sanitize(url, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  if (purified.startsWith("/")) return purified;
  try {
    const parsed = new URL(purified);
    return ["http:", "https:"].includes(parsed.protocol) ? purified : "";
  } catch {
    return "";
  }
}

export function isSafeExternalUrl(url: string | null | undefined): boolean {
  if (!url || !url.trim()) return false;
  const sanitized = sanitizeUrl(url);
  return !!sanitized && /^https?:\/\//i.test(sanitized);
}

export function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url, window.location.origin);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return DOMPurify.sanitize(parsed.href, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  } catch {
    return "";
  }
}

const COINBASE_PAY_ORIGINS = [
  "https://pay.coinbase.com",
  "https://buy.coinbase.com",
  "https://onramp.coinbase.com",
  "https://www.coinbase.com",
];

export function safeExternalRedirect(
  url: string | null | undefined,
  allowedOrigins: string[]
): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return "";
    const origin = `${parsed.protocol}//${parsed.host}`;
    return allowedOrigins.includes(origin) ? url : "";
  } catch {
    return "";
  }
}

export { COINBASE_PAY_ORIGINS };

export function sanitizeCssId(id: string): string {
  return id.replace(/[^a-zA-Z0-9\-_]/g, "");
}

export function sanitizeCssColor(color: string): string {
  const trimmed = color.trim();
  const safe = /^(#[0-9a-fA-F]{3,8}|rgb\([^)]{1,50}\)|rgba\([^)]{1,60}\)|hsl\([^)]{1,50}\)|hsla\([^)]{1,60}\)|[a-zA-Z]{2,30})$/.test(trimmed);
  return safe ? trimmed : "";
}

export function safeIsoCode(code: string): string {
  const purified = DOMPurify.sanitize(code, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return purified.toLowerCase().replace(/[^a-z]/g, "").slice(0, 2);
}

export function safeCryptoSymbol(symbol: string): string {
  const purified = DOMPurify.sanitize(symbol || "", { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return purified.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
}
