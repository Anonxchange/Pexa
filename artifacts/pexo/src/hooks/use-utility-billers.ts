import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * UTILITY BILLS
 */

async function fetchBillers(params: Record<string, string>) {
  // Use supabase.functions.invoke for consistency if possible, 
  // but the original snippet used direct fetch to the function URL.
  // Let's stick to the user's preferred pattern but remove hardcoded keys.
  
  const { data: { session } } = await supabase.auth.getSession();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const url = new URL(`${supabaseUrl}/functions/v1/reloadly-billers`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  if (!session?.access_token) throw new Error("No active session");
  const res = await fetch(url.toString(), {
    headers: {
      apikey: anonKey!,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch billers");
  return res.json();
}

export interface Biller {
  id: number;
  name: string;
  countryCode: string;
  countryName: string;
  type: string;
  serviceType: string;
  localAmountSupported: boolean;
  localTransactionCurrencyCode: string;
  localTransactionFee: number;
  localTransactionFeeCurrencyCode: string;
  localTransactionFeePercentage: number;
  denominationType: string;
  minLocalTransactionAmount: number | null;
  maxLocalTransactionAmount: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  localFixedAmounts: number[] | null;
  fixedAmounts: number[] | null;
  fixedAmountsDescriptions: Record<string, string> | null;
  localFixedAmountsDescriptions: Record<string, string> | null;
}

export interface BillersResponse {
  content: Biller[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface UtilityCountry {
  isoName: string;
  name: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  flag: string;
  callingCodes: string[];
}

export function useUtilityCountries() {
  return useQuery<UtilityCountry[]>({
    queryKey: ["utility-countries"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const url = new URL(`${supabaseUrl}/functions/v1/reloadly-billers`);
      url.searchParams.set("action", "countries");

      if (!session?.access_token) throw new Error("No active session");
      const res = await fetch(url.toString(), {
        headers: {
          apikey: anonKey!,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch utility countries");
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
}

export function useUtilityBillers(countryCode?: string, serviceType?: string) {
  return useQuery<BillersResponse>({
    queryKey: ["utility-billers", countryCode, serviceType],
    queryFn: () => {
      const params: Record<string, string> = { action: "billers" };
      if (countryCode) params.countryISOCode = countryCode;
      if (serviceType) params.serviceType = serviceType;
      return fetchBillers(params);
    },
    staleTime: 1000 * 60 * 30,
  });
}

export async function payUtilityBill(params: {
  subscriberAccountNumber: string;
  amount: number;
  billerId: number;
  billerName?: string;
  billerType?: string;
  countryCode?: string;
  useLocalAmount?: boolean;
  referenceId?: string;
  additionalInfo?: Record<string, string> | null;
}) {
  const { data, error } = await supabase.functions.invoke("reloadly-utility-pay", {
    body: params,
  });
  if (error) throw error;
  return data;
}

export const SERVICE_TYPES = [
  { value: "ALL", label: "All Services" },
  { value: "ELECTRICITY_BILL_PAYMENT", label: "Electricity" },
  { value: "WATER_BILL_PAYMENT", label: "Water" },
  { value: "TV_BILL_PAYMENT", label: "TV / Cable" },
  { value: "INTERNET_BILL_PAYMENT", label: "Internet" },
  { value: "TOLL_BILL_PAYMENT", label: "Toll" },
  { value: "EDUCATION_BILL_PAYMENT", label: "Education" },
  { value: "INSURANCE_BILL_PAYMENT", label: "Insurance" },
  { value: "TAX_BILL_PAYMENT", label: "Tax" },
  { value: "GOVERNMENT_BILL_PAYMENT", label: "Government" },
] as const;

/**
 * GIFT CARDS / PRODUCTS
 */

export interface ReloadlyProduct {
  productId: number;
  productName: string;
  global: boolean;
  supportsPreOrder: boolean;
  senderFee: number;
  senderFeePercentage: number;
  discountPercentage: number;
  denominationType: string;
  recipientCurrencyCode: string;
  minRecipientDenomination: number | null;
  maxRecipientDenomination: number | null;
  fixedRecipientDenominations: number[] | null;
  logoUrls: string[];
  brand: {
    brandId: number;
    brandName: string;
  };
  country: {
    isoName: string;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  redeemInstruction: {
    concise: string;
    verbose: string;
  };
}

export interface ProductsResponse {
  content: ReloadlyProduct[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
}

export function useReloadlyProducts(params: { countryCode?: string; productName?: string; page?: number; size?: number }) {
  return useQuery<ProductsResponse>({
    queryKey: ["reloadly-products", params],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("reloadly-products", {
        method: "GET",
        queryParams: params,
      });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });
}

export async function placeReloadlyOrder(params: {
  productId: number;
  quantity?: number;
  unitPrice: number;
  recipientEmail?: string;
  recipientPhone?: string;
  senderName?: string;
  customIdentifier?: string;
}) {
  const { data, error } = await supabase.functions.invoke("reloadly-order", {
    body: params,
  });
  if (error) throw error;
  return data;
}
