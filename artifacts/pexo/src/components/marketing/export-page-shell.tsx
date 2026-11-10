import { useCallback, useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { useLocation } from "wouter";

const routes: Record<string, string> = {
  home: "/",
  shop: "/shop",
  giftcards: "/gift-cards",
  "gift-cards": "/gift-cards",
  topup: "/wallet/mobile-topup",
  wallet: "/wallet",
  about: "/about-us",
  team: "/teams",
  careers: "/career",
  career: "/career",
  blog: "/blogs",
  blogs: "/blogs",
  checkout: "/checkout",
  support: "/support",
  contact: "/contact",
  signin: "/signin",
  signup: "/signup",
};

export function ExportPageShell({ children, pageName }: { children: ReactNode; pageName: string }) {
  const [, setLocation] = useLocation();
  const [formNotice, setFormNotice] = useState("");
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".export-page .px-nav");
    const updateNav = () => nav?.classList.toggle("scrolled", window.scrollY > 30);
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });

    const reveal = (element: HTMLElement) => {
      const style = window.getComputedStyle(element);
      if (Number.parseFloat(style.opacity) < 0.99 || (style.filter && style.filter !== "none")) {
        element.style.setProperty("transition", "opacity .6s ease,filter .6s ease");
        element.style.setProperty("opacity", "1", "important");
        element.style.setProperty("filter", "none", "important");
        if (!/splide|swiper/.test(String(element.className)) && style.transform !== "none") {
          element.style.setProperty("transition", "opacity .6s ease,filter .6s ease,transform .6s ease");
          element.style.setProperty("transform", "none");
        }
      }
    };
    const animated = Array.from(document.querySelectorAll<HTMLElement>(".export-page [data-w-id]"));
    let observer: IntersectionObserver | undefined;
    const timers = new Set<number>();
    const carouselCleanups: Array<() => void> = [];
    const syncCarousels = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      document.querySelectorAll<HTMLElement>(".export-page .swiper.cr-card").forEach((carousel) => {
        const wrapper = carousel.querySelector<HTMLElement>(".swiper-wrapper");
        if (!wrapper) return;
        const slides = Array.from(wrapper.querySelectorAll<HTMLElement>(".swiper-slide"));
        carousel.style.overflow = "hidden";
        wrapper.style.display = "flex";
        wrapper.style.width = "100%";
        wrapper.style.gap = mobile ? "16px" : "24px";
        wrapper.style.overflowX = "auto";
        wrapper.style.scrollSnapType = "x mandatory";
        wrapper.style.scrollbarWidth = "none";
        wrapper.style.cursor = "grab";
        slides.forEach((slide) => {
          slide.style.flex = mobile
            ? "0 0 calc(76.923% - 3.692px)"
            : tablet
              ? "0 0 calc(33.333% - 16px)"
              : "0 0 calc(22.222% - 18.667px)";
          slide.style.width = "auto";
          slide.style.scrollSnapAlign = "start";
        });
      });
    };
    syncCarousels();
    window.addEventListener("resize", syncCarousels, { passive: true });
    document.querySelectorAll<HTMLElement>(".export-page .swiper.cr-card .swiper-wrapper").forEach((wrapper) => {
      let startX = 0;
      let startScroll = 0;
      let dragging = false;
      const down = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        startX = event.clientX;
        startScroll = wrapper.scrollLeft;
        dragging = true;
        wrapper.setPointerCapture(event.pointerId);
        wrapper.style.cursor = "grabbing";
      };
      const move = (event: PointerEvent) => {
        if (!dragging) return;
        wrapper.scrollLeft = startScroll - (event.clientX - startX);
      };
      const up = () => {
        dragging = false;
        wrapper.style.cursor = "grab";
      };
      wrapper.addEventListener("pointerdown", down);
      wrapper.addEventListener("pointermove", move);
      wrapper.addEventListener("pointerup", up);
      wrapper.addEventListener("pointercancel", up);
      carouselCleanups.push(() => {
        wrapper.removeEventListener("pointerdown", down);
        wrapper.removeEventListener("pointermove", move);
        wrapper.removeEventListener("pointerup", up);
        wrapper.removeEventListener("pointercancel", up);
      });
    });
    const IntersectionObserverConstructor = (
      window as unknown as { IntersectionObserver?: typeof IntersectionObserver }
    ).IntersectionObserver;
    if (IntersectionObserverConstructor) {
      observer = new IntersectionObserverConstructor((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          observer?.unobserve(target);
          timers.add(window.setTimeout(() => {
            reveal(target as HTMLElement);
            timers.clear();
          }, 900));
        });
      }, { threshold: 0.01 });
      animated.forEach((element) => observer?.observe(element));
    } else {
      timers.add(window.setTimeout(() => animated.forEach(reveal), 1500));
    }
    const revealVisible = window.setTimeout(() => {
      animated.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) reveal(element);
      });
    }, 2500);

    return () => {
      window.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", syncCarousels);
      carouselCleanups.forEach((cleanup) => cleanup());
      observer?.disconnect();
      window.clearTimeout(revealVisible);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  const onClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const dropdownButton = target.closest<HTMLButtonElement>(".px-dd-t");
    if (dropdownButton) {
      const expanded = dropdownButton.getAttribute("aria-expanded") === "true";
      dropdownButton.setAttribute("aria-expanded", String(!expanded));
      document.querySelectorAll<HTMLElement>(".export-page .px-dd").forEach((dropdown) => {
        const active = dropdown === dropdownButton.closest(".px-dd") && !expanded;
        dropdown.classList.toggle("open", active);
        dropdown.classList.toggle("is-open", active);
        dropdown.querySelector(".px-dd-t")?.setAttribute("aria-expanded", String(active));
      });
      return;
    }

    const burger = target.closest<HTMLButtonElement>(".px-burger");
    if (burger) {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!expanded));
      burger.closest(".px-nav")?.classList.toggle("is-open", !expanded);
      burger.closest(".px-nav")?.querySelector(".px-menu")?.classList.toggle("open", !expanded);
      return;
    }

    document.querySelectorAll<HTMLElement>(".export-page .px-dd.open, .export-page .px-dd.is-open").forEach((dropdown) => {
      dropdown.classList.remove("open", "is-open");
      dropdown.querySelector(".px-dd-t")?.setAttribute("aria-expanded", "false");
    });

    const faqQuestion = target.closest<HTMLElement>(".faq-question-block");
    if (faqQuestion) {
      const item = faqQuestion.closest(".faq-item");
      const expanded = item?.classList.toggle("w--open") ?? false;
      faqQuestion.setAttribute("aria-expanded", String(expanded));
      faqQuestion.setAttribute("role", "button");
      const answer = item?.querySelector(".faq-ans-block");
      answer?.classList.toggle("w--open", expanded);
      return;
    }

    const tab = target.closest<HTMLElement>(".w-tab-link[data-w-tab]");
    if (tab) {
      const tabs = tab.closest(".w-tabs");
      const selected = tab.dataset.wTab;
      if (!tabs || !selected) return;
      tabs.querySelectorAll<HTMLElement>(".w-tab-link").forEach((link) => {
        const active = link === tab;
        link.classList.toggle("w--current", active);
        link.setAttribute("aria-selected", String(active));
        link.setAttribute("tabindex", active ? "0" : "-1");
      });
      tabs.querySelectorAll<HTMLElement>(".w-tab-pane").forEach((panel) => {
        const active = panel.dataset.wTab === selected;
        panel.classList.toggle("w--tab-active", active);
        panel.hidden = !active;
      });
      return;
    }

    if (target.closest("button[aria-label='Subscribe']")) {
      setFormNotice("Newsletter sign-up is not connected yet.");
      document.querySelector("form.subscribe-form, .subscribe-form-block input")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (target.closest(".sp-chat")) {
      setLocation("/support");
      return;
    }

    const filterButton = target.closest<HTMLButtonElement>(".sp-chips button");
    if (filterButton) {
      const group = filterButton.closest(".sp-chips");
      group?.querySelectorAll("button").forEach((button) => button.classList.toggle("on", button === filterButton));
      window.dispatchEvent(new CustomEvent("pexly-shop-filter", { detail: filterButton.dataset.f ?? "all" }));
      return;
    }

    if (target.closest("#hotshuffle")) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("pexly-shop-shuffle"));
      return;
    }

    const anchor = target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor) return;
    const key = anchor.getAttribute("data-px-link")?.toLowerCase();

    if (key === "home#top-up" || key === "topup") {
      event.preventDefault();
      setLocation("/wallet/mobile-topup");
      return;
    }
    const route = key ? routes[key] : undefined;
    const href = anchor.getAttribute("href") ?? "";
    const internal = href.startsWith("/") && !href.startsWith("//");
    if (route || internal) {
      event.preventDefault();
      setLocation(route ?? href);
      anchor.closest(".px-nav")?.classList.remove("is-open");
    }
  }, [setLocation]);

  const onSubmit = useCallback((event: FormEvent<HTMLDivElement>) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (form.matches(".px-search-panel")) {
      const query = new FormData(form).get("search")?.toString().trim();
      if (query) setLocation(`/shop?search=${encodeURIComponent(query)}`);
      return;
    }
    setFormNotice("This form is not connected to a submission service yet.");
  }, [setLocation]);

  return (
    <div className="export-page" data-export-page={pageName} onClick={onClick} onSubmit={onSubmit}>
      {children}
      {formNotice && <div className="export-form-notice" role="status" aria-live="polite">{formNotice}</div>}
    </div>
  );
}
