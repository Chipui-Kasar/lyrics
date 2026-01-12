"use client";

import { useState, useEffect } from "react";
import { getCachedLyrics, getCachedArtists } from "@/lib/cacheService";
import { ILyrics, IArtists } from "@/models/IObjects";

export function useCachedLyrics() {
  const [lyrics, setLyrics] = useState<ILyrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const { data, isStale: stale } = await getCachedLyrics();
        if (!cancelled) {
          setLyrics(data as ILyrics[]);
          setIsStale(stale);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading cached lyrics:", error);
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { lyrics, isLoading, isStale };
}

export function useCachedArtists() {
  const [artists, setArtists] = useState<IArtists[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const { data, isStale: stale } = await getCachedArtists();
        if (!cancelled) {
          setArtists(data as IArtists[]);
          setIsStale(stale);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading cached artists:", error);
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { artists, isLoading, isStale };
}
