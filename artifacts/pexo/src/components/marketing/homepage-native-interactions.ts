type Cleanup = () => void;

type CarouselMetrics = {
  start: number;
  cycle: number;
};

type SwiperLayout = {
  gap: number;
  slidesPerView: number;
};

function positiveModulo(value: number, divisor: number): number {
  return divisor > 0 ? ((value % divisor) + divisor) % divisor : 0;
}

function rememberInlineStyles(elements: HTMLElement[]): Map<HTMLElement, string | null> {
  return new Map(elements.map((element) => [element, element.getAttribute("style")]));
}

function restoreInlineStyles(styles: Map<HTMLElement, string | null>): void {
  styles.forEach((style, element) => {
    if (style === null) {
      element.removeAttribute("style");
    } else {
      element.setAttribute("style", style);
    }
  });
}

function makeLoopClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.dataset.homeLoopClone = "true";
  clone.setAttribute("aria-hidden", "true");
  clone.setAttribute("inert", "");
  clone.removeAttribute("id");

  clone.querySelectorAll<HTMLElement>("[id]").forEach((element) => {
    element.removeAttribute("id");
  });
  clone.querySelectorAll<HTMLElement>("a, button, input, select, textarea, [tabindex]").forEach((element) => {
    element.setAttribute("tabindex", "-1");
  });

  return clone;
}

function setupNativeSwiper(slider: HTMLElement): Cleanup {
  const foundWrapper = slider.querySelector<HTMLElement>(":scope > .swiper-wrapper");
  if (!foundWrapper) return () => {};
  const wrapper: HTMLElement = foundWrapper;

  const originals = Array.from(wrapper.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );
  if (originals.length < 2) return () => {};

  const styles = rememberInlineStyles([slider, wrapper, ...originals]);
  const cloneCount = Math.min(originals.length, 6);
  const headClones = originals.slice(-cloneCount).map(makeLoopClone);
  const tailClones = originals.slice(0, cloneCount).map(makeLoopClone);
  const originalFirstChild = wrapper.firstChild;

  headClones.forEach((clone) => wrapper.insertBefore(clone, originalFirstChild));
  tailClones.forEach((clone) => wrapper.appendChild(clone));

  const slides = [...headClones, ...originals, ...tailClones];
  const allClones = [...headClones, ...tailClones];
  const metrics: CarouselMetrics = { start: 0, cycle: 0 };
  let layout: SwiperLayout = { gap: 24, slidesPerView: 4.5 };
  let adjustingScroll = false;
  let dragging = false;
  let dragPointerId: number | null = null;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let resizeFrame = 0;

  slider.classList.add("home-native-swiper");
  slider.style.overflowX = "auto";
  slider.style.overflowY = "hidden";
  slider.style.scrollSnapType = "x mandatory";
  slider.style.scrollBehavior = "auto";
  slider.style.scrollbarWidth = "none";
  slider.style.touchAction = "pan-x pan-y";

  wrapper.style.display = "flex";
  wrapper.style.width = "100%";
  wrapper.style.transform = "none";
  wrapper.style.transitionProperty = "none";

  function responsiveLayout(): SwiperLayout {
    if (window.innerWidth < 768) return { gap: 16, slidesPerView: 1.3 };
    if (window.innerWidth < 1024) return { gap: 24, slidesPerView: 3 };
    return { gap: 24, slidesPerView: 4.5 };
  }

  function applyLayout(): void {
    layout = responsiveLayout();
    wrapper.style.gap = `${layout.gap}px`;

    slides.forEach((slide) => {
      slide.style.flex = `0 0 calc((100% - ${layout.gap * (layout.slidesPerView - 1)}px) / ${layout.slidesPerView})`;
      slide.style.width = "auto";
      slide.style.height = "auto";
      slide.style.scrollSnapAlign = "start";
    });

    metrics.cycle =
      originals.reduce((total, slide) => total + slide.getBoundingClientRect().width, 0) +
      layout.gap * originals.length;
    metrics.start =
      headClones.reduce((total, slide) => total + slide.getBoundingClientRect().width, 0) +
      layout.gap * headClones.length;
  }

  function normalizeScroll(): void {
    if (adjustingScroll || metrics.cycle <= 0) return;

    const relativeScroll = slider.scrollLeft - metrics.start;
    if (relativeScroll < 0 || relativeScroll >= metrics.cycle) {
      adjustingScroll = true;
      slider.scrollLeft = metrics.start + positiveModulo(relativeScroll, metrics.cycle);
      adjustingScroll = false;
    }
  }

  function handlePointerDown(event: PointerEvent): void {
    if (
      event.pointerType === "touch" ||
      event.button !== 0 ||
      (event.target instanceof Element && event.target.closest("a, button"))
    ) {
      return;
    }

    dragging = true;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartScroll = slider.scrollLeft;
    slider.classList.add("home-native-is-dragging");
    slider.style.scrollSnapType = "none";
    slider.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (!dragging || event.pointerId !== dragPointerId) return;
    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) > 4) event.preventDefault();
    slider.scrollLeft = dragStartScroll - distance;
  }

  function finishPointerDrag(event: PointerEvent): void {
    if (!dragging || event.pointerId !== dragPointerId) return;
    dragging = false;
    dragPointerId = null;
    slider.classList.remove("home-native-is-dragging");
    slider.style.scrollSnapType = "x mandatory";
  }

  applyLayout();
  slider.scrollLeft = metrics.start;

  const settleLayout = () => {
    applyLayout();
    slider.scrollLeft = metrics.start;
  };
  const handleResize = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(settleLayout);
  };

  slider.addEventListener("scroll", normalizeScroll, { passive: true });
  slider.addEventListener("pointerdown", handlePointerDown);
  slider.addEventListener("pointermove", handlePointerMove);
  slider.addEventListener("pointerup", finishPointerDrag);
  slider.addEventListener("pointercancel", finishPointerDrag);
  window.addEventListener("resize", handleResize, { passive: true });

  return () => {
    window.cancelAnimationFrame(resizeFrame);
    window.removeEventListener("resize", handleResize);
    slider.removeEventListener("scroll", normalizeScroll);
    slider.removeEventListener("pointerdown", handlePointerDown);
    slider.removeEventListener("pointermove", handlePointerMove);
    slider.removeEventListener("pointerup", finishPointerDrag);
    slider.removeEventListener("pointercancel", finishPointerDrag);
    allClones.forEach((clone) => clone.remove());
    slider.classList.remove("home-native-swiper", "home-native-is-dragging");
    restoreInlineStyles(styles);
  };
}

