const COUNTRY_TO_LANG: Record<string, string> = {
  FR: "fr", BE: "fr", CH: "fr", LU: "fr", SN: "fr", CI: "fr", CM: "fr", ML: "fr", BF: "fr", NE: "fr", TG: "fr", BJ: "fr", GA: "fr", CG: "fr", CD: "fr", MG: "fr", RW: "fr", BI: "fr", DJ: "fr", KM: "fr", MR: "fr", HT: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es", EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es", SV: "es", NI: "es", CR: "es", PA: "es", UY: "es", GQ: "es",
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt", CV: "pt", ST: "pt", GW: "pt", TL: "pt",
  SA: "ar", AE: "ar", EG: "ar", MA: "ar", DZ: "ar", IQ: "ar", JO: "ar", KW: "ar", LB: "ar", LY: "ar", OM: "ar", QA: "ar", SY: "ar", TN: "ar", YE: "ar", BH: "ar", PS: "ar", SD: "ar", SO: "ar",
  CN: "zh", TW: "zh", HK: "zh", MO: "zh",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
  DE: "de", AT: "de",
  TR: "tr",
  IN: "hi", NP: "hi",
  ID: "id",
  VN: "vi",
  JP: "ja",
};

export const SUPPORTED_LANGS = ["en", "es", "fr", "pt", "ar", "zh", "ru", "de", "tr", "hi", "id", "vi", "ja", "yo", "ha"] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];

export function isValidLang(lang: string): lang is SupportedLang {
  return (SUPPORTED_LANGS as readonly string[]).includes(lang);
}

export async function detectLanguageFromIP(): Promise<SupportedLang> {
  try {
    const { getCountryCode } = await import("@/lib/geo");
    const countryCode = await getCountryCode();
    const lang = COUNTRY_TO_LANG[countryCode];
    if (lang && isValidLang(lang)) return lang;
  } catch {
  }
  return "en";
}

