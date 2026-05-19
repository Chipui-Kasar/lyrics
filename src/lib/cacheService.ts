"use client";

import {
  getLyricsList,
  getLyricsCount,
  saveLyricsList,
  saveMetadata,
  getMetadata,
  getArtistsList,
  getArtistsCount,
  saveArtistsList,
  saveArtistsMetadata,
  getArtistsMetadata,
  LyricRecord,
  ArtistRecord,
  saveLyric,
  getLyricById,
  savePageCache,
  getPageCache,
} from "./indexedDB";
import { ILyrics, IArtists } from "@/models/IObjects";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STALE_DURATION = 60 * 60 * 1000; // 1 hour - when to show stale warning
const PAGE_TTL = 7 * 24 * 60 * 60 * 1000;
const SEARCH_TTL = 6 * 60 * 60 * 1000;
const LYRICS_METADATA_SCHEMA_VERSION = 2;

export function fastHash(value = "") {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function apiBase() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL || "";
}

function toIfNoneMatch(lastUpdated?: string) {
  return lastUpdated ? `"${lastUpdated}"` : "";
}

function buildApiUrl(path: string, params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  if (typeof window !== "undefined") {
    searchParams.set("_cacheBust", String(Date.now()));
  }

  const queryString = searchParams.toString();
  return `${apiBase()}${path}${queryString ? `?${queryString}` : ""}`;
}

