"use client";

import { useEffect } from "react";
import { syncAllData } from "@/lib/cacheService";

export default function CacheInitializer() {
  useEffect(() => {
    console.log("🚀 Cache system initialized");

    // Don't run initial sync - let pages handle their own data
    // This prevents unnecessary API calls on app start

    // Set up periodic background sync (every 5 minutes)
    // Only syncs if cache is stale (older than 5 minutes)
    const syncInterval = setInterval(() => {
      if (typeof window !== "undefined" && navigator.onLine) {
        console.log("⏰ Periodic sync check...");
        syncAllData(false); // false = only sync if stale
      }
    }, 5 * 60 * 1000);

    // Sync when user comes back online
    const handleOnline = () => {
      console.log("🌐 Network connection restored, syncing data...");
      syncAllData(true); // true = force sync
    };

    // Handle visibility change - sync when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        console.log("👁️ Tab became visible, checking for updates...");
        syncAllData(false);
      }
    };

    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
