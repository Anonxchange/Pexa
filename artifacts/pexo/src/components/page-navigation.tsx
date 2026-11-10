import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const tabs = [
  { id: "wallet", label: "Wallet", path: "/wallet" },
  { id: "gift-cards", label: "Gift Cards", path: "/gift-cards" },
  { id: "shop", label: "Shop", path: "/shop" },
  { id: "topup", label: "Mobile top up", path: "/wallet/mobile-topup" },
  { id: "utility", label: "Utility", path: "/utility" },
  { id: "about", label: "About", path: "/about" },
  { id: "support", label: "Support", path: "/support" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export function PageNavigation({ variant = "default" }: { variant?: "default" | "marketplace" }) {
  const [location, navigate] = useLocation();
  const isMarketplace = variant === "marketplace";
  return (
    <nav
      className={`border-b lg:hidden ${
        isMarketplace
          ? "border-[#e4e9e1] bg-[#fbfcf8]"
          : "bg-card"
      }`}
      aria-label="Pexly pages"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-2.5">
        {tabs.map(({ id, label, path }) => {
          const active = location === path || (id === "wallet" && location.startsWith("/wallet") && !location.includes("mobile-topup"));
          return (
            <Button
              key={id}
              variant={isMarketplace ? "ghost" : active ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(path)}
              className={`shrink-0 whitespace-nowrap text-xs font-medium sm:text-sm ${
                isMarketplace
                  ? active
                    ? "bg-[#0a211f] text-white hover:bg-[#143a32] hover:text-white"
                    : "text-[#405048] hover:bg-[#edf2e9] hover:text-[#0a211f]"
                  : ""
              }`}
              data-testid={`button-service-${id}`}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
