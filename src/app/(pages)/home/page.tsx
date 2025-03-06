import ContributeLyrics from "@/components/component/ContributeLyrics/ContributeLyrics";
import FeaturedLyrics from "@/components/component/FeaturedLyrics/FeaturedLyrics";
import PopularArtists from "@/components/component/PopularArtists/PopularArtists";
import TopLyrics from "@/components/component/TopLyrics/toplyrics";
import { IArtists } from "@/models/IObjects";

const fetchArtistsWithSongCount = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`, {
      next: { revalidate: 60 },
      // cache: "force-cache",
    });

    if (!res.ok) return [];

    const artists = await res.json();
    if (artists.length === 0) return [];

    // Fetch song counts
    const artistIds = artists.map((artist: IArtists) => artist._id).join(",");
    const countRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/artist/lyricscount?artistIds=${artistIds}`
    );

    if (!countRes.ok)
      return artists.map((artist: IArtists) => ({ ...artist, songCount: 0 }));

    const songCounts = await countRes.json();

    // Merge song counts with artists
    return artists.map((artist: IArtists) => ({
      ...artist,
      songCount: songCounts[artist._id] ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching artists with song counts:", error);
    return [];
  }
};

const fetchFeaturedLyrics = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?limit=2`,
      {
        next: { revalidate: 60 },
        // cache: "force-cache",
      }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching featured lyrics:", error);
    return [];
  }
};

const fetchTopLyrics = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lyrics`, {
      next: { revalidate: 60 },
      // cache: "force-cache",
    });
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching top lyrics:", error);
    return [];
  }
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
