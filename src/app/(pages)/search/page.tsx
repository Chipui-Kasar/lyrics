"use client";
import SearchResult from "@/components/component/SearchResult/SearchResult";
import { useSearchParams } from "next/navigation";
import React from "react";

import { Suspense } from "react";

const SearchPage = () => {
  return (
    <Suspense fallback={null}>
      <WithSearchParams />
    </Suspense>
  );
};

const WithSearchParams = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  console.log("query", query);

  return <SearchResult params={query} />;
};

export default SearchPage;
