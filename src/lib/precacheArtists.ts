"use client";

import { getArtistsList } from "./indexedDB";

const PAGE_CACHE_NAME = "pages-v2.1.0";
const MAX_FETCHES_PER_IDLE = 5;
const IDLE_TIMEOUT_MS = 2000;

async function getCachedArtistPaths(): Promise<Set<string>> {
  if (typeof caches === "undefined") return new Set();

  try {
    const cache = await caches.open(PAGE_CACHE_NAME);
    const requests = await cache.keys();
    const paths = requests
      .map((request) => {
        try {
          return new URL(request.url).pathname;
        } catch {
          return null;
        }
      })
      .filter((path): path is string => Boolean(path));

    return new Set(paths);
  } catch (error) {
    console.error("Failed to read pages cache for precaching:", error);
    return new Set();
  }
}

async function fetchAndCacheArtistPage(path: string): Promise<void> {
  try {
    const response = await fetch(path, { credentials: "same-origin" });
    if (!response.ok) return;

    const cache = await caches.open(PAGE_CACHE_NAME);
    await cache.put(path, response.clone());
  } catch (error) {
    console.error(`Failed to precache ${path}:`, error);
  }
}

// Drains the queue a few items at a time, only picking up the next batch
// once the current one has settled — this is what keeps concurrent fetches
// bounded to MAX_FETCHES_PER_IDLE instead of firing the whole queue at once.
function scheduleIdleBatch(queue: string[]): void {
  if (queue.length === 0) return;

  const runBatch = (deadline: IdleDeadline) => {
    const batch: string[] = [];

    while (
      queue.length > 0 &&
      batch.length < MAX_FETCHES_PER_IDLE &&
      (deadline.timeRemaining() > 0 || deadline.didTimeout)
    ) {
      const path = queue.shift();
      if (path) batch.push(path);
    }

    if (batch.length === 0) {
      scheduleIdleBatch(queue);
      return;
    }

    void Promise.all(batch.map((path) => fetchAndCacheArtistPage(path))).then(
      () => scheduleIdleBatch(queue)
    );
  };

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(runBatch, { timeout: IDLE_TIMEOUT_MS });
  } else {
    setTimeout(
      () => runBatch({ didTimeout: true, timeRemaining: () => 0 } as IdleDeadline),
      300
    );
  }
}

export async function precacheUnvisitedArtists(): Promise<void> {
  if (typeof window === "undefined" || typeof caches === "undefined") return;

  try {
    const [artists, cachedPaths] = await Promise.all([
      getArtistsList(),
      getCachedArtistPaths(),
    ]);

    const uncachedPaths = artists
      .map((artist) => artist.slug)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => `/artists/${slug}`)
      .filter((path) => !cachedPaths.has(path));

    scheduleIdleBatch(uncachedPaths);
  } catch (error) {
    console.error("Failed to precache unvisited artists:", error);
  }
}
