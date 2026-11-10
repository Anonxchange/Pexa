import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PexlyIcon } from "@/components/pexly-icon";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { switchLanguage } from "@/lib/language-navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import i18n from "@/lib/i18n";

interface AppSidebarProps {
  onNavigate?: () => void;
}

const navItems = [
  { label: "Wallet", href: "/wallet", description: "Your assets and activity" },
  { label: "Gift Cards", href: "/gift-cards", description: "Browse cards for everyday favorites" },
  { label: "Shop", href: "/shop", description: "Discover physical products" },
  { label: "Mobile top up", href: "/wallet/mobile-topup", description: "Add credit to a mobile number" },
  { label: "Utility", href: "/utility", description: "Pay household and service bills" },
  { label: "About", href: "/about", description: "Learn about Pexly" },
  { label: "Support", href: "/support", description: "Help articles and answers" },
  { label: "Contact", href: "/contact", description: "Get in touch with our team" },
];

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <aside className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-5">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <PexlyIcon className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-bold tracking-tight">Pexly</span>
        </Link>
        <ThemeToggle />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Mobile navigation">
        {navItems.map(({ label, href, description }) => {
          const active = location === href || location.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`block rounded-xl px-3 py-3 transition-colors ${active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
              data-testid={`link-mobile-${href.replaceAll("/", "-").replace(/^-/, "")}`}
            >
              <span className="block text-sm font-semibold">{label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/70 px-4 py-4">
        <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="mobile-language">Language</label>
        <Select value={i18n.language?.split("-")[0] || "en"} onValueChange={switchLanguage}>
          <SelectTrigger id="mobile-language" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="hi">हिन्दी</SelectItem>
            <SelectItem value="id">Bahasa Indonesia</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
            <SelectItem value="ru">Русский</SelectItem>
            <SelectItem value="tr">Türkçe</SelectItem>
            <SelectItem value="vi">Tiếng Việt</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {!user && (
        <div className="grid grid-cols-2 gap-2 border-t border-border/70 p-4">
          <Button variant="outline" onClick={() => { window.location.href = "/signin"; }} data-testid="button-mobile-sign-in">Sign in</Button>
          <Button onClick={() => { window.location.href = "/signup"; }} data-testid="button-mobile-sign-up">Create account</Button>
        </div>
      )}
    </aside>
  );
}
