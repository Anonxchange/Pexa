/**
 * Coin icon registry — all lookups are by contract address first, symbol second.
 * Local paths in /public/logos/ are served with zero network calls.
 * External fallbacks (TrustWallet CDN, cryptocurrency-icons CDN) are only
 * used by CoinIcon.tsx when neither the address nor symbol is in this registry.
 */

// ── Local icon paths (served from /public/logos/) ─────────────────────────────
export const SYMBOL_ICON_MAP: Record<string, string> = {
  // Layer 1 blockchains
  BTC:    "/logos/bitcoin-btc-logo.svg",
  ETH:    "/logos/ethereum-eth-logo.svg",
  SOL:    "/logos/solana-sol-logo.svg",
  BNB:    "/logos/binance-coin-bnb-logo.svg",
  WBNB:   "/logos/wbnb-logo.png",
  ADA:    "/logos/ada-logo.png",
  AVAX:   "/logos/avalanche-avax-logo.svg",
  DOT:    "/logos/dot-logo.png",
  NEAR:   "/logos/near-logo.png",
  ATOM:   "/logos/atom-logo.png",
  APT:    "/logos/apt-logo.png",
  SUI:    "/logos/sui-logo.png",
  SEI:    "/logos/sei-logo.png",
  ALGO:   "/logos/algo-logo.png",
  XLM:    "/logos/xlm-logo.png",
  HBAR:   "/logos/hbar-logo.png",
  TON:    "/logos/ton-logo.png",
  BCH:    "/logos/bch-logo.png",
  LTC:    "/logos/ltc-logo.png",
  XRP:    "/logos/xrp-logo.png",
  DOGE:   "/logos/doge-logo.png",
  TRX:    "/logos/trx-logo.png",
  ETC:    "/logos/etc-logo.png",
  ZEC:    "/logos/zec-logo.png",
  DASH:   "/logos/dash-logo.png",
  FTM:    "/logos/ftm-logo.png",
  // Layer 2 / rollups
  MATIC:  "/logos/polygon-matic-logo.svg",
  POL:    "/logos/polygon-matic-logo.svg",
  ARB:    "/logos/arbitrum-arb-logo.svg",
  OP:     "/logos/optimism-ethereum-op-logo.svg",
  // Stablecoins
  USDT:   "/logos/tether-usdt-logo.svg",
  USDC:   "/logos/usd-coin-usdc-logo.svg",
  USDCE:  "/logos/usdce-logo.png",
  USD1:   "/logos/usd1-logo.png",
  USDE:   "/logos/usde-logo.png",
  PYUSD:  "/logos/pyusd-logo.png",
  DAI:    "/logos/dai-logo.png",
  // DeFi blue chips
  WETH:   "/logos/weth-logo.png",
  WBTC:   "/logos/wbtc-logo.png",
  LINK:   "/logos/chainlink-link-logo.svg",
  UNI:    "/logos/uniswap-uni-logo.svg",
  AAVE:   "/logos/aave-logo.png",
  CAKE:   "/logos/cake-logo.png",
  SUSHI:  "/logos/sushi-logo.png",
  SNX:    "/logos/snx-logo.png",
  // NFT / gaming
  SAND:   "/logos/sand-logo.png",
  GALA:   "/logos/gala-logo.png",
  CHZ:    "/logos/chz-logo.png",
  ENJ:    "/logos/enj-logo.png",
  // AI / infra
  FET:    "/logos/fet-logo.png",
  RENDER: "/logos/render-logo.png",
  // RWA / new DeFi
  ENA:    "/logos/ena-logo.png",
  ONDO:   "/logos/ondo-logo.png",
  PENDLE: "/logos/pendle-logo.png",
  WLD:    "/logos/wld-logo.png",
  MNT:    "/logos/mnt-logo.png",
  // Data / analytics
  ARKM:   "/logos/arkm-logo.png",
  BLUR:   "/logos/blur-logo.png",
  PYTH:   "/logos/pyth-logo.png",
  JUP:    "/logos/jup-logo.png",
  INJ:    "/logos/inj-logo.png",
  FIL:    "/logos/fil-logo.png",
  // Other
  VIRTUAL: "/logos/virtual-logo.png",
  SHIB:   "/logos/shib-logo.png",
  MNT2:   "/logos/mnt-logo.png",
};

