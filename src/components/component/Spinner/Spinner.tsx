"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";

interface PageLoaderProps {
  isLoading?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading = false }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(isLoading);
  const timerRef = useRef<number | null>(null);

  // Ensure spinner never persists after BFCache restore or page show
  useEffect(() => {
    const handlePageShow = () => setLoading(false);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") setLoading(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Show spinner briefly on route changes; auto-hide after a short delay
  useEffect(() => {
    if (isLoading) return;
    setLoading(true);
    // Clear any previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
      timerRef.current = null;
    }, 200);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pathname, isLoading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#79095c33] to-[#001fff29] z-50">
      <Loader className="h-12 w-12 animate-spin text-white drop-shadow-lg" />
    </div>
  );
};

export default PageLoader;
