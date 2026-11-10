import { supabase } from "./supabase";

const SUPABASE_CONFIGURED =
  !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

const EDGE_TIMEOUT_MS = 5000;

async function invokeWithTimeout(
  fn: string,
  body: Record<string, unknown>
): Promise<{ data: unknown; error: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EDGE_TIMEOUT_MS);
  try {
    const result = await supabase.functions.invoke(fn, { body, signal: controller.signal } as Parameters<typeof supabase.functions.invoke>[1]);
    return result;
  } finally {
    clearTimeout(timer);
  }
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export interface ExchangeRates {
  [key: string]: number;
}

// Cache for crypto prices
let cryptoPricesCache: Record<string, CryptoPrice> | null = null;
let lastPricesFetchTime = 0;
const PRICES_CACHE_DURATION = 30000; // 30 seconds for general use

// Real-time price cache (5 seconds for trading)
let realtimePricesCache: Record<string, CryptoPrice> | null = null;
let lastRealtimeFetchTime = 0;
const REALTIME_CACHE_DURATION = 5000; // 5 seconds for real-time pricing

// In-flight promise deduplication — prevents concurrent callers from each
// spawning their own network request when the cache is empty/stale.
let inFlightPrices: Promise<Record<string, CryptoPrice>> | null = null;
let inFlightRealtime: Promise<Record<string, CryptoPrice>> | null = null;
let inFlightExchangeRates: Promise<ExchangeRates> | null = null;

export interface HistoricalPrice {
  timestamp: number;
  price: number;
  date: string;
}

// Generate fallback prices if API is unavailable
function generateFallbackPrices(symbols: string[]): Record<string, CryptoPrice> {
  const fallbackPrices: Record<string, number> = {
    BTC: 95000,
    ETH: 3500,
    USDT: 1,
    USDC: 1,
    SOL: 200,
    BNB: 600,
    TRX: 0.2,
    LTC: 80,
    XRP: 1.5,
    ADA: 0.8,
    DOGE: 0.35,
    AVAX: 40,
    MATIC: 0.85,
    POL: 0.85,
    DOT: 7,
    LINK: 15,
    UNI: 12,
    ATOM: 10,
    APT: 12,
    ARB: 1.2,
    OP: 2.5,
    NEAR: 6,
    FTM: 1.2,
    ALGO: 0.4,
    VET: 0.05
  };
  
  const pricesMap: Record<string, CryptoPrice> = {};
  
  symbols.forEach(symbol => {
    if (fallbackPrices[symbol]) {
      pricesMap[symbol] = {
        symbol,
        name: symbol,
        current_price: fallbackPrices[symbol],
        price_change_percentage_24h: 0,
        market_cap: 0,
        total_volume: 0
      };
    }
  });
  
  return pricesMap;
}

// Add React Query support for prices
import { useQuery } from '@tanstack/react-query';

export function useCryptoPrices(symbols: string[]) {
  return useQuery({
    queryKey: ['crypto-prices', [...symbols].sort()],
    queryFn: () => getCryptoPrices(symbols),
    staleTime: 60000, // 60 seconds stale time for general prices
    refetchInterval: 120000, // 2 minutes background refresh
    gcTime: 600000, // 10 minutes cache retention
  });
}

export function useRealtimeCryptoPrices(symbols: string[]) {
  return useQuery({
    queryKey: ['realtime-prices', [...symbols].sort()],
    queryFn: () => getRealtimeCryptoPrices(symbols),
    staleTime: 15000, // 15 seconds stale time (Bybit/Standard REST polling)
    refetchInterval: 30000, // 30 seconds background refresh
    gcTime: 300000, // 5 minutes cache retention
  });
}

