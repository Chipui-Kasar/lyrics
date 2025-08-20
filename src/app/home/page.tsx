import { generatePageMetadata } from "@/lib/utils";
import { IArtists } from "@/models/IObjects";
import {
  getAllArtists,
  getFeaturedLyrics,
  getTopLyrics,
} from "@/service/allartists";
import { Suspense, lazy } from "react";
import { HomeComponentSkeleton } from "@/components/ui/skeleton";
import PromotionalBanner from "@/components/component/PromotionalBanner/PromotionalBanner";

// Lazy load components to reduce initial bundle size
const FeaturedLyrics = lazy(
  () => import("@/components/component/FeaturedLyrics/FeaturedLyrics")
);
const PopularArtists = lazy(
  () => import("@/components/component/PopularArtists/PopularArtists")
);
const TopLyrics = lazy(
  () => import("@/components/component/TopLyrics/toplyrics")
);
const ContributeLyrics = lazy(
  () => import("@/components/component/ContributeLyrics/ContributeLyrics")
);

export const dynamic = "force-static";
export const revalidate = 300;

const fetchHomeData = async () => {
  try {
    return await Promise.all([
      getAllArtists(),
      getFeaturedLyrics(),
      getTopLyrics(13),
    ]);
  } catch (error) {
    console.error("Error fetching home data:", error);
    return [[], [], []];
  }
};

export async function generateMetadata() {
  return generatePageMetadata({
    title:
      "Tangkhul Lyrics - Find Your Favorite Tangkhul Songs and Artists | Tangkhul Lyrics Translation",
    description:
      "Discover the largest collection of Tangkhul song lyrics online. Browse featured songs, top artists, and contribute your own lyrics to preserve cultural. | Tangkhul Lyrics Translation",
    url: "https://tangkhullyrics.com",
    keywords:
      "Tangkhul lyrics, Tangkhul songs, Tangkhul artists, contribute lyrics, top songs, Manipur music, Northeast India songs, tribal music | Tangkhul Lyrics Translation",
  });
}

const HomePage = async () => {
  const [artists, featuredLyrics, topLyrics] = await fetchHomeData();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Full Width Promotional Banner */}
      <PromotionalBanner />
      <section
        className="above-fold container py-4 sm:py-6 md:py-8 m-auto"
        role="main"
      >
        <h1 className="sr-only">
          Tangkhul Song Lyrics - Cultural Through Music
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 grid gap-4">
            <section aria-labelledby="featured-lyrics-heading">
              <h2 id="featured-lyrics-heading" className="sr-only">
                Featured Tangkhul Song Lyrics
              </h2>
              <Suspense fallback={<HomeComponentSkeleton />}>
                <FeaturedLyrics lyrics={featuredLyrics} />
              </Suspense>
            </section>
            <section
              aria-labelledby="popular-artists-heading"
              className="below-fold"
            >
              <h2 id="popular-artists-heading" className="sr-only">
                Popular Tangkhul Artists
              </h2>
              <Suspense fallback={<HomeComponentSkeleton />}>
                <PopularArtists
                  artists={artists.filter(
                    (artist: IArtists) => artist.name !== "Pamching Kasar"
                  )}
                />
              </Suspense>
            </section>
          </div>
          <aside
            aria-labelledby="top-lyrics-heading"
            className="col-span-2 md:col-span-2 lg:col-span-1"
          >
            <h2 id="top-lyrics-heading" className="sr-only">
              Top Tangkhul Song Lyrics
            </h2>
            <Suspense fallback={<HomeComponentSkeleton />}>
              <TopLyrics lyrics={topLyrics} />
            </Suspense>
          </aside>
        </div>
      </section>
      <section aria-labelledby="contribute-heading" className="below-fold">
        <h2 id="contribute-heading" className="sr-only">
          Contribute Tangkhul Song Lyrics
        </h2>
        <Suspense fallback={<HomeComponentSkeleton />}>
          <ContributeLyrics />
        </Suspense>
      </section>
    </div>
  );
};

export default HomePage;
