export function getLocalizedCheckoutPath(pathname = window.location.pathname): string {
  const firstSegment = pathname.split("/")[1];
  const languageBase = firstSegment && firstSegment.length === 2
    ? `/${firstSegment}`
    : "/en";

  return `${languageBase}/checkout`;
}

export function openLocalizedCheckout(): void {
  window.open(getLocalizedCheckoutPath(), "_blank");
}
