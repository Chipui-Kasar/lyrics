"use client";

import {
  getLyricsList,
  saveLyricsList,
  saveMetadata,
  getMetadata,
  getArtistsList,
  saveArtistsList,
  saveArtistsMetadata,
  getArtistsMetadata,
  LyricRecord,
  ArtistRecord,
} from "./indexedDB";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STALE_DURATION = 60 * 60 * 1000; // 1 hour - when to show stale warning

// Helper to check if cache needs update using lightweight metadata endpoint
async function checkCacheFreshness(
  type: "lyrics" | "artists"
): Promise<boolean> {
  try {
    const metadata =
      type === "lyrics" ? await getMetadata() : await getArtistsMetadata();
    if (!metadata) return false;

    // Use metadata endpoint (returns ~50-100 bytes vs 500KB+)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${type}/metadata`,
      {
        method: "GET",
        headers: {
          "If-None-Match": metadata.lastUpdated || "",
          "Cache-Control": "no-cache",
        },
      }
    );

    // 304 = Not Modified (cache is fresh)
    if (response.status === 304) {
      console.log(`✅ ${type} cache is fresh (304 Not Modified)`);
      return true;
    }

    // Check if server metadata matches our cache
    if (response.ok) {
      const serverMeta = await response.json();
      const isFresh =
        serverMeta.totalCount === metadata.totalCount &&
        serverMeta.lastUpdated === metadata.lastUpdated;

      if (isFresh) {
        console.log(`✅ ${type} cache is fresh (metadata match)`);
        return true;
      }
    }

    console.log(`🔄 ${type} cache needs update`);
    return false;
  } catch (error) {
    console.error(`Error checking ${type} freshness:`, error);
    return false; // Assume stale on error
  }
}

// ==================== LYRICS CACHING ====================

export async function getCachedLyrics(): Promise<{
  data: LyricRecord[];
  isStale: boolean;
}> {
  try {
    const [lyrics, metadata] = await Promise.all([
      getLyricsList(),
      getMetadata(),
    ]);

    if (!lyrics || lyrics.length === 0) {
      return { data: [], isStale: false };
    }

    const now = Date.now();
    const savedAt = metadata?.savedAt || 0;
    const isStale = now - savedAt > STALE_DURATION;

    return { data: lyrics, isStale };
  } catch (error) {
    console.error("Error getting cached lyrics:", error);
    return { data: [], isStale: false };
  }
}

export async function updateLyricsCache(forceRefresh = false): Promise<void> {
  try {
    // Check if cache is recent using lightweight check
    if (!forceRefresh) {
      const metadata = await getMetadata();
      const now = Date.now();
      const savedAt = metadata?.savedAt || 0;

      // First check: Time-based (instant, no network)
      if (now - savedAt < CACHE_DURATION) {
        console.log("✅ Lyrics cache is fresh (time-based), skipping update");
        return;
      }

      // Second check: Metadata-based (minimal network ~50 bytes)
      const isFresh = await checkCacheFreshness("lyrics");
      if (isFresh) {
        // Update savedAt to reset timer without fetching full data
        await saveMetadata({
          ...metadata!,
          savedAt: Date.now(),
        });
        return;
      }
    }

    // Fetch fresh data from API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?sort=title`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate, br", // Request compression
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const lyrics = await response.json();

    console.log(
      `📦 Downloaded ${lyrics.length} lyrics (${Math.round(
        JSON.stringify(lyrics).length / 1024
      )}KB)`
    );

    // Save to IndexedDB
    await saveLyricsList(lyrics);
    await saveMetadata({
      totalCount: lyrics.length,
      lastUpdated: new Date().toISOString(),
      savedAt: Date.now(),
    });

    console.log(`Updated lyrics cache: ${lyrics.length} items`);
  } catch (error) {
    console.error("Error updating lyrics cache:", error);
  }
}

// ==================== ARTISTS CACHING ====================

export async function getCachedArtists(): Promise<{
  data: ArtistRecord[];
  isStale: boolean;
}> {
  try {
    const [artists, metadata] = await Promise.all([
      getArtistsList(),
      getArtistsMetadata(),
    ]);

    if (!artists || artists.length === 0) {
      return { data: [], isStale: false };
    }

    const now = Date.now();
    const savedAt = metadata?.savedAt || 0;
    const isStale = now - savedAt > STALE_DURATION;

    return { data: artists, isStale };
  } catch (error) {
    console.error("Error getting cached artists:", error);
    return { data: [], isStale: false };
  }
}

export async function updateArtistsCache(forceRefresh = false): Promise<void> {
  try {
    // Check if cache is recent using lightweight check
    if (!forceRefresh) {
      const metadata = await getArtistsMetadata();
      const now = Date.now();
      const savedAt = metadata?.savedAt || 0;

      // First check: Time-based (instant, no network)
      if (now - savedAt < CACHE_DURATION) {
        console.log("✅ Artists cache is fresh (time-based), skipping update");
        return;
      }

      // Second check: Metadata-based (minimal network ~50 bytes)
      const isFresh = await checkCacheFreshness("artists");
      if (isFresh) {
        // Update savedAt to reset timer without fetching full data
        await saveArtistsMetadata({
          ...metadata!,
          savedAt: Date.now(),
        });
        return;
      }
    }

    // Fetch fresh artists data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/artist`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate, br", // Request compression
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const artists = await response.json();

    console.log(`📦 Downloaded ${artists.length} artists`);

    // Fetch song counts if artists exist
    if (artists.length > 0) {
      const artistIds = artists
        .map((artist: ArtistRecord) => artist._id)
        .join(",");
      const countResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/artist/lyricscount?artistIds=${artistIds}`
      );

      if (countResponse.ok) {
        const songCounts = await countResponse.json();
        // Merge song counts
        artists.forEach((artist: ArtistRecord) => {
          artist.songCount = songCounts[artist._id] ?? 0;
        });
      }
    }

    // Save to IndexedDB
    await saveArtistsList(artists);
    await saveArtistsMetadata({
      totalCount: artists.length,
      lastUpdated: new Date().toISOString(),
      savedAt: Date.now(),
    });

    console.log(`Updated artists cache: ${artists.length} items`);
  } catch (error) {
    console.error("Error updating artists cache:", error);
  }
}

// ==================== BACKGROUND SYNC ====================

let syncInProgress = false;

export async function syncAllData(forceRefresh = false): Promise<void> {
  if (syncInProgress) {
    console.log("Sync already in progress, skipping");
    return;
  }

  try {
    syncInProgress = true;
    console.log("Starting background data sync...");

    // Update both caches in parallel
    await Promise.allSettled([
      updateLyricsCache(forceRefresh),
      updateArtistsCache(forceRefresh),
    ]);

    console.log("Background data sync completed");
  } catch (error) {
    console.error("Error during background sync:", error);
  } finally {
    syncInProgress = false;
  }
}

// ==================== INITIALIZATION ====================

export async function initializeCache(): Promise<void> {
  // Check if we have cached data
  const [lyricsCache, artistsCache] = await Promise.all([
    getCachedLyrics(),
    getCachedArtists(),
  ]);

  // If no cached data exists, fetch immediately
  if (lyricsCache.data.length === 0 || artistsCache.data.length === 0) {
    console.log("No cached data found, fetching fresh data...");
    await syncAllData(true);
  } else {
    // If cached data exists, sync in background
    console.log("Using cached data, syncing in background...");
    setTimeout(() => syncAllData(false), 100);
  }
}
