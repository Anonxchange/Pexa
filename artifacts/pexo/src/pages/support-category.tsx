import { useHead } from "@unhead/react";
import { useRoute, Link } from "wouter";
import { ChevronRight, Home as HomeIcon, Clock, ArrowLeft } from '@/lib/icons';
import { FloatingChatButton } from "@/components/floating-chat-button";
import { supportCategories, supportArticles } from "@/lib/support-content";

const SupportCategoryPage = () => {
  const [, params] = useRoute("/support/:category");
  const categorySlug = params?.category ?? "";
  const category = supportCategories[categorySlug];

  useHead({
    title: category ? `${category.title} | Pexly Help` : "Category not found | Pexly Help",
    meta: [{ name: "description", content: category?.description ?? "" }],
  });

  const articles = (category?.articleSlugs ?? [])
    .map((s) => supportArticles[s])
    .filter(Boolean);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-2xl font-bold text-foreground">Category not found</p>
        <Link href="/support" className="text-primary font-medium hover:underline underline-offset-2 text-sm">
          ← Back to Help Center
        </Link>
        <FloatingChatButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <header className="bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div
          className="absolute -right-24 top-1/2 w-64 h-64 pointer-events-none"
          style={{ background: "#4F46E5", borderRadius: "50%", transform: "translate(40%, -40%)", opacity: 0.5 }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center justify-between mb-4">
            <Link href="/" className="text-black font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
              Pexly
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 text-black/80 hover:text-black hover:bg-black/5 rounded-lg transition-colors text-sm font-medium">
                <HomeIcon className="w-3.5 h-3.5" />
                Home
              </Link>
              <Link href="/support" className="px-3 py-1.5 text-black/80 hover:text-black hover:bg-black/5 rounded-lg transition-colors text-sm font-medium">
                Help Center
              </Link>
            </div>
          </nav>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-black/70 text-xs mb-4">
            <Link href="/support" className="hover:text-black transition-colors">Help Center</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black font-medium">{category.title}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-1">{category.title}</h1>
          <p className="text-black/70 text-sm max-w-xl">{category.description}</p>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <Link
          href="/support"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All topics
        </Link>

        <p className="text-sm text-muted-foreground mb-4">
          {articles.length} article{articles.length !== 1 ? "s" : ""} in this section
        </p>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/support/article/${article.slug}`}
              className={`flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors group ${
                i < articles.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {article.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{article.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 p-5 bg-card border border-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Can't find your answer?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Submit a request and we'll reply within 24–48 hours.</p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            Contact support
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 px-6 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© Pexly Technologies, Inc.</span>
          <div className="flex items-center gap-4">
            <Link href="/support" className="hover:text-foreground transition-colors">Help Center</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

      <FloatingChatButton />
    </div>
  );
};

export default SupportCategoryPage;
