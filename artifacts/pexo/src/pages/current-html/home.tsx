import { useState, type FormEvent } from "react";
import { CurrentMarketingPage } from "@/components/marketing/current-marketing-page";

export function PexlyHomepage() {
  const [newsletterStatus, setNewsletterStatus] = useState("");

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterStatus("Newsletter sign-up is not connected yet.");
  }

  return (
    <CurrentMarketingPage page="home">
    <div className={"page-wrapper"}>
      <header className={"px-nav"} id={"pxnav"}>
        <div className={"px-nav-in"}>
          <a className={"px-logo"} href={"#top"}>
            <span className={"px-logo-mark"}>
              {"p"}
            </span>
            <span>
              {"pexly"}
            </span>
          </a>
          <nav className={"px-menu"} id={"pxmenu"} aria-label={"Main"}>
            <div className={"px-dd"}>
              <button className={"px-dd-t"} type={"button"} aria-expanded={"false"}>
                {"Marketplace "}
                <i></i>
              </button>
              <div className={"px-dd-l"}>
                <a href={"/gift-cards"}>
                  <b>
                    {"Gift Cards"}
                  </b>
                  <small>
                    {"Shopping, gaming, streaming"}
                  </small>
                </a>
                <a href={"/wallet/mobile-topup"}>
                  <b>
                    {"Mobile Top Up"}
                  </b>
                  <small>
                    {"Airtime and data, anywhere"}
                  </small>
                </a>
                <a href={"/shop"}>
                  <b>
                    {"Physical Products"}
                  </b>
                  <small>
                    {"Electronics, fashion, home"}
                  </small>
                </a>
              </div>
            </div>
            <a className={"px-l"} href={"#how-it-works"}>
              {"How it works"}
            </a>
            <a className={"px-l"} href={"/gift-cards"}>
              {"Categories"}
            </a>
            <div className={"px-dd"}>
              <button className={"px-dd-t"} type={"button"} aria-expanded={"false"}>
                {"Resources "}
                <i></i>
              </button>
              <div className={"px-dd-l"}>
                <a href={"#faq"}>
                  <b>
                    {"FAQ"}
                  </b>
                  <small>
                    {"Answers to common questions"}
                  </small>
                </a>
                <a href={"/blogs"}>
                  <b>
                    {"Blog"}
                  </b>
                  <small>
                    {"News and guides"}
                  </small>
                </a>
              </div>
            </div>
            <div className={"px-mob-btns"}>
              <a className={"px-btn ghost"} href={"/wallet"}>
                {"Connect Wallet"}
              </a>
              <a className={"px-btn solid"} href={"/gift-cards"}>
                {"Start Shopping"}
              </a>
            </div>
          </nav>
          <div className={"px-right"}>
            <a className={"px-btn ghost"} href={"/wallet"}>
              {"Connect Wallet"}
            </a>
            <a className={"px-btn solid"} href={"/gift-cards"}>
              {"Start Shopping"}
            </a>
          </div>
          <button className={"px-burger"} id={"pxburger"} aria-label={"Menu"} aria-expanded={"false"}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      <main id={"top"}>
        <section className={"section-h-v3-hero"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"v3-herocontent-wrapper"}>
                <div className={"v3-hero-content"}>
                  <h1 data-w-id={"efc00cef-13a7-739b-1069-88d52025811f"} className={"h1-large"}>
                    {"Shop and pay with crypto"}
                  </h1>
                  <div className={"v3-hero-text-block"}>
                    <p data-w-id={"9be5ebdd-eacb-1105-68a6-cae003ce4cfc"} className={"p-large cyan"}>
                      {"One decentralized marketplace for gift cards, mobile top up and physical products, all paid straight from your own wallet."}
                    </p>
                  </div>
                  <div data-w-id={"0f339b4c-3cc1-73c1-73d5-37ae38bef528"} className={"v3-hero-btn-wrap"}>
                    <a href={"/gift-cards"} className={"btn-primary w-button"}>
                      {"Start Shopping"}
                    </a>
                  </div>
                </div>
                <div data-w-id={"4c14da3e-38d8-bfee-2ab8-a136ac40cf4e"} className={"v3-hero-right-block"}>
                  <div className={"v3-hero-banner-block"}>
                    <img src={"/marketing-media/media-1ee388ec36d8c9a7.avif"} loading={"lazy"} alt={""} className={"v3-hero-banner"} />
                  </div>
                  <div className={"v3-tag-block"}>
                    <div className={"px-tag px-tag1"}>
                      <div className={"r"}>
                        <span className={"b"}>
                          {"pexly"}
                        </span>
                        <span className={"chip"}>
                          {"Instant"}
                        </span>
                      </div>
                      <div className={"big"}>
                        {"Gift Card · $50"}
                      </div>
                    </div>
                  </div>
                  <div className={"v3-tag-block _2"}>
                    <div className={"px-tag px-tag2"}>
                      <span className={"ic"}>
                        {"₮"}
                      </span>
                      <div className={"m"}>
                        <b>
                          {"Mobile Top Up"}
                        </b>
                        <small>
                          {"Paid with USDT"}
                        </small>
                      </div>
                      <div className={"e"}>
                        <b>
                          {"$10.00"}
                        </b>
                        <small>
                          {"Delivered"}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"section-partners"}>
          <div className={"section-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"partner-content-wrap"}>
                  <div className={"splide common-marquee-slider"}>
                    <div className={"splide__track"}>
                      <div className={"splide__list partner-logos-block"}>
                        <div className={"splide__slide"}>
                          <div className={"partner-logo-item"}>
                            <span className={"px-coin"}>
                              {"Bitcoin"}
                            </span>
                          </div>
                        </div>
                        <div className={"splide__slide"}>
                          <div className={"partner-logo-item"}>
                            <span className={"px-coin"}>
                              {"Ethereum"}
                            </span>
                          </div>
                        </div>
                        <div className={"splide__slide"}>
                          <div className={"partner-logo-item"}>
                            <span className={"px-coin"}>
                              {"USDT"}
                            </span>
                          </div>
                        </div>
                        <div className={"splide__slide"}>
                          <div className={"partner-logo-item"}>
                            <span className={"px-coin"}>
                              {"USDC"}
                            </span>
                          </div>
                        </div>
                        <div className={"splide__slide"}>
                          <div className={"partner-logo-item"}>
                            <span className={"px-coin"}>
                              {"BNB"}
                            </span>
                          </div>
                        </div>
                        <div className={"splide__slide"}>
                          <div className={"partner-logo-item"}>
                            <span className={"px-coin"}>
                              {"Solana"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"p-white-shade"}></div>
                  <div className={"p-white-shade-copy"}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"marketplace"} className={"section-investment"}>
          <div className={"section-padding top-0"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"investment-content-wrpper"}>
                  <div className={"investment-content-upper"}>
                    <h2 data-w-id={"17926322-9a6a-d809-077f-cb7c98f2f30f"} className={"h2-heading"}>
                      {"One marketplace. Every purchase."}
                    </h2>
                    <div className={"invest-upper-text-block"}>
                      <p data-w-id={"17926322-9a6a-d809-077f-cb7c98f2f312"} className={"p-md"}>
                        {"Gift cards, mobile top up and physical products, all paid from your wallet"}
                      </p>
                    </div>
                    <div data-w-id={"21a7497c-2cae-67a8-f12b-f20d3533c197"} className={"invest-button-block"}>
                      <a href={"/gift-cards"} className={"btn-primary w-button"}>
                        {"Explore Marketplace"}
                      </a>
                    </div>
                  </div>
                  <div className={"investment-banner-wrapper"}>
                    <div className={"invest-banner-right"}>
                      <img src={"/marketing-media/media-ee8829bd9b5cc5ab.avif"} loading={"lazy"} alt={""} className={"invest-banner-large"} />
                    </div>
                    <div data-w-id={"17926322-9a6a-d809-077f-cb7c98f2f319"} className={"invest-banner-left"}>
                      <div className={"invest-left-banner-block"}>
                        <div className={"px-art"} style={{"--w": "min(70cqw,56cqh)"} as any}>
                          <div className={"px-phone"} style={{"--dy": "24%"} as any}>
                            <div className={"px-notch"}></div>
                            <div className={"px-screen"}>
                              <div className={"ph-h"}>
                                <b>
                                  {"pexly"}
                                </b>
                                <span className={"ph-w"}>
                                  {"0x7a…93f2"}
                                </span>
                              </div>
                              <div className={"srch"}>
                                {"Search gift cards, top ups, products"}
                              </div>
                              <div className={"chips"}>
                                <span className={"on"}>
                                  {"Gift Cards"}
                                </span>
                                <span className={""}>
                                  {"Top Up"}
                                </span>
                                <span className={""}>
                                  {"Products"}
                                </span>
                              </div>
                              <div className={"grid2"}>
                                <div className={"tile"} style={{"background": "#7c5cff"} as any}>
                                  <b>
                                    {"Shopping"}
                                  </b>
                                  <small>
                                    {"from $10"}
                                  </small>
                                </div>
                                <div className={"tile"} style={{"background": "#ff6b6b"} as any}>
                                  <b>
                                    {"Streaming"}
                                  </b>
                                  <small>
                                    {"from $15"}
                                  </small>
                                </div>
                                <div className={"tile"} style={{"background": "#1fa37a"} as any}>
                                  <b>
                                    {"Gaming"}
                                  </b>
                                  <small>
                                    {"from $20"}
                                  </small>
                                </div>
                                <div className={"tile"} style={{"background": "#2f80ed"} as any}>
                                  <b>
                                    {"Travel"}
                                  </b>
                                  <small>
                                    {"from $25"}
                                  </small>
                                </div>
                              </div>
                              <div className={"rw"}>
                                <span className={"ic"} style={{"background": "#091e1c"} as any}>
                                  {"↻"}
                                </span>
                                <div className={"t"}>
                                  <b>
                                    {"Mobile Top Up"}
                                  </b>
                                  <small>
                                    {"Airtime and data"}
                                  </small>
                                </div>
                                <div className={"p"}>
                                  {"Instant"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"how-it-works"} className={"section-work-process"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"how-it-work-content-wrapper"}>
                <div className={"how-it-work-upper"}>
                  <div className={"how-it-work-upper-title-block"}>
                    <h2 className={"h2-heading"}>
                      {"Everything you can buy with crypto"}
                    </h2>
                  </div>
                  <div className={"how-it-work-upper-text-block"}>
                    <p className={"p-md"}>
                      {"Pexly puts the things you buy every day in one place. Choose a category, connect your wallet and pay with crypto."}
                    </p>
                  </div>
                </div>
                <div className={"how-it-work-tab-wrapper"}>
                  <div data-current={"Tab 1"} data-easing={"ease"} data-duration-in={"300"} data-duration-out={"100"} className={"how-it-work-tab tabs w-tabs"}>
                    <div className={"how-it-work-tab-menu w-tab-menu"} role={"tablist"} aria-label={"Marketplace features"}>
                      <a id={"home-tab-1"} aria-controls={"home-panel-1"} aria-selected={true} role={"tab"} tabIndex={0} data-w-tab={"Tab 1"} className={"how-it-work-tab-link w-inline-block w-tab-link w--current"}>
                        <div className={"tab-link-title-block"}>
                          <h4 className={"tab-link-title"}>
                            {"Gift Cards"}
                          </h4>
                        </div>
                        <div className={"tab-link-text-block"}>
                          <p className={"p-xs dark-gray"}>
                            {"Buy digital gift cards for top global brands and get your code within seconds of payment."}
                          </p>
                        </div>
                      </a>
                      <a id={"home-tab-2"} aria-controls={"home-panel-2"} aria-selected={false} role={"tab"} tabIndex={-1} data-w-tab={"Tab 2"} className={"how-it-work-tab-link w-inline-block w-tab-link"}>
                        <div className={"tab-link-title-block"}>
                          <h4 className={"tab-link-title"}>
                            {"Mobile Top Up"}
                          </h4>
                        </div>
                        <div className={"tab-link-text-block"}>
                          <p className={"p-xs dark-gray"}>
                            {"Recharge airtime and data for any phone number, paid with BTC, USDT and more."}
                          </p>
                        </div>
                      </a>
                      <a id={"home-tab-3"} aria-controls={"home-panel-3"} aria-selected={false} role={"tab"} tabIndex={-1} data-w-tab={"Tab 3"} className={"how-it-work-tab-link w-inline-block w-tab-link"}>
                        <div className={"tab-link-title-block"}>
                          <h4 className={"tab-link-title"}>
                            {"Physical Products"}
                          </h4>
                        </div>
                        <div className={"tab-link-text-block"}>
                          <p className={"p-xs dark-gray"}>
                            {"Order electronics, fashion and more from verified sellers, shipped to your door."}
                          </p>
                        </div>
                      </a>
                      <a id={"home-tab-4"} aria-controls={"home-panel-4"} aria-selected={false} role={"tab"} tabIndex={-1} data-w-tab={"Tab 4"} className={"how-it-work-tab-link w-inline-block w-tab-link"}>
                        <div className={"tab-link-title-block"}>
                          <h4 className={"tab-link-title"}>
                            {"Escrow Protection"}
                          </h4>
                        </div>
                        <div className={"tab-link-text-block"}>
                          <p className={"p-xs dark-gray"}>
                            {"Every physical order is held in escrow until you confirm delivery."}
                          </p>
                        </div>
                      </a>
                      <a id={"home-tab-5"} aria-controls={"home-panel-5"} aria-selected={false} role={"tab"} tabIndex={-1} data-w-tab={"Tab 5"} className={"how-it-work-tab-link w-inline-block w-tab-link"}>
                        <div className={"tab-link-title-block"}>
                          <h4 className={"tab-link-title"}>
                            {"Non-Custodial Wallet"}
                          </h4>
                        </div>
                        <div className={"tab-link-text-block"}>
                          <p className={"p-xs dark-gray"}>
                            {"Your keys, your coins. Pay straight from your own wallet with no deposits."}
                          </p>
                        </div>
                      </a>
                    </div>
                    <div className={"how-it-work-tab-content w-tab-content"}>
                      <div id={"home-panel-1"} aria-labelledby={"home-tab-1"} role={"tabpanel"} data-w-tab={"Tab 1"} className={"how-it-work-tab-panel w-tab-pane w--tab-active"}>
                        <div className={"tab-panel-content-wrapper"}>
                          <div className={"tab-panel-content-image-block"}>
                            <div className={"px-art gift-card-art"} style={{"background": "#bcc6ff"} as any}>
                              <div className={"gift-card-brand-grid"} role={"group"} aria-label={"Gift card brands"}>
                                <img src={"/marketing-media/gift-cards/amazon.png"} alt={"Amazon gift card"} loading={"lazy"} />
                                <img src={"/marketing-media/gift-cards/h&m.png"} alt={"H&M gift card"} loading={"lazy"} />
                                <img src={"/marketing-media/gift-cards/airbnb.png"} alt={"Airbnb gift card"} loading={"lazy"} />
                                <img src={"/marketing-media/gift-cards/uber.png"} alt={"Uber gift card"} loading={"lazy"} />
                                <img src={"/marketing-media/gift-cards/uber-eats.png"} alt={"Uber Eats gift card"} loading={"lazy"} />
                              </div>
                            </div>
                          </div>
                          <div className={"tab-panel-content-block"}>
                            <h3 className={"h3-heading"}>
                              {"How it works"}
                            </h3>
                            <div className={"tab-panel-c-text-block"}>
                              <p className={"p-regular"}>
                                {"Connect your wallet and pick a category, from gift cards to physical products."}
                              </p>
                            </div>
                            <div className={"tab-content-work-process-items"}>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Step 1 · Connect"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Works with any wallet"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"No account needed"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <a href={"/gift-cards"} className={"more-stories-link-block w-inline-block"}>
                              <div className={"p-regular"}>
                                {"Browse Marketplace"}
                              </div>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                                <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div id={"home-panel-2"} aria-labelledby={"home-tab-2"} role={"tabpanel"} hidden={true} data-w-tab={"Tab 2"} className={"how-it-work-tab-panel w-tab-pane"}>
                        <div className={"tab-panel-content-wrapper"}>
                          <div className={"tab-panel-content-image-block"}>
                            <div className={"px-art"} style={{"background": "#bcc6ff"} as any}>
                              <div className={"px-phone"} style={{"--dy": "0%"} as any}>
                                <div className={"px-notch"}></div>
                                <div className={"px-screen"}>
                                  <div className={"ph-h"}>
                                    <b>
                                      {"pexly"}
                                    </b>
                                    <span className={"ph-w"}>
                                      {"0x7a…93f2"}
                                    </span>
                                  </div>
                                  <div className={"ph-t"}>
                                    {"Mobile Top Up"}
                                  </div>
                                  <div className={"fld"}>
                                    <small>
                                      {"Country"}
                                    </small>
                                    <b>
                                      {"Select country"}
                                    </b>
                                  </div>
                                  <div className={"fld"}>
                                    <small>
                                      {"Phone number"}
                                    </small>
                                    <b>
                                      {"+234 801 234 5678"}
                                    </b>
                                  </div>
                                  <div className={"chips"}>
                                    <span className={""}>
                                      {"$5"}
                                    </span>
                                    <span className={"on"}>
                                      {"$10"}
                                    </span>
                                    <span className={""}>
                                      {"$20"}
                                    </span>
                                    <span className={""}>
                                      {"$50"}
                                    </span>
                                  </div>
                                  <div className={"fld"}>
                                    <small>
                                      {"Pay with"}
                                    </small>
                                    <b>
                                      {"USDT · 10.02"}
                                    </b>
                                  </div>
                                  <div className={"btn"}>
                                    {"Top up now"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"tab-panel-content-block"}>
                            <h3 className={"h3-heading"}>
                              {"How it works"}
                            </h3>
                            <div className={"tab-panel-c-text-block"}>
                              <p className={"p-regular"}>
                                {"Pay with crypto. Funds are locked in escrow while the seller or provider fulfils your order."}
                              </p>
                            </div>
                            <div className={"tab-content-work-process-items"}>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Step 2 · Pay"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Pay in BTC, ETH, USDT"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Escrow protected"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <a href={"/gift-cards"} className={"more-stories-link-block w-inline-block"}>
                              <div className={"p-regular"}>
                                {"Browse Marketplace"}
                              </div>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                                <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div id={"home-panel-3"} aria-labelledby={"home-tab-3"} role={"tabpanel"} hidden={true} data-w-tab={"Tab 3"} className={"how-it-work-tab-panel w-tab-pane"}>
                        <div className={"tab-panel-content-wrapper"}>
                          <div className={"tab-panel-content-image-block"}>
                            <div className={"px-art"} style={{"background": "#bcc6ff"} as any}>
                              <div className={"px-phone"} style={{"--dy": "0%"} as any}>
                                <div className={"px-notch"}></div>
                                <div className={"px-screen"}>
                                  <div className={"ph-h"}>
                                    <b>
                                      {"pexly"}
                                    </b>
                                    <span className={"ph-w"}>
                                      {"0x7a…93f2"}
                                    </span>
                                  </div>
                                  <div className={"ph-t"}>
                                    {"Physical Products"}
                                  </div>
                                  <div className={"chips"}>
                                    <span className={"on"}>
                                      {"Electronics"}
                                    </span>
                                    <span className={""}>
                                      {"Fashion"}
                                    </span>
                                    <span className={""}>
                                      {"Home"}
                                    </span>
                                  </div>
                                  <div className={"grid2"}>
                                    <div className={"prd"}>
                                      <div className={"im"} style={{"background": "#cfd8ff"} as any}></div>
                                      <b>
                                        {"Wireless Earbuds"}
                                      </b>
                                      <small>
                                        {"$39 · Escrow"}
                                      </small>
                                    </div>
                                    <div className={"prd"}>
                                      <div className={"im"} style={{"background": "#ffd9c9"} as any}></div>
                                      <b>
                                        {"Smart Watch"}
                                      </b>
                                      <small>
                                        {"$89 · Escrow"}
                                      </small>
                                    </div>
                                    <div className={"prd"}>
                                      <div className={"im"} style={{"background": "#d8ff85"} as any}></div>
                                      <b>
                                        {"Sneakers"}
                                      </b>
                                      <small>
                                        {"$64 · Escrow"}
                                      </small>
                                    </div>
                                    <div className={"prd"}>
                                      <div className={"im"} style={{"background": "#e8e1ff"} as any}></div>
                                      <b>
                                        {"Desk Lamp"}
                                      </b>
                                      <small>
                                        {"$27 · Escrow"}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"tab-panel-content-block"}>
                            <h3 className={"h3-heading"}>
                              {"How it works"}
                            </h3>
                            <div className={"tab-panel-c-text-block"}>
                              <p className={"p-regular"}>
                                {"Receive your code, top up or parcel, then confirm and the seller gets paid."}
                              </p>
                            </div>
                            <div className={"tab-content-work-process-items"}>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Step 3 · Receive"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Instant for digital items"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Low marketplace fees"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <a href={"/gift-cards"} className={"more-stories-link-block w-inline-block"}>
                              <div className={"p-regular"}>
                                {"Browse Marketplace"}
                              </div>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                                <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div id={"home-panel-4"} aria-labelledby={"home-tab-4"} role={"tabpanel"} hidden={true} data-w-tab={"Tab 4"} className={"how-it-work-tab-panel w-tab-pane"}>
                        <div className={"tab-panel-content-wrapper"}>
                          <div className={"tab-panel-content-image-block"}>
                            <div className={"px-art"} style={{"background": "#bcc6ff"} as any}>
                              <div className={"px-phone"} style={{"--dy": "0%"} as any}>
                                <div className={"px-notch"}></div>
                                <div className={"px-screen"}>
                                  <div className={"ph-h"}>
                                    <b>
                                      {"pexly"}
                                    </b>
                                    <span className={"ph-w"}>
                                      {"0x7a…93f2"}
                                    </span>
                                  </div>
                                  <div className={"ph-t"}>
                                    {"Order #4821"}
                                  </div>
                                  <div className={"rw"}>
                                    <span className={"ic"} style={{"background": "#091e1c"} as any}>
                                      {"□"}
                                    </span>
                                    <div className={"t"}>
                                      <b>
                                        {"Wireless Earbuds"}
                                      </b>
                                      <small>
                                        {"Verified seller"}
                                      </small>
                                    </div>
                                    <div className={"p"}>
                                      {"$39"}
                                    </div>
                                  </div>
                                  <div className={"steps"}>
                                    <div className={"d"}>
                                      <i></i>
                                      <span>
                                        {"Paid with USDT"}
                                      </span>
                                    </div>
                                    <div className={"d"}>
                                      <i></i>
                                      <span>
                                        {"Held in escrow"}
                                      </span>
                                    </div>
                                    <div className={"d"}>
                                      <i></i>
                                      <span>
                                        {"Shipped"}
                                      </span>
                                    </div>
                                    <div className={"n"}>
                                      <i></i>
                                      <span>
                                        {"Delivered"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className={"btn"}>
                                    {"Confirm delivery"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"tab-panel-content-block"}>
                            <h3 className={"h3-heading"}>
                              {"How it works"}
                            </h3>
                            <div className={"tab-panel-c-text-block"}>
                              <p className={"p-regular"}>
                                {"Connect your wallet and pick a category, from gift cards to physical products."}
                              </p>
                            </div>
                            <div className={"tab-content-work-process-items"}>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Step 1 · Connect"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Works with any wallet"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"No account needed"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <a href={"/about"} className={"more-stories-link-block w-inline-block"}>
                              <div className={"p-regular"}>
                                {"Learn More"}
                              </div>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                                <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div id={"home-panel-5"} aria-labelledby={"home-tab-5"} role={"tabpanel"} hidden={true} data-w-tab={"Tab 5"} className={"how-it-work-tab-panel w-tab-pane"}>
                        <div className={"tab-panel-content-wrapper"}>
                          <div className={"tab-panel-content-image-block"}>
                            <div className={"px-art"} style={{"background": "#bcc6ff"} as any}>
                              <div className={"px-phone"} style={{"--dy": "0%"} as any}>
                                <div className={"px-notch"}></div>
                                <div className={"px-screen"}>
                                  <div className={"ph-h"}>
                                    <b>
                                      {"pexly"}
                                    </b>
                                    <span className={"ph-w"}>
                                      {"0x7a…93f2"}
                                    </span>
                                  </div>
                                  <div className={"ph-t"}>
                                    {"Wallet"}
                                  </div>
                                  <div className={"bal"}>
                                    <small>
                                      {"Total balance"}
                                    </small>
                                    <b>
                                      {"$1,284.50"}
                                    </b>
                                  </div>
                                  <div className={"rw"}>
                                    <span className={"ic"} style={{"background": "#f7931a"} as any}>
                                      {"₿"}
                                    </span>
                                    <div className={"t"}>
                                      <b>
                                        {"Bitcoin"}
                                      </b>
                                      <small>
                                        {"0.0102 BTC"}
                                      </small>
                                    </div>
                                    <div className={"p"}>
                                      {"$642.10"}
                                    </div>
                                  </div>
                                  <div className={"rw"}>
                                    <span className={"ic"} style={{"background": "#627eea"} as any}>
                                      {"Ξ"}
                                    </span>
                                    <div className={"t"}>
                                      <b>
                                        {"Ethereum"}
                                      </b>
                                      <small>
                                        {"0.1800 ETH"}
                                      </small>
                                    </div>
                                    <div className={"p"}>
                                      {"$381.40"}
                                    </div>
                                  </div>
                                  <div className={"rw"}>
                                    <span className={"ic"} style={{"background": "#26a17b"} as any}>
                                      {"₮"}
                                    </span>
                                    <div className={"t"}>
                                      <b>
                                        {"Tether"}
                                      </b>
                                      <small>
                                        {"261.00 USDT"}
                                      </small>
                                    </div>
                                    <div className={"p"}>
                                      {"$261.00"}
                                    </div>
                                  </div>
                                  <div className={"btn"}>
                                    {"Pay with wallet"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"tab-panel-content-block"}>
                            <h3 className={"h3-heading"}>
                              {"How it works"}
                            </h3>
                            <div className={"tab-panel-c-text-block"}>
                              <p className={"p-regular"}>
                                {"Pay with crypto. Funds are locked in escrow while the seller or provider fulfils your order."}
                              </p>
                            </div>
                            <div className={"tab-content-work-process-items"}>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Step 2 · Pay"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Pay in BTC, ETH, USDT"}
                                  </p>
                                </div>
                              </div>
                              <div className={"tab-panel-c-work-item"}>
                                <div className={"c-work-item-icon-block"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                                    <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                  </svg>
                                </div>
                                <div className={"c-work-item-text-block"}>
                                  <p className={"p-regular dark-gray"}>
                                    {"Escrow protected"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <a href={"/about"} className={"more-stories-link-block w-inline-block"}>
                              <div className={"p-regular"}>
                                {"Learn More"}
                              </div>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                                <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                                <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"section-process"}>
          <div className={"section-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"process-content-wrapper"}>
                  <div className={"process-content-upper"}>
                    <h2 data-w-id={"ecb60f8b-e040-3558-f938-2d224fea3f51"} className={"h2-heading text-dark"}>
                      {"Shop without banks, borders or middlemen."}
                    </h2>
                  </div>
                  <div className={"process-cards-wrapper"}>
                    <div className={"process-upper-cards"}>
                      <div className={"process-card"}>
                        <div className={"process-card-icon-block"}>
                          <div className={"process-card-icon"} data-w-id={"ecb60f8b-e040-3558-f938-2d224fea3f57"} data-animation-type={"lottie"} data-src={"/lottie/68791f01e0b4fa9011ebc2a2_Global.json"} data-loop={"1"} data-direction={"1"} data-autoplay={"1"} data-is-ix2-target={"0"} data-renderer={"svg"} data-default-duration={"0"} data-duration={"0"} data-loading={"eager"}></div>
                        </div>
                        <div className={"process-card-content"}>
                          <h3 className={"h3-heading"}>
                            {"Global Reach"}
                          </h3>
                          <div className={"process-card-text-block"}>
                            <p className={"p-regular dark-gray"}>
                              {"Buy gift cards and top up phones for people around the world, all settled in crypto."}
                            </p>
                          </div>
                          <a href={"/about"} className={"process-card-link w-inline-block"}>
                            <div className={"process-card-link-text"}>
                              {"Learn More"}
                            </div>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                              <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div className={"vertical-divider"}></div>
                      <div className={"process-card"}>
                        <div className={"process-card-icon-block"}>
                          <div className={"process-card-icon"} data-w-id={"ecb60f8b-e040-3558-f938-2d224fea3f67"} data-animation-type={"lottie"} data-src={"/lottie/69d522b06328037c16b824f6_Transaction.json"} data-loop={"1"} data-direction={"1"} data-autoplay={"1"} data-is-ix2-target={"0"} data-renderer={"svg"} data-default-duration={"0"} data-duration={"3.033333333333333"} data-loading={"eager"}></div>
                        </div>
                        <div className={"process-card-content"}>
                          <h3 className={"h3-heading"}>
                            {"Escrow Secured"}
                          </h3>
                          <div className={"process-card-text-block"}>
                            <p className={"p-regular dark-gray"}>
                              {"Smart-contract escrow holds your payment until your order is delivered, so you are protected on every purchase."}
                            </p>
                          </div>
                          <a href={"/about"} className={"process-card-link w-inline-block"}>
                            <div className={"process-card-link-text"}>
                              {"Learn More"}
                            </div>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                              <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className={"middle-divider-wrap"}>
                      <div className={"horizontal-divider"}></div>
                      <div className={"horizontal-divider"}></div>
                    </div>
                    <div className={"process-upper-cards"}>
                      <div className={"process-card"}>
                        <div className={"process-card-icon-block"}>
                          <div className={"process-card-icon"} data-w-id={"ecb60f8b-e040-3558-f938-2d224fea3f7a"} data-animation-type={"lottie"} data-src={"/lottie/687a164bc84513b85bb6e928_Financial.json"} data-loop={"1"} data-direction={"1"} data-autoplay={"1"} data-is-ix2-target={"0"} data-renderer={"svg"} data-default-duration={"0"} data-duration={"4.033333333333333"} data-loading={"eager"}></div>
                        </div>
                        <div className={"process-card-content"}>
                          <h3 className={"h3-heading"}>
                            {"Financial "}
                            <br />
                            {"Freedom"}
                          </h3>
                          <div className={"process-card-text-block"}>
                            <p className={"p-regular dark-gray"}>
                              {"Spend your crypto directly on the things you actually need, with no cashing out first."}
                            </p>
                          </div>
                          <a href={"/gift-cards"} className={"process-card-link w-inline-block"}>
                            <div className={"process-card-link-text"}>
                              {"Browse Marketplace"}
                            </div>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                              <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div className={"vertical-divider"}></div>
                      <div className={"process-card"}>
                        <div className={"process-card-icon-block"}>
                          <div className={"process-card-icon"} data-w-id={"ecb60f8b-e040-3558-f938-2d224fea3f8c"} data-animation-type={"lottie"} data-src={"/lottie/687a16aa4b0aa3035d72492f_Growth.json"} data-loop={"1"} data-direction={"1"} data-autoplay={"1"} data-is-ix2-target={"0"} data-renderer={"svg"} data-default-duration={"0"} data-duration={"4.033333333333333"} data-loading={"eager"}></div>
                        </div>
                        <div className={"process-card-content"}>
                          <h3 className={"h3-heading"}>
                            {"Community"}
                          </h3>
                          <div className={"process-card-text-block"}>
                            <p className={"p-regular dark-gray"}>
                              {"Pexly is built for buyers and sellers who want a fair marketplace,"}
                              <br />
                              {"owned by no one and open to everyone."}
                            </p>
                          </div>
                          <a href={"/gift-cards"} className={"process-card-link w-inline-block"}>
                            <div className={"process-card-link-text"}>
                              {"Browse Marketplace"}
                            </div>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                              <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                              <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"top-up"} className={"section-esim-activation"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"esim-activation-content-wrap"}>
                <div className={"esim-activation-right"}>
                  <div data-w-id={"0e745624-d154-5168-b82a-2e30c6250a07"} className={"esim-activation-right-img-block"}>
                    <div className={"px-art"} style={{"background": "linear-gradient(160deg,#8dfdba,#3aa9ff)"} as any}>
                      <div className={"px-phone"} style={{"--dy": "0%"} as any}>
                        <div className={"px-notch"}></div>
                        <div className={"px-screen"}>
                          <div className={"ph-h"}>
                            <b>
                              {"pexly"}
                            </b>
                            <span className={"ph-w"}>
                              {"0x7a…93f2"}
                            </span>
                          </div>
                          <div className={"ph-t"}>
                            {"Mobile Top Up"}
                          </div>
                          <div className={"fld"}>
                            <small>
                              {"Country"}
                            </small>
                            <b>
                              {"Select country"}
                            </b>
                          </div>
                          <div className={"fld"}>
                            <small>
                              {"Phone number"}
                            </small>
                            <b>
                              {"+234 801 234 5678"}
                            </b>
                          </div>
                          <div className={"chips"}>
                            <span className={""}>
                              {"$5"}
                            </span>
                            <span className={"on"}>
                              {"$10"}
                            </span>
                            <span className={""}>
                              {"$20"}
                            </span>
                            <span className={""}>
                              {"$50"}
                            </span>
                          </div>
                          <div className={"fld"}>
                            <small>
                              {"Pay with"}
                            </small>
                            <b>
                              {"USDT · 10.02"}
                            </b>
                          </div>
                          <div className={"btn"}>
                            {"Top up now"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"esim-activation-left"}>
                  <div className={"esim-a-title-block"}>
                    <h2 data-w-id={"0e745624-d154-5168-b82a-2e30c62509e2"} className={"h2-heading text-dark"}>
                      {"Mobile top up in seconds"}
                    </h2>
                  </div>
                  <div data-w-id={"0e745624-d154-5168-b82a-2e30c62509e4"} className={"esim-a-feature-wrapper"}>
                    <div className={"esim-a-feature-item"}>
                      <div className={"esim-a-feature-icon-block"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                          <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                        </svg>
                      </div>
                      <div className={"esim-a-feature-text-block"}>
                        <p className={"p-regular dark-gray"}>
                          {"Top up airtime and data for any phone number in seconds, paid with crypto."}
                        </p>
                      </div>
                    </div>
                    <div className={"esim-a-feature-item"}>
                      <div className={"esim-a-feature-icon-block"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                          <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                        </svg>
                      </div>
                      <div className={"esim-a-feature-text-block"}>
                        <p className={"p-regular dark-gray"}>
                          {"Pick the country and network, enter the number and confirm. No card or bank account needed."}
                        </p>
                      </div>
                    </div>
                    <div className={"esim-a-feature-item"}>
                      <div className={"esim-a-feature-icon-block"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                          <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                        </svg>
                      </div>
                      <div className={"esim-a-feature-text-block"}>
                        <p className={"p-regular dark-gray"}>
                          {"Send top ups to family and friends abroad and skip expensive transfer fees."}
                        </p>
                      </div>
                    </div>
                    <div className={"esim-a-feature-item"}>
                      <div className={"esim-a-feature-icon-block"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                          <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                        </svg>
                      </div>
                      <div className={"esim-a-feature-text-block"}>
                        <p className={"p-regular dark-gray"}>
                          {"Reorder your favourite top ups in one tap from your order history."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div data-w-id={"0e745624-d154-5168-b82a-2e30c6250a01"} className={"esim-a-button-wrapper"}>
                    <a href={"/wallet/mobile-topup"} className={"btn-primary w-button"}>
                      {"Top Up Now"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"section-disposablecard"}>
          <div className={"section-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"disposable-card-content-wrapper"}>
                  <div className={"disposable-cards-upper"}>
                    <div className={"ds-card-title-block"}>
                      <h2 data-w-id={"306079fa-eab5-755f-84e5-ba3b8f69d15f"} className={"h2-heading"}>
                        {"Where you can spend your"}
                        <br />
                        {"Gift Cards & Digital Goods,"}
                      </h2>
                      <p data-w-id={"306079fa-eab5-755f-84e5-ba3b8f69d161"} className={"p-md"}>
                        {"Buy once with crypto and redeem anywhere the brand is accepted."}
                      </p>
                    </div>
                  </div>
                </div>
                <div data-delay={"4000"} data-animation={"slide"} className={"disposable-card-slider w-slider"} data-autoplay={"false"} data-easing={"ease"} data-hide-arrows={"false"} data-disable-swipe={"false"} data-autoplay-limit={"0"} data-nav-spacing={"3"} data-duration={"500"} data-infinite={"true"}>
                  <div className={"slider-mask w-slider-mask"}>
                    <div className={"card-slide w-slide"}>
                      <div data-w-id={"306079fa-eab5-755f-84e5-ba3b8f69d166"} className={"card-slide-content"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-e2a2772de065d14e.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white"}>
                              {"Shopping Gift Cards"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"card-slide w-slide"}>
                      <div data-w-id={"306079fa-eab5-755f-84e5-ba3b8f69d172"} className={"card-slide-content"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-8c029f8ebf3c6965.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _2nd"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white"}>
                              {"Streaming & Music"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"card-slide w-slide"}>
                      <div data-w-id={"306079fa-eab5-755f-84e5-ba3b8f69d17e"} className={"card-slide-content"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-ebc41a5685db3420.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white"}>
                              {"Travel & Rides"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"card-slide w-slide"}>
                      <div data-w-id={"306079fa-eab5-755f-84e5-ba3b8f69d18a"} className={"card-slide-content"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-2fd5969b5478cff4.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white"}>
                              {"Gaming Credits"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"left-arrow w-slider-arrow-left"}>
                    <div className={"w-icon-slider-left"}></div>
                  </div>
                  <div className={"right-arrow w-slider-arrow-right"}>
                    <div className={"w-icon-slider-right"}></div>
                  </div>
                  <div className={"slide-nav w-slider-nav w-round w-num"}></div>
                </div>
                <div className={"swp-content-wrapper"}>
                  <div className={"swiper cr-card"}>
                    <div className={"swiper-wrapper disposable-card-wrapper"}>
                      <div data-wf--disposable-card--variant={"base"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-e2a2772de065d14e.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white"}>
                              {"Shopping Gift Cards"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"light-green"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-ebc41a5685db3420.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st w-variant-85688ccc-aa30-763f-779a-f17975cb8641"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white w-variant-85688ccc-aa30-763f-779a-f17975cb8641"}>
                              {"Travel & Rides"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14 w-variant-85688ccc-aa30-763f-779a-f17975cb8641"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"orange"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-2fd5969b5478cff4.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st w-variant-a489c5a5-a51c-ecea-34e9-ac4d88d9fe9d"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white w-variant-a489c5a5-a51c-ecea-34e9-ac4d88d9fe9d"}>
                              {"Gaming Credits"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14 w-variant-a489c5a5-a51c-ecea-34e9-ac4d88d9fe9d"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"light-blue"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-301386fd30d190d4.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                              {"Streaming & Music"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14 w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                                {"Pay for music and streaming subscriptions with crypto, then enjoy instant access."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"base"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-e2a2772de065d14e.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white"}>
                              {"Shopping Gift Cards"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"light-blue"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-301386fd30d190d4.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                              {"Mobile Top Up"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14 w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                                {"Recharge airtime and data for any phone number with BTC, USDT and more."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"orange"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-ebc41a5685db3420.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st w-variant-a489c5a5-a51c-ecea-34e9-ac4d88d9fe9d"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white w-variant-a489c5a5-a51c-ecea-34e9-ac4d88d9fe9d"}>
                              {"Shopping Gift Cards"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14 w-variant-a489c5a5-a51c-ecea-34e9-ac4d88d9fe9d"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"light-blue"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-301386fd30d190d4.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                              {"Shopping Gift Cards"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14 w-variant-0804d94b-db76-5d91-8c7b-56186dc35489"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-wf--disposable-card--variant={"base"} data-w-id={"07b7e76f-d8e0-c9c7-d6f6-52fc77c8a15c"} className={"card-slide-content swiper-slide"}>
                        <div className={"card-slide-image-block"}>
                          <img src={"/marketing-media/media-bd8469a8412c4e74.avif"} loading={"lazy"} alt={""} className={"card-slide-content-image"} />
                        </div>
                        <div className={"card-slide-text-block _1st"}>
                          <div className={"card-slide-title-block"}>
                            <h3 className={"h3-heading white"}>
                              {"Shopping Gift Cards"}
                            </h3>
                          </div>
                          <div className={"card-slide-para-block"}>
                            <div className={"margin-top-12px"}>
                              <p className={"p-regular white mb-14"}>
                                {"Instant digital delivery. Pay with crypto, get your code in seconds and redeem it with the brand."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"categories"} data-wf--plan-section--variant={"padding-bottom-0"} className={"section-plans"}>
          <div className={"section-padding top-0 w-variant-0e3f5f51-4053-b5fb-6390-57ca9720232f"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"how-it-work-upper"}>
                  <div className={"how-it-work-upper-title-block"}>
                    <h2 data-w-id={"c621754d-e163-45a4-c187-28e3e77bfc1e"} className={"h2-heading"}>
                      {"Three categories. One wallet."}
                    </h2>
                  </div>
                  <div className={"how-it-work-upper-text-block"}>
                    <p data-w-id={"c621754d-e163-45a4-c187-28e3e77bfc21"} className={"p-md"}>
                      {"Browse every category from a single marketplace, pay from your own wallet and stay in full control of your funds."}
                    </p>
                  </div>
                </div>
                <div className={"plan-bento-wrapper"}>
                  <div id={"w-node-c621754d-e163-45a4-c187-28e3e77bfc24-e77bfc18"} className={"plan-bento-upper"}>
                    <div className={"plan-card-first"}>
                      <div className={"plan-card-content"}>
                        <div className={"pf-card-upper"}>
                          <h3 className={"h3-xs"}>
                            {"Instant Delivery"}
                          </h3>
                          <p className={"p-regular"}>
                            {"Gift card codes and top ups arrive within seconds of payment."}
                          </p>
                        </div>
                        <div className={"pf-card-image-block"}>
                          <div className={"px-art px-list"} style={{"background": "#fff", "placeItems": "stretch"} as any}>
                            <div className={"ol"}>
                              <div className={"rw"}>
                                <span className={"ic"} style={{"background": "#7c5cff"} as any}>
                                  {"S"}
                                </span>
                                <div className={"t"}>
                                  <b>
                                    {"Shopping Card $25"}
                                  </b>
                                  <small>
                                    {"Delivered · code ready"}
                                  </small>
                                </div>
                                <div className={"p"}>
                                  <span className={"g"}>
                                    {"+ 0.00038 BTC"}
                                  </span>
                                </div>
                              </div>
                              <div className={"rw"}>
                                <span className={"ic"} style={{"background": "#091e1c"} as any}>
                                  {"↻"}
                                </span>
                                <div className={"t"}>
                                  <b>
                                    {"Mobile Top Up $10"}
                                  </b>
                                  <small>
                                    {"Delivered to +234 801 …"}
                                  </small>
                                </div>
                                <div className={"p"}>
                                  <span className={"g"}>
                                    {"+ 10.02 USDT"}
                                  </span>
                                </div>
                              </div>
                              <div className={"rw"}>
                                <span className={"ic"} style={{"background": "#1fa37a"} as any}>
                                  {"□"}
                                </span>
                                <div className={"t"}>
                                  <b>
                                    {"Sneakers $64"}
                                  </b>
                                  <small>
                                    {"In escrow · shipped"}
                                  </small>
                                </div>
                                <div className={"p"}>
                                  <span className={"g"}>
                                    {"+ 64.20 USDC"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-wf--plan-card--variant={"base"} className={"plan-card"}>
                      <div className={"pc-bg-image-block"}>
                        <img src={"/marketing-media/media-59c99a35d948f6c1.avif"} loading={"lazy"} alt={""} className={"pc-bg-image"} />
                      </div>
                      <div className={"pc-content-wrapper"}>
                        <div className={"pc-content"}>
                          <h3 className={"h3-xs white"}>
                            {"Pay With Any Coin"}
                          </h3>
                          <p className={"p-regular white-02"}>
                            {"Use BTC, ETH, USDT, USDC and other popular coins directly from your wallet."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div data-wf--plan-card--variant={"base"} className={"plan-card"}>
                      <div className={"pc-bg-image-block"}>
                        <img src={"/marketing-media/media-f9de0167e3e0ed2c.avif"} loading={"lazy"} alt={""} className={"pc-bg-image"} />
                      </div>
                      <div className={"pc-content-wrapper"}>
                        <div className={"pc-content"}>
                          <h3 className={"h3-xs white"}>
                            {"Escrow Protection"}
                          </h3>
                          <p className={"p-regular white-02"}>
                            {"Funds stay locked in escrow until your order is delivered and confirmed."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id={"w-node-c621754d-e163-45a4-c187-28e3e77bfc31-e77bfc18"} className={"plan-bento-bottom"}>
                    <div data-wf--plan-card--variant={"1-5fr"} className={"plan-card"}>
                      <div className={"pc-bg-image-block"}>
                        <div className={"px-art px-lap"} style={{"background": "#0d1412"} as any}>
                          <div className={"bw"}>
                            <div className={"bar"}>
                              <i></i>
                              <i></i>
                              <i></i>
                              <span>
                                {"pexly.app"}
                              </span>
                            </div>
                            <div className={"bd"}>
                              <b>
                                {"Shop everything with crypto"}
                              </b>
                              <small>
                                {"Gift cards · Mobile top up · Physical products"}
                              </small>
                              <div className={"g3"}>
                                <span style={{"background": "#7c5cff"} as any}>
                                  {"Gift Cards"}
                                </span>
                                <span style={{"background": "#1fa37a"} as any}>
                                  {"Top Up"}
                                </span>
                                <span style={{"background": "#2f80ed"} as any}>
                                  {"Products"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={"pc-content-wrapper"}>
                        <div className={"pc-content w-variant-30894388-e089-780c-92cb-de42724bbae0"}>
                          <h3 className={"h3-xs white"}>
                            {"Non-Custodial"}
                          </h3>
                          <p className={"p-regular white-02"}>
                            {"We never hold your keys. You approve every payment from your own wallet."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div data-wf--plan-card--variant={"1-5fr"} className={"plan-card"}>
                      <div className={"pc-bg-image-block"}>
                        <img src={"/marketing-media/media-d9e7636fc944d27d.avif"} loading={"lazy"} alt={""} className={"pc-bg-image"} />
                      </div>
                      <div className={"pc-content-wrapper"}>
                        <div className={"pc-content w-variant-30894388-e089-780c-92cb-de42724bbae0"}>
                          <h3 className={"h3-xs white"}>
                            {"Shop From Anywhere"}
                          </h3>
                          <p className={"p-regular white-02"}>
                            {"Use the marketplace on mobile or desktop, wherever you are."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className={"section-padding"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"pricing-upper-content"}>
                <h2 data-w-id={"13d91184-ad1b-0a77-b0f0-e63fe3f1ca5e"} className={"h2-heading"}>
                  {"Transparent Fees"}
                </h2>
                <p data-w-id={"13d91184-ad1b-0a77-b0f0-e63fe3f1ca60"} className={"p-md"}>
                  {"Clear marketplace fees and nothing hidden at checkout."}
                </p>
              </div>
              <div data-w-id={"13d91184-ad1b-0a77-b0f0-e63fe3f1ca62"} className={"pricing-content-box"}>
                <div className={"single-pricing-box-block"}>
                  <div className={"pricing-content-item padding-32px"}>
                    <div className={"pricing-plan-block"}>
                      <h3 className={"h3-heading white"}>
                        {"Gift Cards"}
                      </h3>
                      <div className={"pricing-plan-duration-block"}>
                        <div className={"h3-heading white"}>
                          {"Instant"}
                          <span className={"subscript"}>
                            {"/ code"}
                          </span>
                        </div>
                        <div className={"duration-text-block"}>
                          <p className={"p-regular light-gray"}>
                            {"Shopping, gaming and streaming cards from popular brands, delivered by code."}
                          </p>
                        </div>
                        <a href={"/gift-cards"} className={"btn-secondary w-button"}>
                          {"Shop Gift Cards"}
                        </a>
                      </div>
                    </div>
                    <div className={"pricing-features-content"}>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large white _w-500"}>
                          {"Popular Brands"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Shopping, gaming and streaming cards"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large white _w-500"}>
                          {"Payment"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Pay with BTC, ETH, USDT and more"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Instant code delivery"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"No bank account or card needed"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large white _w-500"}>
                          {"Value"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Compare face value and price"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Order history in one place"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large white _w-500"}>
                          {"Redeem"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Redeem with the brand online or in-app"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large white _w-500"}>
                          {"Support"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Dispute help"}
                        </div>
                        <div className={"pricing-feature-text"}>
                          {"Mobile and desktop access"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"dual-pricing-box-block"}>
                  <div className={"pricing-content-item"}>
                    <div className={"pricing-plan-block secondary-block"}>
                      <h3 className={"h3-heading"}>
                        {"Mobile Top Up"}
                      </h3>
                      <div className={"pricing-plan-duration-block"}>
                        <div className={"h3-heading"}>
                          {"Instant"}
                          <span className={"subscript"}>
                            {"/ top up"}
                          </span>
                        </div>
                        <div className={"duration-text-block"}>
                          <p className={"p-regular dark-gray"}>
                            {"Airtime and data bundles for any phone, delivered in seconds."}
                          </p>
                        </div>
                        <a href={"/wallet/mobile-topup"} className={"btn-primary w-button"}>
                          {"Top Up Now"}
                        </a>
                      </div>
                    </div>
                    <div className={"pricing-features-content"}>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Airtime & Data"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Airtime and data bundles"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Major networks worldwide"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Speed"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Delivered in seconds"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Receipt for every top up"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Reminders for recurring top ups"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Send To Anyone"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Top up family and friends abroad"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Coverage"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Many countries and networks"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Support"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Fast support"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Live chat"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"pricing-content-item"}>
                    <div className={"pricing-plan-block secondary-block"}>
                      <h3 className={"h3-heading"}>
                        {"Physical Products"}
                      </h3>
                      <div className={"pricing-plan-duration-block"}>
                        <div className={"h3-heading"}>
                          {"Shipped"}
                          <span className={"subscript"}>
                            {"/ tracked"}
                          </span>
                        </div>
                        <div className={"duration-text-block"}>
                          <p className={"p-regular dark-gray"}>
                            {"Verified sellers, tracked shipping and dispute help if something goes wrong."}
                          </p>
                        </div>
                        <a href={"/shop"} className={"btn-primary w-button"}>
                          {"Shop Products"}
                        </a>
                      </div>
                    </div>
                    <div className={"pricing-features-content"}>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Shop Physical Goods"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Electronics, fashion and home"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Verified sellers only"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Safe Checkout"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Escrow until delivery"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Pay instantly with crypto"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Sell your own products"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Seller Ratings"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Reviews from real buyers"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Delivery"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Tracked shipping updates"}
                        </div>
                      </div>
                      <div className={"pricing-feature-item"}>
                        <div className={"p-large cyan _w-500"}>
                          {"Support"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Dispute resolution"}
                        </div>
                        <div className={"pricing-feature-text yellow-green"}>
                          {"Order help when you need it"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section id={"products"} className={"section-payment-cards"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"payment-cards-content-wrap"}>
                <div className={"pc-upper"}>
                  <div className={"pc-upper-title-block"}>
                    <h2 className={"h2-heading"}>
                      {"Shop physical products with crypto"}
                    </h2>
                  </div>
                  <div className={"pc-upper-text-block"}>
                    <p className={"p-md dark-gray"}>
                      {"Browse electronics, fashion, home and more from verified sellers. Pay from your wallet and funds stay in escrow until your order arrives."}
                    </p>
                  </div>
                </div>
                <div className={"pc-slider-wrapper"}>
                  <div className={"payment-cards-block"}>
                    <div className={"swiper cr-card"} role={"region"} aria-label={"Gift card and digital goods categories"} tabIndex={0}>
                      <div className={"swiper-wrapper disposable-card-wrapper"}>
                        <div className={"swiper-slide"}>
                          <div className={"payment-card-content"}>
                            <div className={"payment-card-image-block"}>
                              <div className={"px-art px-cat"} style={{"background": "linear-gradient(135deg,#3b1055,#c026d3)"} as any}>
                                <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"#fff"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <rect x={"5"} y={"6"} width={"14"} height={"10"} rx={"1.5"}></rect>
                                  <path d={"M3 19h18"}></path>
                                </svg>
                              </div>
                            </div>
                            <div className={"payment-card-text-wrapper"}>
                              <h3 className={"h3-heading _w-medium"}>
                                {"Electronics"}
                              </h3>
                              <p className={"p-regular"}>
                                {"Phones, laptops, audio and accessories from verified sellers."}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={"swiper-slide"}>
                          <div className={"payment-card-content"}>
                            <div className={"payment-card-image-block"}>
                              <div className={"px-art px-cat"} style={{"background": "linear-gradient(135deg,#1e3a8a,#38bdf8)"} as any}>
                                <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"#fff"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <path d={"M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 01-8 0z"}></path>
                                </svg>
                              </div>
                            </div>
                            <div className={"payment-card-text-wrapper"}>
                              <h3 className={"h3-heading _w-medium"}>
                                {"Fashion & Accessories"}
                              </h3>
                              <p className={"p-regular"}>
                                {"Clothes, sneakers, watches and bags, shipped straight to you."}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={"swiper-slide"}>
                          <div className={"payment-card-content"}>
                            <div className={"payment-card-image-block"}>
                              <div className={"px-art px-cat"} style={{"background": "linear-gradient(135deg,#0a0a0a,#3f3f46)"} as any}>
                                <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"#fff"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <path d={"M3 11l9-8 9 8M5 10v10h14V10"}></path>
                                </svg>
                              </div>
                            </div>
                            <div className={"payment-card-text-wrapper"}>
                              <h3 className={"h3-heading _w-medium"}>
                                {"Home & Living"}
                              </h3>
                              <p className={"p-regular"}>
                                {"Kitchen, decor and everyday essentials delivered to your door."}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={"swiper-slide"}>
                          <div className={"payment-card-content"}>
                            <div className={"payment-card-image-block"}>
                              <div className={"px-art px-cat"} style={{"background": "linear-gradient(135deg,#3b1055,#c026d3)"} as any}>
                                <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"#fff"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <rect x={"5"} y={"6"} width={"14"} height={"10"} rx={"1.5"}></rect>
                                  <path d={"M3 19h18"}></path>
                                </svg>
                              </div>
                            </div>
                            <div className={"payment-card-text-wrapper"}>
                              <h3 className={"h3-heading _w-medium"}>
                                {"Electronics"}
                              </h3>
                              <p className={"p-regular"}>
                                {"Phones, laptops, audio and accessories from verified sellers."}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={"swiper-slide"}>
                          <div className={"payment-card-content"}>
                            <div className={"payment-card-image-block"}>
                              <div className={"px-art px-cat"} style={{"background": "linear-gradient(135deg,#2e1065,#a78bfa)"} as any}>
                                <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"#fff"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <rect x={"2"} y={"8"} width={"20"} height={"10"} rx={"5"}></rect>
                                  <path d={"M7 11v4M5 13h4"}></path>
                                  <circle cx={"16"} cy={"12"} r={"1"}></circle>
                                  <circle cx={"18.5"} cy={"14.5"} r={"1"}></circle>
                                </svg>
                              </div>
                            </div>
                            <div className={"payment-card-text-wrapper"}>
                              <h3 className={"h3-heading _w-medium"}>
                                {"Gaming & Gear"}
                              </h3>
                              <p className={"p-regular"}>
                                {"Controllers, headsets, keyboards and gear for every setup."}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={"swiper-slide"}>
                          <div className={"payment-card-content"}>
                            <div className={"payment-card-image-block"}>
                              <div className={"px-art px-cat"} style={{"background": "linear-gradient(135deg,#1e3a8a,#38bdf8)"} as any}>
                                <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"#fff"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <path d={"M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 01-8 0z"}></path>
                                </svg>
                              </div>
                            </div>
                            <div className={"payment-card-text-wrapper"}>
                              <h3 className={"h3-heading _w-medium"}>
                                {"Fashion & Accessories"}
                              </h3>
                              <p className={"p-regular"}>
                                {"Clothes, sneakers, watches and bags, shipped straight to you."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"w-embed"}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"trust"} data-wf--testimonial-section--variant={"base"} className={"section-testimonial"}>
          <div className={"section-padding"}>
            <div className={"testimonial-content-wrapper"}>
              <div className={"testimonial-content-upper"}>
                <h2 data-w-id={"96dc991f-c2ba-6dbd-78bb-505a0507493c"} className={"h2-heading"}>
                  {"Shop with people you can trust"}
                </h2>
                <div className={"testimonial-content-text-block"}>
                  <p data-w-id={"96dc991f-c2ba-6dbd-78bb-505a0507493f"} className={"p-md"}>
                    {"Escrow-backed orders, verified sellers and reviews from real buyers."}
                  </p>
                </div>
                <a data-w-id={"96dc991f-c2ba-6dbd-78bb-505a05074941"} href={"/gift-cards"} className={"more-stories-link-block w-inline-block"}>
                  <div className={"process-card-link-text"}>
                    {"Browse the marketplace"}
                  </div>
                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"process-card-link-icon"}>
                    <path d={"M19.0001 12L4.00012 12"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                    <path d={"M14.9999 7L19.2928 11.2929C19.6262 11.6262 19.7928 11.7929 19.7928 12C19.7928 12.2071 19.6262 12.3738 19.2928 12.7071L14.9999 17"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                  </svg>
                </a>
              </div>
              <div data-speed={"1"} className={"splide common-marquee-slider"}>
                <div className={"splide__track"}>
                  <div className={"splide__list testimonial-cards-wrapper"}>
                    <div className={"testimonial-card splide__slide"}>
                      <div className={"testimonial-card-image-block"}>
                        <img src={"/marketing-media/media-e1b23d5832c4b8bf.avif"} loading={"lazy"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"testimonial-card-content"}>
                        <div className={"testimonial-card-logo-block"}>
                          <span className={"px-tlogo"}>
                            {"pexly"}
                          </span>
                        </div>
                        <div className={"tc-tag-block"}>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"GIFT CARDS"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"testimonial-card splide__slide"}>
                      <div className={"testimonial-card-image-block"}>
                        <img src={"/marketing-media/media-6b0a97a8aba9af95.avif"} loading={"lazy"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"testimonial-card-content"}>
                        <div className={"testimonial-card-logo-block"}>
                          <span className={"px-tlogo"}>
                            {"pexly"}
                          </span>
                        </div>
                        <div className={"tc-tag-block"}>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"TOP UP"}
                            </div>
                          </div>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"INSTANT"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"testimonial-card splide__slide"}>
                      <div className={"testimonial-card-image-block"}>
                        <img src={"/marketing-media/media-bb41c51d3949d7ff.avif"} loading={"lazy"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"testimonial-card-content"}>
                        <div className={"testimonial-card-logo-block"}>
                          <span className={"px-tlogo"}>
                            {"pexly"}
                          </span>
                        </div>
                        <div className={"tc-tag-block"}>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"VERIFIED SELLER"}
                            </div>
                          </div>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"GIFT CARDS"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"testimonial-card splide__slide"}>
                      <div className={"testimonial-card-image-block"}>
                        <img src={"/marketing-media/media-054ff617864fae06.avif"} loading={"lazy"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"testimonial-card-content"}>
                        <div className={"testimonial-card-logo-block"}>
                          <span className={"px-tlogo"}>
                            {"pexly"}
                          </span>
                        </div>
                        <div className={"tc-tag-block"}>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"PHYSICAL PRODUCTS"}
                            </div>
                          </div>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"VERIFIED SELLER"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"testimonial-card splide__slide"}>
                      <div className={"testimonial-card-image-block"}>
                        <img src={"/marketing-media/media-b2848b7d59bbc976.avif"} loading={"lazy"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"testimonial-card-content"}>
                        <div className={"testimonial-card-logo-block"}>
                          <span className={"px-tlogo"}>
                            {"pexly"}
                          </span>
                        </div>
                        <div className={"tc-tag-block"}>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"VERIFIED SELLER"}
                            </div>
                          </div>
                          <div className={"tc-tag"}>
                            <div className={"p-xs white"}>
                              {"GIFT CARDS"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"faq"} className={"section-faq"}>
          <div className={"section-padding top-0"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"faq-content-wrapper"}>
                  <div data-w-id={"9d67d083-ff82-996a-efe2-28122066bded"} className={"faq-content-left"}>
                    <div className={"faq-subscribe-content-wrap"}>
                      <div className={"subscribe-content-upper"}>
                        <div className={"p-xs dark bold"}>
                          {"Stay in the loop"}
                        </div>
                        <div className={"margin-top-12px"}>
                          <h3 className={"h3-heading"}>
                            {"New brands, better deals, more ways to pay."}
                          </h3>
                        </div>
                      </div>
                      <div className={"subscribe-bottom-content"}>
                        <p className={"p-md dark-green"}>
                          {"Join the Pexly community and get updates on new gift cards, top up deals and marketplace features, delivered to your inbox."}
                        </p>
                        <div className={"subscribe-form-block w-form"}>
                          <form id={"email-form"} name={"email-form"} data-name={"Email Form"} method={"get"} className={"subscribe-form"} data-wf-page-id={"68bfe91b792fa6a7ce08405c"} data-wf-element-id={"532c6c75-2dd7-6736-75ab-e5b31abb92c5"} data-turnstile-sitekey={"0x4AAAAAAAQTptj2So4dx43e"} onSubmit={handleNewsletterSubmit}>
                            <input className={"subscribe-form-field w-input"} maxLength={256} name={"name"} data-name={"Name"} placeholder={"Your email address"} type={"email"} id={"name"} required={true} />
                            <input type={"submit"} data-wait={"Please wait..."} className={"submit-btn w-button"} value={"Subscribe Now"} />
                          </form>
                          {newsletterStatus && (
                            <div className={"p-xs dark"} role={"status"} aria-live={"polite"}>
                              {newsletterStatus}
                            </div>
                          )}
                          <div className={"success-message w-form-done"}>
                            <div>
                              {"Thank you! Your submission has been received!"}
                            </div>
                          </div>
                          <div className={"w-form-fail"}>
                            <div>
                              {"Oops! Something went wrong while submitting the form."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"faq-left-logo-overlay-block"}>
                      <span className={"px-ovl"}>
                        {"p"}
                      </span>
                    </div>
                  </div>
                  <div className={"faq-content-right"}>
                    <div className={"faq-content-right-title-block"}>
                      <h2 data-w-id={"9d67d083-ff82-996a-efe2-28122066be06"} className={"h2-heading"}>
                        {"Frequently "}
                        <span className={"h2-gray"}>
                          {"asked question"}
                        </span>
                      </h2>
                    </div>
                    <div data-w-id={"9d67d083-ff82-996a-efe2-28122066be0a"} className={"faq-qa-wrapper"}>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"}>
                        <div id={"home-faq-question-1"} aria-controls={"home-faq-answer-1"} aria-expanded={false} role={"button"} tabIndex={0} className={"faq-question-block w-dropdown-toggle"}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How does paying with crypto work?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav id={"home-faq-answer-1"} aria-labelledby={"home-faq-question-1"} role={"region"} hidden={true} className={"faq-ans-block w-dropdown-list"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"Choose a product, connect your wallet and approve the payment. Pexly is non-custodial, so your funds move straight from your wallet and never sit with us."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"}>
                        <div id={"home-faq-question-2"} aria-controls={"home-faq-answer-2"} aria-expanded={false} role={"button"} tabIndex={0} className={"faq-question-block w-dropdown-toggle"}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"Which coins can I use?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav id={"home-faq-answer-2"} aria-labelledby={"home-faq-question-2"} role={"region"} hidden={true} className={"faq-ans-block w-dropdown-list"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"You can pay with popular coins such as BTC, ETH, USDT and USDC. Available coins are shown at checkout."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"}>
                        <div id={"home-faq-question-3"} aria-controls={"home-faq-answer-3"} aria-expanded={false} role={"button"} tabIndex={0} className={"faq-question-block w-dropdown-toggle"}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"Do I need to create an account?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav id={"home-faq-answer-3"} aria-labelledby={"home-faq-question-3"} role={"region"} hidden={true} className={"faq-ans-block w-dropdown-list"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"You can browse freely and connect a wallet at checkout. No bank account or card is required."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"}>
                        <div id={"home-faq-question-4"} aria-controls={"home-faq-answer-4"} aria-expanded={false} role={"button"} tabIndex={0} className={"faq-question-block w-dropdown-toggle"}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How does mobile top up work?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav id={"home-faq-answer-4"} aria-labelledby={"home-faq-question-4"} role={"region"} hidden={true} className={"faq-ans-block w-dropdown-list"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"Pick a country and network, enter the phone number and pay with crypto. Airtime or data is delivered within moments."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"}>
                        <div id={"home-faq-question-5"} aria-controls={"home-faq-answer-5"} aria-expanded={false} role={"button"} tabIndex={0} className={"faq-question-block w-dropdown-toggle"}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How is my money kept safe?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav id={"home-faq-answer-5"} aria-labelledby={"home-faq-question-5"} role={"region"} hidden={true} className={"faq-ans-block w-dropdown-list"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"Payments for physical orders are held in escrow and released only after you confirm delivery. Digital orders are delivered right after payment."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"}>
                        <div id={"home-faq-question-6"} aria-controls={"home-faq-answer-6"} aria-expanded={false} role={"button"} tabIndex={0} className={"faq-question-block w-dropdown-toggle"}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How do physical orders work?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav id={"home-faq-answer-6"} aria-labelledby={"home-faq-question-6"} role={"region"} hidden={true} className={"faq-ans-block w-dropdown-list"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"Choose a verified seller, pay into escrow and follow the shipping updates. Confirm when it arrives and the seller gets paid."}
                            </p>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"start"} className={"section-cta"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"cta-content-wrapper"}>
                <div className={"cta-content-upper"}>
                  <h2 data-w-id={"9b66b8f8-24ca-dda9-ad23-2019e7bbf2cf"} className={"h2-heading text-white"}>
                    {"Your wallet is your marketplace"}
                  </h2>
                  <div data-w-id={"bade7455-58a7-c3f1-4166-038844c94483"} className={"cta-btn-block"}>
                    <a href={"/gift-cards"} className={"btn-secondary w-button"}>
                      {"Start Shopping"}
                    </a>
                  </div>
                </div>
                <div className={"cta-bottom"}>
                  <img src={"/marketing-media/media-e05861332b6de9c2.avif"} loading={"lazy"} data-w-id={"9b66b8f8-24ca-dda9-ad23-2019e7bbf2d4"} alt={""} className={"image"} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className={"footer"}>
        <div className={"padding-global"}>
          <div className={"container-large"}>
            <div className={"footer-content-box"}>
              <div className={"footer-content-upper"}>
                <div className={"footer-upper-left-content"}>
                  <div className={"footer-upper-logo-block"}>
                    <span className={"px-flogo"}>
                      <span className={"px-logo-mark"}>
                        {"p"}
                      </span>
                      {"pexly"}
                    </span>
                  </div>
                  <div className={"footer-upper-text-block"}>
                    <p className={"p-regular text-lightgrey"}>
                      {"Pexly is one decentralized marketplace for shopping with crypto."}
                      <br />
                      {"‍"}
                      <br />
                      {" Buy gift cards, top up mobile phones and order physical products, all from your own wallet."}
                    </p>
                  </div>
                  <div className={"footer-upper-coin-icon-block"}>
                    <img src={"/marketing-media/media-e04327e51cd5c862.avif"} loading={"lazy"} alt={""} className={"footer-upper-coin"} />
                  </div>
                  <div className={"footer-upper-text-block"}>
                    <p className={"p-regular light-gray"}>
                      {"Decentralized. Non-custodial. Borderless."}
                    </p>
                  </div>
                  <div className={"footer-social-link-wrap"}>
                    <a href={"/"} className={"footer-social-link-block w-inline-block"}>
                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 14 12"} fill={"none"} className={"footer-social-link-icon"}>
                        <path d={"M10.4416 0H12.3925L8.1304 4.87129L13.1444 11.5H9.21849L6.1436 7.4797L2.62515 11.5H0.673105L5.23183 6.2896L0.421875 0H4.44747L7.22689 3.6747L10.4416 0ZM9.7569 10.3323H10.8379L3.86009 1.10636H2.70006L9.7569 10.3323Z"} fill={"currentColor"}></path>
                      </svg>
                    </a>
                    <a href={"/"} className={"footer-social-link-block w-inline-block"}>
                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 20 20"} fill={"none"} className={"footer-social-link-icon"}>
                        <mask id={"mask0_3988_4230"} style={{"maskType": "luminance"} as any} maskUnits={"userSpaceOnUse"} x={"3"} y={"2"} width={"14"} height={"16"}>
                          <path d={"M17 2.75H3V17.522H17V2.75Z"} fill={"white"}></path>
                        </mask>
                        <g mask={"url(#mask0_3988_4230)"}>
                          <path d={"M10.7972 7.88289C11.0942 7.10744 11.7173 6.8054 12.4559 6.69064C13.1348 6.58479 13.8207 6.57277 14.4984 6.71196C15.479 6.91319 16.1533 7.49168 16.5297 8.41485C16.8008 9.0798 16.9423 9.77771 16.9508 10.4919C16.978 12.7589 16.9834 15.0259 17.0043 17.293C17.0059 17.481 16.9322 17.5186 16.7651 17.5175C15.8799 17.5116 14.9947 17.5093 14.1096 17.519C13.9095 17.5213 13.8599 17.4546 13.8606 17.2635C13.8665 15.3253 13.8657 13.387 13.8626 11.4488C13.8618 11.0987 13.8273 10.7489 13.6544 10.4345C13.369 9.91496 12.8708 9.775 12.3373 9.77383C11.7894 9.77267 11.2509 9.89984 11.0031 10.4566C10.8686 10.7586 10.8088 11.1173 10.8057 11.4511C10.7879 13.37 10.7972 15.2888 10.7968 17.2077C10.7968 17.4121 10.695 17.5145 10.4913 17.5147C9.6321 17.5147 8.77251 17.5101 7.91331 17.5182C7.72488 17.5202 7.65586 17.474 7.65625 17.2713C7.66207 13.8019 7.66168 10.3321 7.65703 6.86279C7.65703 6.67707 7.7117 6.61852 7.89858 6.62046C8.78376 6.6286 9.66894 6.63015 10.5541 6.61968C10.7581 6.61736 10.8073 6.69025 10.8003 6.87791C10.7879 7.21252 10.7972 7.5479 10.7972 7.88289Z"} fill={"currentColor"}></path>
                          <path d={"M6.14019 12.0889C6.14019 13.8073 6.14019 15.5261 6.14019 17.2445C6.14019 17.5186 6.13902 17.5198 5.86102 17.5198C4.98864 17.5201 4.11665 17.5155 3.24465 17.5232C3.06126 17.5248 3.00038 17.4721 3.00038 17.2832C3.00542 13.8139 3.00542 10.3445 3 6.87513C3 6.677 3.06126 6.62311 3.25396 6.62505C4.12595 6.63396 4.99833 6.62854 5.87033 6.62892C6.13864 6.62892 6.1398 6.63009 6.1398 6.89413C6.14019 8.62571 6.14019 10.3573 6.14019 12.0889Z"} fill={"currentColor"}></path>
                          <path d={"M6.13554 4.32223C6.13477 5.21361 5.45818 5.88631 4.56331 5.88554C3.67232 5.88476 2.99961 5.2078 3 4.31292C3.00078 3.42193 3.67736 2.74923 4.57223 2.75C5.46439 2.75078 6.13593 3.4262 6.13554 4.32223Z"} fill={"currentColor"}></path>
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className={"footer-upper-right-content"}>
                  <div className={"footer-links-wrapper"}>
                    <div className={"footer-link-title-block"}>
                      <div className={"footer-link-title"}>
                        {"Marketplace"}
                      </div>
                    </div>
                    <div className={"footer-links-block"}>
                      <a href={"/gift-cards"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Gift Cards"}
                        </div>
                      </a>
                      <a href={"/wallet/mobile-topup"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Mobile Top Up"}
                        </div>
                      </a>
                      <a href={"/shop"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Physical Products"}
                        </div>
                      </a>
                      <a href={"/"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Sell on Pexly"}
                        </div>
                      </a>
                      <a href={"/wallet"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Order History"}
                        </div>
                      </a>
                      <a href={"/wallet"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Price Alerts"}
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className={"footer-links-wrapper"}>
                    <div className={"footer-link-title-block"}>
                      <div className={"footer-link-title"}>
                        {"Wallet"}
                      </div>
                    </div>
                    <div className={"footer-links-block"}>
                      <a href={"/wallet"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Connect Wallet"}
                        </div>
                      </a>
                      <a href={"/wallet"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with BTC"}
                        </div>
                      </a>
                      <a href={"/wallet"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with ETH"}
                        </div>
                      </a>
                      <a href={"/wallet"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with USDT"}
                        </div>
                      </a>
                      <a href={"/wallet"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with USDC"}
                        </div>
                      </a>
                      <a href={"/support"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Escrow"}
                        </div>
                      </a>
                      <a href={"/support"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Fees"}
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className={"footer-links-wrapper"}>
                    <div className={"footer-link-title-block"}>
                      <div className={"footer-link-title"}>
                        {"Support"}
                      </div>
                    </div>
                    <div className={"footer-links-block"}>
                      <a href={"/support"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Help Center"}
                        </div>
                      </a>
                      <a href={"/support"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Dispute Resolution"}
                        </div>
                      </a>
                      <a href={"/contact"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Contact Us"}
                        </div>
                      </a>
                      <a href={"/support"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"FAQ"}
                        </div>
                      </a>
                      <a href={"/support"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Report a Seller"}
                        </div>
                      </a>
                      <a href={"/support"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Status"}
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className={"footer-links-wrapper"}>
                    <div className={"footer-link-title-block"}>
                      <div className={"footer-link-title"}>
                        {"Company"}
                      </div>
                    </div>
                    <div className={"footer-links-block"}>
                      <a href={"/about-us"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"About Pexly"}
                        </div>
                      </a>
                      <a href={"/blogs"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Blog"}
                        </div>
                      </a>
                      <a href={"/career"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Careers"}
                        </div>
                      </a>
                      <a href={"/teams"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Teams"}
                        </div>
                      </a>
                      <a href={"/"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Terms"}
                        </div>
                      </a>
                      <a href={"/"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Privacy"}
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className={"footer-bottom-content-wrap"}>
                <div className={"footer-big-logo-wrap"}>
                  <div className={"px-big"}>
                    {"PEXLY"}
                  </div>
                  <div className={"footer-logo-line"}></div>
                </div>
                <div className={"footer-bottom-text-wrapper"}>
                  <div className={"footer-bottom-text-left"}>
                    <p className={"p-xs light-gray"}>
                      {"2026 — All rights reserved. Pexly is a decentralized, non-custodial marketplace. Crypto assets are volatile, so only spend what you can afford to. Availability of gift cards, top ups and products varies by region."}
                    </p>
                  </div>
                  <div className={"footer-bottom-link-wrap"}>
                    <a href={"/"} className={"footer-link-item w-inline-block"}>
                      <div className={"p-xs light-gray"}>
                        {"Terms & policies"}
                      </div>
                    </a>
                    <a href={"/"} className={"footer-link-item w-inline-block"}>
                      <div className={"p-xs light-gray"}>
                        {"Privacy Policy"}
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </CurrentMarketingPage>
  );
}
