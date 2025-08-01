"use client";

import { useEffect } from "react";

export default function ServiceWorkerErrorHandler() {
  useEffect(() => {
    // Handle service worker errors globally
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes("Cache")) {
        console.warn("Service worker cache error suppressed:", event.message);
        event.preventDefault();
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        (event.reason.message?.includes("Cache") ||
          event.reason.message?.includes("Failed to execute 'put' on 'Cache'"))
      ) {
        console.warn(
          "Service worker promise rejection suppressed:",
          event.reason
        );
        event.preventDefault();
        return true;
      }
    };

    // Add global error handlers
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return null; // This component doesn't render anything
}
