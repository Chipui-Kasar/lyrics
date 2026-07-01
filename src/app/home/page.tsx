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
    title: "Tangkhul Lyrics | Song Lyrics, Artists & Cultural Music",
    description:
      "Browse 1000+ authentic Tangkhul song lyrics. Discover trending hits, traditional favorites and new releases from top Tangkhul artists with cultural context.",
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
        target: "https://tangkhullyrics.com/search?query={search_term_string}",
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
          Tangkhul Song Lyrics — Preserving Culture Through Music
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 grid gap-4">
            <section className="below-fold non-critical">
              <PopularArtists
                artists={artists.filter(
                  (artist: IArtists) => artist.name !== "Pamching Kasar",
                )}
              />
            </section>
          </div>
          <aside className="col-span-2 md:col-span-2 lg:col-span-1 below-fold non-critical">
            <section className="critical-path mb-6">
              <FeaturedLyrics lyrics={featuredLyrics} />
            </section>
            <TopLyrics lyrics={topLyrics} />
          </aside>
        </div>
      </section>
      <section className="below-fold non-critical">
        <ContributeLyrics headingLevel="h2" />
      </section>
    </div>
  );
};

export default HomePage;
