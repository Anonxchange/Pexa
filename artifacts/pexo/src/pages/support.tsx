import { useHead } from "@unhead/react";
import {
  Menu,
  Search,
  Star,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Sparkles,
  Globe,
  CheckCircle,
  Bell,
  Facebook,
  Twitter,
  Instagram,
  X,
  Mail,
  Home as HomeIcon,
  Phone,
} from '@/lib/icons';
import { LiveChatWidget } from "@/components/live-chat/LiveChatWidget";
import { useState } from "react";
import { Link } from "wouter";
import {
  faqItems,
} from "@/lib/support-content";

/* ─── App-icon SVGs ──────────────────────────────────────────────────────── */

const IconGetStarted = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#B4F22E" />
    <path d="M22 12c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S27.523 12 22 12Z" fill="white" opacity=".25" />
    <path d="M26.5 19.5 20 22l-2.5 6.5L30 18l-3.5 1.5Z" fill="white" />
    <circle cx="19.5" cy="24.5" r="1.5" fill="#0f1f00" />
  </svg>
);

const IconShop = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#F59E0B" />
    <path d="M15 16h14l-2 10H17L15 16Z" fill="white" opacity=".3" />
    <path d="M15 16h14l-2 10H17L15 16Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M19 16c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="19" cy="28" r="1.3" fill="white" />
    <circle cx="27" cy="28" r="1.3" fill="white" />
  </svg>
);

const IconAccount = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#3B82F6" />
    <circle cx="22" cy="18" r="4.5" fill="white" />
    <path d="M13 32c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="29" cy="20" r="4" fill="#3B82F6" />
    <circle cx="29" cy="20" r="3" stroke="white" strokeWidth="1.5" />
    <path d="M27.5 20h3M29 18.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconBuySell = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#22C55E" />
    <path d="M14 28l5-6 4 3 5-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="28" cy="17" r="2" fill="white" />
    <path d="M28 24v4M26 27l2 2 2-2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconApps = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#8B5CF6" />
    <rect x="13" y="13" width="7" height="7" rx="2" fill="white" />
    <rect x="24" y="13" width="7" height="7" rx="2" fill="white" opacity=".7" />
    <rect x="13" y="24" width="7" height="7" rx="2" fill="white" opacity=".7" />
    <rect x="24" y="24" width="7" height="7" rx="2" fill="white" opacity=".4" />
  </svg>
);

const IconSecurity = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#6366F1" />
    <path d="M22 12l9 3.5v7c0 4.5-3.8 8.7-9 10-5.2-1.3-9-5.5-9-10v-7L22 12Z" fill="white" opacity=".25" />
    <path d="M22 12l9 3.5v7c0 4.5-3.8 8.7-9 10-5.2-1.3-9-5.5-9-10v-7L22 12Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M18.5 22l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconStaking = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#06B6D4" />
    <ellipse cx="22" cy="16" rx="8" ry="3" fill="white" opacity=".9" />
    <path d="M14 16v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4" stroke="white" strokeWidth="1.8" />
    <path d="M14 20v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4" stroke="white" strokeWidth="1.8" />
    <path d="M14 24v4c0 1.657 3.582 3 8 3s8-1.343 8-3v-4" stroke="white" strokeWidth="1.8" />
  </svg>
);

const IconTrading = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="10" fill="#F97316" />
    <rect x="13" y="22" width="4" height="9" rx="1" fill="white" />
    <rect x="20" y="17" width="4" height="14" rx="1" fill="white" opacity=".8" />
    <rect x="27" y="13" width="4" height="18" rx="1" fill="white" opacity=".6" />
    <path d="M13 20l4-5 5 3 7-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Category config ────────────────────────────────────────────────────── */

interface Category {
  icon: React.ReactNode;
  title: string;
  description: string;
  slug: string;
}

interface CategoryCardProps extends Category {
  delay?: number;
}

