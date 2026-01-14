"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Hide loader when pathname changes
    setIsLoading(false);

    // Listen for navigation start event
    const handleNavigationStart = () => {
      setIsLoading(true);
    };

    // Listen for navigation end event
    const handleNavigationEnd = () => {
      setIsLoading(false);
    };

    window.addEventListener("navigationStart", handleNavigationStart);
    window.addEventListener("navigationEnd", handleNavigationEnd);

    return () => {
      window.removeEventListener("navigationStart", handleNavigationStart);
      window.removeEventListener("navigationEnd", handleNavigationEnd);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#79095c33] to-[#001fff29] z-50">
      <Loader className="h-12 w-12 animate-spin text-white drop-shadow-lg" />
    </div>
  );
}
