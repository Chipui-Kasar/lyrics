"use client";

import { useEffect } from "react";
import { initializeCache } from "@/lib/cacheService";

export default function CacheInitializer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const run = async () => {
      try {
        await initializeCache();
      } catch (error) {
        if (!cancelled) {
          console.error("Cache initialization failed:", error);
        }
      }
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => {
        void run();
      }, { timeout: 1500 });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timeout = setTimeout(() => {
      void run();
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
