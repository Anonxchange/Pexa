import { ShoppingCart, Trash2, Plus, Minus, ExternalLink, Loader2 } from '@/lib/icons';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/hooks/use-shopify-cart";
import { useState, useEffect, type ReactElement } from "react";

// Payment-method badges as pure inline SVG — drawn directly as markup, not
// loaded as a resource, so img-src (which only governs <img>/background-image/
// SVG <image href>) never enters the picture. Colors use SVG *attributes*
// (fill="...") rather than the style prop, so a strict style-src without
// 'unsafe-inline' can't strip them either. These are simplified, original
// glyphs suggestive of each brand — not traced copies of the official
// trademarked logos. If you need the exact official marks (some brands'
// usage guidelines require their unmodified asset), download each one from
// the provider's brand-kit, host it locally, and allow that path in img-src.
function AmazonPayBadge() {
  return (
    <svg viewBox="0 0 120 40" className="flex-1 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="20" fill="#E8DCC8" />
      <text x="60" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111111" fontFamily="sans-serif">amazon</text>
      <path d="M 40 25 Q 60 32 80 25" stroke="#111111" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <text x="60" y="34" textAnchor="middle" fontSize="7" fontWeight="600" fill="#111111" fontFamily="sans-serif">pay</text>
    </svg>
  );
}

function GooglePayBadge() {
  return (
    <svg viewBox="0 0 120 40" className="flex-1 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="20" fill="#111111" />
      <circle cx="38" cy="20" r="7" fill="#4285F4" />
      <path d="M38 20 A7 7 0 0 1 45 20" fill="#EA4335" />
      <path d="M38 13 A7 7 0 0 0 31.5 23" fill="#FBBC05" />
      <path d="M33 26 A7 7 0 0 0 45 20" fill="#34A853" />
      <text x="72" y="25" textAnchor="middle" fontSize="12" fontWeight="600" fill="#FFFFFF" fontFamily="sans-serif">Pay</text>
    </svg>
  );
}

function PayPalBadge() {
  return (
    <svg viewBox="0 0 120 40" className="flex-1 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="20" fill="#FFC439" />
      <path d="M35 12 h8 a6 6 0 0 1 0 12 h-5 l-1 6 h-5 z" fill="#003087" />
      <path d="M41 12 h8 a6 6 0 0 1 0 12 h-5 l-1 6 h-5 z" fill="#009CDE" transform="translate(4,0)" />
      <text x="78" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1A2C56" fontFamily="sans-serif">PayPal</text>
    </svg>
  );
}

function ShopPayBadge() {
  return (
    <svg viewBox="0 0 120 40" className="flex-1 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="20" fill="#5A31F4" />
      <path d="M32 15 h10 l2 12 h-14 z" fill="#FFFFFF" />
      <path d="M35 15 v-2 a3 3 0 0 1 6 0 v2" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
      <text x="72" y="25" textAnchor="middle" fontSize="12" fontWeight="600" fill="#FFFFFF" fontFamily="sans-serif">Pay</text>
    </svg>
  );
}

export function CartSheet({
  renderTrigger,
  initiallyOpen = false,
}: {
  renderTrigger?: (itemCount: number) => ReactElement;
  initiallyOpen?: boolean;
} = {}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const { items, cartId, checkoutUrl, isLoading, updateQuantity, removeItem, refreshCart } = useCart();

  // Refresh cart when sheet opens — guarded by isLoading to prevent race conditions
  useEffect(() => {
    if (isOpen && cartId && !isLoading) {
      refreshCart();
    }
  }, [isOpen, cartId, isLoading, refreshCart]);

  const subtotal = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
  const currency = items[0]?.currency || "USD";
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (checkoutUrl) {
      setIsOpen(false);
      window.location.href = checkoutUrl;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {renderTrigger ? renderTrigger(itemCount) : (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0">
        <div className="p-6 pb-4 pr-12">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-base font-black tracking-tight uppercase">
              Cart ({itemCount})
            </SheetTitle>
            <SheetDescription className="sr-only">
              {items.length} {items.length === 1 ? 'item' : 'items'} ready for checkout
            </SheetDescription>
          </SheetHeader>
        </div>

        <Separator />

        <div className="flex-1 min-h-0">
          {isLoading && items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <div className="rounded-full bg-muted p-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Explore our Shopify store and add some amazing digital products to your cart.
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-5">
                {items.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        {/* Row 1: title + price, side by side like the reference layout */}
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-sm leading-snug line-clamp-2 break-words">
                            {item.title}
                          </p>
                          <p className="text-sm font-bold flex-shrink-0 whitespace-nowrap">
                            {Number(item.price).toFixed(2)} {item.currency}
                          </p>
                        </div>

                        {/* Row 2: Remove link (left) + circular qty stepper (right) */}
                        <div className="flex items-center justify-between gap-2 min-w-0 mt-1">
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                            className="text-xs underline underline-offset-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            Remove
                          </button>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() =>
                                item.quantity <= 1
                                  ? removeItem(item.id)
                                  : updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isLoading}
                              aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
                            >
                              {item.quantity <= 1 ? (
                                <Trash2 className="h-3 w-3" />
                              ) : (
                                <Minus className="h-3 w-3" />
                              )}
                            </Button>
                            <span className="w-5 text-center text-sm tabular-nums font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex-shrink-0 border-t p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-black">Subtotal</span>
              <span className="text-xl font-black">
                {subtotal.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground -mt-2">
              <span>Processing Fee</span>
              <span>Free</span>
            </div>

            <Button
              className="w-full h-14 rounded-full text-base font-bold"
              onClick={handleCheckout}
              disabled={isLoading || !checkoutUrl}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Complete Checkout
                  <span className="mx-2 opacity-50">|</span>
                  {subtotal.toFixed(2)} {currency}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              <span>Securely processed by Shopify Payments</span>
            </div>

            {/* Payment badges — plain colored text pills, no logo images, nothing for CSP to block */}
            <div className="flex items-center gap-2 pt-1">
              <AmazonPayBadge />
              <GooglePayBadge />
              <PayPalBadge />
              <ShopPayBadge />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
