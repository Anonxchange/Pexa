import { isValidLang } from "@/lib/detect-language";

export function switchLanguage(code: string) {
  if (!isValidLang(code)) return;
  const segments = window.location.pathname.split("/").filter(Boolean);
  const currentLanguage =
    segments[0] && (isValidLang(segments[0]) || segments[0] === "jp")
      ? segments.shift()
      : null;
  const route = segments.length ? `/${segments.join("/")}` : "";
  const nextPath = `/${code}${route}`;
  if (currentLanguage === code) return;
  try {
    localStorage.setItem("pexly-lang", code);
  } catch {
    // The route prefix remains authoritative when storage is unavailable.
  }
  window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
}
