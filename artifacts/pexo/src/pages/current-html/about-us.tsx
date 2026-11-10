import { CurrentMarketingPage } from "@/components/marketing/current-marketing-page";

export function AboutUsExport() {
  return (
    <CurrentMarketingPage page="about-us">
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
      <div className={"main"}>
        <section className={"section-about-hero"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"about-content-wrapper"}>
                <div className={"about-content-wrap"}>
                  <div id={"w-node-_391f0fa4-83b8-4aca-6f81-e5fd01170f3d-363d832d"} className={"about-left-content"}>
                    <h1 data-w-id={"391f0fa4-83b8-4aca-6f81-e5fd01170f48"} className={"h1-heading"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      {"We're building the marketplace for crypto spending"}
                    </h1>
                    <div className={"about-text-block"}>
                      <p data-w-id={"391f0fa4-83b8-4aca-6f81-e5fd01170f4b"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "opacity": "0", "filter": "blur(5px)", "transformStyle": "preserve-3d"} as any} className={"p-md"}>
                        {"Pexly is a decentralized, non-custodial marketplace where people buy gift cards, top up phones and order physical products with crypto. No banks and no middlemen."}
                      </p>
                    </div>
                    <div data-w-id={"391f0fa4-83b8-4aca-6f81-e5fd01170f4d"} className={"about-btn-wrap"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <a href={"#"} className={"btn-primary w-button"}>
                        {"Start Shopping"}
                      </a>
                    </div>
                  </div>
                  <div className={"about-right-content"}>
                    <div data-w-id={"2d7ac970-6ba6-a277-da29-4dda0e8b5827"} className={"about-right-image-block"} style={{"opacity": "0"} as any}>
                      <div className={"px-art"} style={{"background": "linear-gradient(160deg,#0f3d2e,#1fa37a)", "--w": "min(58cqw,44cqh)"} as any}>
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
                              {"Gift Cards"}
                            </div>
                            <div className={"chips"}>
                              <span className={"on"}>
                                {"All"}
                              </span>
                              <span className={""}>
                                {"Shopping"}
                              </span>
                              <span className={""}>
                                {"Gaming"}
                              </span>
                              <span className={""}>
                                {"Streaming"}
                              </span>
                            </div>
                            <div className={"rw"}>
                              <span className={"ic"} style={{"background": "#7c5cff"} as any}>
                                {"S"}
                              </span>
                              <div className={"t"}>
                                <b>
                                  {"Shopping Card"}
                                </b>
                                <small>
                                  {"$25 · Instant"}
                                </small>
                              </div>
                              <div className={"p"}>
                                {"0.00038 BTC"}
                              </div>
                            </div>
                            <div className={"rw"}>
                              <span className={"ic"} style={{"background": "#1fa37a"} as any}>
                                {"G"}
                              </span>
                              <div className={"t"}>
                                <b>
                                  {"Gaming Card"}
                                </b>
                                <small>
                                  {"$20 · Instant"}
                                </small>
                              </div>
                              <div className={"p"}>
                                {"20.1 USDT"}
                              </div>
                            </div>
                            <div className={"rw"}>
                              <span className={"ic"} style={{"background": "#ff6b6b"} as any}>
                                {"M"}
                              </span>
                              <div className={"t"}>
                                <b>
                                  {"Streaming Card"}
                                </b>
                                <small>
                                  {"$15 · Instant"}
                                </small>
                              </div>
                              <div className={"p"}>
                                {"0.0049 ETH"}
                              </div>
                            </div>
                            <div className={"rw"}>
                              <span className={"ic"} style={{"background": "#2f80ed"} as any}>
                                {"T"}
                              </span>
                              <div className={"t"}>
                                <b>
                                  {"Travel Card"}
                                </b>
                                <small>
                                  {"$50 · Instant"}
                                </small>
                              </div>
                              <div className={"p"}>
                                {"50.2 USDC"}
                              </div>
                            </div>
                            <div className={"btn"}>
                              {"Buy with crypto"}
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
        <section className={"section-partners"}>
          <div className={"section-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"partner-content-wrap"}>
                  <div className={"splide common-marquee-slider splide--loop splide--ltr splide--draggable is-active is-initialized"} id={"splide01"} role={"region"} aria-roledescription={"carousel"}>
                    <div className={"splide__track splide__track--loop splide__track--ltr splide__track--draggable"} id={"splide01-track"} style={{"paddingLeft": "0px", "paddingRight": "0px"} as any} aria-live={"off"} aria-atomic={"true"}>
                      <div className={"splide__list partner-logos-block"} style={{"transform": "translateX(-1907.5px)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any} id={"splide01-list"} role={"presentation"}>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone01"} role={"group"} aria-roledescription={"slide"} aria-label={"1 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-1e30e9cc51ca4b54.svg"} data-pxs={"0"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone02"} role={"group"} aria-roledescription={"slide"} aria-label={"2 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-3d6251ec588315db.svg"} data-pxs={"1"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone03"} role={"group"} aria-roledescription={"slide"} aria-label={"3 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-0b395b9e733b6a30.svg"} data-pxs={"2"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone04"} role={"group"} aria-roledescription={"slide"} aria-label={"4 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-4ad2aecdede0279c.svg"} data-pxs={"3"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone05"} role={"group"} aria-roledescription={"slide"} aria-label={"5 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-306655f7d974a6ec.svg"} data-pxs={"4"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone is-active"} id={"splide01-clone06"} role={"group"} aria-roledescription={"slide"} aria-label={"6 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-306655f7d974a6ec.svg"} data-pxs={"4"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide"} id={"splide01-slide01"} role={"group"} aria-roledescription={"slide"} aria-label={"1 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-1e30e9cc51ca4b54.svg"} data-pxs={"0"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide"} id={"splide01-slide02"} role={"group"} aria-roledescription={"slide"} aria-label={"2 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-3d6251ec588315db.svg"} data-pxs={"1"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide"} id={"splide01-slide03"} role={"group"} aria-roledescription={"slide"} aria-label={"3 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-0b395b9e733b6a30.svg"} data-pxs={"2"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide"} id={"splide01-slide04"} role={"group"} aria-roledescription={"slide"} aria-label={"4 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-4ad2aecdede0279c.svg"} data-pxs={"3"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide is-prev"} id={"splide01-slide05"} role={"group"} aria-roledescription={"slide"} aria-label={"5 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-306655f7d974a6ec.svg"} data-pxs={"4"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide is-active"} id={"splide01-slide06"} role={"group"} aria-roledescription={"slide"} aria-label={"6 of 6"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-306655f7d974a6ec.svg"} data-pxs={"4"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone is-next"} id={"splide01-clone07"} role={"group"} aria-roledescription={"slide"} aria-label={"1 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-1e30e9cc51ca4b54.svg"} data-pxs={"0"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone08"} role={"group"} aria-roledescription={"slide"} aria-label={"2 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-3d6251ec588315db.svg"} data-pxs={"1"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone09"} role={"group"} aria-roledescription={"slide"} aria-label={"3 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-0b395b9e733b6a30.svg"} data-pxs={"2"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone10"} role={"group"} aria-roledescription={"slide"} aria-label={"4 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-4ad2aecdede0279c.svg"} data-pxs={"3"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone"} id={"splide01-clone11"} role={"group"} aria-roledescription={"slide"} aria-label={"5 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-306655f7d974a6ec.svg"} data-pxs={"4"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
                          </div>
                        </div>
                        <div className={"splide__slide splide__slide--clone is-active"} id={"splide01-clone12"} role={"group"} aria-roledescription={"slide"} aria-label={"6 of 6"} aria-hidden={"true"}>
                          <div className={"partner-logo-item"}>
                            <img src={"/marketing-media/media-306655f7d974a6ec.svg"} data-pxs={"4"} loading={"lazy"} alt={""} className={"partner-logo-image"} width={"300"} height={"150"} />
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
        <section className={"section-matrics"}>
          <div className={"section-padding is-0"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"matrics-content-wrapper"}>
                  <div className={"matrics-content-left"}>
                    <div data-w-id={"7a4ccd8a-2ed2-f067-54e5-ae1235736367"} className={"matrics-content-block"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <div className={"p-md"}>
                        {"Categories live:"}
                      </div>
                      <h3 className={"h3-heading"}>
                        {"3"}
                      </h3>
                    </div>
                    <div data-w-id={"1b9c3e70-ee29-500b-1635-337f491165e3"} className={"matrics-content-block"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <div className={"p-md"}>
                        {"Payments made in:"}
                      </div>
                      <h3 className={"h3-heading"}>
                        {"Crypto"}
                      </h3>
                    </div>
                  </div>
                  <div data-w-id={"07103728-ac2c-d8bb-88a6-bdb31a33f96b"} className={"matrics-content-right"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                    <p className={"p-md"}>
                      {"Pexly was built on a simple idea: your crypto should be as easy to spend as cash. We bring everyday shopping into one decentralized marketplace, so you never have to cash out first."}
                      <br />
                      <br />
                      {"Gift cards, mobile top up and physical products live together in one place, protected by escrow and a non-custodial wallet, so you always stay in control of your funds."}
                      <br />
                      <br />
                      {"Buyers and sellers who believe in open, borderless commerce help us shape what shopping with crypto looks like, from instant digital goods to tracked physical orders."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"section-esim-activation"}>
          <div className={"section-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"esim-activation-content-wrap"}>
                  <div className={"esim-activation-right"}>
                    <div data-w-id={"770cc6c5-2e71-5392-1b22-feba200d1163"} className={"esim-activation-right-img-block"} style={{"opacity": "0"} as any}>
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
                  <div className={"esim-activation-left"}>
                    <div className={"esim-a-title-block"}>
                      <h2 data-w-id={"770cc6c5-2e71-5392-1b22-feba200d113e"} className={"h2-heading text-dark"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                        {"Why we build"}
                        <br />
                        {"Pexly"}
                      </h2>
                    </div>
                    <div data-w-id={"770cc6c5-2e71-5392-1b22-feba200d1140"} className={"esim-a-feature-wrapper"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <div className={"esim-a-feature-item"}>
                        <div className={"esim-a-feature-icon-block"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                            <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                          </svg>
                        </div>
                        <div className={"esim-a-feature-text-block"}>
                          <p className={"p-regular dark-gray"}>
                            {"Make crypto useful for everyday purchases, not just trading."}
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
                            {"Keep users in control with a non-custodial wallet and escrow."}
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
                            {"Open global shopping to anyone, with no bank account needed."}
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
                            {"Build a fair marketplace where buyers and sellers trust each other."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div data-w-id={"770cc6c5-2e71-5392-1b22-feba200d115d"} className={"esim-a-button-wrapper"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <a href={"#"} className={"btn-primary w-button"}>
                        {"Start Shopping"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"section-esim-activation white-02"}>
          <div className={"section-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"esim-activation-content-wrap"}>
                  <div className={"esim-activation-left"}>
                    <div className={"esim-a-title-block"}>
                      <h2 data-w-id={"52b20b1d-2049-5c94-3eac-2f51fb975bbd"} className={"h2-heading text-dark"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                        {"Top up any phone, anywhere"}
                      </h2>
                    </div>
                    <div data-w-id={"52b20b1d-2049-5c94-3eac-2f51fb975bbf"} className={"esim-a-feature-wrapper"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <div className={"esim-a-feature-item"}>
                        <div className={"esim-a-feature-icon-block"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 24 24"} fill={"none"} className={"esim-a-feature-icon"}>
                            <path d={"M20 6L9 17L4 12"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}></path>
                          </svg>
                        </div>
                        <div className={"esim-a-feature-text-block"}>
                          <p className={"p-regular dark-gray"}>
                            {"Top up airtime and data for any phone in seconds."}
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
                            {"Pick the country and network, enter the number and confirm."}
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
                            {"Send top ups to family and friends abroad with no transfer fees."}
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
                            {"Reorder your favourite top ups in one tap."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"esim-activation-right"}>
                    <div data-w-id={"52b20b1d-2049-5c94-3eac-2f51fb975be2"} className={"esim-activation-right-img-block"} style={{"opacity": "0"} as any}>
                      <div className={"px-art"} style={{"background": "linear-gradient(160deg,#bcc6ff,#8aa4ff)"} as any}>
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
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"section-esim-activation"}>
          <div className={"section-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"esim-activation-content-wrap"}>
                  <div className={"esim-activation-left"}>
                    <div className={"esim-a-title-block"}>
                      <h2 data-w-id={"6ac948c0-4052-46e4-918b-18cf5058a84d"} className={"h2-heading text-dark"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                        {"Our"}
                        <br />
                        {"story"}
                      </h2>
                    </div>
                    <div className={"esim-a-feature-wrapper"}>
                      <p data-w-id={"cca8b0ee-424a-eb67-62df-1ea7f0bf52e3"} className={"p-md"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                        {"Shopping with crypto is still harder than it should be. Whether it is topping up a phone, buying a gift card or ordering a product from abroad, paying with crypto usually means too many steps and too many middlemen. That is why Pexly exists: to remove the friction between your wallet and the things you need."}
                      </p>
                    </div>
                    <div data-w-id={"6ac948c0-4052-46e4-918b-18cf5058a86e"} className={"esim-a-button-wrapper"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      <a href={"#"} className={"btn-primary w-button"}>
                        {"Top Up Now"}
                      </a>
                    </div>
                  </div>
                  <div className={"esim-activation-right"}>
                    <div data-w-id={"6ac948c0-4052-46e4-918b-18cf5058a849"} className={"esim-activation-right-img-block"} style={{"opacity": "0"} as any}>
                      <div className={"px-art"} style={{"background": "linear-gradient(160deg,#ffe29f,#ffa99f)"} as any}>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"section-testimonial"}>
          <div className={"section-padding top-0"}>
            <div className={"testimonial-content-wrapper"}>
              <div className={"testimonial-content-upper"}>
                <h2 data-w-id={"77632277-9651-1370-8c75-e9ca687c9fe8"} className={"h2-heading"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                  {"Our Team Members"}
                </h2>
                <div className={"team-summury-block"}>
                  <p data-w-id={"77632277-9651-1370-8c75-e9ca687c9feb"} className={"p-md"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                    {"A small team of builders, designers and support heroes working to make crypto spendable everywhere."}
                  </p>
                </div>
              </div>
              <div className={"about-team-slider"}>
                <div className={"testimonial-card-slide"}>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-e9287485342e1485.avif"} data-pxs={"5"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Daniel Reyes"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"CEO and Founder"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-a1a406199af33d3a.avif"} data-pxs={"6"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Kwame Mensah"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Head of Product"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-436a845dbefbd83e.avif"} data-pxs={"7"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Samuel Okoye"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Lead Smart Contract Engineer"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-bccc78114d1c6e8b.avif"} data-pxs={"8"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Marcus Lee"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Head of Marketplace Operations"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-c526428f04c41681.avif"} data-pxs={"9"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Adrian Cole"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Customer Support Lead"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"testimonial-card-slide"}>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-e9287485342e1485.avif"} data-pxs={"5"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Daniel Reyes"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"CEO and Founder"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-a1a406199af33d3a.avif"} data-pxs={"6"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Kwame Mensah"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Head of Product"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-436a845dbefbd83e.avif"} data-pxs={"7"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Samuel Okoye"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Lead Smart Contract Engineer"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-bccc78114d1c6e8b.avif"} data-pxs={"8"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Marcus Lee"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Head of Marketplace Operations"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-c526428f04c41681.avif"} data-pxs={"9"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Adrian Cole"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Customer Support Lead"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={"testimonial-card-slide"}>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-e9287485342e1485.avif"} data-pxs={"5"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Daniel Reyes"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"CEO and Founder"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-a1a406199af33d3a.avif"} data-pxs={"6"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Kwame Mensah"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Head of Product"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-436a845dbefbd83e.avif"} data-pxs={"7"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Samuel Okoye"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Lead Smart Contract Engineer"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-bccc78114d1c6e8b.avif"} data-pxs={"8"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Marcus Lee"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Head of Marketplace Operations"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"testimonial-cards-wrapper"} style={{"willChange": "transform", "transform": "translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d"} as any}>
                    <div className={"testimonial-card"}>
                      <div className={"testimonial-card-image-block"}>
                        <img loading={"lazy"} src={"/marketing-media/media-c526428f04c41681.avif"} data-pxs={"9"} alt={""} className={"testimonial-card-image"} />
                      </div>
                      <div className={"client-position-wrap"}>
                        <div className={"client-position-block"}>
                          <div className={"client-name-block"}>
                            <div className={"client-name"}>
                              {"Adrian Cole"}
                            </div>
                          </div>
                          <div className={"client-position-item"}>
                            <div className={"client-position"}>
                              {"Customer Support Lead"}
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
                          <form id={"email-form"} name={"email-form"} data-name={"Email Form"} method={"get"} className={"subscribe-form"} data-wf-page-id={"68a2311f957f8dd4363d832d"} data-wf-element-id={"578f4569-74bb-9421-c965-f350c0d7ef76"} data-turnstile-sitekey={"0x4AAAAAAAQTptj2So4dx43e"} aria-label={"Email Form"}>
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
      </div>
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
    <a className={"w-webflow-badge"} href={"https://webflow.com/?utm_campaign=brandjs"}>
      <img src={"/assets/webflow-badge/icon.svg"} alt={""} style={{"marginRight": "4px", "width": "26px"} as any} width={"26"} height={"150"} />
      <img src={"/assets/webflow-badge/text.svg"} alt={"Made in Webflow"} width={"300"} height={"150"} />
    </a>
    </CurrentMarketingPage>
  );
}
