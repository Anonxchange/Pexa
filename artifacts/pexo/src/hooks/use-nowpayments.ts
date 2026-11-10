import { supabase } from "@/lib/supabase";

export const getNowPaymentsStatus = async () => {
  const { data, error } = await supabase.functions.invoke("nowpayments", {
    body: { action: "status" },
  });
  if (error) throw error;
  return data;
};

export const getNowPaymentsCurrencies = async () => {
  const { data, error } = await supabase.functions.invoke("nowpayments", {
    body: { action: "currencies" },
  });
  if (error) throw error;
  return data;
};

export const getNowPaymentsEstimate = async (
  amount: number,
  currencyFrom: string,
  currencyTo: string
) => {
  const { data, error } = await supabase.functions.invoke("nowpayments", {
    body: { action: "estimate", amount, currency_from: currencyFrom, currency_to: currencyTo },
  });
  if (error) throw error;
  return data;
};

export const createNowPayment = async (params: {
  priceAmount: number;
  priceCurrency: string;
  payCurrency: string;
  orderId?: string;
  orderDescription?: string;
  ipnCallbackUrl?: string;
}) => {
  const { data, error } = await supabase.functions.invoke("nowpayments", {
    body: {
      action: "create-payment",
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency,
      pay_currency: params.payCurrency,
      order_id: params.orderId,
      order_description: params.orderDescription,
      ipn_callback_url: params.ipnCallbackUrl,
    },
  });
  if (error) throw error;
  return data;
};

export const getNowPaymentStatus = async (paymentId: string) => {
  const { data, error } = await supabase.functions.invoke("nowpayments", {
    body: { action: "payment-status", payment_id: paymentId },
  });
  if (error) throw error;
  return data;
};

export const createNowPaymentsInvoice = async (params: {
  priceAmount: number;
  priceCurrency: string;
  orderId?: string;
  orderDescription?: string;
  successUrl?: string;
  cancelUrl?: string;
  ipnCallbackUrl?: string;
}) => {
  const { data, error } = await supabase.functions.invoke("nowpayments", {
    body: {
      action: "create-invoice",
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency,
      order_id: params.orderId,
      order_description: params.orderDescription,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      ipn_callback_url: params.ipnCallbackUrl,
    },
  });
  if (error) throw error;
  return data;
};
