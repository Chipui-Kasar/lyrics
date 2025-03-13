import ContributeLyrics from "@/components/component/ContributeLyrics/ContributeLyrics";
import FeaturedLyrics from "@/components/component/FeaturedLyrics/FeaturedLyrics";
import PopularArtists from "@/components/component/PopularArtists/PopularArtists";
import TopLyrics from "@/components/component/TopLyrics/toplyrics";
import {
  getArtistsWithSongCount,
  getFeaturedLyrics,
  getTopLyrics,
} from "@/service/allartists";

const fetchArtistsWithSongCount = async () => {
  return await getArtistsWithSongCount();
};

const fetchFeaturedLyrics = async () => {
  return await getFeaturedLyrics();
};

const fetchTopLyrics = async () => {
  return await getTopLyrics();
};

const HomePage = async () => {
  const [artists, featuredLyrics, topLyrics] = await Promise.all([
    fetchArtistsWithSongCount(),
    fetchFeaturedLyrics(),
    fetchTopLyrics(),
  ]);

  return (
    <div className="flex min-h-screen flex-col dark:bg-background">
      <main className="flex-1">
        <section className="container py-4 sm:py-8 md:py-10 m-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 grid gap-4">
              <FeaturedLyrics lyrics={featuredLyrics} />
              <PopularArtists artists={artists} />
            </div>
            <TopLyrics lyrics={topLyrics} />
          </div>
        </section>
        <ContributeLyrics />
      </main>
    </div>
  );
};

export default HomePage;
