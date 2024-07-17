"use client";
import SearchResult from "@/components/component/SearchResult/SearchResult";
import { log } from "console";
import { useSearchParams } from "next/navigation";
import React from "react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  console.log("query", query);

  return <SearchResult params={query} />;
};

export default SearchPage;
