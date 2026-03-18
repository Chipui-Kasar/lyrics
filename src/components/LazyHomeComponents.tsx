"use client";

import { lazy, Suspense } from "react";

// Lazy load heavy components with simpler imports
const ContributeLyrics = lazy(
  () => import("@/components/component/ContributeLyrics/ContributeLyrics")
);
const FeaturedLyrics = lazy(
  () => import("@/components/component/FeaturedLyrics/FeaturedLyrics")
);
const PopularArtists = lazy(
  () => import("@/components/component/PopularArtists/PopularArtists")
);
const TopLyrics = lazy(
  () => import("@/components/component/TopLyrics/toplyrics")
);

// Optimized loading fallback component with minimal CLS
const ComponentSkeleton = () => (
  <div className="animate-pulse min-h-[200px]">
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

export const LazyContributeLyrics = () => (
  <Suspense fallback={<ComponentSkeleton />}>
    <ContributeLyrics />
  </Suspense>
);

export const LazyFeaturedLyrics = ({
  featuredLyrics,
}: {
  featuredLyrics: any[];
}) => (
  <Suspense fallback={<ComponentSkeleton />}>
    <FeaturedLyrics lyrics={featuredLyrics} />
  </Suspense>
);

export const LazyPopularArtists = ({ artists }: { artists: any[] }) => (
  <Suspense fallback={<ComponentSkeleton />}>
    <PopularArtists artists={artists} />
  </Suspense>
);

export const LazyTopLyrics = ({ topLyrics }: { topLyrics: any[] }) => (
  <Suspense fallback={<ComponentSkeleton />}>
    <TopLyrics lyrics={topLyrics} />
  </Suspense>
);
