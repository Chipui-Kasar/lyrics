"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useNavigationLoader() {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Listen for browser back/forward navigation to cancel spinner
  useEffect(() => {
    const handlePopState = () => {
      setIsNavigating(false);
    };

    window.addEventListener("popstate", handlePopState);

    // Also listen to pageshow event for BFCache
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsNavigating(false);
      }
    };

    window.addEventListener("pageshow", handlePageShow as EventListener);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow as EventListener);
    };
  }, []);

  const navigateWithLoader = useCallback(
    (href: string) => {
      setIsNavigating(true);
      router.push(href);

      // Fallback: Hide spinner after a maximum timeout
      const timeout = setTimeout(() => {
        setIsNavigating(false);
      }, 3000);

      return () => clearTimeout(timeout);
    },
    [router]
  );

  const resetLoader = useCallback(() => {
    setIsNavigating(false);
  }, []);

  return { isNavigating, navigateWithLoader, resetLoader };
}