async function fetchCollectionMetadata(type: "lyrics" | "artists") {
  const response = await fetch(
    buildApiUrl(
      `/api/${type}/metadata`,
      type === "lyrics" ? { includeAll: "true" } : undefined
    ),
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed metadata fetch for ${type}: ${response.status}`);
  }

  return response.json() as Promise<{
    totalCount: number;
    lastUpdated?: string;
  }>;
}

function lyricCacheMeta(lyric: ILyrics | LyricRecord) {
  const lyrics = lyric.lyrics || "";
  return {
    lastUpdated:
      typeof lyric.updatedAt === "string"
        ? lyric.updatedAt
        : lyric.updatedAt?.toISOString?.(),
    length: lyrics.length,
    hash: fastHash(lyrics),
  };
}

function artistPageMeta(lyrics: ILyrics[]) {
  const lastUpdated = lyrics
    .map((lyric) =>
      typeof lyric.updatedAt === "string"
        ? lyric.updatedAt
        : lyric.updatedAt?.toISOString?.()
    )
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    totalCount: lyrics.length,
    lastUpdated,
    hash: fastHash(
      lyrics.map((lyric) => `${lyric._id}:${lyric.title}:${lyric.updatedAt}`).join("|")
    ),
  };
}

async function fetchAllLyrics(): Promise<LyricRecord[]> {
  const pageSize = 200;
  const lyrics: LyricRecord[] = [];
  let page = 1;
  let totalCount = 0;
  let hasNext = true;

  while (hasNext) {
    const response = await fetch(
      buildApiUrl("/api/lyrics", {
        page: String(page),
        limit: String(pageSize),
        sort: "title",
        order: "asc",
        includeAll: "true",
      }),
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data?.items) || !data?.pagination) {
      throw new Error("Invalid paginated lyrics response");
    }

    for (const lyric of data.items as LyricRecord[]) {
      if (lyric) {
        lyrics.push(lyric);
      }
    }

    totalCount = data.pagination.totalCount ?? totalCount;
    hasNext = Boolean(data.pagination.hasNext);
    page += 1;
  }

  if (totalCount && lyrics.length < totalCount) {
    throw new Error(
      `Incomplete lyrics response: received ${lyrics.length} of ${totalCount}`
    );
  }

  return lyrics;
}

// Helper to check if cache needs update using lightweight metadata endpoint
async function checkCacheFreshness(
  type: "lyrics" | "artists"
): Promise<boolean> {
  try {
    const metadata =
      type === "lyrics" ? await getMetadata() : await getArtistsMetadata();
    if (!metadata) return false;

    const storedCount =
      type === "lyrics" ? await getLyricsCount() : await getArtistsCount();
    if (storedCount !== metadata.totalCount) {
      console.log(
        `🔄 ${type} cache count mismatch (${storedCount}/${metadata.totalCount})`
      );
      return false;
    }

    // Use metadata endpoint (returns ~50-100 bytes vs 500KB+)
    const response = await fetch(
      buildApiUrl(
        `/api/${type}/metadata`,
        type === "lyrics" ? { includeAll: "true" } : undefined
      ),
      {
      method: "GET",
      cache: "no-store",
      headers: {
        "If-None-Match": toIfNoneMatch(metadata.lastUpdated),
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
      const storedCount = await getLyricsCount();
      const now = Date.now();
      const savedAt = metadata?.savedAt || 0;
      const hasCompleteCache =
        !!metadata &&
        metadata.schemaVersion === LYRICS_METADATA_SCHEMA_VERSION &&
        storedCount > 0 &&
        storedCount === metadata.totalCount;

      // First check: Time-based (instant, no network)
      if (hasCompleteCache && now - savedAt < CACHE_DURATION) {
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
    const metadata = await fetchCollectionMetadata("lyrics").catch(() => null);

    const lyrics = await fetchAllLyrics();

    console.log(
      `📦 Downloaded ${lyrics.length} lyrics (${Math.round(
        JSON.stringify(lyrics).length / 1024
      )}KB)`
    );

    if (metadata?.totalCount && lyrics.length < metadata.totalCount) {
      throw new Error(
        `Incomplete lyrics response: received ${lyrics.length} of ${metadata.totalCount}`
      );
    }

    // Save to IndexedDB
    await saveLyricsList(
      lyrics.map((lyric: LyricRecord) => ({
        ...lyric,
        lyricsLength: lyric.lyrics?.length ?? 0,
        lyricsHash: fastHash(lyric.lyrics || ""),
      }))
    );
    await saveMetadata({
      totalCount: metadata?.totalCount ?? lyrics.length,
      schemaVersion: LYRICS_METADATA_SCHEMA_VERSION,
      lastUpdated:
        metadata?.lastUpdated ??
        lyrics
          .map((lyric: LyricRecord) => lyric.updatedAt)
          .filter(Boolean)
          .sort()
          .at(-1),
      savedAt: Date.now(),
    });

    console.log(`Updated lyrics cache: ${lyrics.length} items`);
  } catch (error) {
    console.error("Error updating lyrics cache:", error);
  }
}

// ==================== PAGE-LEVEL STALE-WHILE-REVALIDATE ====================

export async function seedLyricCache(lyric: ILyrics) {
  if (!lyric?._id) return;
  const meta = lyricCacheMeta(lyric);
  await Promise.all([
    saveLyric({
      ...(lyric as LyricRecord),
      updatedAt: meta.lastUpdated,
      lyricsLength: meta.length,
      lyricsHash: meta.hash,
    }),
    savePageCache(`lyric:${lyric._id}`, lyric, {
      ttlMs: PAGE_TTL,
      meta,
    }),
  ]);
}

export async function getCachedLyric(id: string) {
  const [page, legacy] = await Promise.all([
    getPageCache<ILyrics>(`lyric:${id}`),
    getLyricById(id),
  ]);

  const data = page?.data || (legacy as ILyrics | undefined);
  return {
    data: data || null,
    meta: page?.meta,
    isExpired: page ? Date.now() > page.expiresAt : true,
  };
}

export async function revalidateLyricCache(id: string) {
  const cached = await getCachedLyric(id);
  const response = await fetch(`${apiBase()}/api/lyrics/author/singleLyrics?id=${id}`, {
    headers: cached.meta?.lastUpdated
      ? { "If-None-Match": toIfNoneMatch(cached.meta.lastUpdated) }
      : undefined,
  });

  if (response.status === 304) return cached.data;
  if (!response.ok) return cached.data;

  const fresh = (await response.json()) as ILyrics;
  const freshMeta = lyricCacheMeta(fresh);
  const changed =
    !cached.meta ||
    cached.meta.lastUpdated !== freshMeta.lastUpdated ||
    cached.meta.length !== freshMeta.length ||
    cached.meta.hash !== freshMeta.hash;

  if (changed) {
    await seedLyricCache(fresh);
    return fresh;
  }

  await savePageCache(`lyric:${id}`, fresh, { ttlMs: PAGE_TTL, meta: freshMeta });
  return cached.data || fresh;
}

export async function seedArtistPageCache(slug: string, lyrics: ILyrics[]) {
  if (!slug || !lyrics?.length) return;
  await savePageCache(`artist:${slug}`, lyrics, {
    ttlMs: PAGE_TTL,
    meta: artistPageMeta(lyrics),
  });
}

export async function getCachedArtistPage(slug: string) {
  const page = await getPageCache<ILyrics[]>(`artist:${slug}`);
  return {
    data: page?.data || [],
    meta: page?.meta,
    isExpired: page ? Date.now() > page.expiresAt : true,
  };
}

export async function revalidateArtistPageCache(slug: string) {
  const cached = await getCachedArtistPage(slug);
  const response = await fetch(
    `${apiBase()}/api/lyrics/author/lyrics?artistName=${encodeURIComponent(slug)}`,
    {
      headers: cached.meta?.lastUpdated
        ? { "If-None-Match": toIfNoneMatch(cached.meta.lastUpdated) }
        : undefined,
    }
  );

  if (response.status === 304) return cached.data;
  if (!response.ok) return cached.data;

  const fresh = (await response.json()) as ILyrics[];
  const freshMeta = artistPageMeta(fresh);
  const changed =
    !cached.meta ||
    cached.meta.totalCount !== freshMeta.totalCount ||
    cached.meta.lastUpdated !== freshMeta.lastUpdated ||
    cached.meta.hash !== freshMeta.hash;

  if (changed || cached.isExpired) {
    await savePageCache(`artist:${slug}`, fresh, {
      ttlMs: PAGE_TTL,
      meta: freshMeta,
    });
    return fresh;
  }

  return cached.data;
}

export async function getCachedSearch(query: string) {
  const key = `search:${query.trim().toLowerCase()}`;
  const page = await getPageCache<{ lyrics: ILyrics[]; artists: IArtists[] }>(key);
  if (!page || Date.now() > page.expiresAt) return null;
  return page.data;
}

export async function saveSearchCache(
  query: string,
  data: { lyrics: ILyrics[]; artists: IArtists[] }
) {
  const key = `search:${query.trim().toLowerCase()}`;
  await savePageCache(key, data, {
    ttlMs: SEARCH_TTL,
    meta: {
      totalCount: (data.lyrics?.length || 0) + (data.artists?.length || 0),
      hash: fastHash(JSON.stringify(data)),
    },
  });
}

export async function getCachedLyricsPage(page: number) {
  return getPageCache<{
    items: ILyrics[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>(`lyrics-page:${page}`);
}

export async function saveLyricsPageCache(
  page: number,
  data: {
    items: ILyrics[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }
) {
  const lyricsWithIds = data.items.filter((lyric) => lyric?._id);

  await Promise.all(
    lyricsWithIds.map((lyric) => {
      const meta = lyricCacheMeta(lyric);
      return saveLyric({
        ...(lyric as LyricRecord),
        updatedAt: meta.lastUpdated,
        lyricsLength: meta.length,
        lyricsHash: meta.hash,
      });
    })
  );

  await savePageCache(`lyrics-page:${page}`, data, {
    ttlMs: PAGE_TTL,
    meta: {
      totalCount: data.pagination.totalCount,
      hash: fastHash(
        data.items.map((lyric) => `${lyric._id}:${lyric.title}:${lyric.updatedAt}`).join("|")
      ),
    },
  });
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
      const storedCount = await getArtistsCount();
      const now = Date.now();
      const savedAt = metadata?.savedAt || 0;
      const hasCompleteCache =
        !!metadata &&
        storedCount > 0 &&
        storedCount === metadata.totalCount;

      // First check: Time-based (instant, no network)
      if (hasCompleteCache && now - savedAt < CACHE_DURATION) {
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
    const metadata = await fetchCollectionMetadata("artists").catch(() => null);

    const response = await fetch(
      buildApiUrl("/api/artist"),
      {
        cache: "no-store",
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
    if (!Array.isArray(artists)) {
      throw new Error("Invalid artists response");
    }

    if (metadata?.totalCount && artists.length < metadata.totalCount) {
      throw new Error(
        `Incomplete artists response: received ${artists.length} of ${metadata.totalCount}`
      );
    }

    console.log(`📦 Downloaded ${artists.length} artists`);

    // Fetch song counts if artists exist
    if (artists.length > 0) {
      const artistIds = artists
        .map((artist: ArtistRecord) => artist._id)
        .join(",");
      const countResponse = await fetch(
        `${apiBase()}/api/artist/lyricscount?artistIds=${artistIds}`
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
      totalCount: metadata?.totalCount ?? artists.length,
      lastUpdated:
        metadata?.lastUpdated ??
        artists
          .map((artist: ArtistRecord) => artist.updatedAt)
          .filter(Boolean)
          .sort()
          .at(-1),
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
