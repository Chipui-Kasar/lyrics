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
    // Check if cache is recent
    if (!forceRefresh) {
      const metadata = await getMetadata();
      const now = Date.now();
      const savedAt = metadata?.savedAt || 0;

      if (now - savedAt < CACHE_DURATION) {
        console.log("Lyrics cache is fresh, skipping update");
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
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const lyrics = await response.json();

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
    // Check if cache is recent
    if (!forceRefresh) {
      const metadata = await getArtistsMetadata();
      const now = Date.now();
      const savedAt = metadata?.savedAt || 0;

      if (now - savedAt < CACHE_DURATION) {
        console.log("Artists cache is fresh, skipping update");
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
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const artists = await response.json();

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
