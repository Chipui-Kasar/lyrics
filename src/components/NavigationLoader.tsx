"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Loader } from "lucide-react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  if (!isLoading && !isPending) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#79095c33] to-[#001fff29] z-50">
      <Loader className="h-12 w-12 animate-spin text-white drop-shadow-lg" />
    </div>
  );
}
