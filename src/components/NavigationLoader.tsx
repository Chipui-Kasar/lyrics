"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Safety net so the ring can never get stuck if a navigation is cancelled.
const MAX_VISIBLE_MS = 8000;

/**
 * The one and only page-navigation spinner. It reacts to clicks on ANY
 * internal link (nav bar, cards, footer...) the moment they happen, so there
 * is instant feedback even when the next page isn't prefetched, then hides
 * when the pathname changes. app/loading.tsx renders nothing so there is never
 * a second spinner on top of this one.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // New page arrived.
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    let timer: number | undefined;

    const hide = () => {
      window.clearTimeout(timer);
      setIsLoading(false);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same page (hash jump or query-only change): the pathname won't change
      // to hide the ring, so don't show it.
      if (url.pathname === window.location.pathname) return;

      window.clearTimeout(timer);
      setIsLoading(true);
      timer = window.setTimeout(hide, MAX_VISIBLE_MS);
    };

    // Capture phase: runs before Next's Link calls preventDefault.
    document.addEventListener("click", onClick, true);
    // Back/forward during a navigation: drop the ring.
    window.addEventListener("popstate", hide);
    window.addEventListener("pageshow", hide);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", hide);
      window.removeEventListener("pageshow", hide);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/40"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