function cssPixels(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function setupNativeMarquee(marquee: HTMLElement, reducedMotion: boolean): Cleanup {
  const foundTrack = marquee.querySelector<HTMLElement>(":scope > .splide__track");
  const foundList = foundTrack?.querySelector<HTMLElement>(":scope > .splide__list");
  if (!foundTrack || !foundList) return () => {};
  const track: HTMLElement = foundTrack;
  const list: HTMLElement = foundList;

  const originals = Array.from(list.children).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );
  if (originals.length < 2) return () => {};

  const styles = rememberInlineStyles([track, list]);
  const clones: HTMLElement[] = [];
  const speedValue = Number.parseFloat(marquee.dataset.speed ?? "0.5");
  const speed = (Number.isFinite(speedValue) ? Math.abs(speedValue) : 0.5) * 60;
  const direction = marquee.dataset.direction === "reversed" ? -1 : 1;
  const canDrag = marquee.dataset.drag !== "false";
  let cycleWidth = 0;
  let offset = 0;
  let lastFrameTime = 0;
  let animationFrame = 0;
  let resizeFrame = 0;
  let dragging = false;
  let dragPointerId: number | null = null;
  let dragStartX = 0;
  let dragStartOffset = 0;

  marquee.classList.add("home-native-marquee", "is-initialized", "is-rendered", "is-active");
  track.style.overflow = "hidden";
  track.style.touchAction = "pan-y";
  list.style.display = "flex";
  list.style.width = "max-content";
  list.style.flexWrap = "nowrap";
  list.style.willChange = "transform";

  function measureCycle(): number {
    const listStyle = window.getComputedStyle(list);
    const gap = cssPixels(listStyle.columnGap || listStyle.gap);
    const slideWidths = originals.reduce((total, slide) => {
      const slideStyle = window.getComputedStyle(slide);
      return total +
        slide.getBoundingClientRect().width +
        cssPixels(slideStyle.marginLeft) +
        cssPixels(slideStyle.marginRight);
    }, 0);

    return slideWidths + gap * originals.length;
  }

  function renderOffset(): void {
    if (cycleWidth <= 0) return;
    offset = positiveModulo(offset, cycleWidth);
    list.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  function rebuildClones(): void {
    clones.forEach((clone) => clone.remove());
    clones.length = 0;
    cycleWidth = measureCycle();
    if (cycleWidth <= 0) return;

    const requiredWidth = cycleWidth + track.clientWidth;
    let rounds = 0;
    while (list.scrollWidth < requiredWidth && rounds < 24) {
      originals.forEach((original) => {
        const clone = makeLoopClone(original);
        clones.push(clone);
        list.appendChild(clone);
      });
      rounds += 1;
    }

    renderOffset();
  }

  function animate(time: number): void {
    if (lastFrameTime > 0 && !dragging && document.visibilityState === "visible") {
      const delta = Math.min(time - lastFrameTime, 50);
      offset += direction * speed * (delta / 1000);
      renderOffset();
    }
    lastFrameTime = time;
    animationFrame = window.requestAnimationFrame(animate);
  }

  function handlePointerDown(event: PointerEvent): void {
    if (
      !canDrag ||
      event.button !== 0 ||
      (event.target instanceof Element && event.target.closest("a, button"))
    ) {
      return;
    }

    dragging = true;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartOffset = offset;
    marquee.classList.add("home-native-is-dragging");
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (!dragging || event.pointerId !== dragPointerId) return;
    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) > 4) event.preventDefault();
    offset = dragStartOffset - distance;
    renderOffset();
  }

  function finishPointerDrag(event: PointerEvent): void {
    if (!dragging || event.pointerId !== dragPointerId) return;
    dragging = false;
    dragPointerId = null;
    marquee.classList.remove("home-native-is-dragging");
  }

  rebuildClones();
  console.info("Homepage marquee layout", JSON.stringify({
    list: list.className,
    trackSize: [track.clientWidth, track.clientHeight],
    cycleWidth,
    slideSizes: originals.map((slide) => [
      slide.getBoundingClientRect().width,
      slide.getBoundingClientRect().height,
      window.getComputedStyle(slide).width,
    ]),
    visibility: window.getComputedStyle(marquee).visibility,
  }));

  const handleResize = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(rebuildClones);
  };

  window.addEventListener("resize", handleResize, { passive: true });
  if (canDrag) {
    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", finishPointerDrag);
    track.addEventListener("pointercancel", finishPointerDrag);
  }
  if (!reducedMotion && speed > 0) {
    animationFrame = window.requestAnimationFrame(animate);
  }

  return () => {
    window.cancelAnimationFrame(animationFrame);
    window.cancelAnimationFrame(resizeFrame);
    window.removeEventListener("resize", handleResize);
    track.removeEventListener("pointerdown", handlePointerDown);
    track.removeEventListener("pointermove", handlePointerMove);
    track.removeEventListener("pointerup", finishPointerDrag);
    track.removeEventListener("pointercancel", finishPointerDrag);
    clones.forEach((clone) => clone.remove());
    marquee.classList.remove(
      "home-native-marquee",
      "home-native-is-dragging",
      "is-initialized",
      "is-rendered",
      "is-active",
    );
    restoreInlineStyles(styles);
  };
}