export async function getCryptoPrices(symbols: string[]): Promise<Record<string, CryptoPrice>> {
  const now = Date.now();
  
  if (cryptoPricesCache && (now - lastPricesFetchTime) < PRICES_CACHE_DURATION) {
    const hasAllSymbols = symbols.every(s => cryptoPricesCache![s]);
    if (hasAllSymbols) {
      return cryptoPricesCache;
    }
  }

  // Return the in-flight promise if one is already running, so concurrent
  // callers share a single network request instead of each firing their own.
  if (inFlightPrices) return inFlightPrices;

  inFlightPrices = (async () => {
    try {
      if (SUPABASE_CONFIGURED) {
        try {
          const { data, error } = await invokeWithTimeout('crypto-prices', { symbols, type: 'markets' });
          if (error) throw error;
          const pricesMap = ((data as any)?.data || data) as Record<string, CryptoPrice>;
          cryptoPricesCache = pricesMap;
          lastPricesFetchTime = Date.now();
          return pricesMap;
        } catch (error) {
          console.warn('[crypto-prices] Supabase edge function unavailable, using fallback:', (error as Error)?.message ?? error);
        }
      }

      // Try public API fallback (CoinGecko)
      try {
        const ids = symbols.map(s => {
          const mapping: Record<string, string> = {
            BTC: 'bitcoin', ETH: 'ethereum', USDT: 'tether', USDC: 'usd-coin',
            SOL: 'solana', TON: 'the-open-network', XMR: 'monero', LTC: 'litecoin',
            XRP: 'ripple', BNB: 'binancecoin', TRX: 'tron', MATIC: 'matic-network',
            POL: 'polygon-ecosystem-token', ARB: 'arbitrum', OP: 'optimism'
          };
          return mapping[s] || s.toLowerCase();
        }).join(',');

        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`);
        if (response.ok) {
          const data = await response.json();
          const fallbackMap: Record<string, CryptoPrice> = {};
          symbols.forEach(s => {
            const id = Object.keys(data).find(key => key.toLowerCase() === s.toLowerCase() || (s === 'BTC' && key === 'bitcoin') || (s === 'ETH' && key === 'ethereum'));
            if (id && data[id]) {
              fallbackMap[s] = {
                symbol: s, name: s,
                current_price: data[id].usd,
                price_change_percentage_24h: data[id].usd_24h_change || 0,
                market_cap: data[id].usd_market_cap || 0,
                total_volume: data[id].usd_24h_vol || 0
              };
            }
          });
          if (Object.keys(fallbackMap).length > 0) {
            cryptoPricesCache = fallbackMap;
            lastPricesFetchTime = Date.now();
            return fallbackMap;
          }
        }
      } catch (e) {
        console.warn('[crypto-prices] CoinGecko fallback failed:', (e as Error)?.message ?? e);
      }

      return cryptoPricesCache || generateFallbackPrices(symbols);
    } finally {
      inFlightPrices = null;
    }
  })();

  return inFlightPrices;
}

export async function getRealtimeCryptoPrices(symbols: string[]): Promise<Record<string, CryptoPrice>> {
  const now = Date.now();
  
  if (realtimePricesCache && (now - lastRealtimeFetchTime) < REALTIME_CACHE_DURATION) {
    const hasAllSymbols = symbols.every(s => realtimePricesCache![s]);
    if (hasAllSymbols) {
      return realtimePricesCache;
    }
  }

  if (inFlightRealtime) return inFlightRealtime;

  inFlightRealtime = (async () => {
    try {
      if (SUPABASE_CONFIGURED) {
        try {
          const { data, error } = await invokeWithTimeout('crypto-prices', { symbols, type: 'simple' });
          if (error) throw error;
          const pricesMap = ((data as any)?.data || data) as Record<string, CryptoPrice>;
          realtimePricesCache = pricesMap;
          lastRealtimeFetchTime = Date.now();
          return pricesMap;
        } catch (error) {
          console.warn('[crypto-prices] Realtime edge function unavailable, using fallback:', (error as Error)?.message ?? error);
        }
      }

      // Try public API fallback (Binance Public API)
      try {
        const results = await Promise.all(symbols.map(async s => {
          try {
            const pair = s === 'USDT' ? 'USDCUSDT' : `${s}USDT`;
            const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
            if (res.ok) {
              const data = await res.json();
              return { symbol: s, price: parseFloat(data.lastPrice), change: parseFloat(data.priceChangePercent), vol: parseFloat(data.quoteVolume) };
            }
          } catch (e) { return null; }
          return null;
        }));

        const fallbackMap: Record<string, CryptoPrice> = {};
        results.forEach(r => {
          if (r) {
            fallbackMap[r.symbol] = { symbol: r.symbol, name: r.symbol, current_price: r.price, price_change_percentage_24h: r.change, market_cap: 0, total_volume: r.vol };
          }
        });

        if (Object.keys(fallbackMap).length > 0) {
          realtimePricesCache = fallbackMap;
          lastRealtimeFetchTime = Date.now();
          return fallbackMap;
        }
      } catch (e) {
        console.warn('[crypto-prices] Binance fallback failed:', (e as Error)?.message ?? e);
      }

      return realtimePricesCache || cryptoPricesCache || generateFallbackPrices(symbols);
    } finally {
      inFlightRealtime = null;
    }
  })();

  return inFlightRealtime;
}

export async function getHistoricalPrices(symbol: string, days: number = 30): Promise<HistoricalPrice[]> {
  if (!SUPABASE_CONFIGURED) return [];
  try {
    const { data, error } = await invokeWithTimeout('crypto-prices', { symbols: [symbol], days, type: 'historical' });
    if (error) throw error;
    return ((data as any)?.data || data) as HistoricalPrice[];
  } catch (error) {
    console.warn('[crypto-prices] Historical fetch failed:', (error as Error)?.message ?? error);
    return [];
  }
}

export async function getIntradayPrices(symbol: string): Promise<HistoricalPrice[]> {
  if (!SUPABASE_CONFIGURED) return [];
  try {
    const { data, error } = await invokeWithTimeout('crypto-prices', { symbols: [symbol], days: 1, type: 'historical' });
    if (error) throw error;
    return ((data as any)?.data || data) as HistoricalPrice[];
  } catch (error) {
    console.warn('[crypto-prices] Intraday fetch failed:', (error as Error)?.message ?? error);
    return [];
  }
}

// Calculate floating price based on premium percentage (Bybit-style)
export function calculateFloatingPrice(
  marketPrice: number,
  premiumPercentage: number
): number {
  return marketPrice * (1 + premiumPercentage / 100);
}

// Calculate premium percentage from fixed price and market price
export function calculatePremiumFromPrice(
  fixedPrice: number,
  marketPrice: number
): number {
  if (marketPrice === 0) return 0;
  return ((fixedPrice / marketPrice) - 1) * 100;
}

// Get price range based on premium (for premium indicator)
export function getPriceRange(
  marketPrice: number,
  minPremium: number = -10,
  maxPremium: number = 100
): { minPrice: number; maxPrice: number } {
  return {
    minPrice: calculateFloatingPrice(marketPrice, minPremium),
    maxPrice: calculateFloatingPrice(marketPrice, maxPremium)
  };
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  } else if (price >= 1) {
    return price.toFixed(2);
  } else {
    return price.toFixed(4);
  }
}

// Cache for exchange rates
let exchangeRatesCache: ExchangeRates | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();

  if (exchangeRatesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return exchangeRatesCache;
  }

  if (inFlightExchangeRates) return inFlightExchangeRates;

  const FALLBACK_RATES: ExchangeRates = { USD: 1, NGN: 1470, EUR: 0.92, GBP: 0.79, GHS: 15.50, KES: 129.50, ZAR: 18.50 };

  inFlightExchangeRates = (async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      exchangeRatesCache = data.rates;
      lastFetchTime = Date.now();
      return data.rates as ExchangeRates;
    } catch (error) {
      console.warn('[exchange-rates] Fetch failed, using fallback:', (error as Error)?.message ?? error);
      return exchangeRatesCache ?? FALLBACK_RATES;
    } finally {
      inFlightExchangeRates = null;
    }
  })();

  return inFlightExchangeRates;
}

export async function convertCurrency(usdAmount: number, toCurrency: string): Promise<number> {
  const rates = await getExchangeRates();
  const rate = rates[toCurrency] || 1;
  return usdAmount * rate;
}

// Legacy function for backward compatibility
export function convertToNGN(usdAmount: number, usdToNgnRate: number = 1470): number {
  return usdAmount * usdToNgnRate;
}

// Convert NGN amount to another currency
export async function convertFromNGN(ngnAmount: number, toCurrency: string): Promise<number> {
  if (toCurrency === 'NGN') {
    return ngnAmount;
  }
  
  const rates = await getExchangeRates();
  const ngnRate = rates['NGN'];
  const targetRate = rates[toCurrency];
  
  if (!ngnRate || ngnRate === 0) {
    throw new Error('NGN exchange rate not available');
  }
  
  if (!targetRate || targetRate === 0) {
    throw new Error(`Exchange rate for ${toCurrency} not available`);
  }
  
  const usdAmount = ngnAmount / ngnRate;
  return usdAmount * targetRate;
}

// Convert any currency amount to USD
export async function convertToUSD(amount: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === 'USD') {
    return amount;
  }
  
  const rates = await getExchangeRates();
  const fromRate = rates[fromCurrency];
  
  if (!fromRate || fromRate === 0) {
    throw new Error(`Exchange rate for ${fromCurrency} not available`);
  }
  
  // Convert to USD (rates are relative to USD = 1)
  return amount / fromRate;
}

// Get minimum and maximum offer limits in the specified currency
// Limits are based on USD: $3 minimum, $50,000 maximum
export async function getOfferLimits(currency: string): Promise<{ min: number; max: number }> {
  const MIN_USD = 3;
  const MAX_USD = 50000;
  
  if (currency === 'USD') {
    return { min: MIN_USD, max: MAX_USD };
  }
  
  try {
    const min = await convertCurrency(MIN_USD, currency);
    const max = await convertCurrency(MAX_USD, currency);
    
    return { 
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100
    };
  } catch (error) {
    throw new Error(`Cannot calculate limits for currency ${currency}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
