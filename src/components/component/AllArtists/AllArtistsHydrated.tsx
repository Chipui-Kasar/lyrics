"use client";

import { useEffect, useState } from "react";
import PopularArtists from "../PopularArtists/PopularArtists";
import { IArtists } from "@/models/IObjects";
import { getCachedArtists, updateArtistsCache } from "@/lib/cacheService";
import { saveArtistsList, saveArtistsMetadata } from "@/lib/indexedDB";

interface Props {
  initialArtists: IArtists[];
}

export default function AllArtistsHydrated({ initialArtists }: Props) {
  const [artists, setArtists] = useState<IArtists[]>(initialArtists || []);

  useEffect(() => {
    let cancelled = false;

    // Fast path: Try to get cached data without blocking
    getCachedArtists()
      .then(({ data: cachedArtists, isStale }) => {
        if (cancelled) return;

        if (cachedArtists && cachedArtists.length > 0) {
          // Use cached data
          setArtists(cachedArtists as IArtists[]);

          // Update in background if stale (don't await)
          if (isStale) {
            console.log("Artists cache is stale, updating in background...");
            updateArtistsCache(true)
              .then(() => {
                if (!cancelled) {
                  getCachedArtists().then(({ data: freshArtists }) => {
                    if (freshArtists && freshArtists.length > 0) {
                      setArtists(freshArtists as IArtists[]);
                    }
                  });
                }
              })
              .catch((err) => console.error("Background update failed:", err));
          }
        } else if (initialArtists && initialArtists.length > 0) {
          // No cache - save SSR data in background (non-blocking)
          console.log(
            "Caching SSR artists in background...",
            initialArtists.length
          );
          Promise.all([
            saveArtistsList(initialArtists as any),
            saveArtistsMetadata({
              totalCount: initialArtists.length,
              lastUpdated: new Date().toISOString(),
              savedAt: Date.now(),
            }),
          ])
            .then(() => {
              console.log("✅ SSR artists cached");
            })
            .catch((err) => console.error("Cache save failed:", err));

          // Use SSR data immediately
          if (!cancelled) {
            setArtists(initialArtists);
          }
        }
      })
      .catch((error) => {
        console.error("Error loading artists:", error);
        // Fallback to initialArtists
        if (!cancelled && initialArtists && initialArtists.length > 0) {
          setArtists(initialArtists);
        }
      });

    // Cleanup
    return () => {
      cancelled = true;
    };
  }, []); // Empty deps - only run once

  return (
    <section className="container py-4 sm:py-8 md:py-10 m-auto">
      <PopularArtists artists={artists} />
    </section>
  );
}
