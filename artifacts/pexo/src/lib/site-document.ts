export const siteMetadata = {
  title: "Pexly — Your wallet, your way to pay",
  description:
    "Pexly is a non-custodial crypto marketplace for people who use their own wallets to pay for digital services.",
  url: "https://www.pexly.app/",
  image: "https://www.pexly.app/hero-bg.webp",
  imageAlt: "Pexly — digital services with your own wallet",
  siteName: "Pexly",
} as const;

export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.pexly.app/#organization",
      name: "Pexly",
      alternateName: "Pexly",
      url: "https://www.pexly.app/",
      description:
        "Pexly is a non-custodial crypto marketplace for people who use their own wallets to pay for digital services.",
      foundingDate: "2024",
      logo: {
        "@type": "ImageObject",
        url: "https://www.pexly.app/favicon.svg",
        width: "512",
        height: "512",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "technical support",
          availableLanguage: ["English"],
          areaServed: "Worldwide",
        },
      ],
      sameAs: [],
      knowsAbout: ["Non-custodial wallets", "Digital services", "Cryptocurrency payments"],
      slogan: "Your wallet, your way to pay",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.pexly.app/#website",
      url: "https://www.pexly.app/",
      name: "Pexly",
      description:
        "A non-custodial crypto marketplace for digital services, mobile top ups, and utility payments.",
      publisher: {
        "@id": "https://www.pexly.app/#organization",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.pexly.app/#software",
      name: "Pexly Decentralized Software",
      description:
        "Pexly connects digital services with crypto users paying directly from wallets they control. Pexly does not custody user funds.",
      provider: {
        "@id": "https://www.pexly.app/#organization",
      },
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
} as const;

type EntryDocumentOptions = {
  basePath: string;
  development: boolean;
  entryFile: string;
  cssFiles?: string[];
};

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function createEntryDocument({
  basePath,
  development,
  entryFile,
  cssFiles = [],
}: EntryDocumentOptions) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const assetUrl = (file: string) => `${base}${file.replace(/^\/+/, "")}`;
  const stylesheets = cssFiles
    .map(
      (file) =>
        `<link rel="stylesheet" crossorigin href="${escapeAttribute(assetUrl(file))}" />`,
    )
    .join("\n    ");
  const viteClient = development
    ? `<script type="module" src="${escapeAttribute(assetUrl("@vite/client"))}"></script>`
    : "";
  const entryUrl = development ? assetUrl("src/main.tsx") : assetUrl(entryFile);
  const structuredData = JSON.stringify(siteStructuredData).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta property="csp-nonce" content="" />
    <meta name="cf-country" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <title>${escapeAttribute(siteMetadata.title)}</title>
    <meta name="description" content="${escapeAttribute(siteMetadata.description)}" />
    <meta property="og:title" content="${escapeAttribute(siteMetadata.title)}" />
    <meta property="og:description" content="A non-custodial crypto marketplace for digital services. Pay with your own wallet." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeAttribute(siteMetadata.url)}" />
    <meta property="og:image" content="${escapeAttribute(siteMetadata.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeAttribute(siteMetadata.imageAlt)}" />
    <meta property="og:site_name" content="${escapeAttribute(siteMetadata.siteName)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(siteMetadata.title)}" />
    <meta name="twitter:description" content="A non-custodial crypto marketplace for digital services. Pay with your own wallet." />
    <meta name="twitter:image" content="${escapeAttribute(siteMetadata.image)}" />
    <meta name="twitter:image:alt" content="${escapeAttribute(siteMetadata.imageAlt)}" />
    <link rel="icon" type="image/svg+xml" href="${escapeAttribute(assetUrl("favicon.svg"))}" />
    <script id="pexly-site-structured-data" type="application/ld+json">${structuredData}</script>
    ${stylesheets}
    ${viteClient}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="${escapeAttribute(entryUrl)}"></script>
  </body>
</html>`;
}
