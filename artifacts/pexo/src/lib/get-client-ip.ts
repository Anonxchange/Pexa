const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const SUPABASE_EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-client-ip`;

export interface ClientLocation {
  ip: string;
  country: string;
  isp: string;
}

let _cache: ClientLocation | null = null;
let _cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Returns the client's IP, country name, and ISP/network from the Supabase
 * edge function, which runs server-side behind Cloudflare and has access to
 * CF-IPCountry, CF-ISP and other enriched headers.
 * Result is cached for 5 minutes — safe to call from multiple places.
 */
export async function getClientLocation(): Promise<ClientLocation> {
  const now = Date.now();
  if (_cache && now < _cacheExpiry) return _cache;

  try {
    const res = await fetch(SUPABASE_EDGE_URL, {
      headers: { apikey: ANON_KEY },
    });
    if (res.ok) {
      const data = await res.json();
      const ip = data?.ip && data.ip !== 'unknown' ? String(data.ip) : 'unknown';
      const result: ClientLocation = {
        ip,
        country: String(data?.country || data?.country_name || ''),
        isp:     String(data?.isp || data?.org || data?.network || ''),
      };
      if (ip !== 'unknown') {
        _cache = result;
        _cacheExpiry = now + CACHE_TTL_MS;
      }
      return result;
    }
  } catch {
    // Edge function unreachable — return empty location, never block auth
  }

  return { ip: 'unknown', country: '', isp: '' };
}

/** Backwards-compatible helper — returns IP string only. */
export async function getClientIP(): Promise<string> {
  return (await getClientLocation()).ip;
}
