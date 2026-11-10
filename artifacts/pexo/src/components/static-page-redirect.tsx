import { useEffect } from "react";

export function StaticPageRedirect({ to }: { to: string }) {
  useEffect(() => {
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const destination = `${base}${to.replace(/^\/+/, "")}`;

    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== destination) {
      window.location.replace(destination);
    }
  }, [to]);

  return null;
}