const CategoryCard = ({ icon, title, description, slug, delay = 0 }: CategoryCardProps) => (
  <Link
    href={`/support/${slug}`}
    className="group flex items-center justify-between p-5 border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer animate-fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-start gap-4 flex-1 min-w-0">
      <div className="flex-shrink-0 mt-0.5 rounded-[10px] overflow-hidden shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground mb-0.5">{title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{description}</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-3" />
  </Link>
);

const categories: Category[] = [
  {
    icon: <IconGetStarted />,
    title: "Get started",
    description: "Create your Pexly wallet, customize your accounts, and learn about the key features.",
    slug: "get-started",
  },
  {
    icon: <IconShop />,
    title: "Shop",
    description: "Buy products with crypto or list your own items to sell in the Pexly marketplace.",
    slug: "shop",
  },
  {
    icon: <IconAccount />,
    title: "Account and settings",
    description: "Manage your wallets, account names, recovery phrases, privacy, and device settings.",
    slug: "account-settings",
  },
  {
    icon: <IconBuySell />,
    title: "Buy and sell tokens",
    description: "Use on-ramps and off-ramps to buy, sell, or withdraw tokens and fix common purchase issues.",
    slug: "buy-sell",
  },
  {
    icon: <IconApps />,
    title: "Apps",
    description: "Connect Pexly to apps, manage your connection settings, and troubleshoot connections.",
    slug: "apps",
  },
  {
    icon: <IconSecurity />,
    title: "Security",
    description: "Protect your wallet from scams, phishing, and hacks, plus tips on staying safe.",
    slug: "security",
  },
  {
    icon: <IconStaking />,
    title: "Staking",
    description: "Use liquid staking with PSOL or stake SOL natively to earn rewards.",
    slug: "staking",
  },
  {
    icon: <IconTrading />,
    title: "Trading",
    description: "Swap, bridge, or trade tokens and perps, plus understand gas, slippage, and trade execution.",
    slug: "trading",
  },
];

const promotedArticles = [
  { title: "Get started with Pexly", slug: "get-started-with-pexly" },
  { title: "Create a new Pexly wallet", slug: "create-wallet" },
  { title: "Receive tokens in Pexly", slug: "receive-tokens" },
  { title: "How to buy in the Pexly Shop", slug: "shop-guide" },
  { title: "Send tokens from Pexly", slug: "send-tokens" },
  { title: "Buy tokens in Pexly", slug: "buy-tokens" },
  { title: "Get help from Pexly", slug: "get-help" },
  { title: "What to do if I was scammed?", slug: "scam-recovery" },
];

/* ─── FAQ Accordion ─────────────────────────────────────────────────────── */

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold text-foreground mb-1">Frequently asked questions</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Quick answers to the questions we hear most often.
      </p>
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        {faqItems.map((item, i) => (
          <div key={i}>
            <button
              className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-semibold text-foreground leading-snug">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Newsletter ─────────────────────────────────────────────────────────── */

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="mt-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Stay in the loop</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Subscribe to Pexly updates</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get notified about new features, platform updates, security advisories, and maintenance windows — delivered straight to your inbox.
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-80">
          {submitted ? (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">You're subscribed!</p>
                <p className="text-xs text-muted-foreground">We'll keep you posted on what matters.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────────────── */

const HelpCenter = () => {
  useHead({
    title: "Help Center | Pexly",
    meta: [{ name: "description", content: "Browse support articles, watch guides, or contact our team for help with your Pexly wallet." }],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const q = searchQuery.trim().toLowerCase();

  const filteredCategories = q
    ? categories.filter((c) => c.title.toLowerCase().includes(q) || (c.description as string).toLowerCase().includes(q))
    : categories;

  const filteredArticles = q
    ? promotedArticles.filter((a) => a.title.toLowerCase().includes(q))
    : promotedArticles;

  const filteredFaq = q
    ? faqItems.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      )
    : faqItems;

  const hasResults =
    filteredCategories.length > 0 || filteredArticles.length > 0 || filteredFaq.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Security warning banner */}
      <div className="bg-[#FF7A45] py-3 px-6 text-white text-center flex items-center justify-center gap-3">
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">!</div>
        <p className="text-sm font-medium">
          Pexly Support will NEVER DM you or ask for your Secret Recovery Phrase!
        </p>
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[340px] overflow-hidden bg-gradient-to-br from-primary to-primary/80">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -left-32 top-1/2 w-[500px] h-[500px] animate-curve-float"
              style={{ background: "#4F46E5", borderRadius: "50%", transform: "translate(-60%, -30%)" }}
            />
            <div
              className="absolute -right-32 top-1/2 w-[500px] h-[500px] animate-curve-float-reverse"
              style={{ background: "#4F46E5", borderRadius: "50%", transform: "translate(60%, -20%)" }}
            />
            <Sparkles className="absolute top-20 left-[15%] w-4 h-4 text-white/60 animate-sparkle" />
            <Sparkles className="absolute top-32 right-[20%] w-3 h-3 text-white/60 animate-sparkle-delay-1" />
            <Sparkles className="absolute bottom-24 left-[25%] w-3 h-3 text-white/60 animate-sparkle-delay-2" />
            <Sparkles className="absolute bottom-32 right-[15%] w-4 h-4 text-white/60 animate-sparkle" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
            {/* Nav */}
            <nav className="flex items-center justify-between mb-12">
              <Link href="/" className="text-black font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity">
                Pexly
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 text-black/80 hover:text-black hover:bg-black/5 rounded-lg transition-colors text-sm font-medium">
                  <HomeIcon className="w-4 h-4" />
                  Home
                </Link>
                <Link href="/contact" className="flex items-center gap-2 px-4 py-2 text-black/80 hover:text-black hover:bg-black/5 rounded-lg transition-colors text-sm font-medium">
                  <Mail className="w-4 h-4" />
                  Contact
                </Link>
              </div>

              <div className="relative md:hidden">
                <button
                  className="text-black p-2 hover:bg-black/5 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Open menu"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors text-sm">
                      <HomeIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Home</span>
                    </Link>
                    <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors border-t border-border text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Contact</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">How can we help you?</h1>
              <div className="relative max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for answers…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-14 pr-10 rounded-full bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 text-base shadow-lg"
                />
                {searchQuery && (
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* No results */}
          {q && !hasResults && (
            <div className="text-center py-20">
              <p className="text-foreground text-lg mb-2 font-medium">No results for "{searchQuery}"</p>
              <p className="text-muted-foreground text-sm">
                Try different keywords or{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2 font-medium">
                  contact support
                </Link>
                .
              </p>
            </div>
          )}

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left — categories */}
            {filteredCategories.length > 0 && (
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-foreground mb-3 px-1">
                  {q ? "Matching categories" : "Browse by topic"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredCategories.map((category, index) => (
                    <div
                      key={category.title}
                      className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
                    >
                      <CategoryCard {...category} delay={index * 0.04} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right — promoted articles + trending + contact CTA */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
              {/* Popular / matching articles */}
              {filteredArticles.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-3 px-1">
                    {q ? "Matching articles" : "Popular articles"}
                  </h2>
                  <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    {filteredArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/support/article/${article.slug}`}
                        className="group flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Star className="w-4 h-4 text-[#FF7A45] fill-[#FF7A45] flex-shrink-0" />
                          <span className="text-foreground text-sm font-medium truncate">{article.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Still need help */}
              {!q && (
                <div className="bg-card rounded-xl border border-border shadow-sm p-5 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-[10px] overflow-hidden shadow-sm">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="10" fill="#B4F22E" />
                      <path d="M24 14c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S29.523 14 24 14Z" fill="white" opacity=".2" />
                      <path d="M24 20v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M17 29l4-2M31 29l-4-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M20 17l1 2M28 17l-1 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <p className="text-foreground font-semibold text-sm mb-1">Still need help?</p>
                  <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
                    Our support team is here to help you with anything.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Submit a request
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* FAQ — show always (filtered when searching) */}
          {filteredFaq.length > 0 && !q && <FaqAccordion />}

          {/* FAQ search results */}
          {q && filteredFaq.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-semibold text-foreground mb-3 px-1">Matching FAQ answers</h2>
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                {filteredFaq.map((item, i) => (
                  <div key={i} className="px-5 py-4">
                    <p className="text-sm font-semibold text-foreground mb-1.5">{item.question}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter — only show when not searching */}
          {!q && <NewsletterSignup />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 mt-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">© Pexly Technologies, Inc.</p>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                <Globe className="w-4 h-4" />
                <span>English (US)</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </button>

              <div className="flex items-center gap-2">
                <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <LiveChatWidget />
    </div>
  );
};

export default HelpCenter;