// ── Contract-address → local icon (case-insensitive match) ────────────────────
// Keyed by EVM contract address. Covers the most common AsterDEX spot tokens
// across BSC, Ethereum, and Arbitrum so address-based lookup hits the local
// registry first (zero network round-trip).
export const CONTRACT_ICON_MAP: Record<string, string> = {
  // ── BSC (chainId 56) ────────────────────────────────────────────────────────
  "0x55d398326f99059fF775485246999027B3197955": "/logos/tether-usdt-logo.svg",      // USDT
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d": "/logos/usd-coin-usdc-logo.svg",    // USDC
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": "/logos/wbnb-logo.png",             // WBNB
  "0x2170Ed0880ac9A755fd29B2688956BD959F933F8": "/logos/ethereum-eth-logo.svg",     // ETH (BSC)
  "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": "/logos/bitcoin-btc-logo.svg",      // BTCB
  "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE": "/logos/xrp-logo.png",              // XRP
  "0xbA2aE424d960c26247Dd6c32edC70B295c744C43": "/logos/doge-logo.png",             // DOGE
  "0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3": "/logos/trx-logo.png",              // TRX
  "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94": "/logos/ltc-logo.png",              // LTC
  "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402": "/logos/dot-logo.png",              // DOT
  "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD": "/logos/chainlink-link-logo.svg",   // LINK
  "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3": "/logos/dai-logo.png",              // DAI
  "0xfb6115445Bff7b52FeB98650C87f44907E58f802": "/logos/aave-logo.png",             // AAVE
  "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D": "/logos/shib-logo.png",             // SHIB
  "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1": "/logos/uniswap-uni-logo.svg",      // UNI
  "0x1CE0c2827e2eF14D5C4f29a091d735A204794041": "/logos/avalanche-avax-logo.svg",   // AVAX
  "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF": "/logos/solana-sol-logo.svg",       // SOL (BSC)
  "0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d": "/logos/usd1-logo.png",             // USD1
  "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47": "/logos/ada-logo.png",              // ADA
  "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153": "/logos/fil-logo.png",              // FIL
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": "/logos/cake-logo.png",             // CAKE
  "0xa2B726B1145A4773F68593CF171187d8EBe4d495": "/logos/inj-logo.png",              // INJ
  // ── Ethereum mainnet (chainId 1) ─────────────────────────────────────────────
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": "/logos/tether-usdt-logo.svg",      // USDT
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "/logos/usd-coin-usdc-logo.svg",   // USDC
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "/logos/dai-logo.png",              // DAI
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": "/logos/wbtc-logo.png",             // WBTC
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": "/logos/weth-logo.png",             // WETH
  "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE": "/logos/shib-logo.png",             // SHIB
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9": "/logos/aave-logo.png",             // AAVE
  "0x514910771AF9Ca656af840dff83E8264EcF986CA": "/logos/chainlink-link-logo.svg",   // LINK
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": "/logos/uniswap-uni-logo.svg",      // UNI
  "0x3c3a81e81dc49A522A592e7622A7E711c06bf354": "/logos/mnt-logo.png",              // MNT
  "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3": "/logos/usde-logo.png",             // USDe
  "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8": "/logos/pyusd-logo.png",            // PYUSD
  "0x582d872A1B094FC48F5DE31D3B73F2D9bE47def1": "/logos/ton-logo.png",              // TON
  "0x3845badAde8e6dFF049820680d1F14bD3903a5d0": "/logos/sand-logo.png",             // SAND
  "0xd1d2Eb1B1e90B638588728b4130137D262C87cae": "/logos/gala-logo.png",             // GALA
  "0x3506424F91fD33084466F402d5D97f05F8e3b4AF": "/logos/chz-logo.png",              // CHZ
  "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F": "/logos/snx-logo.png",              // SNX
  "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2": "/logos/sushi-logo.png",            // SUSHI
  "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c": "/logos/enj-logo.png",              // ENJ
  "0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85": "/logos/fet-logo.png",              // FET
  "0x57e114B691Db790C35207b2e685D4A43181e6061": "/logos/ena-logo.png",              // ENA
  "0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24": "/logos/render-logo.png",           // RENDER
  "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3": "/logos/ondo-logo.png",             // ONDO
  "0x808507121B80c02388fAd14726482e061B8da827": "/logos/pendle-logo.png",           // PENDLE
  "0x5283D291DBCF85356A21bA090E6db59121208b44": "/logos/blur-logo.png",             // BLUR
  "0x6E2a43be0B1d33b726f0CA3b8de60b3482b8b050": "/logos/arkm-logo.png",             // ARKM
  // ── Arbitrum (chainId 42161) ──────────────────────────────────────────────────
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "/logos/tether-usdt-logo.svg",      // USDT
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "/logos/usd-coin-usdc-logo.svg",    // USDC
  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": "/logos/usdce-logo.png",            // USDC.e
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "/logos/wbtc-logo.png",             // WBTC
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "/logos/weth-logo.png",             // WETH
  "0x912CE59144191C1204E64559FE8253a0e49E6548": "/logos/arbitrum-arb-logo.svg",     // ARB
  "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": "/logos/chainlink-link-logo.svg",   // LINK
  "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196": "/logos/aave-logo.png",             // AAVE
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": "/logos/dai-logo.png",              // DAI
  // ── Optimism (chainId 10) ─────────────────────────────────────────────────────
  "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1": "/logos/wld-logo.png",              // WLD
  // ── Base (chainId 8453) ───────────────────────────────────────────────────────
  "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b": "/logos/virtual-logo.png",          // VIRTUAL
};

