import AllArtitsts from "@/components/component/AllArtists/AllArtitsts";
import { IArtists } from "@/models/IObjects";
export default async function AllArtistsPage() {
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
  const artists = await fetchArtistsWithSongCount();
  return <AllArtitsts artists={artists} />;
}
