"use client";

import { useEffect, useState } from "react";
import AllLyrics from "./AllLyrics";
import type { ILyrics } from "@/models/IObjects";
import { getCachedLyrics, updateLyricsCache } from "@/lib/cacheService";
import { saveLyricsList, saveMetadata } from "@/lib/indexedDB";

interface Props {
  initialLyrics: ILyrics[];
}

export default function AllLyricsHydrated({ initialLyrics }: Props) {
  const [lyrics, setLyrics] = useState<ILyrics[]>(initialLyrics || []);

  useEffect(() => {
    let cancelled = false;

    // Fast path: Try to get cached data without blocking
    getCachedLyrics()
      .then(({ data: cachedLyrics, isStale }) => {
        if (cancelled) return;

        if (cachedLyrics && cachedLyrics.length > 0) {
          // Use cached data
          setLyrics(
            (cachedLyrics as ILyrics[])
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title))
          );

          // Update in background if stale (don't await)
          if (isStale) {
            console.log("Cache is stale, updating in background...");
            updateLyricsCache(true)
              .then(() => {
                if (!cancelled) {
                  getCachedLyrics().then(({ data: freshLyrics }) => {
                    if (freshLyrics && freshLyrics.length > 0) {
                      setLyrics(
                        (freshLyrics as ILyrics[])
                          .slice()
                          .sort((a, b) => a.title.localeCompare(b.title))
                      );
                    }
                  });
                }
              })
              .catch((err) => console.error("Background update failed:", err));
          }
        } else if (initialLyrics && initialLyrics.length > 0) {
          // No cache - save SSR data in background (non-blocking)
          console.log(
            "Caching SSR data in background...",
            initialLyrics.length
          );
          Promise.all([
            saveLyricsList(initialLyrics as any),
            saveMetadata({
              totalCount: initialLyrics.length,
              lastUpdated: new Date().toISOString(),
              savedAt: Date.now(),
            }),
          ])
            .then(() => {
              console.log("✅ SSR data cached");
            })
            .catch((err) => console.error("Cache save failed:", err));

          // Use SSR data immediately
          if (!cancelled) {
            setLyrics(initialLyrics);
          }
        }
      })
      .catch((error) => {
        console.error("Error loading lyrics:", error);
        // Fallback to initialLyrics
        if (!cancelled && initialLyrics && initialLyrics.length > 0) {
          setLyrics(initialLyrics);
        }
      });

    // Cleanup
    return () => {
      cancelled = true;
    };
  }, []); // Empty deps - only run once

  return <AllLyrics lyrics={lyrics} />;
}
