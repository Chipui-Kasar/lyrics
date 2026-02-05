"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AllLyrics from "./AllLyrics";
import type { ILyrics } from "@/models/IObjects";

interface Props {
  initialLyrics: ILyrics[];
  initialPagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AllLyricsHydrated({
  initialLyrics,
  initialPagination,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lyrics, setLyrics] = useState<ILyrics[]>(initialLyrics || []);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const cacheRef = useRef<
    Record<
      number,
      {
        items: ILyrics[];
        pagination: Props["initialPagination"];
      }
    >
  >({
    [initialPagination.page]: {
      items: initialLyrics || [],
      pagination: initialPagination,
    },
  });

  const pageFromUrl = useMemo(() => {
    const raw = searchParams.get("page");
    const parsed = raw ? Number(raw) : initialPagination.page;
    if (!parsed || Number.isNaN(parsed) || parsed < 1) {
      return initialPagination.page;
    }
    return parsed;
  }, [searchParams, initialPagination.page]);

  const fetchPage = useCallback(
    async (page: number) => {
      abortRef.current?.abort();
      requestIdRef.current += 1;
      const requestId = requestIdRef.current;

      const cached = cacheRef.current[page];
      if (cached) {
        setIsLoading(false);
        setLyrics(cached.items);
        setPagination(cached.pagination);
        return;
      }

      setIsLoading(true);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(initialPagination.limit));
        params.set("sort", "title");
        params.set("order", "asc");
        params.set("fields", "summary");

        const res = await fetch(`/api/lyrics?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch lyrics page: ${res.status}`);
        }

        const data = await res.json();
        if (!data?.items || !data?.pagination) {
          throw new Error("Invalid paginated response");
        }

        cacheRef.current[page] = {
          items: data.items,
          pagination: data.pagination,
        };

        setLyrics(data.items);
        setPagination(data.pagination);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Error loading lyrics page:", error);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [initialPagination.limit]
  );

  useEffect(() => {
    if (pageFromUrl === pagination.page && lyrics.length > 0) return;
    fetchPage(pageFromUrl);
  }, [fetchPage, pageFromUrl, pagination.page, lyrics.length]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/lyrics", { scroll: true });
  };

  return (
    <AllLyrics
      lyrics={lyrics}
      isLoading={isLoading}
      pagination={{
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalCount: pagination.totalCount,
        pageSize: pagination.limit,
        onPageChange: handlePageChange,
      }}
    />
  );
}
