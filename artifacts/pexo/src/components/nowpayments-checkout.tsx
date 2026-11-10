import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createNowPayment, getNowPaymentsEstimate, getNowPaymentStatus } from "@/hooks/use-nowpayments";
import { Copy, RefreshCw, Loader2 } from "@/lib/icons";
import { QRCodeSVG } from "qrcode.react";
import { SYMBOL_ICON_MAP } from "@/lib/crypto-icons";

// Extract the base token symbol from a NOWPayments currency code
function extractTokenSymbol(code: string): string {
  const c = code.toLowerCase();
  if (c.startsWith("usdt")) return "USDT";
  if (c.startsWith("usdc")) return "USDC";
  if (c.startsWith("bnb")) return "BNB";
  if (c.startsWith("btc") || c === "btcln") return "BTC";
  if (c.startsWith("eth")) return "ETH";
  if (c.startsWith("sol")) return "SOL";
  if (c.startsWith("trx")) return "TRX";
  if (c.startsWith("ton")) return "TON";
  if (c.startsWith("ltc")) return "LTC";
  if (c.startsWith("xrp")) return "XRP";
  if (c.startsWith("doge")) return "DOGE";
  if (c.startsWith("ada")) return "ADA";
  if (c.startsWith("matic") || c.startsWith("pol")) return "MATIC";
  if (c.startsWith("avax")) return "AVAX";
  if (c.startsWith("dot")) return "DOT";
  if (c.startsWith("near")) return "NEAR";
  if (c.startsWith("xlm")) return "XLM";
  if (c.startsWith("algo")) return "ALGO";
  if (c.startsWith("ftm")) return "FTM";
  if (c.startsWith("bch")) return "BCH";
  return c.replace(/[^a-z]/g, "").slice(0, 5).toUpperCase();
}

function MethodIcon({ symbol, size = "h-9 w-9" }: { symbol: string; size?: string }) {
  const [failed, setFailed] = useState(false);
  const tokenSymbol = extractTokenSymbol(symbol);
  const src = SYMBOL_ICON_MAP[tokenSymbol];
  if (!src || failed) {
    return (
      <div className={`${size} rounded-full bg-muted border border-border flex items-center justify-center shrink-0`}>
        <span className="text-[10px] font-bold text-muted-foreground">{tokenSymbol.slice(0, 3)}</span>
      </div>
    );
  }
  return (
    <div className={`${size} rounded-full bg-card border border-border flex items-center justify-center overflow-hidden shrink-0 p-1.5`}>
      <img src={src} alt={tokenSymbol} className="w-full h-full object-contain" onError={() => setFailed(true)} />
    </div>
  );
}

interface NowPaymentsCheckoutProps {
  amount: number;
  currency?: string;         // fiat currency of the price (e.g. "usd", "ngn")
  payCurrency?: string;      // crypto to pay with (e.g. "usdttrc20", "btc")
  description: string;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentClose?: () => void;
  onChangeMethod?: () => void;
  onChangeEmail?: () => void;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
  // Order details for the accordion
  methodLabel?: string;      // e.g. "USDT TRC20"
  methodBg?: string;
  methodSymbol?: string;
  networkName?: string;      // e.g. "Tron"
  email?: string;
  orderTitle?: string;
  orderSubline?: string;
  orderCurrency?: string;
  orderAmount?: number;
  orderImage?: string;
  invoiceId?: string;
}

const EXPIRE_SECONDS = 60 * 60; // 60 minutes

