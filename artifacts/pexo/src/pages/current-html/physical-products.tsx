import { CurrentMarketingPage } from "@/components/marketing/current-marketing-page";

export function PhysicalProductsExport() {
  return (
    <CurrentMarketingPage page="physical-products">
    <div className={"page-wrapper"}>
      <header className={"px-nav"} id={"pxnav"}>
        <div className={"px-nav-in"}>
          <a className={"px-logo"} href={"#"} data-px-link={"home"}>
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
                <a href={"#"} data-px-link={"giftcards"}>
                  <b>
                    {"Gift Cards"}
                  </b>
                  <small>
                    {"Shopping, gaming, streaming"}
                  </small>
                </a>
                <a href={"#"} data-px-link={"home#top-up"}>
                  <b>
                    {"Mobile Top Up"}
                  </b>
                  <small>
                    {"Airtime and data, anywhere"}
                  </small>
                </a>
                <a href={"#"} data-px-link={"shop"}>
                  <b>
                    {"Physical Products"}
                  </b>
                  <small>
                    {"Electronics, fashion, home"}
                  </small>
                </a>
              </div>
            </div>
            <a className={"px-l"} href={"#"} data-px-link={"giftcards"}>
              {"Gift Cards"}
            </a>
            <a className={"px-l"} href={"#"} data-px-link={"shop"}>
              {"Physical Products"}
            </a>
            <a className={"px-l"} href={"#"} data-px-link={"blog"}>
              {"Blog"}
            </a>
            <div className={"px-dd"}>
              <button className={"px-dd-t"} type={"button"} aria-expanded={"false"}>
                {"Company "}
                <i></i>
              </button>
              <div className={"px-dd-l"}>
                <a href={"#"} data-px-link={"about"}>
                  <b>
                    {"About Pexly"}
                  </b>
                  <small>
                    {"Our mission and story"}
                  </small>
                </a>
                <a href={"#"} data-px-link={"team"}>
                  <b>
                    {"Our Team"}
                  </b>
                  <small>
                    {"The people behind Pexly"}
                  </small>
                </a>
                <a href={"#"} data-px-link={"careers"}>
                  <b>
                    {"Careers"}
                  </b>
                  <small>
                    {"Open roles"}
                  </small>
                </a>
              </div>
            </div>
            <div className={"px-mob-btns"}>
              <a className={"px-btn ghost"} href={"#"}>
                {"Connect Wallet"}
              </a>
              <a className={"px-btn solid"} href={"#"} data-px-link={"giftcards"}>
                {"Start Shopping"}
              </a>
            </div>
          </nav>
          <div className={"px-right"}>
            <a className={"px-btn ghost"} href={"#"}>
              {"Connect Wallet"}
            </a>
            <a className={"px-btn solid"} href={"#"} data-px-link={"giftcards"}>
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
                    {"Real goods. Paid in crypto."}
                  </h1>
                  <div className={"v3-hero-text-block"}>
                    <p data-w-id={"9be5ebdd-eacb-1105-68a6-cae003ce4cfc"} className={"p-large cyan"}>
                      {"Order electronics, fashion, home and gaming gear from verified sellers. Pay with crypto straight from your own wallet."}
                    </p>
                  </div>
                  <div data-w-id={"0f339b4c-3cc1-73c1-73d5-37ae38bef528"} className={"v3-hero-btn-wrap"}>
                    <a href={"#categories"} className={"btn-primary w-button"}>
                      {"Browse Products"}
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
                      </div>
                      <div className={"big"}>
                        {"Order #4821"}
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
                          {"Wireless Earbuds"}
                        </b>
                        <small>
                          {"Paid with USDT"}
                        </small>
                      </div>
                      <div className={"e"}>
                        <b>
                          {"$39.00"}
                        </b>
                        <small>
                          {"Shipped"}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"categories"} className={"sp-sec"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-head"}>
                <h2 className={"sp-h"}>
                  {"Shop by category"}
                </h2>
                <a className={"sp-all"} href={"#"}>
                  {"View all"}
                </a>
              </div>
              <div className={"sp-row sp-cats"}>
                <a className={"sp-cat"} href={"#"}>
                  <div className={"t"} style={{"background": "linear-gradient(135deg,#3b1055,#c026d3)"} as any}>
                    <svg viewBox={"0 0 24 24"} width={"64"} height={"64"} fill={"none"} stroke={"#fff"} strokeWidth={"1.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <rect x={"5"} y={"6"} width={"14"} height={"10"} rx={"1.5"}></rect>
                      <path d={"M3 19h18"}></path>
                    </svg>
                  </div>
                  <div className={"l"}>
                    {"Electronics"}
                  </div>
                </a>
                <a className={"sp-cat"} href={"#"}>
                  <div className={"t"} style={{"background": "linear-gradient(135deg,#9f1239,#fb7185)"} as any}>
                    <svg viewBox={"0 0 24 24"} width={"64"} height={"64"} fill={"none"} stroke={"#fff"} strokeWidth={"1.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <path d={"M8 4l-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 01-8 0z"}></path>
                    </svg>
                  </div>
                  <div className={"l"}>
                    {"Fashion"}
                  </div>
                </a>
                <a className={"sp-cat"} href={"#"}>
                  <div className={"t"} style={{"background": "linear-gradient(135deg,#0a0a0a,#3f3f46)"} as any}>
                    <svg viewBox={"0 0 24 24"} width={"64"} height={"64"} fill={"none"} stroke={"#fff"} strokeWidth={"1.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <path d={"M3 11l9-8 9 8M5 10v10h14V10"}></path>
                    </svg>
                  </div>
                  <div className={"l"}>
                    {"Home & Living"}
                  </div>
                </a>
                <a className={"sp-cat"} href={"#"}>
                  <div className={"t"} style={{"background": "linear-gradient(135deg,#2e1065,#a78bfa)"} as any}>
                    <svg viewBox={"0 0 24 24"} width={"64"} height={"64"} fill={"none"} stroke={"#fff"} strokeWidth={"1.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <rect x={"2"} y={"8"} width={"20"} height={"10"} rx={"5"}></rect>
                      <path d={"M7 11v4M5 13h4"}></path>
                      <circle cx={"16"} cy={"12"} r={"1"}></circle>
                      <circle cx={"18.5"} cy={"14.5"} r={"1"}></circle>
                    </svg>
                  </div>
                  <div className={"l"}>
                    {"Gaming & Gear"}
                  </div>
                </a>
                <a className={"sp-cat"} href={"#"}>
                  <div className={"t"} style={{"background": "linear-gradient(135deg,#1e3a8a,#38bdf8)"} as any}>
                    <svg viewBox={"0 0 24 24"} width={"64"} height={"64"} fill={"none"} stroke={"#fff"} strokeWidth={"1.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <rect x={"7"} y={"6"} width={"10"} height={"12"} rx={"3"}></rect>
                      <path d={"M9 6l1-3h4l1 3M9 18l1 3h4l1-3"}></path>
                    </svg>
                  </div>
                  <div className={"l"}>
                    {"Accessories"}
                  </div>
                </a>
                <a className={"sp-cat"} href={"#"}>
                  <div className={"t"} style={{"background": "linear-gradient(135deg,#9a3412,#fdba74)"} as any}>
                    <svg viewBox={"0 0 24 24"} width={"64"} height={"64"} fill={"none"} stroke={"#fff"} strokeWidth={"1.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <path d={"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"}></path>
                    </svg>
                  </div>
                  <div className={"l"}>
                    {"Beauty"}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id={"hot"} className={"sp-sec"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-head"}>
                <div>
                  <h2 className={"sp-h"}>
                    {"Hot right now"}
                  </h2>
                  <p className={"sp-sub"}>
                    {"A fresh mix of products, picked at random each visit."}
                  </p>
                </div>
                <a className={"sp-all"} href={"#"} id={"hotshuffle"}>
                  {"Shuffle"}
                </a>
              </div>
              <div className={"sp-row"} id={"hotrow"}>
                <article className={"sp-card"} data-tags={"popular new fast under50"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#e8590c"}>
                        <path d={"M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0017 14.5c0-2-1-3.5-2-4.5.2 1.5-.3 2.5-1.2 3 .5-3-.3-6.5-1.8-11z"}></path>
                      </svg>
                      {"HOT"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#e8e1ff"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M4 15v-3a8 8 0 0116 0v3"}></path>
                        <rect x={"3"} y={"14"} width={"4"} height={"6"} rx={"1.5"}></rect>
                        <rect x={"17"} y={"14"} width={"4"} height={"6"} rx={"1.5"}></rect>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Wireless Earbuds"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$39.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"popular fast"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#e8590c"}>
                        <path d={"M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0017 14.5c0-2-1-3.5-2-4.5.2 1.5-.3 2.5-1.2 3 .5-3-.3-6.5-1.8-11z"}></path>
                      </svg>
                      {"HOT"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#e3f9dc"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"6"} width={"10"} height={"12"} rx={"3"}></rect>
                        <path d={"M9 6l1-3h4l1 3M9 18l1 3h4l1-3"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Smart Watch"}
                  </h3>
                  <p className={"sp-price"}>
                    <s>
                      {"$99"}
                    </s>
                    <b>
                      {"$89.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"popular under100 fast"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#e8590c"}>
                        <path d={"M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0017 14.5c0-2-1-3.5-2-4.5.2 1.5-.3 2.5-1.2 3 .5-3-.3-6.5-1.8-11z"}></path>
                      </svg>
                      {"HOT"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#ffe9d6"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M3 16c0-2 2-3 4-3l3-4 3 3 5 1c2 0 3 1 3 3v2H3z"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Everyday Sneakers"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$64.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"under50 new"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#e8590c"}>
                        <path d={"M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0017 14.5c0-2-1-3.5-2-4.5.2 1.5-.3 2.5-1.2 3 .5-3-.3-6.5-1.8-11z"}></path>
                      </svg>
                      {"HOT"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#fff3c9"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M8 3h8l3 9H5l3-9zM12 12v7M8 21h8"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Desk Lamp"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$27.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"under50 popular"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#e8590c"}>
                        <path d={"M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14.5A5 5 0 0017 14.5c0-2-1-3.5-2-4.5.2 1.5-.3 2.5-1.2 3 .5-3-.3-6.5-1.8-11z"}></path>
                      </svg>
                      {"HOT"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#dbeafe"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M6 8h12l1 12H5L6 8zM9 8a3 3 0 016 0"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"City Backpack"}
                  </h3>
                  <p className={"sp-price"}>
                    <s>
                      {"$55"}
                    </s>
                    <b>
                      {"$45.00"}
                    </b>
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
        <section id={"top-picks"} className={"sp-sec"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-head"}>
                <div>
                  <h2 className={"sp-h"}>
                    {"Our top picks"}
                  </h2>
                  <p className={"sp-sub"}>
                    {"Real products from verified sellers, paid in crypto."}
                  </p>
                </div>
                <a className={"sp-all"} href={"#"}>
                  {"View all"}
                </a>
              </div>
              <div className={"sp-chips"} data-row={"sprow"}>
                <button className={"on"} data-f={"all"}>
                  {"All"}
                </button>
                <button data-f={"popular"}>
                  {"Popular"}
                </button>
                <button data-f={"fast"}>
                  {"Fast shipping"}
                </button>
                <button data-f={"under50"}>
                  {"Under $50"}
                </button>
                <button data-f={"new"}>
                  {"New"}
                </button>
              </div>
              <div className={"sp-row"} id={"sprow"}>
                <article className={"sp-card"} data-tags={"popular new fast under50"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"NEW"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#e8e1ff"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M4 15v-3a8 8 0 0116 0v3"}></path>
                        <rect x={"3"} y={"14"} width={"4"} height={"6"} rx={"1.5"}></rect>
                        <rect x={"17"} y={"14"} width={"4"} height={"6"} rx={"1.5"}></rect>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Wireless Earbuds"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$39.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"popular fast"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"SAVE 10%"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#e3f9dc"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"6"} width={"10"} height={"12"} rx={"3"}></rect>
                        <path d={"M9 6l1-3h4l1 3M9 18l1 3h4l1-3"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Smart Watch"}
                  </h3>
                  <p className={"sp-price"}>
                    <s>
                      {"$99"}
                    </s>
                    <b>
                      {"$89.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"popular under100 fast"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"POPULAR"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#ffe9d6"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M3 16c0-2 2-3 4-3l3-4 3 3 5 1c2 0 3 1 3 3v2H3z"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Everyday Sneakers"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$64.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"under50 new"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"UNDER $50"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#fff3c9"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M8 3h8l3 9H5l3-9zM12 12v7M8 21h8"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Desk Lamp"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$27.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"under50 popular"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"SAVE 18%"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#dbeafe"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M6 8h12l1 12H5L6 8zM9 8a3 3 0 016 0"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"City Backpack"}
                  </h3>
                  <p className={"sp-price"}>
                    <s>
                      {"$55"}
                    </s>
                    <b>
                      {"$45.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"new fast"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"NEW"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#fce7f3"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"2"} y={"8"} width={"20"} height={"10"} rx={"5"}></rect>
                        <path d={"M7 11v4M5 13h4"}></path>
                        <circle cx={"16"} cy={"12"} r={"1"}></circle>
                        <circle cx={"18.5"} cy={"14.5"} r={"1"}></circle>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Wireless Controller"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$59.00"}
                    </b>
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
        <section id={"giftcards"} className={"sp-sec"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-head"}>
                <div>
                  <h2 className={"sp-h"}>
                    {"Gift Cards & Mobile Top Up"}
                  </h2>
                  <p className={"sp-sub"}>
                    {"Gift cards, airtime and data, paid in crypto."}
                  </p>
                </div>
                <a className={"sp-all"} id={"gtall"} href={"#"} data-px-link={"giftcards"}>
                  {"View all"}
                </a>
              </div>
              <div className={"sp-row"} id={"gtrow"}>
                <article className={"sp-card"} data-tags={"gift"} data-kind={"gift"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"POPULAR"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#fff0c7"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"3"} y={"8"} width={"18"} height={"13"} rx={"2"}></rect>
                        <path d={"M12 8v13M3 13h18M12 8c-2-4-6-3-5 0 .6 1.5 3 1.2 5 0zm0 0c2-4 6-3 5 0-.6 1.5-3 1.2-5 0z"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"giftcards"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Amazon Gift Card"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $10"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"topup"} data-kind={"topup"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"POPULAR"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#e3f9dc"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"2"} width={"10"} height={"20"} rx={"2.5"}></rect>
                        <path d={"M11 18h2"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"home#top-up"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"MTN Airtime"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $2"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"gift"} data-kind={"gift"}>
                  <div className={"sp-img"}>
                    <div className={"sp-pr"} style={{"background": "#e8e1ff"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"3"} y={"8"} width={"18"} height={"13"} rx={"2"}></rect>
                        <path d={"M12 8v13M3 13h18M12 8c-2-4-6-3-5 0 .6 1.5 3 1.2 5 0zm0 0c2-4 6-3 5 0-.6 1.5-3 1.2-5 0z"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"giftcards"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Steam Wallet Code"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $10"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"topup"} data-kind={"topup"}>
                  <div className={"sp-img"}>
                    <div className={"sp-pr"} style={{"background": "#ffe5d9"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"2"} width={"10"} height={"20"} rx={"2.5"}></rect>
                        <path d={"M11 18h2"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"home#top-up"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Airtel Data Bundle"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $3"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"gift"} data-kind={"gift"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"NEW"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#ffe5d9"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"3"} y={"8"} width={"18"} height={"13"} rx={"2"}></rect>
                        <path d={"M12 8v13M3 13h18M12 8c-2-4-6-3-5 0 .6 1.5 3 1.2 5 0zm0 0c2-4 6-3 5 0-.6 1.5-3 1.2-5 0z"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"giftcards"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Netflix Gift Card"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $15"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"topup"} data-kind={"topup"}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"NEW"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#dff3ff"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"2"} width={"10"} height={"20"} rx={"2.5"}></rect>
                        <path d={"M11 18h2"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"home#top-up"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Vodafone Top Up"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $5"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"gift"} data-kind={"gift"}>
                  <div className={"sp-img"}>
                    <div className={"sp-pr"} style={{"background": "#e3f9dc"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"3"} y={"8"} width={"18"} height={"13"} rx={"2"}></rect>
                        <path d={"M12 8v13M3 13h18M12 8c-2-4-6-3-5 0 .6 1.5 3 1.2 5 0zm0 0c2-4 6-3 5 0-.6 1.5-3 1.2-5 0z"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"giftcards"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Spotify Gift Card"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $10"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"topup"} data-kind={"topup"}>
                  <div className={"sp-img"}>
                    <div className={"sp-pr"} style={{"background": "#e8e1ff"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"2"} width={"10"} height={"20"} rx={"2.5"}></rect>
                        <path d={"M11 18h2"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"home#top-up"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Orange Data Pack"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $5"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"gift"} data-kind={"gift"}>
                  <div className={"sp-img"}>
                    <div className={"sp-pr"} style={{"background": "#dff3ff"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"3"} y={"8"} width={"18"} height={"13"} rx={"2"}></rect>
                        <path d={"M12 8v13M3 13h18M12 8c-2-4-6-3-5 0 .6 1.5 3 1.2 5 0zm0 0c2-4 6-3 5 0-.6 1.5-3 1.2-5 0z"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"giftcards"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Google Play Gift Card"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $10"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={"topup"} data-kind={"topup"}>
                  <div className={"sp-img"}>
                    <div className={"sp-pr"} style={{"background": "#fff0c7"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"2"} width={"10"} height={"20"} rx={"2.5"}></rect>
                        <path d={"M11 18h2"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} data-px-link={"home#top-up"} aria-label={"Open"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"T-Mobile Top Up"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"From $10"}
                    </b>
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
        <section className={"sp-sec tight"} id={"why"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-guide"}>
                <img src={"/marketing-media/media-ee8829bd9b5cc5ab.avif"} alt={""} />
                <div className={"ov"}>
                  <span>
                    {"Why shop"}
                  </span>
                  <b>
                    {"physical products on Pexly"}
                  </b>
                  <p style={{"margin": "0 0 18px", "maxWidth": "30em", "fontSize": "clamp(16px,1.5vw,19px)", "lineHeight": "1.5", "color": "rgba(255,255,255,.92)"} as any}>
                    {"Real goods from verified sellers, paid straight from your own wallet."}
                  </p>
                  <a className={"sp-btn light"} href={"#sellers"}>
                    {"See how it works"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={"sp-sec"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-head"}>
                <h2 className={"sp-h"}>
                  {"Everyday finds under $25"}
                </h2>
                <a className={"sp-all"} href={"#"}>
                  {"View all"}
                </a>
              </div>
              <div className={"sp-row"}>
                <article className={"sp-card"} data-tags={""}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"FAST SHIPPING"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#e3f9dc"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <rect x={"7"} y={"2"} width={"10"} height={"20"} rx={"2.5"}></rect>
                        <path d={"M11 18h2"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Phone Stand"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$12.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={""}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"FAST SHIPPING"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#e8e1ff"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Cable Organizer"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$9.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={""}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"SAVE 25%"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#ffe9d6"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M6 8h12l1 12H5L6 8zM9 8a3 3 0 016 0"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Canvas Tote"}
                  </h3>
                  <p className={"sp-price"}>
                    <s>
                      {"$24"}
                    </s>
                    <b>
                      {"$18.00"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card"} data-tags={""}>
                  <div className={"sp-img"}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"NEW"}
                    </span>
                    <div className={"sp-pr"} style={{"background": "#fff3c9"} as any}>
                      <svg viewBox={"0 0 24 24"} width={"92"} height={"92"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M8 3h8l3 9H5l3-9zM12 12v7M8 21h8"}></path>
                      </svg>
                    </div>
                    <a className={"sp-plus"} href={"#"} aria-label={"Add"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Mini Desk Lamp"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$21.00"}
                    </b>
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
        <section className={"sp-sec"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-head"}>
                <h2 className={"sp-h"}>
                  {"Picked just for you"}
                </h2>
                <a className={"sp-all"} href={"#"}>
                  {"View all"}
                </a>
              </div>
              <div className={"sp-row"}>
                <article className={"sp-card big"}>
                  <div className={"sp-img"} style={{"background": "linear-gradient(135deg,#1e3a8a,#38bdf8)"} as any}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"BEST SELLER"}
                    </span>
                    <svg viewBox={"0 0 24 24"} width={"110"} height={"110"} fill={"none"} stroke={"#fff"} strokeWidth={"1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <path d={"M4 15v-3a8 8 0 0116 0v3"}></path>
                      <rect x={"3"} y={"14"} width={"4"} height={"6"} rx={"1.5"}></rect>
                      <rect x={"17"} y={"14"} width={"4"} height={"6"} rx={"1.5"}></rect>
                    </svg>
                    <a className={"sp-plus"} href={"#"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Earbuds + Case Bundle"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$49"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card big"}>
                  <div className={"sp-img"} style={{"background": "linear-gradient(135deg,#0a0a0a,#3f3f46)"} as any}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"POPULAR"}
                    </span>
                    <svg viewBox={"0 0 24 24"} width={"110"} height={"110"} fill={"none"} stroke={"#fff"} strokeWidth={"1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <rect x={"7"} y={"6"} width={"10"} height={"12"} rx={"3"}></rect>
                      <path d={"M9 6l1-3h4l1 3M9 18l1 3h4l1-3"}></path>
                    </svg>
                    <a className={"sp-plus"} href={"#"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Smart Watch Pro"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$129"}
                    </b>
                  </p>
                </article>
                <article className={"sp-card big"}>
                  <div className={"sp-img"} style={{"background": "linear-gradient(135deg,#2e1065,#a78bfa)"} as any}>
                    <span className={"sp-badge"}>
                      <svg viewBox={"0 0 24 24"} width={"16"} height={"16"} fill={"#14924f"}>
                        <path d={"M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-.9z"}></path>
                      </svg>
                      {"NEW"}
                    </span>
                    <svg viewBox={"0 0 24 24"} width={"110"} height={"110"} fill={"none"} stroke={"#fff"} strokeWidth={"1"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <rect x={"2"} y={"8"} width={"20"} height={"10"} rx={"5"}></rect>
                      <path d={"M7 11v4M5 13h4"}></path>
                      <circle cx={"16"} cy={"12"} r={"1"}></circle>
                      <circle cx={"18.5"} cy={"14.5"} r={"1"}></circle>
                    </svg>
                    <a className={"sp-plus"} href={"#"}>
                      {"+"}
                    </a>
                  </div>
                  <h3>
                    {"Gaming Starter Kit"}
                  </h3>
                  <p className={"sp-price"}>
                    <b>
                      {"$99"}
                    </b>
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
        <section className={"sp-sec"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <h2 className={"sp-h center"}>
                {"Explore the rest of the marketplace"}
              </h2>
              <div className={"sp-looks"}>
                <figure className={"sp-look"}>
                  <img src={"/marketing-media/media-59c99a35d948f6c1.avif"} alt={""} />
                  <a className={"sp-pill"} href={"#"} data-px-link={"giftcards"}>
                    <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.8"}>
                      <path d={"M3 12l9-9h8v8l-9 9z"}></path>
                      <circle cx={"16"} cy={"8"} r={"1.2"}></circle>
                    </svg>
                    {"Shop Gift Cards"}
                  </a>
                </figure>
                <figure className={"sp-look"}>
                  <img src={"/marketing-media/media-f9de0167e3e0ed2c.avif"} alt={""} />
                  <a className={"sp-pill"} href={"#"} data-px-link={"home#top-up"}>
                    <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.8"}>
                      <path d={"M3 12l9-9h8v8l-9 9z"}></path>
                      <circle cx={"16"} cy={"8"} r={"1.2"}></circle>
                    </svg>
                    {"Shop Top Ups"}
                  </a>
                </figure>
                <figure className={"sp-look"}>
                  <img src={"/marketing-media/media-d9e7636fc944d27d.avif"} alt={""} />
                  <a className={"sp-pill"} href={"#sellers"}>
                    <svg viewBox={"0 0 24 24"} width={"20"} height={"20"} fill={"none"} stroke={"#091e1c"} strokeWidth={"1.8"}>
                      <path d={"M3 12l9-9h8v8l-9 9z"}></path>
                      <circle cx={"16"} cy={"8"} r={"1.2"}></circle>
                    </svg>
                    {"Start Selling"}
                  </a>
                </figure>
              </div>
            </div>
          </div>
        </section>
        <section className={"sp-reviews"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-stars"}>
                {"★★★★★"}
              </div>
              <h2 className={"sp-h center"}>
                {"What people are saying"}
              </h2>
              <div className={"sp-row"}>
                <article className={"sp-rev"}>
                  <div className={"st"}>
                    {"★★★★★"}
                  </div>
                  <p>
                    {"Ordered earbuds from a verified seller. They arrived in four days and tracking was clear the whole way."}
                  </p>
                  <div className={"by"}>
                    <b>
                      {"James T."}
                    </b>
                    <span>
                      <i>
                        {"✓"}
                      </i>
                      {"Verified buyer"}
                    </span>
                  </div>
                </article>
                <article className={"sp-rev"}>
                  <div className={"st"}>
                    {"★★★★★"}
                  </div>
                  <p>
                    {"Paid with USDT, got tracking the same day. Easiest online order I have made with crypto."}
                  </p>
                  <div className={"by"}>
                    <b>
                      {"Marie K."}
                    </b>
                    <span>
                      <i>
                        {"✓"}
                      </i>
                      {"Verified buyer"}
                    </span>
                  </div>
                </article>
                <article className={"sp-rev"}>
                  <div className={"st"}>
                    {"★★★★★"}
                  </div>
                  <p>
                    {"The seller ratings helped me pick. Sneakers fit perfectly and the seller was easy to reach."}
                  </p>
                  <div className={"by"}>
                    <b>
                      {"Adaeze O."}
                    </b>
                    <span>
                      <i>
                        {"✓"}
                      </i>
                      {"Verified buyer"}
                    </span>
                  </div>
                </article>
                <article className={"sp-rev"}>
                  <div className={"st"}>
                    {"★★★★★"}
                  </div>
                  <p>
                    {"Finally I can spend my crypto on real things without cashing out first."}
                  </p>
                  <div className={"by"}>
                    <b>
                      {"Sonia D."}
                    </b>
                    <span>
                      <i>
                        {"✓"}
                      </i>
                      {"Verified buyer"}
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
        <section className={"sp-sec tight"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <p className={"sp-eyebrow"}>
                {"Pay with"}
              </p>
              <div className={"sp-marq"}>
                <div className={"in"}>
                  <span>
                    {"Bitcoin"}
                  </span>
                  <span>
                    {"Ethereum"}
                  </span>
                  <span>
                    {"USDT"}
                  </span>
                  <span>
                    {"USDC"}
                  </span>
                  <span>
                    {"BNB"}
                  </span>
                  <span>
                    {"Solana"}
                  </span>
                  <span>
                    {"Litecoin"}
                  </span>
                  <span>
                    {"Tron"}
                  </span>
                  <span>
                    {"Bitcoin"}
                  </span>
                  <span>
                    {"Ethereum"}
                  </span>
                  <span>
                    {"USDT"}
                  </span>
                  <span>
                    {"USDC"}
                  </span>
                  <span>
                    {"BNB"}
                  </span>
                  <span>
                    {"Solana"}
                  </span>
                  <span>
                    {"Litecoin"}
                  </span>
                  <span>
                    {"Tron"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"sellers"} className={"sp-feature"}>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"sp-feature-in"}>
                <img src={"/marketing-media/media-ebc41a5685db3420.avif"} alt={""} />
                <div className={"txt"}>
                  <h2 className={"sp-h"}>
                    {"Verified sellers"}
                  </h2>
                  <p>
                    {"Every seller is rated by real buyers. Shop with confidence, or open your own store and sell to a global crypto audience."}
                  </p>
                  <a className={"sp-btn"} href={"#"}>
                    {"Open your store"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id={"start"} className={"sp-signup"}>
          <svg className={"wave"} viewBox={"0 0 1440 120"} preserveAspectRatio={"none"}>
            <path d={"M0 120V60C120 20 240 0 380 30s260 70 420 40 260-60 400-30 180 50 240 30v80z"} fill={"#091e1c"}></path>
          </svg>
          <div className={"padding-global"}>
            <div className={"container-large"}>
              <div className={"in"}>
                <h2>
                  {"Get 5% back on your first order when you sign up for email!"}
                </h2>
                <div className={"f"}>
                  <input type={"email"} placeholder={"Email address"} aria-label={"Email"} />
                  <button aria-label={"Subscribe"}>
                    {"→"}
                  </button>
                </div>
                <small>
                  {"By submitting this form you agree to receive marketing emails from Pexly. Unsubscribe at any time."}
                </small>
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
                    <a href={"#"} className={"footer-social-link-block w-inline-block"}>
                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} viewBox={"0 0 14 12"} fill={"none"} className={"footer-social-link-icon"}>
                        <path d={"M10.4416 0H12.3925L8.1304 4.87129L13.1444 11.5H9.21849L6.1436 7.4797L2.62515 11.5H0.673105L5.23183 6.2896L0.421875 0H4.44747L7.22689 3.6747L10.4416 0ZM9.7569 10.3323H10.8379L3.86009 1.10636H2.70006L9.7569 10.3323Z"} fill={"currentColor"}></path>
                      </svg>
                    </a>
                    <a href={"#"} className={"footer-social-link-block w-inline-block"}>
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
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Gift Cards"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Mobile Top Up"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Physical Products"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Open a Store"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Order History"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
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
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Connect Wallet"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with BTC"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with ETH"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with USDT"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Pay with USDC"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
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
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Help Center"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Dispute Resolution"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Contact Us"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"FAQ"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Report a Seller"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
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
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"About Pexly"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Blog"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Careers"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Press"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
                        <div className={"p-regular light-gray"}>
                          {"Terms"}
                        </div>
                      </a>
                      <a href={"#"} className={"footer-link-item w-inline-block"}>
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
                    <a href={"#"} className={"footer-link-item w-inline-block"}>
                      <div className={"p-xs light-gray"}>
                        {"Terms & policies"}
                      </div>
                    </a>
                    <a href={"#"} className={"footer-link-item w-inline-block"}>
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