function setupCardDescriptionToggles(root: HTMLElement): Cleanup {
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".card-slide-content")).filter(
    (card) => !card.closest("[data-home-loop-clone]"),
  );
  const previousAttributes = new Map<
    HTMLElement,
    { role: string | null; tabIndex: string | null; expanded: string | null }
  >();
  cards.forEach((card) => {
    previousAttributes.set(card, {
      role: card.getAttribute("role"),
      tabIndex: card.getAttribute("tabindex"),
      expanded: card.getAttribute("aria-expanded"),
    });
  });

  const toggleCard = (card: HTMLElement) => {
    const expanded = !card.classList.contains("is-expanded");
    card.classList.toggle("is-expanded", expanded);
    card.setAttribute("aria-expanded", String(expanded));
  };

  const listeners = cards.map((card) => {
    const handleClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a, button")) return;
      toggleCard(card);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleCard(card);
    };

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-expanded", "false");
    card.addEventListener("click", handleClick);
    card.addEventListener("keydown", handleKeyDown);

    return { card, handleClick, handleKeyDown };
  });

  return () => {
    listeners.forEach(({ card, handleClick, handleKeyDown }) => {
      card.removeEventListener("click", handleClick);
      card.removeEventListener("keydown", handleKeyDown);
      card.classList.remove("is-expanded");

      const previous = previousAttributes.get(card);
      if (!previous) return;
      if (previous.role === null) card.removeAttribute("role");
      else card.setAttribute("role", previous.role);
      if (previous.tabIndex === null) card.removeAttribute("tabindex");
      else card.setAttribute("tabindex", previous.tabIndex);
      if (previous.expanded === null) card.removeAttribute("aria-expanded");
      else card.setAttribute("aria-expanded", previous.expanded);
    });
  };
}

export function setupHomepageNativeInteractions(
  root: HTMLElement,
  reducedMotion: boolean,
): Cleanup {
  const documentElement = document.documentElement;
  const previousScrollBehavior = documentElement.style.scrollBehavior;
  documentElement.style.scrollBehavior = reducedMotion ? "auto" : "smooth";

  const cleanups = [
    ...Array.from(root.querySelectorAll<HTMLElement>(".splide.common-marquee-slider")).map((marquee) =>
      setupNativeMarquee(marquee, reducedMotion),
    ),
    ...Array.from(root.querySelectorAll<HTMLElement>(".swiper.cr-card")).map(setupNativeSwiper),
    setupCardDescriptionToggles(root),
  ];

  return () => {
    cleanups.reverse().forEach((cleanup) => cleanup());
    documentElement.style.scrollBehavior = previousScrollBehavior;
  };
}
