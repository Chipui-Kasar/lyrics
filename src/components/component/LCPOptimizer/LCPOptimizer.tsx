"use client";

import { useEffect } from "react";

export default function LCPOptimizer() {
  useEffect(() => {
    // Monitor LCP and optimize
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);

          // If LCP is slow, try to optimize
          if (entry.startTime > 2500) {
            // Hide non-critical content until LCP is complete
            const belowFoldElements = document.querySelectorAll(".below-fold");
            belowFoldElements.forEach((el) => {
              (el as HTMLElement).style.contentVisibility = "auto";
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Create high-priority resource hints
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.href = "/api/lyrics?featured=true&limit=3";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    };

    // Only preload if we're on a fast connection
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType !== "slow-2g") {
        preloadCriticalResources();
      }
    } else {
      preloadCriticalResources();
    }

    // Optimize font loading for LCP
    const optimizeFonts = () => {
      const fontLink = document.createElement("link");
      fontLink.rel = "preload";
      fontLink.as = "font";
      fontLink.type = "font/woff2";
      fontLink.href =
        "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2";
      fontLink.crossOrigin = "anonymous";
      document.head.appendChild(fontLink);
    };

    optimizeFonts();

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
