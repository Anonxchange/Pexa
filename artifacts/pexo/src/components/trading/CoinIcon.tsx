import { useState } from "react";
import {
  getIconByAddress,
  getCryptoIconUrl,
  trustwalletUrls,
  cryptoIconsCdnUrl,
  livecoinwatchUrl,
} from "@/lib/crypto-icons";

interface CoinIconProps {
  symbol: string;
  address?: string;
  className?: string;
}

/**
 * Resolution order:
 *  1. Local registry by contract address  (zero network, instant)
 *  2. Local registry by symbol            (zero network, instant)
 *  3. TrustWallet CDN by address BSC      (network, address-authoritative)
 *  4. TrustWallet CDN by address ETH      (network, address-authoritative)
 *  5. TrustWallet CDN by address ARB      (network, address-authoritative)
 *  6. TrustWallet CDN by address OP       (network, address-authoritative)
 *  7. TrustWallet CDN by address Base     (network, address-authoritative)
 *  8. cryptocurrency-icons CDN by symbol  (covers ~450 classic coins)
 *  9. LiveCoinWatch CDN by symbol         (broader coverage, incl. ASTER + newer tokens)
 * 10. Letter avatar fallback
 */
type Stage =
  | "local"
  | "tw-0" | "tw-1" | "tw-2" | "tw-3" | "tw-4"
  | "cdn-symbol"
  | "lcw"
  | "fallback";

function initialStage(symbol: string, address?: string): Stage {
  if (getIconByAddress(address) || getCryptoIconUrl(symbol)) return "local";
  if (address) return "tw-0";
  return "cdn-symbol";
}

function Fallback({ symbol, className }: { symbol: string; className: string }) {
  return (
    <div className={`rounded-full bg-secondary flex items-center justify-center flex-shrink-0 ${className}`}>
      <span className="text-xs font-bold text-muted-foreground">
        {symbol.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export function CoinIcon({ symbol, address, className = "w-8 h-8" }: CoinIconProps) {
  // Derived-state pattern: store previous props so we can reset stage when
  // symbol or address changes (e.g. when exchange info loads addresses async).
  const [prevSymbol, setPrevSymbol] = useState(symbol);
  const [prevAddress, setPrevAddress] = useState(address);
  const [stage, setStage] = useState<Stage>(() => initialStage(symbol, address));

  if (prevSymbol !== symbol || prevAddress !== address) {
    setPrevSymbol(symbol);
    setPrevAddress(address);
    setStage(initialStage(symbol, address));
  }

  const advance = () => {
    setStage(prev => {
      switch (prev) {
        case "local":      return address ? "tw-0" : "cdn-symbol";
        case "tw-0":       return "tw-1";
        case "tw-1":       return "tw-2";
        case "tw-2":       return "tw-3";
        case "tw-3":       return "tw-4";
        case "tw-4":       return "cdn-symbol";
        case "cdn-symbol": return "lcw";
        case "lcw":        return "fallback";
        default:           return "fallback";
      }
    });
  };

  if (stage === "fallback") {
    return <Fallback symbol={symbol} className={className} />;
  }

  let src: string | undefined;

  if (stage === "local") {
    src = getIconByAddress(address) ?? getCryptoIconUrl(symbol);
  } else if (stage === "cdn-symbol") {
    src = cryptoIconsCdnUrl(symbol);
  } else if (stage === "lcw") {
    src = livecoinwatchUrl(symbol);
  } else if (address) {
    const idx = parseInt(stage.split("-")[1]);
    src = trustwalletUrls(address)[idx];
  }

  if (!src) {
    return <Fallback symbol={symbol} className={className} />;
  }

  return (
    <img
      key={src}
      src={src}
      alt={symbol}
      className={`rounded-full flex-shrink-0 bg-secondary object-cover ${className}`}
      onError={advance}
    />
  );
}
