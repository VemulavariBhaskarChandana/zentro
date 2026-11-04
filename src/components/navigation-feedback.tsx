"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export function NavigationFeedback() {
  const pathname = usePathname();
  const [navigationOrigin, setNavigationOrigin] = useState<string | null>(null);
  const isNavigating = navigationOrigin === pathname;

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
        (destination.pathname === window.location.pathname &&
          destination.search === window.location.search &&
          destination.hash === window.location.hash)
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

  if (!isNavigating) return null;

  return (
    <div
      aria-live="polite"
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-full border border-[#e8e1d4] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#6f5108] shadow-lg"
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
      Loading page…
    </div>
  );
}
