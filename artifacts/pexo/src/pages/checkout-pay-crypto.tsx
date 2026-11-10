import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Lock, ShieldCheck, Clock, Bitcoin } from '@/lib/icons';
import { PexlyIcon } from "@/components/pexly-icon";
import { Button } from "@/components/ui/button";
import NowPaymentsCheckout from "@/components/nowpayments-checkout";
import { devLog } from "@/lib/dev-logger";

interface CryptoCheckoutContext {
  amount: number;
  currency: string;
  description: string;
  itemCount: number;
  recipientEmail?: string;
  orderId: string;
}

const STORAGE_KEY = "pexly:crypto-checkout-ctx";

export function CheckoutPayCrypto() {
  const [, setLocation] = useLocation();
  const [ctx, setCtx] = useState<CryptoCheckoutContext | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCtx(JSON.parse(raw));
        return;
      }
    } catch {
      /* ignore */
    }
    setLocation("/checkout");
  }, [setLocation]);

  if (!ctx) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Slim brand bar */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <PexlyIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Pexly</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Secure crypto payment
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setLocation("/checkout")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to checkout
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          {/* Payment column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Bitcoin className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Pay with Crypto</h1>
                <p className="text-sm text-muted-foreground">
                  Choose your asset and send the exact amount.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <NowPaymentsCheckout
                amount={ctx.amount}
                currency={ctx.currency}
                description={ctx.description}
                metadata={{
                  service: "gift-cards",
                  orderId: ctx.orderId,
                  items: ctx.itemCount,
                  recipientEmail: ctx.recipientEmail,
                }}
                onPaymentSuccess={(paymentData) => {
                  devLog.info("Payment successful", paymentData);
                  try {
                    sessionStorage.removeItem(STORAGE_KEY);
                  } catch {
                    /* ignore */
                  }
                }}
                onPaymentClose={() => devLog.info("Crypto payment cancelled")}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Non-custodial", sub: "We never hold your keys" },
                { icon: Clock, label: "Instant delivery", sub: "After 1 confirmation" },
                { icon: Lock, label: "Encrypted", sub: "End-to-end TLS" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/60 bg-card/50 p-3 flex items-center gap-2.5"
                >
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight">{label}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order recap */}
          <aside>
            <div className="sticky top-20 rounded-2xl border border-border/60 bg-card p-5 space-y-4">
              <h3 className="text-sm font-semibold">Order recap</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{ctx.itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-xs">{ctx.orderId.slice(0, 16)}…</span>
                </div>
                {ctx.recipientEmail && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground flex-shrink-0">Deliver to</span>
                    <span className="font-medium truncate">{ctx.recipientEmail}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total due</span>
                <span className="text-2xl font-extrabold">
                  ${ctx.amount.toFixed(2)}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/checkout")}
              >
                Change payment method
              </Button>
            </div>
          </aside>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Need help?{" "}
          <a href="/support" className="underline hover:text-foreground">
            Contact support
          </a>
        </p>
      </main>
    </div>
  );
}

export default CheckoutPayCrypto;
export { STORAGE_KEY as CRYPTO_CHECKOUT_STORAGE_KEY };
export type { CryptoCheckoutContext };
