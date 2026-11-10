const ISO_TO_CALLING: Record<string, string> = {
  AF: "+93",  AL: "+355", DZ: "+213", AD: "+376", AO: "+244", AR: "+54",  AM: "+374",
  AU: "+61",  AT: "+43",  AZ: "+994", BH: "+973", BD: "+880", BY: "+375", BE: "+32",
  BJ: "+229", BT: "+975", BO: "+591", BA: "+387", BW: "+267", BR: "+55",  BN: "+673",
  BG: "+359", BF: "+226", BI: "+257", KH: "+855", CM: "+237", CA: "+1",   CV: "+238",
  CF: "+236", TD: "+235", CL: "+56",  CN: "+86",  CO: "+57",  CD: "+243", CR: "+506",
  HR: "+385", CU: "+53",  CY: "+357", CZ: "+420", DK: "+45",  DJ: "+253", DO: "+1",
  EC: "+593", EG: "+20",  SV: "+503", EE: "+372", ET: "+251", FI: "+358", FR: "+33",
  GA: "+241", GE: "+995", DE: "+49",  GH: "+233", GR: "+30",  GT: "+502", GN: "+224",
  GW: "+245", GY: "+592", HT: "+509", HN: "+504", HU: "+36",  IS: "+354", IN: "+91",
  ID: "+62",  IR: "+98",  IQ: "+964", IE: "+353", IL: "+972", IT: "+39",  JM: "+1",
  JP: "+81",  JO: "+962", KZ: "+7",   KE: "+254", KW: "+965", KG: "+996", LA: "+856",
  LV: "+371", LB: "+961", LR: "+231", LY: "+218", LI: "+423", LT: "+370", LU: "+352",
  MK: "+389", MG: "+261", MW: "+265", MY: "+60",  MV: "+960", ML: "+223", MT: "+356",
  MR: "+222", MU: "+230", MX: "+52",  MD: "+373", MC: "+377", MN: "+976", ME: "+382",
  MA: "+212", MZ: "+258", MM: "+95",  NA: "+264", NP: "+977", NL: "+31",  NZ: "+64",
  NI: "+505", NE: "+227", NG: "+234", NO: "+47",  OM: "+968", PK: "+92",  PS: "+970",
  PA: "+507", PG: "+675", PY: "+595", PE: "+51",  PH: "+63",  PL: "+48",  PT: "+351",
  QA: "+974", RO: "+40",  RU: "+7",   RW: "+250", SA: "+966", SN: "+221", RS: "+381",
  SL: "+232", SG: "+65",  SK: "+421", SI: "+386", SO: "+252", ZA: "+27",  SS: "+211",
  ES: "+34",  LK: "+94",  SD: "+249", SE: "+46",  CH: "+41",  SY: "+963", TW: "+886",
  TJ: "+992", TZ: "+255", TH: "+66",  TG: "+228", TN: "+216", TR: "+90",  TM: "+993",
  UG: "+256", UA: "+380", AE: "+971", GB: "+44",  US: "+1",   UY: "+598", UZ: "+998",
  VE: "+58",  VN: "+84",  YE: "+967", ZM: "+260", ZW: "+263",
};

/**
 * Returns the ISO-3166-1 alpha-2 country code for the current user.
 *
 * In production (behind the Cloudflare Worker) this is read instantly from the
 * <meta name="cf-country"> tag stamped at the edge — zero network request.
 * In dev (Replit, localhost) it falls back to ipapi.co with a 3-second timeout.
 */
export async function getCountryCode(): Promise<string> {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="cf-country"]');
  const fromMeta = meta?.getAttribute("content")?.trim();
  if (fromMeta) return fromMeta;

  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(3_000),
    });
    if (res.ok) {
      const data = await res.json();
      const code = (data.country_code as string | undefined)?.trim();
      if (code) return code;
    }
  } catch {
    // Silently fall through to default
  }
  return "US";
}

/**
 * Returns the phone dialling prefix (e.g. "+44") for the current user's country.
 */
export async function getCallingCode(): Promise<string> {
  const iso = await getCountryCode();
  return ISO_TO_CALLING[iso] ?? "+1";
}
