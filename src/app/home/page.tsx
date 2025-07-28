import ContributeLyrics from "@/components/component/ContributeLyrics/ContributeLyrics";
import FeaturedLyrics from "@/components/component/FeaturedLyrics/FeaturedLyrics";
import PopularArtists from "@/components/component/PopularArtists/PopularArtists";
import TopLyrics from "@/components/component/TopLyrics/toplyrics";
import { generatePageMetadata } from "@/lib/utils";
import { IArtists } from "@/models/IObjects";
import {
  getAllArtists,
  getFeaturedLyrics,
  getTopLyrics,
} from "@/service/allartists";

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
    title: "Tangkhul Lyrics - Find Your Favorite Tangkhul Songs",
    description:
      "Discover the largest collection of Tangkhul song lyrics online. Browse featured songs, top artists, and contribute your own lyrics to preserve cultural heritage.",
    url: "https://tangkhullyrics.com",
    keywords:
      "Tangkhul lyrics, Tangkhul songs, Tangkhul artists, contribute lyrics, top songs, Manipur music, Northeast India songs, tribal music",
  });
}

const HomePage = async () => {
  const [artists, featuredLyrics, topLyrics] = await fetchHomeData();

  return (
    <div className="flex min-h-screen flex-col">
      <section className="container py-4 sm:py-8 md:py-10 m-auto" role="main">
        <h1 className="sr-only">
          Tangkhul Song Lyrics - Cultural Heritage Through Music
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 grid gap-4">
            <section aria-labelledby="featured-lyrics-heading">
              <h2 id="featured-lyrics-heading" className="sr-only">
                Featured Tangkhul Song Lyrics
              </h2>
              <FeaturedLyrics lyrics={featuredLyrics} />
            </section>
            <section aria-labelledby="popular-artists-heading">
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
            className="col-span-2 md:col-span-2 lg:col-span-1 "
          >
            <h2 id="top-lyrics-heading" className="sr-only">
              Top Tangkhul Song Lyrics
            </h2>
            <TopLyrics lyrics={topLyrics} />
          </aside>
        </div>
      </section>
      <section aria-labelledby="contribute-heading">
        <h2 id="contribute-heading" className="sr-only">
          Contribute Tangkhul Song Lyrics
        </h2>
        <ContributeLyrics />
      </section>
    </div>
  );
};

export default HomePage;
