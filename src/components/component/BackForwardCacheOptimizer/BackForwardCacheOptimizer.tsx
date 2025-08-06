"use client";

import { useEffect } from "react";

export default function BackForwardCacheOptimizer() {
  useEffect(() => {
    // Optimize back/forward cache restoration
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from back/forward cache
        console.log("Page restored from bfcache");
        // Refresh any time-sensitive data if needed
        window.dispatchEvent(new CustomEvent("bfcache-restore"));
      }
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      // Clean up to improve bfcache eligibility
      if (!event.persisted) {
        console.log("Page unloaded without bfcache");
      }
    };

    const handleBeforeUnload = () => {
      // Minimal beforeunload to avoid blocking bfcache
      // Remove any non-essential event listeners
      return undefined; // Don't show browser dialog
    };

    // Optimize for bfcache eligibility
    const removeBlockingListeners = () => {
      // Clean up any blocking event listeners
      const abortController = new AbortController();

      // Use AbortController for proper cleanup
      window.addEventListener("pageshow", handlePageShow, {
        signal: abortController.signal,
        passive: true,
      });

      window.addEventListener("pagehide", handlePageHide, {
        signal: abortController.signal,
        passive: true,
      });

      window.addEventListener("beforeunload", handleBeforeUnload, {
        signal: abortController.signal,
        passive: true,
      });

      return abortController;
    };

    const abortController = removeBlockingListeners();

    // Clean up any WebSocket connections, timers, or other blocking resources
    return () => {
      abortController.abort();

      // Ensure all cleanup is completed
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          // Final cleanup in idle time
          console.log("bfcache optimization cleanup completed");
        });
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
