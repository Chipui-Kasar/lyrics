"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag: any;
  }
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Track Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "largest-contentful-paint") {
            const lcp = entry.startTime;
            if (window.gtag) {
              window.gtag("event", "LCP", {
                event_category: "Web Vitals",
                value: Math.round(lcp),
                custom_parameter_1:
                  lcp < 2500
                    ? "good"
                    : lcp < 4000
                    ? "needs_improvement"
                    : "poor",
              });
            }
          }

          if (entry.entryType === "first-input") {
            const fid = (entry as any).processingStart - entry.startTime;
            if (window.gtag) {
              window.gtag("event", "FID", {
                event_category: "Web Vitals",
                value: Math.round(fid),
                custom_parameter_1:
                  fid < 100 ? "good" : fid < 300 ? "needs_improvement" : "poor",
              });
            }
          }
        });
      });

      // Observe LCP and FID
      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input"],
      });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      let clsEntries: any[] = [];

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry);
            clsValue += (entry as any).value;
          }
        }
      });

      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // Report CLS when page becomes hidden
      const reportCLS = () => {
        if (window.gtag && clsValue > 0) {
          window.gtag("event", "CLS", {
            event_category: "Web Vitals",
            value: Math.round(clsValue * 1000),
            custom_parameter_1:
              clsValue < 0.1
                ? "good"
                : clsValue < 0.25
                ? "needs_improvement"
                : "poor",
          });
        }
      };

      document.addEventListener("visibilitychange", reportCLS);
      window.addEventListener("beforeunload", reportCLS);

      return () => {
        observer.disconnect();
        clsObserver.disconnect();
        document.removeEventListener("visibilitychange", reportCLS);
        window.removeEventListener("beforeunload", reportCLS);
      };
    }
  }, []);

  return null;
}
