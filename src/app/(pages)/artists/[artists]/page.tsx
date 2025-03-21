import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { generatePageMetadata } from "@/lib/utils";
import { IArtists } from "@/models/IObjects";
import {
  getAllArtists,
  getSingleArtistWithSongCount,
} from "@/service/allartists";

// ✅ Fetch lyrics for a single artist
const fetchFeaturedLyrics = async (artistName: string) => {
  return await getSingleArtistWithSongCount(artistName);
};

// ✅ Pre-generate static paths for all artists
export const generateStaticParams = async () => {
  const artists = await getAllArtists();
  return artists.map((artist: IArtists) => ({
    artists: artist.name?.toLowerCase(), // Ensure consistency in URL
  }));
};

// ✅ Generate Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { artists: string };
}) {
  const artistData = await fetchFeaturedLyrics(params.artists);

  if (!artistData) {
    return generatePageMetadata({
      title: "Artist Not Found - Tangkhul Lyrics",
      description: "The artist you are looking for is not available.",
      url: `https://tangkhullyrics.com/artists/not-found`,
    });
  }

  return generatePageMetadata({
    title: `${artistData.name} - Tangkhul Song Lyrics`,
    description: `Explore all song lyrics by ${artistData.name} on Tangkhul Lyrics.`,
    url: `https://tangkhullyrics.com/artists/${artistData.name?.toLowerCase()}`,
    keywords: `${artistData.name}, Tangkhul songs, Tangkhul lyrics, ${artistData.name} lyrics`,
  });
}

// ✅ Artist page (server component)
export default async function ArtistPage({
  params,
}: {
  params: { artists: string };
}) {
  const lyrics = await fetchFeaturedLyrics(params.artists);
  return <ArtistsSongLists lyrics={lyrics} />;
}
