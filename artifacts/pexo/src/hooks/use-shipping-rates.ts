import { useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface ShippingRate {
  logisticName: string;
  logisticAftName?: string;
  logisticPrice: number;
  logisticPriceCur?: string;
  minDeliveryTime?: number;
  maxDeliveryTime?: number;
}

export interface CalculateRatesInput {
  endCountryCode: string;
  endProvinceCode?: string;
  endCityCode?: string;
  products: Array<{ vid: string; quantity: number }>;
}

export function useShippingRates() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (input: CalculateRatesInput) => {
    if (!input.products?.length) {
      setRates([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = await getSupabase();

      const { data, error: fnError } = await supabase.functions.invoke('cj-freight', {
        body: input,
      });

      if (fnError) throw fnError;

      // CJ / edge error formats
      if (data?.error || data?.message?.toLowerCase?.().includes('error')) {
        throw new Error(data?.error || data?.message);
      }

      console.log('CJ FREIGHT RESPONSE:', data);

      // 🔥 FIX: CJ response is not always data[]
      const raw = data?.data;

      const list: ShippingRate[] =
        raw?.logistics ||
        raw?.list ||
        raw ||
        [];

      const safeList = Array.isArray(list) ? list : [];

      safeList.sort((a, b) => {
        const aPrice = Number(a?.logisticPrice || 0);
        const bPrice = Number(b?.logisticPrice || 0);
        return aPrice - bPrice;
      });

      setRates(safeList);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch shipping rates';

      setError(msg);
      setRates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRates([]);
    setError(null);
  }, []);

  return { rates, isLoading, error, calculate, reset };
}
