"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IArtists, ILyrics } from "@/models/IObjects";
import SearchResult from "./SearchResult";
import { getCachedSearch, saveSearchCache } from "@/lib/cacheService";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const query = decodeURIComponent(queryParam);
  const [data, setData] = useState<{ lyrics: ILyrics[]; artists: IArtists[] }>({
    lyrics: [],
    artists: [],
  });

  useEffect(() => {
    if (!query) {
      setData({ lyrics: [], artists: [] });
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const cached = await getCachedSearch(query);
        if (!cancelled && cached) {
          setData(cached);
        }

        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          await saveSearchCache(query, json);
          if (!cancelled) {
            setData(json);
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Search fetch failed", err);
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  return <SearchResult params={query} lyrics={data} />;
}
