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
      "Explore the best Tangkhul lyrics, featured songs, top artists, and contribute your own lyrics to the community.",
    url: "https://tangkhullyrics.com",
    keywords:
      "Tangkhul lyrics, Tangkhul songs, Tangkhul artists, contribute lyrics, top songs",
  });
}

const HomePage = async () => {
  const [artists, featuredLyrics, topLyrics] = await fetchHomeData();

  return (
    <div className="flex min-h-screen flex-col">
      <section className="container py-4 sm:py-8 md:py-10 m-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2 grid gap-4">
            <FeaturedLyrics lyrics={featuredLyrics} />
            <PopularArtists
              artists={artists.filter(
                (artist: IArtists) => artist.name !== "Pamching Kasar"
              )}
            />
          </div>
          <TopLyrics lyrics={topLyrics} />
        </div>
      </section>
      <ContributeLyrics />
    </div>
  );
};

export default HomePage;
