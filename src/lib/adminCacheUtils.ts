"use client";

import { updateLyricsCache, updateArtistsCache } from "@/lib/cacheService";

/**
 * Utility functions for admin operations
 * Call these after creating/updating/deleting data to refresh the cache
 */

export async function refreshLyricsCache() {
  try {
    console.log("Refreshing lyrics cache...");
    await updateLyricsCache(true);
    console.log("Lyrics cache refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh lyrics cache:", error);
  }
}

export async function refreshArtistsCache() {
  try {
    console.log("Refreshing artists cache...");
    await updateArtistsCache(true);
    console.log("Artists cache refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh artists cache:", error);
  }
}

export async function refreshAllCaches() {
  try {
    console.log("Refreshing all caches...");
    await Promise.all([updateLyricsCache(true), updateArtistsCache(true)]);
    console.log("All caches refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh caches:", error);
  }
}
