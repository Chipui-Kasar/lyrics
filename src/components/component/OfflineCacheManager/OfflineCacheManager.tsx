"use client";

import { useEffect } from "react";
import { updateLyricsCache } from "@/lib/cacheService";
import { getLyricsList } from "@/lib/indexedDB";

// Minimal cache manager: compares backend metadata and updates IDB silently
export default function OfflineCacheManager() {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (typeof window === "undefined") return;
      // Try to load cached list early (no-op here, but warms IDB)
      await getLyricsList().catch(() => {});

      // Only run when online
      if (!navigator.onLine) return;

      try {
        const metaRes = await fetch("/api/lyrics/metadata?includeAll=true", {
          cache: "no-store",
        });
        if (!metaRes.ok) return;
        const remoteMeta = await metaRes.json();

        const cachedLyrics = await getLyricsList();

        const isDifferent =
          !cachedLyrics.length || cachedLyrics.length !== remoteMeta.totalCount;

        if (isDifferent) {
          if (!cancelled) {
            await updateLyricsCache(true);
          }
        }
      } catch (err) {
        // Swallow errors for MVP
        // Updates will try again on next load
      }
    };

    // Run after a brief delay to avoid blocking initial render
    const t = setTimeout(run, 1000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return null;
}
