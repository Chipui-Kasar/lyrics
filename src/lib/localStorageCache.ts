"use client";

/**
 * Alternative: localStorage implementation (NOT RECOMMENDED)
 *
 * WARNING: localStorage has limitations:
 * - Only 5-10MB storage
 * - Synchronous (blocks UI)
 * - Strings only (requires JSON.parse/stringify)
 * - Can cause performance issues with large data
 *
 * Use IndexedDB instead for better performance!
 */

const LYRICS_KEY = "tangkhul_lyrics_cache";
const ARTISTS_KEY = "tangkhul_artists_cache";
const LYRICS_META_KEY = "tangkhul_lyrics_meta";
const ARTISTS_META_KEY = "tangkhul_artists_meta";

// Save lyrics to localStorage
export function saveLyricsToLocalStorage(lyrics: any[]) {
  try {
    localStorage.setItem(LYRICS_KEY, JSON.stringify(lyrics));
    localStorage.setItem(
      LYRICS_META_KEY,
      JSON.stringify({
        totalCount: lyrics.length,
        savedAt: Date.now(),
        lastUpdated: new Date().toISOString(),
      })
    );
    console.log("✅ Saved lyrics to localStorage:", lyrics.length);
  } catch (error) {
    console.error("❌ Failed to save lyrics to localStorage:", error);
    // Likely quota exceeded
  }
}

// Get lyrics from localStorage
export function getLyricsFromLocalStorage(): any[] {
  try {
    const data = localStorage.getItem(LYRICS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Failed to get lyrics from localStorage:", error);
    return [];
  }
}

// Save artists to localStorage
export function saveArtistsToLocalStorage(artists: any[]) {
  try {
    localStorage.setItem(ARTISTS_KEY, JSON.stringify(artists));
    localStorage.setItem(
      ARTISTS_META_KEY,
      JSON.stringify({
        totalCount: artists.length,
        savedAt: Date.now(),
        lastUpdated: new Date().toISOString(),
      })
    );
    console.log("✅ Saved artists to localStorage:", artists.length);
  } catch (error) {
    console.error("❌ Failed to save artists to localStorage:", error);
  }
}

// Get artists from localStorage
export function getArtistsFromLocalStorage(): any[] {
  try {
    const data = localStorage.getItem(ARTISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Failed to get artists from localStorage:", error);
    return [];
  }
}

// Clear all cache
export function clearLocalStorageCache() {
  localStorage.removeItem(LYRICS_KEY);
  localStorage.removeItem(ARTISTS_KEY);
  localStorage.removeItem(LYRICS_META_KEY);
  localStorage.removeItem(ARTISTS_META_KEY);
  console.log("🗑️ Cleared localStorage cache");
}

// Get cache metadata
export function getCacheMetadata() {
  try {
    const lyricsMeta = localStorage.getItem(LYRICS_META_KEY);
    const artistsMeta = localStorage.getItem(ARTISTS_META_KEY);
    return {
      lyrics: lyricsMeta ? JSON.parse(lyricsMeta) : null,
      artists: artistsMeta ? JSON.parse(artistsMeta) : null,
    };
  } catch (error) {
    console.error("❌ Failed to get cache metadata:", error);
    return { lyrics: null, artists: null };
  }
}
