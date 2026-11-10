import { CurrentMarketingPage } from "@/components/marketing/current-marketing-page";

export function BlogsExport() {
  return (
    <CurrentMarketingPage page="blogs">
    <div className={"page-wrapper"}>
      <header className={"px-nav px-nav-with-tools"} id={"pxnav"}>
        <div className={"px-nav-in"}>
          <a className={"px-logo"} href={"/"}>
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
            <a className={"px-l"} href={"/#how-it-works"}>
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
                <a href={"/#faq"}>
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
          <div className={"px-tools"} aria-label={"Shopping tools"}>
            <details className={"px-static-search"}>
              <summary className={"px-tool-search"} aria-label={"Search products"}>
                <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <circle cx={"10.8"} cy={"10.8"} r={"6.8"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"}></circle>
                  <path d={"m16 16 4.2 4.2"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"}></path>
                </svg>
                <span>
                  {"Search"}
                </span>
              </summary>
              <form className={"px-search-panel"} action={"/shop"} method={"get"} role={"search"} aria-label={"Search Pexly products"}>
                <input type={"search"} name={"search"} aria-label={"Search products"} placeholder={"Search products..."} />
                <button className={"px-search-submit"} type={"submit"}>
                  {"Search"}
                </button>
              </form>
            </details>
            <a className={"px-tool-cart"} href={"/shop?openCart=1"} aria-label={"Open shop cart"}>
              <svg viewBox={"0 0 24 24"} aria-hidden={"true"} fill={"none"}>
                <path d={"M3 4h2l2.2 11h11.5L21 8H6"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                <circle cx={"9"} cy={"19"} r={"1.2"} fill={"currentColor"}></circle>
                <circle cx={"17"} cy={"19"} r={"1.2"} fill={"currentColor"}></circle>
              </svg>
            </a>
          </div>
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
      <main>
        <section className={"section-blogs"}>
          <div className={"section-padding career-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"blogs-title-wrapper"}>
                  <h2 data-w-id={"dc965ddd-fde6-ba88-89bd-e3f1072633fc"} className={"h2-heading"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                    {"Guides, news and ideas"}
                  </h2>
                  <div className={"margin-top-16px"}>
                    <div className={"blog-subtext-block"}>
                      <p data-w-id={"dc965ddd-fde6-ba88-89bd-e3f1072633ff"} className={"p-md"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                        {"Learn how to shop, top up and pay with crypto, and keep up with what is new at Pexly."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={"blog-content-wrapper"}>
                  <div className={"featured-blogs-wrapper"}>
                    <div className={"feature-blog-large"}>
                      <div className={"feature-collection-wrapper w-dyn-list"}>
                        <div role={"list"} className={"featured-collection-list w-dyn-items"}>
                          <div role={"listitem"} className={"featured-collection-item w-dyn-item"}>
                            <a href={"#"} className={"feature-blog-card w-inline-block"}>
                              <div className={"feature-blog-banner"}>
                                <img src={"/marketing-media/media-2722ca3e63cc4656.webp"} data-pxs={"0"} loading={"lazy"} alt={""} className={"featured-blog-banner-image"} width={"2"} height={"2"} />
                              </div>
                              <div className={"feature-blog-content"}>
                                <div className={"category-text-block"}>
                                  <div className={"p-regular uppercase"}>
                                    {"Gift Cards"}
                                  </div>
                                </div>
                                <div className={"feature-blog-bottom-content"}>
                                  <div className={"feature-blog-title"}>
                                    <h3 className={"h3-small"}>
                                      {"How to buy a gift card with crypto in under a minute"}
                                    </h3>
                                  </div>
                                  <div className={"blog-author-info"}>
                                    <div className={"p-xs dark-gray uppercase"}>
                                      {"Pexly Team"}
                                    </div>
                                    <div className={"p-xs dark-gray uppercase"}>
                                      {"6.8.25"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"featured-blog-small-wrapper"}>
                      <div className={"feature-collection-wrapper w-dyn-list"}>
                        <div role={"list"} className={"small-feature-collection-list w-dyn-items"}>
                          <div role={"listitem"} className={"feature-small-blog-item w-dyn-item"}>
                            <a href={"#"} className={"feature-blog-card-small w-inline-block"}>
                              <div className={"f-blog-small-card-image"}>
                                <img src={"/marketing-media/media-e67994b8376b6a99.webp"} data-pxs={"1"} loading={"lazy"} alt={""} className={"fb-small-card-banner"} width={"2"} height={"2"} />
                              </div>
                              <div className={"f-blog-content-wrapper"}>
                                <div className={"category-text-block"}>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"Guides"}
                                  </div>
                                </div>
                                <h4 className={"fb-small-blog-title"}>
                                  {"Mobile top up with USDT: a step by step guide"}
                                </h4>
                                <div className={"blog-author-info"}>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"Marketplace Team"}
                                  </div>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"6.8.25"}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                          <div role={"listitem"} className={"feature-small-blog-item w-dyn-item"}>
                            <a href={"#"} className={"feature-blog-card-small w-inline-block"}>
                              <div className={"f-blog-small-card-image"}>
                                <img src={"/marketing-media/media-dcf61bb2bf363acf.webp"} data-pxs={"2"} loading={"lazy"} alt={""} className={"fb-small-card-banner"} width={"2"} height={"2"} />
                              </div>
                              <div className={"f-blog-content-wrapper"}>
                                <div className={"category-text-block"}>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"Guides"}
                                  </div>
                                </div>
                                <h4 className={"fb-small-blog-title"}>
                                  {"What escrow is and why it protects your crypto purchases"}
                                </h4>
                                <div className={"blog-author-info"}>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"Security Team"}
                                  </div>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"6.8.25"}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                          <div role={"listitem"} className={"feature-small-blog-item w-dyn-item"}>
                            <a href={"#"} className={"feature-blog-card-small w-inline-block"}>
                              <div className={"f-blog-small-card-image"}>
                                <img src={"/marketing-media/media-9f00d27ec6ba0558.webp"} data-pxs={"3"} loading={"lazy"} alt={""} className={"fb-small-card-banner"} width={"2"} height={"2"} />
                              </div>
                              <div className={"f-blog-content-wrapper"}>
                                <div className={"category-text-block"}>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"Mobile Top Up"}
                                  </div>
                                </div>
                                <h4 className={"fb-small-blog-title"}>
                                  {"Non-custodial wallets explained: why your keys matter"}
                                </h4>
                                <div className={"blog-author-info"}>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"Support Team"}
                                  </div>
                                  <div className={"p-xs dark-gray uppercase"}>
                                    {"6.8.25"}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"all-blogs-wrapper"}>
                    <div data-current={"Tab 1"} data-easing={"ease"} data-duration-in={"300"} data-duration-out={"100"} className={"all-blogs-content w-tabs"}>
                      <div className={"all-blogs-category-wrapper w-tab-menu"} role={"tablist"}>
                        <a data-w-tab={"Tab 1"} className={"blog-category-link w-inline-block w-tab-link w--current"} id={"w-tabs-0-data-w-tab-0"} href={"#"} role={"tab"} aria-controls={"w-tabs-0-data-w-pane-0"} aria-selected={"true"}>
                          <div className={"category-link-text"}>
                            {"All Posts"}
                          </div>
                        </a>
                        <a data-w-tab={"Tab 2"} className={"blog-category-link w-inline-block w-tab-link"} tabIndex={-1} id={"w-tabs-0-data-w-tab-1"} href={"#"} role={"tab"} aria-controls={"w-tabs-0-data-w-pane-1"} aria-selected={"false"}>
                          <div className={"category-link-text"}>
                            {"Security"}
                          </div>
                        </a>
                        <a data-w-tab={"Tab 3"} className={"blog-category-link w-inline-block w-tab-link"} tabIndex={-1} id={"w-tabs-0-data-w-tab-2"} href={"#"} role={"tab"} aria-controls={"w-tabs-0-data-w-pane-2"} aria-selected={"false"}>
                          <div className={"category-link-text"}>
                            {"Guides"}
                          </div>
                        </a>
                        <a data-w-tab={"Tab 4"} className={"blog-category-link w-inline-block w-tab-link"} tabIndex={-1} id={"w-tabs-0-data-w-tab-3"} href={"#"} role={"tab"} aria-controls={"w-tabs-0-data-w-pane-3"} aria-selected={"false"}>
                          <div className={"category-link-text"}>
                            {"Mobile Top Up"}
                          </div>
                        </a>
                        <a data-w-tab={"Tab 5"} className={"blog-category-link w-inline-block w-tab-link"} tabIndex={-1} id={"w-tabs-0-data-w-tab-4"} href={"#"} role={"tab"} aria-controls={"w-tabs-0-data-w-pane-4"} aria-selected={"false"}>
                          <div className={"category-link-text"}>
                            {"Gift Cards"}
                          </div>
                        </a>
                      </div>
                      <div className={"blogs-cards-wrapper w-tab-content"}>
                        <div data-w-tab={"Tab 1"} className={"blog-collection-wrapper w-tab-pane w--tab-active"} id={"w-tabs-0-data-w-pane-0"} role={"tabpanel"} aria-labelledby={"w-tabs-0-data-w-tab-0"}>
                          <div className={"all-blog-collection-wrapper w-dyn-list"}>
                            <div role={"list"} className={"blogs-collection-lists w-dyn-items"}>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-2722ca3e63cc4656.webp"} data-pxs={"0"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Gift Cards"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"How to buy a gift card with crypto in under a minute"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Pexly Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-e67994b8376b6a99.webp"} data-pxs={"1"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Guides"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Mobile top up with USDT: a step by step guide"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Marketplace Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-dcf61bb2bf363acf.webp"} data-pxs={"2"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Guides"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"What escrow is and why it protects your crypto purchases"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Security Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-9f00d27ec6ba0558.webp"} data-pxs={"3"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Mobile Top Up"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Non-custodial wallets explained: why your keys matter"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Support Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-d97963f0fc0b6f3e.webp"} data-pxs={"4"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Guides"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Five tips for ordering physical products with crypto"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Product Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-6c9bf9cd9509b2e2.webp"} data-pxs={"5"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Mobile Top Up"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Which coins work best for everyday payments?"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Growth Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-70cf8a5c5f3764bb.webp"} data-pxs={"6"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Security"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Send airtime to family abroad without transfer fees"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Pexly Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-d0d2945e5a3e7066.webp"} data-pxs={"7"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Gift Cards"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"How to spot a trustworthy seller on a decentralized marketplace"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Marketplace Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-1cbfc60d5b326f2b.webp"} data-pxs={"8"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Mobile Top Up"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Pay with crypto: a beginner guide to your first purchase"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Support Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-w-tab={"Tab 2"} className={"blog-collection-wrapper w-tab-pane"} id={"w-tabs-0-data-w-pane-1"} role={"tabpanel"} aria-labelledby={"w-tabs-0-data-w-tab-1"}>
                          <div className={"all-blog-collection-wrapper w-dyn-list"}>
                            <div role={"list"} className={"blogs-collection-lists w-dyn-items"}>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-70cf8a5c5f3764bb.webp"} data-pxs={"6"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Security"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Send airtime to family abroad without transfer fees"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Pexly Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-w-tab={"Tab 3"} className={"blog-collection-wrapper w-tab-pane"} id={"w-tabs-0-data-w-pane-2"} role={"tabpanel"} aria-labelledby={"w-tabs-0-data-w-tab-2"}>
                          <div className={"all-blog-collection-wrapper w-dyn-list"}>
                            <div role={"list"} className={"blogs-collection-lists w-dyn-items"}>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-e67994b8376b6a99.webp"} data-pxs={"1"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Guides"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Mobile top up with USDT: a step by step guide"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Marketplace Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-dcf61bb2bf363acf.webp"} data-pxs={"2"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Guides"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"What escrow is and why it protects your crypto purchases"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Security Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-d97963f0fc0b6f3e.webp"} data-pxs={"4"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Guides"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Five tips for ordering physical products with crypto"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Product Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-w-tab={"Tab 4"} className={"blog-collection-wrapper w-tab-pane"} id={"w-tabs-0-data-w-pane-3"} role={"tabpanel"} aria-labelledby={"w-tabs-0-data-w-tab-3"}>
                          <div className={"all-blog-collection-wrapper w-dyn-list"}>
                            <div role={"list"} className={"blogs-collection-lists w-dyn-items"}>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-9f00d27ec6ba0558.webp"} data-pxs={"3"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Mobile Top Up"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Non-custodial wallets explained: why your keys matter"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Support Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-6c9bf9cd9509b2e2.webp"} data-pxs={"5"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Mobile Top Up"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Which coins work best for everyday payments?"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Growth Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-1cbfc60d5b326f2b.webp"} data-pxs={"8"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Mobile Top Up"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"Pay with crypto: a beginner guide to your first purchase"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Support Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-w-tab={"Tab 5"} className={"blog-collection-wrapper w-tab-pane"} id={"w-tabs-0-data-w-pane-4"} role={"tabpanel"} aria-labelledby={"w-tabs-0-data-w-tab-4"}>
                          <div className={"all-blog-collection-wrapper w-dyn-list"}>
                            <div role={"list"} className={"blogs-collection-lists w-dyn-items"}>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-2722ca3e63cc4656.webp"} data-pxs={"0"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Gift Cards"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"How to buy a gift card with crypto in under a minute"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Pexly Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                              <div role={"listitem"} className={"blog-collection-item w-dyn-item"}>
                                <a href={"#"} className={"blog-card w-inline-block"}>
                                  <div className={"blog-thumb-wrapper"}>
                                    <img src={"/marketing-media/media-d0d2945e5a3e7066.webp"} data-pxs={"7"} loading={"lazy"} alt={""} className={"blog-thumbnail"} width={"2"} height={"2"} />
                                  </div>
                                  <div className={"blog-info-block"}>
                                    <div className={"category-text-block"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Gift Cards"}
                                      </div>
                                    </div>
                                    <div className={"blog-title-block"}>
                                      <h4 className={"blog-title"}>
                                        {"How to spot a trustworthy seller on a decentralized marketplace"}
                                      </h4>
                                    </div>
                                    <div className={"blog-author-info"}>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"Marketplace Team"}
                                      </div>
                                      <div className={"p-xs dark-gray uppercase"}>
                                        {"6.8.25"}
                                      </div>
                                    </div>
                                  </div>
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
            </div>
          </div>
        </section>
        <section className={"section-faq"}>
          <div className={"section-padding top-0"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"faq-content-wrapper"}>
                  <div data-w-id={"61e1d0d7-8e6a-3e3e-8bfa-24ab7caa8ee9"} className={"faq-content-left"} style={{"opacity": "0"} as any}>
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
                        <div className={"subscribe-form-block w-form w-form-loading"}>
                          <form id={"email-form"} name={"email-form"} data-name={"Email Form"} method={"get"} className={"subscribe-form"} data-wf-page-id={"6893699404766727a200a828"} data-wf-element-id={"578f4569-74bb-9421-c965-f350c0d7ef76"} data-turnstile-sitekey={"0x4AAAAAAAQTptj2So4dx43e"} aria-label={"Email Form"}>
                            <input className={"subscribe-form-field w-input"} maxLength={256} name={"name"} data-name={"Name"} placeholder={"Your email address"} type={"email"} id={"name"} required={true} />
                            <input type={"submit"} data-wait={"Please wait..."} className={"submit-btn w-button w-form-loading"} value={"Subscribe Now"} disabled={true} />
                          </form>
                          <div className={"success-message w-form-done"} tabIndex={-1} role={"region"} aria-label={"Email Form success"}>
                            <div>
                              {"Thank you! Your submission has been received!"}
                            </div>
                          </div>
                          <div className={"w-form-fail"} tabIndex={-1} role={"region"} aria-label={"Email Form failure"}>
                            <div>
                              {"Oops! Something went wrong while submitting the form."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={"faq-left-logo-overlay-block"}>
                      <img src={"/marketing-media/media-8c705d2b554987b4.svg"} loading={"lazy"} alt={""} className={"overlay-logo"} />
                    </div>
                  </div>
                  <div className={"faq-content-right"}>
                    <div className={"faq-content-right-title-block"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <h2 className={"h2-heading"}>
                        {"Frequently "}
                        <span className={"h2-gray"}>
                          {"asked question"}
                        </span>
                      </h2>
                    </div>
                    <div className={"faq-qa-wrapper"}>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"} style={{"opacity": "0"} as any}>
                        <div className={"faq-question-block w-dropdown-toggle"} id={"w-dropdown-toggle-3"} aria-controls={"w-dropdown-list-3"} aria-haspopup={"menu"} aria-expanded={"false"} role={"button"} tabIndex={0}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How does paying with crypto work?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"} style={{"display": "block"} as any}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"} style={{"display": "none"} as any}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav className={"faq-ans-block w-dropdown-list"} style={{"height": "0px"} as any} id={"w-dropdown-list-3"} aria-labelledby={"w-dropdown-toggle-3"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"Choose a product, connect your wallet and approve the payment. Pexly is non-custodial, so your funds move straight from your wallet and never sit with us."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"} style={{"opacity": "0"} as any}>
                        <div className={"faq-question-block w-dropdown-toggle"} id={"w-dropdown-toggle-4"} aria-controls={"w-dropdown-list-4"} aria-haspopup={"menu"} aria-expanded={"false"} role={"button"} tabIndex={0}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"Can I upgrade or downgrade my plan anytime?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"} style={{"display": "block"} as any}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"} style={{"display": "none"} as any}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav className={"faq-ans-block w-dropdown-list"} style={{"height": "0px"} as any} id={"w-dropdown-list-4"} aria-labelledby={"w-dropdown-toggle-4"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"You can pay with popular coins such as BTC, ETH, USDT and USDC. Available coins are shown at checkout."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"} style={{"opacity": "0"} as any}>
                        <div className={"faq-question-block w-dropdown-toggle"} id={"w-dropdown-toggle-5"} aria-controls={"w-dropdown-list-5"} aria-haspopup={"menu"} aria-expanded={"false"} role={"button"} tabIndex={0}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"Do I need to create an account?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"} style={{"display": "block"} as any}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"} style={{"display": "none"} as any}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav className={"faq-ans-block w-dropdown-list"} style={{"height": "0px"} as any} id={"w-dropdown-list-5"} aria-labelledby={"w-dropdown-toggle-5"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"You can browse freely and connect a wallet at checkout. No bank account or card is required."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"} style={{"opacity": "0"} as any}>
                        <div className={"faq-question-block w-dropdown-toggle"} id={"w-dropdown-toggle-6"} aria-controls={"w-dropdown-list-6"} aria-haspopup={"menu"} aria-expanded={"false"} role={"button"} tabIndex={0}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How does mobile top up work?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"} style={{"display": "block"} as any}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"} style={{"display": "none"} as any}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav className={"faq-ans-block w-dropdown-list"} style={{"height": "0px"} as any} id={"w-dropdown-list-6"} aria-labelledby={"w-dropdown-toggle-6"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"Pick a country and network, enter the phone number and pay with crypto. Airtime or data is delivered within moments."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"} style={{"opacity": "0"} as any}>
                        <div className={"faq-question-block w-dropdown-toggle"} id={"w-dropdown-toggle-7"} aria-controls={"w-dropdown-list-7"} aria-haspopup={"menu"} aria-expanded={"false"} role={"button"} tabIndex={0}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How is my money kept safe?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"} style={{"display": "block"} as any}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"} style={{"display": "none"} as any}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav className={"faq-ans-block w-dropdown-list"} style={{"height": "0px"} as any} id={"w-dropdown-list-7"} aria-labelledby={"w-dropdown-toggle-7"}>
                          <div className={"faq-ans-text-block"}>
                            <p className={"p-regular"}>
                              {"Payments for physical orders are held in escrow and released only after you confirm delivery. Digital orders are delivered right after payment."}
                            </p>
                          </div>
                        </nav>
                      </div>
                      <div data-hover={"false"} data-delay={"0"} className={"faq-item w-dropdown"} style={{"opacity": "0"} as any}>
                        <div className={"faq-question-block w-dropdown-toggle"} id={"w-dropdown-toggle-8"} aria-controls={"w-dropdown-list-8"} aria-haspopup={"menu"} aria-expanded={"false"} role={"button"} tabIndex={0}>
                          <div className={"faq-title"}>
                            <div className={"faq-question"}>
                              {"How do physical orders work?"}
                            </div>
                          </div>
                          <div className={"faq-question-icon-block"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 18 2"} fill={"none"} className={"faq-question-icon"} style={{"display": "block"} as any}>
                              <path d={"M17 1L1 1"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"faq-ques-cross-icon"} style={{"display": "none"} as any}>
                              <path d={"M19.0005 5L5.00049 19M5.00049 5L19.0005 19"} stroke={"currentColor"} strokeWidth={"1.5"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                            </svg>
                          </div>
                        </div>
                        <nav className={"faq-ans-block w-dropdown-list"} style={{"height": "0px"} as any} id={"w-dropdown-list-8"} aria-labelledby={"w-dropdown-toggle-8"}>
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
        <section id={"start"} className={"section-cta"} style={{"backgroundColor": "#0a211f"} as any}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"cta-content-wrapper"}>
                <div className={"cta-content-upper"}>
                  <h2 data-w-id={"9b66b8f8-24ca-dda9-ad23-2019e7bbf2cf"} className={"h2-heading text-white"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                    {"Your wallet is your marketplace"}
                  </h2>
                  <div data-w-id={"bade7455-58a7-c3f1-4166-038844c94483"} className={"cta-btn-block"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                    <a href={"#"} className={"btn-secondary w-button"}>
                      {"Start Shopping"}
                    </a>
                  </div>
                </div>
                <div className={"cta-bottom"}>
                  <img src={"/assets/cta-wallet.avif"} loading={"lazy"} data-w-id={"9b66b8f8-24ca-dda9-ad23-2019e7bbf2d4"} alt={""} className={"image"} />
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
      <div className={"w-embed"}></div>
    </div>
    <a className={"w-webflow-badge"} href={"https://webflow.com/?utm_campaign=brandjs"}>
      <img src={"/assets/webflow-badge/icon.svg"} alt={""} style={{"marginRight": "4px", "width": "26px"} as any} width={"26"} height={"150"} />
      <img src={"/assets/webflow-badge/text.svg"} alt={"Made in Webflow"} width={"300"} height={"150"} />
    </a>
    </CurrentMarketingPage>
  );
}