function useCountdown(startSeconds: number) {
  const [remaining, setRemaining] = useState(startSeconds);
  useEffect(() => {
    const t = setInterval(() => setRemaining(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const copy = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied!");
  };
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-start gap-3">
        <p className="text-lg font-bold text-foreground break-all leading-snug flex-1">{value}</p>
        <button
          onClick={copy}
          className="shrink-0 mt-0.5 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Copy className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

const NowPaymentsCheckout = ({
  amount,
  currency = "usd",
  payCurrency,
  description,
  onPaymentSuccess,
  onPaymentClose,
  onChangeMethod,
  onChangeEmail,
  disabled,
  metadata,
  methodLabel,
  methodBg = "#26A17B",
  methodSymbol = "₮",
  networkName,
  email,
  orderTitle,
  orderSubline,
  orderCurrency,
  orderAmount,
  orderImage,
  invoiceId,
}: NowPaymentsCheckoutProps) => {
  const numericAmount = typeof amount === "number" ? amount : parseFloat(String(amount) || "0");
  const cryptoCurrency = payCurrency ?? "btc";

  const [paymentData, setPaymentData] = useState<any>(null);
  const [estimatedAmount, setEstimatedAmount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [orderOpen, setOrderOpen] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const countdown = useCountdown(EXPIRE_SECONDS);
  const didCreate = useRef(false);

  // Fetch estimate
  useEffect(() => {
    if (!numericAmount || numericAmount <= 0) return;
    let cancelled = false;
    getNowPaymentsEstimate(numericAmount, currency, cryptoCurrency)
      .then((data) => {
        if (cancelled) return;
        if (!data.error) {
          const v = typeof data.estimated_amount === "number" ? data.estimated_amount : Number(data.estimated_amount);
          if (!isNaN(v) && v > 0) setEstimatedAmount(v);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [numericAmount, currency, cryptoCurrency]);

  // Auto-create payment once we have an estimate
  useEffect(() => {
    if (didCreate.current || !estimatedAmount || paymentData || processing) return;
    didCreate.current = true;
    handleCreatePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimatedAmount]);

  const handleCreatePayment = async () => {
    setProcessing(true);
    setPaymentError(null);
    try {
      const serviceMetadata = metadata ? { ...metadata } : {};
      const service = serviceMetadata.service as string || "";
      delete serviceMetadata.service;
      const structuredOrderId = service
        ? `${service}:${JSON.stringify(serviceMetadata)}`
        : `order_${Date.now()}`;

      const supabaseBaseUrl = (import.meta.env.VITE_SUPABASE_URL as string || "").trim().replace(/\/$/, "");
      const ipnCallbackUrl = `${supabaseBaseUrl}/functions/v1/nowpayments-webhook`;

      const data = await createNowPayment({
        priceAmount: numericAmount,
        priceCurrency: currency,
        payCurrency: cryptoCurrency,
        orderId: structuredOrderId,
        orderDescription: description,
        ipnCallbackUrl,
      });

      if (!data?.pay_address) throw new Error(data?.message || data?.error || "No payment address returned");
      setPaymentData(data);
    } catch (err: any) {
      const msg = err.message || "Failed to create payment";
      setPaymentError(msg);
      toast.error("Payment error", { description: msg });
      didCreate.current = false; // allow retry
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!paymentData?.payment_id) return;
    setCheckingStatus(true);
    try {
      const status = await getNowPaymentStatus(paymentData.payment_id);
      if (["finished", "confirmed"].includes(status.payment_status)) {
        onPaymentSuccess?.(status);
      } else {
        toast.info("Payment pending", { description: `Status: ${status.payment_status}` });
      }
    } catch (err: any) {
      toast.error("Status check failed", { description: err.message });
    } finally {
      setCheckingStatus(false);
    }
  };

  // Build wallet deep link
  const walletUri = paymentData
    ? buildWalletUri(cryptoCurrency, paymentData.pay_address, paymentData.pay_amount, paymentData.payin_extra_id)
    : null;

  const displayMethodLabel = methodLabel ?? cryptoCurrency.toUpperCase();
  const displayNetwork = networkName ?? "";
  const payAmountDisplay = paymentData?.pay_amount ?? estimatedAmount;
  const cryptoLabel = (paymentData?.pay_currency ?? cryptoCurrency).toUpperCase();

  // ── Loading / creating ──────────────────────────────────────────────
  if (processing || (!paymentData && !paymentError)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">
          {estimatedAmount ? "Creating payment…" : "Fetching price…"}
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (paymentError && !paymentData) {
    return (
      <div className="space-y-4 py-4">
        <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {paymentError}
        </div>
        <button
          onClick={() => { didCreate.current = false; handleCreatePayment(); }}
          className="w-full py-3 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-all"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Payment created ──────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <MethodIcon symbol={payCurrency ?? "btc"} />
        <h2 className="text-xl font-extrabold text-foreground">
          Pay with {displayMethodLabel}{displayNetwork ? ` on ${displayNetwork}` : ""}
        </h2>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950 border border-amber-400 dark:border-amber-600 rounded-2xl px-4 py-3.5">
        <span className="text-amber-600 dark:text-amber-400 text-base shrink-0 mt-0.5">⚠</span>
        <p className="text-sm text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
          Send only <strong>{displayMethodLabel}</strong>
          {displayNetwork ? ` on ${displayNetwork}` : ""}. Sending other tokens may result in loss of funds.
        </p>
      </div>

      {/* ── QR mode: large QR at top, address below ── */}
      {showQr && paymentData.pay_address ? (
        <>
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-5">
            {/* Large QR */}
            <QRCodeSVG
              value={walletUri || paymentData.pay_address}
              size={260}
              bgColor="white"
              fgColor="#111111"
              className="rounded-xl"
              imageSettings={{
                src: "",
                x: undefined,
                y: undefined,
                height: 0,
                width: 0,
                excavate: false,
              }}
            />
            {/* Address below QR */}
            <div className="w-full border-t border-border pt-4">
              <CopyRow label="Payment unique address" value={paymentData.pay_address} />
              {paymentData.payin_extra_id && (
                <div className="mt-4">
                  <CopyRow label="Memo / Tag (required)" value={paymentData.payin_extra_id} />
                </div>
              )}
            </div>
          </div>

          {/* Hide QR button */}
          <button
            onClick={() => setShowQr(false)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-muted hover:bg-muted/70 border border-border text-foreground font-semibold text-sm transition-all active:scale-[0.98]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              <path d="M14 14h3v3m0 4h4v-4m-7 4h3"/>
            </svg>
            Hide QR code
          </button>
        </>
      ) : (
        <>
          {/* ── Normal mode: address + amount copy rows ── */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
            <CopyRow label="Payment unique address" value={paymentData.pay_address} />

            {paymentData.payin_extra_id && (
              <CopyRow label="Memo / Tag (required)" value={paymentData.payin_extra_id} />
            )}

            <div className="border-t border-border" />

            {payAmountDisplay && (
              <CopyRow
                label="Amount to pay"
                value={`${payAmountDisplay} ${cryptoLabel}`}
              />
            )}
          </div>

          {/* Show QR button */}
          <button
            onClick={() => setShowQr(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-muted hover:bg-muted/70 border border-border text-foreground font-semibold text-sm transition-all active:scale-[0.98]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              <path d="M14 14h3v3m0 4h4v-4m-7 4h3"/>
            </svg>
            Scan QR with another device
          </button>
        </>
      )}

      {walletUri && (
        <a
          href={walletUri}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-all active:scale-[0.98] shadow-md"
        >
          Open your wallet
        </a>
      )}

      {/* Countdown */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2 text-sm font-semibold text-foreground">
          <span>Expires in</span>
          <span className="font-mono tabular-nums">{countdown}</span>
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <button
          onClick={handleCheckStatus}
          disabled={checkingStatus}
          className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${checkingStatus ? "animate-spin" : ""}`} />
          Check status
        </button>
      </div>

      {/* Order details accordion */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setOrderOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4"
        >
          <span className="font-semibold text-foreground">Order details</span>
          <span className="text-muted-foreground text-lg">{orderOpen ? "∧" : "∨"}</span>
        </button>

        {orderOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
            {/* Email */}
            {email && (
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Email address</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{email}</p>
                </div>
                {onChangeEmail && (
                  <button onClick={onChangeEmail} className="text-xs text-primary underline underline-offset-2 shrink-0 mt-1">
                    Change
                  </button>
                )}
              </div>
            )}

            {/* Payment method */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Payment method</p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {displayMethodLabel}{displayNetwork ? ` ${displayNetwork.toUpperCase()}` : ""}
                </p>
              </div>
              {onChangeMethod && (
                <button onClick={onChangeMethod} className="text-xs text-primary underline underline-offset-2 shrink-0 mt-1">
                  Change
                </button>
              )}
            </div>

            {/* Invoice id */}
            {(invoiceId ?? paymentData?.payment_id) && (
              <div>
                <p className="text-xs text-muted-foreground">Invoice id</p>
                <p className="text-xs font-mono text-foreground mt-0.5 break-all">
                  {invoiceId ?? paymentData.payment_id}
                </p>
              </div>
            )}

            <div className="border-t border-border" />

            {/* Product row */}
            {orderTitle && (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {orderImage
                    ? <img src={orderImage} alt={orderTitle} className="w-full h-full object-contain p-1.5" />
                    : <span className="text-xl">⚡</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{orderTitle}</p>
                  {orderSubline && <p className="text-xs text-muted-foreground mt-0.5">{orderSubline}</p>}
                  {orderAmount != null && orderCurrency && (
                    <p className="text-xs text-muted-foreground">
                      {orderAmount.toFixed(2)} {orderCurrency.toUpperCase()} value
                    </p>
                  )}
                </div>
                {payAmountDisplay && (
                  <p className="text-sm font-bold text-foreground shrink-0">
                    {payAmountDisplay} {cryptoLabel}
                  </p>
                )}
              </div>
            )}

            <div className="border-t border-border" />

            {/* Total */}
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-base font-extrabold text-foreground">
                {payAmountDisplay ? `${payAmountDisplay} ${cryptoLabel}` : "—"}
              </span>
            </div>

            {/* Conversion note */}
            {orderCurrency && orderCurrency.toUpperCase() !== "USD" && payAmountDisplay && orderAmount && (
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span>↻</span>
                <span>
                  We've converted this price from {orderCurrency.toUpperCase()} to {cryptoLabel} at our
                  rate of approximately 1 {cryptoLabel} ={" "}
                  {(orderAmount / Number(payAmountDisplay)).toFixed(2)} {orderCurrency.toUpperCase()}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Build a wallet deep-link URI based on the crypto
function buildWalletUri(currency: string, address: string, amount: number | null, memo?: string): string | null {
  if (!address) return null;
  const c = currency.toLowerCase();
  const amt = amount ? String(amount) : "";
  if (c.startsWith("btc")) return `bitcoin:${address}${amt ? `?amount=${amt}` : ""}`;
  if (c.startsWith("eth") || c.startsWith("usdc") || c.startsWith("usdt") && !c.includes("trc") && !c.includes("matic"))
    return `ethereum:${address}${amt ? `?value=${amt}` : ""}`;
  if (c.startsWith("ltc")) return `litecoin:${address}${amt ? `?amount=${amt}` : ""}`;
  if (c.startsWith("sol")) return `solana:${address}${amt ? `?amount=${amt}` : ""}`;
  if (c.startsWith("ton")) return `ton://transfer/${address}${amt ? `?amount=${Math.round(Number(amt) * 1e9)}` : ""}`;
  // For TRC20 / USDT Tron etc. — use tron: scheme
  if (c.includes("trc") || c.startsWith("trx")) return `tron:${address}${amt ? `?amount=${amt}` : ""}${memo ? `&memo=${memo}` : ""}`;
  return null;
}

export default NowPaymentsCheckout;
