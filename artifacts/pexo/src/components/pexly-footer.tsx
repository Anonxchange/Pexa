import { Link } from "wouter";

const footerColumns = [
  {
    title: "Marketplace",
    links: [
      ["Gift Cards", "/gift-cards"],
      ["Mobile Top Up", "/wallet/mobile-topup"],
      ["Physical Products", "/shop"],
      ["Sell on Pexly", "/"],
      ["Order History", "/wallet"],
      ["Price Alerts", "/wallet"],
    ],
  },
  {
    title: "Wallet",
    links: [
      ["Connect Wallet", "/wallet"],
      ["Pay with BTC", "/wallet"],
      ["Pay with ETH", "/wallet"],
      ["Pay with USDT", "/wallet"],
      ["Pay with USDC", "/wallet"],
      ["Escrow", "/support"],
      ["Fees", "/support"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/support"],
      ["Dispute Resolution", "/support"],
      ["Contact Us", "/contact"],
      ["FAQ", "/support"],
      ["Report a Seller", "/support"],
      ["Status", "/support"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Pexly", "/about-us"],
      ["Blog", "/blogs"],
      ["Careers", "/career"],
      ["Teams", "/teams"],
      ["Terms", "/"],
      ["Privacy", "/"],
    ],
  },
];

export function PexlyFooter() {
  return (
    <footer className="footer">
      <div className="padding-global">
        <div className="container-large">
          <div className="footer-content-box">
            <div className="footer-content-upper">
              <div className="footer-upper-left-content">
                <div className="footer-upper-logo-block">
                  <span className="px-flogo"><span className="px-logo-mark">p</span>pexly</span>
                </div>
                <div className="footer-upper-text-block">
                  <p className="p-regular text-lightgrey">
                    Pexly is one decentralized marketplace for shopping with crypto.
                    <br /><br />
                    Buy gift cards, top up mobile phones and order physical products, all from your own wallet.
                  </p>
                </div>
                <div className="footer-upper-coin-icon-block" aria-hidden="true">
                  <img
                    src="/assets/footer-coins.avif"
                    className="footer-upper-coin"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="footer-upper-text-block">
                  <p className="p-regular light-gray">Decentralized. Non-custodial. Borderless.</p>
                </div>
                <div className="footer-social-link-wrap">
                  <Link href="/" className="footer-social-link-block" aria-label="Pexly on X">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 12" fill="none" className="footer-social-link-icon">
                      <path d="M10.4416 0H12.3925L8.1304 4.87129L13.1444 11.5H9.21849L6.1436 7.4797L2.62515 11.5H0.673105L5.23183 6.2896L0.421875 0H4.44747L7.22689 3.6747L10.4416 0ZM9.7569 10.3323H10.8379L3.86009 1.10636H2.70006L9.7569 10.3323Z" fill="currentColor" />
                    </svg>
                  </Link>
                  <Link href="/" className="footer-social-link-block" aria-label="Pexly on LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className="footer-social-link-icon">
                      <path d="M17 2.75H3V17.52H17V2.75ZM6.14 17.52H3.25V6.63H6.14V17.52ZM4.69 5.89A1.57 1.57 0 1 1 4.69 2.75a1.57 1.57 0 0 1 0 3.14ZM17 17.52h-2.89v-6.07c0-1.45-.53-1.68-1.3-1.68-.79 0-1.55.6-1.55 1.72v6.03H8.38V6.63h2.77v1.51h.04c.28-.57 1.26-1.79 3-1.79 1.9 0 2.81 1.2 2.81 3.55v7.62Z" fill="currentColor" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="footer-upper-right-content">
                {footerColumns.map(column => (
                  <div className="footer-links-wrapper" key={column.title}>
                    <div className="footer-link-title-block">
                      <div className="footer-link-title">{column.title}</div>
                    </div>
                    <div className="footer-links-block">
                      {column.links.map(([label, href]) => (
                        <Link href={href} className="footer-link-item" key={label}>
                          <div className="p-regular light-gray">{label}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="footer-bottom-content-wrap">
              <div className="footer-big-logo-wrap">
                <div className="px-big">PEXLY</div>
                <div className="footer-logo-line" />
              </div>
              <div className="footer-bottom-text-wrapper">
                <div className="footer-bottom-text-left">
                  <p className="p-xs light-gray">
                    2026 — All rights reserved. Pexly is a decentralized, non-custodial marketplace. Crypto assets are volatile, so only spend what you can afford to. Availability of gift cards, top ups and products varies by region.
                  </p>
                </div>
                <div className="footer-bottom-link-wrap">
                  <Link href="/" className="footer-link-item"><div className="p-xs light-gray">Terms &amp; policies</div></Link>
                  <Link href="/" className="footer-link-item"><div className="p-xs light-gray">Privacy Policy</div></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
