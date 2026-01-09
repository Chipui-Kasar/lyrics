"use client";

import NextDynamic from "next/dynamic";

// Defer client-only utilities to reduce First Load JS
const AIAssistant = NextDynamic(
  () => import("@/components/component/AIAssistant/AIAssistant"),
  { ssr: false, loading: () => null }
);
const DarkTheme = NextDynamic(
  () => import("@/components/component/DarkTheme/DarkTheme"),
  { ssr: false, loading: () => null }
);
const PageLoader = NextDynamic(
  () => import("@/components/component/Spinner/Spinner"),
  { ssr: false, loading: () => null }
);
// Dev-only monitoring (not needed in production)
const PerformanceMonitor =
  process.env.NODE_ENV !== "production"
    ? NextDynamic(
        () =>
          import(
            "@/components/component/PerformanceMonitor/PerformanceMonitor"
          ),
        { ssr: false, loading: () => null }
      )
    : () => null;

const ServiceWorkerErrorHandler = NextDynamic(
  () =>
    import(
      "@/components/component/ServiceWorkerErrorHandler/ServiceWorkerErrorHandler"
    ),
  { ssr: false, loading: () => null }
);
const ServiceWorkerRegistrar = NextDynamic(
  () =>
    import(
      "@/components/component/ServiceWorkerRegistrar/ServiceWorkerRegistrar"
    ),
  { ssr: false, loading: () => null }
);
const BackForwardCacheOptimizer = NextDynamic(
  () =>
    import(
      "@/components/component/BackForwardCacheOptimizer/BackForwardCacheOptimizer"
    ),
  { ssr: false, loading: () => null }
);
const LCPOptimizer = NextDynamic(
  () => import("@/components/component/LCPOptimizer/LCPOptimizer"),
  { ssr: false, loading: () => null }
);
const OfflineIndicator = NextDynamic(
  () => import("@/components/ui/OfflineIndicator"),
  { ssr: false, loading: () => null }
);
const OfflineCacheManager = NextDynamic(
  () =>
    import("@/components/component/OfflineCacheManager/OfflineCacheManager"),
  { ssr: false, loading: () => null }
);

export default function ClientShell() {
  return (
    <>
      <AIAssistant />
      <LCPOptimizer />
      <BackForwardCacheOptimizer />
      <ServiceWorkerErrorHandler />
      <ServiceWorkerRegistrar />
      <OfflineCacheManager />
      <PerformanceMonitor />
      <DarkTheme />
      <PageLoader />
      <OfflineIndicator />
    </>
  );
}
