import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* ============================= */
/* 🔹 Base Fetch Function */
/* ============================= */

async function fetchAirtime(params: Record<string, string>) {
  const url = new URL(`${SUPABASE_URL}/functions/v1/reloadly-airtime`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("No active session");

  const res = await fetch(url.toString(), {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to fetch airtime data");
  }

  return res.json();
}

/* ============================= */
/* 🔹 Types */
/* ============================= */

export interface AirtimeCountry {
  isoName: string;
  name: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  flagUrl: string;
  callingCodes: string[];
}

export interface AirtimeOperator {
  operatorId: number;
  name: string;
  bundle: boolean;
  data: boolean;
  pin: boolean;
  supportsLocalAmounts: boolean;
  denominationType: string;
  senderCurrencyCode: string;
  senderCurrencySymbol: string;
  destinationCurrencyCode: string;
  destinationCurrencySymbol: string;
  commission: number;
  minAmount: number | null;
  maxAmount: number | null;
  localMinAmount: number | null;
  localMaxAmount: number | null;
  country: {
    isoName: string;
    name: string;
    flagUrl: string;
  };
  logoUrls: string[];
  fixedAmounts: number[];
  fixedAmountsDescriptions: Record<string, string>;
  localFixedAmounts: number[];
  localFixedAmountsDescriptions: Record<string, string>;
}

/* ============================= */
/* 🔹 Hooks */
/* ============================= */

export function useAirtimeCountries() {
  return useQuery<AirtimeCountry[]>({
    queryKey: ["airtime-countries"],
    queryFn: () => fetchAirtime({ action: "countries" }),
    staleTime: 1000 * 60 * 60,
  });
}

export function useAirtimeOperators(countryCode?: string) {
  return useQuery<AirtimeOperator[]>({
    queryKey: ["airtime-operators", countryCode],
    enabled: !!countryCode,
    queryFn: () =>
      fetchAirtime({
        action: "operators",
        countryCode: countryCode!,
      }),
  });
}

export function useAutoDetectOperator(
  phone?: string,
  countryCode?: string
) {
  return useQuery<AirtimeOperator>({
    queryKey: ["airtime-auto-detect", phone, countryCode],
    enabled: !!phone && phone.length >= 6 && !!countryCode,
    queryFn: () =>
      fetchAirtime({
        action: "auto-detect", // ✅ FIXED
        phone: phone!,
        countryCode: countryCode!,
      }),
    retry: false,
  });
}

/* ============================= */
/* 🔹 Send Topup */
/* ============================= */

export async function sendTopup(params: {
  operatorId: number;
  amount: number;
  useLocalAmount?: boolean;
  recipientPhone: string;
  recipientCountryCode: string;
  senderPhone?: string;
  senderCountryCode?: string;
}) {
  const { data, error } = await supabase.functions.invoke("reloadly-topup", {
    body: params,
  });

  if (error) throw error;

  return data;
}

/* ============================= */
/* 🔹 Optional Combined Hook */
/* ============================= */

export function useAirtime(countryCode?: string, phone?: string) {
  const countries = useAirtimeCountries();
  const operators = useAirtimeOperators(countryCode);
  const autoDetect = useAutoDetectOperator(phone, countryCode);
  const processTopup = useMutation({
    mutationFn: sendTopup,
  });

  return {
    countries,
    operators,
    autoDetect,
    processTopup,
  };
}
