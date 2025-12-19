"use client";

import { useEffect, useState } from "react";
import AllLyrics from "./AllLyrics";
import type { ILyrics } from "@/models/IObjects";
import { getLyricsList } from "@/lib/indexedDB";

interface Props {
  initialLyrics: ILyrics[];
}

export default function AllLyricsHydrated({ initialLyrics }: Props) {
  const [lyrics, setLyrics] = useState<ILyrics[]>(initialLyrics || []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        // Try IndexedDB first for instant offline-friendly render
        const cached = await getLyricsList();
        if (!cancelled && cached && cached.length > 0) {
          // Sort alphabetically to match server behavior
          setLyrics(
            (cached as ILyrics[])
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title))
          );
        }
      } catch {
        // ignore
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return <AllLyrics lyrics={lyrics} />;
}
