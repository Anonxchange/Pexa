import "@/lib/i18n";
import { startAutoTranslate } from "@/lib/auto-translate";
import { setNonce } from "get-nonce";
import { createRoot } from "react-dom/client";
import { createHead, UnheadProvider } from "@unhead/react/client";
import App from "./App";
import "./styles.css";

try {
  const theme = window.localStorage.getItem("pexly-theme");
  document.documentElement.classList.add(theme === "dark" ? "dark" : "light");
} catch {
  document.documentElement.classList.add("light");
}

// The Cloudflare Worker writes the per-request CSP nonce into the `content`
// attribute of <meta property="csp-nonce"> (`content`, not `nonce`, avoids
// Chrome's nonce-hiding behaviour). Calling setNonce() here propagates it into
// get-nonce so react-style-singleton (used by Radix Dialog, Dropdown, Popover,
// Tooltip, etc.) automatically stamps the nonce onto every <style> it injects —
// eliminating CSP violations without unsafe-inline or hash maintenance.
const cspMeta = document.querySelector<HTMLMetaElement>('meta[property="csp-nonce"]');
const edgeNonce = cspMeta?.getAttribute("content");
if (edgeNonce) setNonce(edgeNonce);

const head = createHead();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <UnheadProvider head={head}>
      <App />
    </UnheadProvider>
  );
  // Kick off the DOM-level translator after the first paint so it starts
  // walking the rendered tree as soon as React has committed.
  if (typeof window !== "undefined") {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      queueMicrotask(startAutoTranslate);
    } else {
      window.addEventListener("DOMContentLoaded", () => startAutoTranslate(), { once: true });
    }
  }
}
