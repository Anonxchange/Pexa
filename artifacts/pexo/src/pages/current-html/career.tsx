import { CurrentMarketingPage } from "@/components/marketing/current-marketing-page";

export function CareerExport() {
  return (
    <CurrentMarketingPage page="career">
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
        <div className={"section"}>
          <div className={"section-padding career-padding"}>
            <div className={"padding-global"}>
              <div className={"container-large"}>
                <div className={"career-wrapper"}>
                  <div className={"contact-tittle-wrapper"}>
                    <div className={"contact-tittle-block"}>
                      <h1 data-w-id={"e02f224c-608e-fe35-b869-eb70be3e991b"} className={"h1-heading"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                        {"Help build the future of shopping with crypto."}
                      </h1>
                    </div>
                    <div className={"contact-summury-block"}>
                      <p data-w-id={"e02f224c-608e-fe35-b869-eb70be3e991e"} className={"p-md"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                        {"Join a small, driven team making crypto useful for everyday purchases, and help shape how people pay, top up and shop."}
                      </p>
                    </div>
                  </div>
                  <div className={"career-image-block"}>
                    <div className={"career-image-item"} style={{"opacity": "0"} as any}>
                      <img src={"/marketing-media/media-1a776f0833e6f651.avif"} data-pxs={"0"} loading={"lazy"} alt={""} className={"c-image"} />
                    </div>
                    <div className={"career-image-item"} style={{"opacity": "0"} as any}>
                      <img src={"/marketing-media/media-4dc74740d2182847.avif"} data-pxs={"1"} loading={"lazy"} alt={""} className={"c-image"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"section"}>
          <div className={"section-padding roles-padding"}>
            <div className={"padding-global"}>
              <div className={"container-small"}>
                <div className={"roles-wrapper"}>
                  <div className={"roles-tittle-block"}>
                    <h3 data-w-id={"1116f241-a1f8-64bf-2a4f-e5f7db0d7269"} className={"h3-heading"} style={{"transform": "translate3d(0px, 25px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)", "transformStyle": "preserve-3d", "opacity": "0", "filter": "blur(5px)"} as any}>
                      {"Open Roles"}
                    </h3>
                  </div>
                  <div className={"roles-card-wrapper"}>
                    <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                      <div className={"r-text-block break"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Senior Product Designer"}
                        </div>
                      </div>
                      <div className={"r-text-block"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Remote Full Time"}
                        </div>
                      </div>
                    </a>
                    <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                      <div className={"r-text-block break"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Full Stack Engineer"}
                        </div>
                      </div>
                      <div className={"r-text-block"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Remote Full Time"}
                        </div>
                      </div>
                    </a>
                    <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                      <div className={"r-text-block break"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Smart Contract Engineer"}
                        </div>
                      </div>
                      <div className={"r-text-block"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Remote Full Time"}
                        </div>
                      </div>
                    </a>
                    <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                      <div className={"r-text-block break"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Marketplace Operations Manager"}
                        </div>
                      </div>
                      <div className={"r-text-block"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Remote Full Time"}
                        </div>
                      </div>
                    </a>
                    <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                      <div className={"r-text-block break"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Customer Support Lead"}
                        </div>
                      </div>
                      <div className={"r-text-block"}>
                        <div className={"p-regular _w-medium text-darkgrey"}>
                          {"Remote Full Time"}
                        </div>
                      </div>
                    </a>
                    <div style={{"display": "none"} as any} className={"job-hide"}>
                      <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                        <div className={"r-text-block break"}>
                          <div className={"p-regular _w-medium text-darkgrey"}>
                            {"Growth Marketer"}
                          </div>
                        </div>
                        <div className={"r-text-block"}>
                          <div className={"p-regular _w-medium text-darkgrey"}>
                            {"Remote Full Time"}
                          </div>
                        </div>
                      </a>
                      <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                        <div className={"r-text-block break"}>
                          <div className={"p-regular _w-medium text-darkgrey"}>
                            {"Security Engineer"}
                          </div>
                        </div>
                        <div className={"r-text-block"}>
                          <div className={"p-regular _w-medium text-darkgrey"}>
                            {"Remote Full Time"}
                          </div>
                        </div>
                      </a>
                      <a href={"#"} className={"roles-card-block w-inline-block"} style={{"opacity": "0"} as any}>
                        <div className={"r-text-block break"}>
                          <div className={"p-regular _w-medium text-darkgrey"}>
                            {"Content Writer"}
                          </div>
                        </div>
                        <div className={"r-text-block"}>
                          <div className={"p-regular _w-medium text-darkgrey"}>
                            {"Remote Full Time"}
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div data-w-id={"44388f25-9e66-bd77-16f7-f8d239e8f876"} className={"roles-button-block"}>
                    <a href={"#"} className={"btn-primary w-button"}>
                      {"See More Roles"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section id={"start"} className={"section-cta"} style={{"backgroundColor": "#0a211f"} as any}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"cta-content-wrapper"}>
                <div className={"cta-content-upper"}>
                  <h2 className={"h2-heading text-white"}>
                    {"Your wallet is your marketplace"}
                  </h2>
                  <a href={"#"} className={"btn-secondary w-button"}>
                    {"Contact Us"}
                  </a>
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
