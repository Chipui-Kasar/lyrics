"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When pathname changes, hide the loader
    setIsLoading(false);

    // Listen for custom navigation events
    const handleNavigationStart = () => {
      setIsLoading(true);
    };

    const handleNavigationEnd = () => {
      setIsLoading(false);
    };

    // Listen for browser back/forward button
    const handlePopState = () => {
      setIsLoading(false);
    };

    // Listen for BFCache restore
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsLoading(false);
      }
    };

    window.addEventListener("navigationStart", handleNavigationStart);
    window.addEventListener("navigationEnd", handleNavigationEnd);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow as EventListener);

    return () => {
      window.removeEventListener("navigationStart", handleNavigationStart);
      window.removeEventListener("navigationEnd", handleNavigationEnd);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow as EventListener);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#79095c33] to-[#001fff29] z-50">
      <Loader className="h-12 w-12 animate-spin text-white drop-shadow-lg" />
    </div>
  );
}
