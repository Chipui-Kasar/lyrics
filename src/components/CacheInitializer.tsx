"use client";

import { useEffect } from "react";

export default function CacheInitializer() {
  useEffect(() => {
    console.log("🚀 Cache system initialized");

    // Don't run any background syncs - let pages handle their own data
    // This component is now a placeholder for future cache initialization
    // Removed expensive syncAllData calls that were causing slow navigation
    
  }, []);

  return null; // This component doesn't render anything
}
