import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { IArtists } from "@/models/IObjects";
import {
  getAllArtists,
  getSingleArtistWithSongCount,
} from "@/service/allartists";

// Fetch lyrics for a single artist
const fetchFeaturedLyrics = async (artistName: string) => {
  return await getSingleArtistWithSongCount(artistName);
};

// ✅ Pre-generate static paths for all artists
export const generateStaticParams = async () => {
  const artists = await getAllArtists();
  return artists.map((artist: IArtists) => ({
    artists: artist.name.toLowerCase(), // Ensure consistency in URL
  }));
};

// ✅ Artist page (server component)
export default async function ArtistPage({
  params,
}: {
  params: { artists: string };
}) {
  const lyrics = await fetchFeaturedLyrics(params.artists);
  return <ArtistsSongLists lyrics={lyrics} />;
}