/**
 * Look up a local icon path by contract address.
 * Case-insensitive — callers don't need to checksum first.
 * Returns undefined when the address is not in the registry.
 */
export function getIconByAddress(address: string | undefined): string | undefined {
  if (!address) return undefined;
  const lower = address.toLowerCase();
  for (const [key, path] of Object.entries(CONTRACT_ICON_MAP)) {
    if (key.toLowerCase() === lower) return path;
  }
  return undefined;
}

/**
 * Look up a local icon path by token symbol.
 * Returns undefined when the symbol is not in the local registry.
 */
export function getCryptoIconUrl(symbol: string): string | undefined {
  return SYMBOL_ICON_MAP[symbol.toUpperCase()];
}

/**
 * Backward-compatible alias for files that import `cryptoIconUrls` directly.
 * All values are local /logos/ paths — no external hotlinks.
 */
export const cryptoIconUrls: Record<string, string> = SYMBOL_ICON_MAP;

// ── External CDN fallbacks (used only by CoinIcon.tsx when local registry misses) ──

/**
 * TrustWallet CDN URLs to try for a given EVM contract address.
 * The caller should attempt them in sequence, stopping on the first 200.
 * Only called when address is provided but not found in CONTRACT_ICON_MAP.
 */
const TW_CHAINS = ["smartchain", "ethereum", "arbitrum", "optimism", "base"];

export function trustwalletUrls(address: string): string[] {
  return TW_CHAINS.map(
    chain =>
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/logo.png`,
  );
}

/**
 * Fallback icon URL for a token symbol via the cryptocurrency-icons CDN.
 * Covers ~450 classic crypto symbols (BTC, ETH, DOGE, BNB, ATOM, etc.)
 * Does NOT require a contract address — works for perpetuals/futures that
 * are synthetic instruments with no on-chain address.
 */
export function cryptoIconsCdnUrl(symbol: string): string {
  const s = symbol.toLowerCase().replace(/^1000/, "");
  return `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${s}.svg`;
}

/**
 * LiveCoinWatch CDN icon URL for a token symbol.
 * Broader coverage than cryptocurrency-icons — includes ASTER, newer DeFi
 * tokens, and many altcoins not in the classic cryptocurrency-icons set.
 * Images are 64×64 WebP.
 */
export function livecoinwatchUrl(symbol: string): string {
  const s = symbol.toLowerCase().replace(/^1000/, "");
  return `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${s}.webp`;
}
