import { generatePageMetadata } from "@/lib/utils";
import { IArtists } from "@/models/IObjects";
import {
  getAllArtists,
  getFeaturedLyrics,
  getTopLyrics,
} from "@/service/allartists";
import PromotionalBanner from "@/components/component/PromotionalBanner/PromotionalBanner";
import FeaturedLyrics from "@/components/component/FeaturedLyrics/FeaturedLyrics";
import PopularArtists from "@/components/component/PopularArtists/PopularArtists";
import TopLyrics from "@/components/component/TopLyrics/toplyrics";
import ContributeLyrics from "@/components/component/ContributeLyrics/ContributeLyrics";

export const dynamic = "force-static";
// PERFORMANCE FIX: Increased from 300s to reduce ISR writes
// Featured/top content doesn't change frequently enough to justify 5-minute cache
export const revalidate = 1800; // 30 minutes

const fetchHomeData = async () => {
  try {
    // Prioritize featured content for LCP optimization
    const [featuredLyrics, [artists, topLyrics]] = await Promise.all([
      getFeaturedLyrics(), // Critical for LCP
      Promise.all([
        getAllArtists(),
        getTopLyrics(13), // Reduced from 13 for faster loading
      ]),
    ]);
    return [artists, featuredLyrics, topLyrics];
  } catch (error) {
    console.error("Error fetching home data:", error);
    return [[], [], []];
  }
};

export async function generateMetadata() {
  return generatePageMetadata({
    title:
      "Tangkhul Lyrics - Best Collection of Tangkhul Songs & Artists | Cultural Music Heritage",
    description:
      "🎵 Discover 1000+ authentic Tangkhul song lyrics online. Browse trending hits, traditional favorites & new releases from top Tangkhul artists. Updated daily with accurate translations. Preserve cultural heritage through music!",
    url: "https://tangkhullyrics.com",
    keywords:
      "Tangkhul lyrics, Tangkhul songs, Tangkhul music, Northeast India songs, Manipur tribal music, traditional songs, cultural heritage, song translations, Tangkhul artists, folk music, indigenous music, ethnic songs",
    image: "/ogImage.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Tangkhul Lyrics",
      description: "Best collection of Tangkhul song lyrics and cultural music",
      url: "https://tangkhullyrics.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://tangkhullyrics.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  });
}

const HomePage = async () => {
  const [artists, featuredLyrics, topLyrics] = await fetchHomeData();

  return (
    <div className="flex min-h-screen flex-col first-paint">
      {/* Lazy load promotional banner for better LCP */}
      <PromotionalBanner />

      <section
        className="critical-path above-fold container py-4 sm:py-6 md:py-8 m-auto"
        role="main"
      >
        <h1 className="sr-only">
          Tangkhul Song Lyrics - Cultural Through Music
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 grid gap-4">
            <section
              aria-labelledby="featured-lyrics-heading"
              className="critical-path"
            >
              <h2 id="featured-lyrics-heading" className="sr-only">
                Featured Tangkhul Song Lyrics
              </h2>
              <FeaturedLyrics lyrics={featuredLyrics} />
            </section>
            <section
              aria-labelledby="popular-artists-heading"
              className="below-fold non-critical"
            >
              <h2 id="popular-artists-heading" className="sr-only">
                Popular Tangkhul Artists
              </h2>
              <PopularArtists
                artists={artists.filter(
                  (artist: IArtists) => artist.name !== "Pamching Kasar"
                )}
              />
            </section>
          </div>
          <aside
            aria-labelledby="top-lyrics-heading"
            className="col-span-2 md:col-span-2 lg:col-span-1 below-fold"
          >
            <h2 id="top-lyrics-heading" className="sr-only">
              Top Tangkhul Song Lyrics
            </h2>
            <TopLyrics lyrics={topLyrics} />
          </aside>
        </div>
      </section>
      <section
        aria-labelledby="contribute-heading"
        className="below-fold non-critical"
      >
        <h2 id="contribute-heading" className="sr-only">
          Contribute Tangkhul Song Lyrics
        </h2>
        <ContributeLyrics />
      </section>
    </div>
  );
};

export default HomePage;
