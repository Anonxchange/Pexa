import { useState } from 'react';
import { ShoppingCart, Package } from '@/lib/icons';
import { sanitizeImageUrl } from "@/lib/sanitize";
import { CartLoadingAnimation } from "@/components/shop/CartLoadingAnimation";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  location: string;
  status: string;
  user_id: string;
  variantId?: string;
  originalPrice?: number;
  soldCount?: number;
  rating?: number;
  reviewCount?: number;
}

interface ShopItemCardProps {
  product: Listing;
  onViewDetails: (product: Listing) => void;
  onAddToCart?: (product: Listing) => void;
}

export const ShopItemCard = ({ product, onViewDetails, onAddToCart }: ShopItemCardProps) => {
  const [loaded, setLoaded] = useState(false);

  const disc =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const soldLabel = product.soldCount
    ? product.soldCount >= 1000
      ? `${(product.soldCount / 1000).toFixed(0)}K+ sold`
      : `${product.soldCount}+ sold`
    : null;

  const hasImage = !!(product.images && product.images.length > 0);

  return (
    <div
      className="group cursor-pointer flex flex-col bg-background"
      onClick={() => onViewDetails(product)}
    >
      {/* Mobile: natural-height masonry | Desktop: fixed aspect-ratio, object-contain, no bg box */}
      <div className="bg-muted lg:bg-transparent overflow-hidden relative w-full lg:aspect-[3/4]">
        {hasImage ? (
          <>
            {/* Reserved slot + cart animation so the card is never a bare block of text */}
            {!loaded && (
              <div
                className="w-full aspect-[3/4] lg:absolute lg:inset-0 lg:h-full flex items-center justify-center bg-muted"
                aria-hidden="true"
              >
                <CartLoadingAnimation size={48} />
              </div>
            )}
            <img
              src={sanitizeImageUrl(product.images[0])}
              alt={product.title}
              className={`w-full h-auto block lg:absolute lg:inset-0 lg:h-full lg:object-contain transition-transform duration-500 group-hover:scale-105 ${
                loaded ? 'opacity-100' : 'absolute opacity-0 pointer-events-none'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full aspect-[3/4] lg:absolute lg:inset-0 lg:h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
        {disc && (
          <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">
            -{disc}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-1.5 pt-1.5 pb-2 gap-1">
        <p className="text-[12px] leading-snug text-foreground/90 line-clamp-2">
          {product.title}
        </p>

        {(soldLabel || product.rating) && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            {soldLabel && <span>🔥 {soldLabel}</span>}
            {product.rating && (
              <span className="flex items-center gap-0.5">
                <span className="text-foreground">★</span>
                {product.rating.toFixed(1)}
              </span>
            )}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-0.5">
          <div className="flex flex-col gap-0.5">
            <span className={`text-[14px] font-bold leading-none ${disc ? 'text-amber-500' : 'text-foreground'}`}>
              {product.currency} {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-muted-foreground line-through leading-none">
                {product.currency} {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-3.5 w-3.5 text-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
