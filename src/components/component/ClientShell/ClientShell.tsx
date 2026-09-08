"use client";

import NextDynamic from "next/dynamic";
import ServiceWorkerRegistrar from "@/components/component/ServiceWorkerRegistrar/ServiceWorkerRegistrar";
import CacheInitializer from "@/components/CacheInitializer";
import ArtistPrecacher from "@/components/ArtistPrecacher";

// Only load truly essential interactive components
const DarkTheme = NextDynamic(
  () => import("@/components/component/DarkTheme/DarkTheme"),
  { ssr: false, loading: () => null }
);

// AI Assistant - load on interaction only
const AIAssistant = NextDynamic(
  () => import("@/components/component/AIAssistant/AIAssistant"),
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

export default function ClientShell() {
  return (
    <>
      <ServiceWorkerRegistrar />
      <CacheInitializer />
      <ArtistPrecacher />
      <DarkTheme />
      <AIAssistant />
      {process.env.NODE_ENV !== "production" && <PerformanceMonitor />}
    </>
  );
}
