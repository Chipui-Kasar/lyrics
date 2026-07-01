"use client";

import { useEffect } from "react";
import { precacheUnvisitedArtists } from "@/lib/precacheArtists";

const VISITED_KEY = "tl-has-visited";
const FIRST_VISIT_DELAY_MS = 3000;

export default function ArtistPrecacher() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isRepeatVisit = window.localStorage.getItem(VISITED_KEY) === "1";
    window.localStorage.setItem(VISITED_KEY, "1");

    const timer = window.setTimeout(
      () => {
        void precacheUnvisitedArtists();
      },
      isRepeatVisit ? 0 : FIRST_VISIT_DELAY_MS
    );

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
