import { Gift } from "@/lib/icons";
import { formatDenominationRange, getRecipientDenominationRange } from "@/lib/gift-card-denominations";
import { sanitizeImageUrl } from "@/lib/sanitize";

export function mapProducts(
  content: any[],
): { id: string; name: string; priceRange: string; discount: number; image: string }[] {
  return (content || []).map((card: any) => {
    const range = getRecipientDenominationRange(card);
    const currencyCode: string = range.currencyCode || card.recipientCurrencyCode || "USD";
    const { min, max } = range;

    return {
      id: String(card.productId),
      name: card.productName,
      priceRange:
        min != null && max != null
          ? formatDenominationRange(range)
          : `${currencyCode} ${min ?? "?"} – ${max ?? "?"}`,
      discount: card.discountPercentage || 0,
      image: sanitizeImageUrl(card.logoUrls?.[0]) || "",
    };
  });
}

export function ProductCardGrid({ card, onClick }: { card: any; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left group w-full">
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-secondary mb-2 relative border border-border group-hover:border-primary/30 transition-colors">
        {card.discount > 0 && (
          <span className="absolute top-2 left-2 z-10 text-[10px] font-bold bg-yellow-400 text-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            ↓ {card.discount}%
          </span>
        )}
        {card.image ? (
          <img
            src={card.image}
            alt={card.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Gift className="h-12 w-12" />
          </div>
        )}
      </div>
      <p className="text-foreground text-sm font-semibold leading-tight line-clamp-2 mb-0.5">{card.name}</p>
      <p className="text-muted-foreground text-xs">{card.priceRange}</p>
    </button>
  );
}
