"use client";

import { useEffect, useRef, useState } from "react";
import { IArtists, ILyrics } from "@/models/IObjects";
import {
  LyricRecord,
  ArtistRecord,
  searchLyricsByTitlePrefix,
  searchArtistsByNamePrefix,
} from "@/lib/indexedDB";
import { getCachedSearch, saveSearchCache } from "@/lib/cacheService";

export type SearchSource = "idle" | "cache" | "live";

export interface LocalSearchResult {
  lyrics: ILyrics[];
  artists: IArtists[];
  source: SearchSource;
  isSearching: boolean;
}

const MIN_QUERY_LENGTH = 2;
const LOCAL_RESULT_LIMIT = 20;

function toDisplayLyric(record: LyricRecord): ILyrics {
  const artistName =
    record.artist ||
    (typeof record.artistId === "string" ? record.artistId : record.artistId?.name) ||
    "Unknown Artist";

  return {
    ...(record as unknown as ILyrics),
    _id: record._id || record.id || "",
    title: record.title,
    lyrics: record.lyrics ?? record.content ?? "",
    artistId: { name: artistName } as IArtists,
  };
}

function toDisplayArtist(record: ArtistRecord): IArtists {
  return record as unknown as IArtists;
}

async function fetchFromApi(query: string): Promise<{ lyrics: ILyrics[]; artists: IArtists[] } | null> {
  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return null;
    const json = await res.json();
    await saveSearchCache(query, json);
    return json;
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.error("Search fetch failed", err);
    }
    return null;
  }
}

/**
 * Local-first search: reads the "lyrics"/"artists" IndexedDB stores via their
 * by_title/by_name indexes for an instant (~1 frame) result, then only hits
 * the server if IndexedDB has nothing to show, or refreshes quietly in the
 * background when it does.
 */
export function useLocalSearch(query: string): LocalSearchResult {
  const [state, setState] = useState<LocalSearchResult>({
    lyrics: [],
    artists: [],
    source: "idle",
    isSearching: false,
  });
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    const id = ++requestId.current;
    let cancelled = false;

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setState({ lyrics: [], artists: [], source: "idle", isSearching: false });
      return;
    }

    setState((prev) => ({ ...prev, isSearching: true }));

    (async () => {
      const [localLyrics, localArtists] = await Promise.all([
        searchLyricsByTitlePrefix(trimmed, LOCAL_RESULT_LIMIT),
        searchArtistsByNamePrefix(trimmed, LOCAL_RESULT_LIMIT),
      ]);
      if (cancelled || id !== requestId.current) return;

      const hasLocalResults = localLyrics.length > 0 || localArtists.length > 0;

      if (hasLocalResults) {
        setState({
          lyrics: localLyrics.map(toDisplayLyric),
          artists: localArtists.map(toDisplayArtist),
          source: "cache",
          isSearching: false,
        });

        // Background refresh: don't block the instant local render on this.
        const fresh = await fetchFromApi(trimmed);
        if (!cancelled && id === requestId.current && fresh) {
          setState({
            lyrics: fresh.lyrics,
            artists: fresh.artists,
            source: "live",
            isSearching: false,
          });
        }
        return;
      }

      // Nothing local — try a previously cached exact-query API response
      // before paying for a network round trip.
      const cachedExact = await getCachedSearch(trimmed);
      if (cancelled || id !== requestId.current) return;
      if (cachedExact) {
        setState({
          lyrics: cachedExact.lyrics,
          artists: cachedExact.artists,
          source: "cache",
          isSearching: false,
        });
        return;
      }

      const fresh = await fetchFromApi(trimmed);
      if (cancelled || id !== requestId.current) return;
      setState({
        lyrics: fresh?.lyrics ?? [],
        artists: fresh?.artists ?? [],
        source: "live",
        isSearching: false,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return state;
}
