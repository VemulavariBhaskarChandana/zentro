"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "@/components/loading-screen";

export function NavigationFeedback() {
  const pathname = usePathname();
  const [navigationOrigin, setNavigationOrigin] = useState<string | null>(null);
  const isNavigating = navigationOrigin === pathname;

  useEffect(() => {
    const appContent = document.getElementById("app-content");
    if (appContent) {
      appContent.inert = isNavigating;
      appContent.setAttribute("aria-busy", String(isNavigating));
    }

    return () => {
      if (appContent) {
        appContent.inert = false;
        appContent.removeAttribute("aria-busy");
      }
    };
  }, [isNavigating]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      setNavigationOrigin(window.location.pathname);
      clearTimeout(timeout);
      timeout = setTimeout(() => setNavigationOrigin(null), 12_000);
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearTimeout(timeout);
    };
  }, []);

  return (
    isNavigating ? <LoadingScreen /> : null
  );
}
