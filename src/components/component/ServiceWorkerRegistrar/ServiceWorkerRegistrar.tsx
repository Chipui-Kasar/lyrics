"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        // Register only in production; allow manual override via env
        const isProd = process.env.NODE_ENV === "production";
        if (!isProd) return;

        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        // Optional: listen for updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            // Can postMessage to clients if needed
          });
        });
      } catch (err) {
        // Errors are handled by ServiceWorkerErrorHandler
        console.warn("SW registration failed", err);
      }
    };

    register();
    return () => {};
  }, []);

  return null;
}
