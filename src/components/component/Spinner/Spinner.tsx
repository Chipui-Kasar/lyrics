"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const PageLoader = () => {
  const pathname = usePathname(); // Detect route changes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle clicks on internal links only, except for the current page link
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (
        link &&
        link.getAttribute("href")?.startsWith("/") &&
        link.getAttribute("href") !== pathname
      ) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    // Trigger loader on route change
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800);

    return () => clearTimeout(timeout);
  }, [pathname]);

  //   if (!loading) return null;
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center rounded-lg shadow-lg 
      bg-gradient-to-r from-[#79095c33] to-[#001fff29] 
      transition-all duration-700 ease-in-out
      ${
        loading
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }
    `}
    >
      {loading && (
        <Loader className="h-12 w-12 animate-spin text-white drop-shadow-lg" />
      )}
    </div>
  );
};

export default PageLoader;
