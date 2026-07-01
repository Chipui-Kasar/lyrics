"use client";

import { useSearchParams } from "next/navigation";
import SearchResult from "./SearchResult";
import { useLocalSearch } from "@/hooks/useLocalSearch";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const query = decodeURIComponent(queryParam);
  const { lyrics, artists, source } = useLocalSearch(query);

  return (
    <SearchResult
      params={query}
      lyrics={{ lyrics, artists }}
      source={source}
    />
  );
}
