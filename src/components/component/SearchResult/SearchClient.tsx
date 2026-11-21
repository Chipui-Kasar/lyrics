"use client";

import { useSearchParams } from "next/navigation";
import SearchResult from "./SearchResult";
import { useLocalSearch } from "@/hooks/useLocalSearch";
import CacheInitializer from "@/components/CacheInitializer";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const query = decodeURIComponent(queryParam);
  const { lyrics, artists, source } = useLocalSearch(query);

  return (
    <>
      {/* Syncs the full lyrics/artists list into IndexedDB for local-first
          search. Only mounted here so other pages don't pay for it. */}
      <CacheInitializer />
      <SearchResult
        params={query}
        lyrics={{ lyrics, artists }}
        source={source}
      />
    </>
  );
}
