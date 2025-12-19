"use client";

import { useEffect } from "react";
import {
  getMetadata,
  saveMetadata,
  saveLyricsList,
  getLyricsList,
} from "@/lib/indexedDB";

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
        // Fetch metadata from backend
        const metaRes = await fetch("/api/lyrics/metadata", {
          cache: "no-store",
        });
        if (!metaRes.ok) return;
        const remoteMeta = await metaRes.json();

        const localMeta = await getMetadata();

        const isDifferent =
          !localMeta ||
          localMeta.totalCount !== remoteMeta.totalCount ||
          localMeta.lastUpdated !== remoteMeta.lastUpdated;

        if (isDifferent) {
          // Fetch updated list (limit can be applied server-side; here we fetch all published)
          const listRes = await fetch("/api/lyrics?sort=updatedAt", {
            cache: "no-store",
          });
          if (listRes.ok) {
            const list = await listRes.json();
            if (!cancelled && Array.isArray(list)) {
              await saveLyricsList(list);
              await saveMetadata({
                totalCount: remoteMeta.totalCount,
                lastUpdated: remoteMeta.lastUpdated,
                savedAt: Date.now(),
              });
            }
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
