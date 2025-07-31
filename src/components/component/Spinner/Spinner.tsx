"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface PageLoaderProps {
  isLoading?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading = false }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
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
    if (isLoading) return;
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timeout);
  }, [pathname, isLoading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#79095c33] to-[#001fff29] z-50">
      <Loader className="h-12 w-12 animate-spin text-white drop-shadow-lg" />
    </div>
  );
};

export default PageLoader;
