import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { generatePageMetadata } from "@/lib/utils";
import { IArtists, ILyrics } from "@/models/IObjects";
import {
  getAllArtists,
  getSingleArtistWithSongCount,
} from "@/service/allartists";
import { cache } from "react";
export const revalidate = 604800;
// ✅ Fetch lyrics for a single artist
const fetchFeaturedLyrics = cache(async (artistName: string) => {
  return await getSingleArtistWithSongCount(artistName);
});

// ✅ Pre-generate static paths for all artists
export const generateStaticParams = async () => {
  const artists = await getAllArtists();
  return artists.map((artist: IArtists) => ({
    artists: artist.name?.toLowerCase(), // Ensure consistency in URL
  }));
};

// ✅ Generate Metadata for SEO
export async function generateMetadata(props: {
  params: Promise<{ artists: string }>;
}) {
  const params = await props.params;
  const artistData: ILyrics[] = await fetchFeaturedLyrics(params.artists);

  if (artistData.length === 0) {
    return generatePageMetadata({
      title: "Artist Lyrics Not Found - Tangkhul Lyrics",
      description:
        "The artist doesn't have any lyrics available. Try another artist.",
      url: `https://tangkhullyrics.com/artists/not-found`,
    });
  }

  return generatePageMetadata({
    title: `${artistData[0].artistId?.name} - Tangkhul Song Lyrics`,
    description: `Explore all song lyrics by ${artistData[0].artistId?.name} on Tangkhul Lyrics.`,
    url: `https://tangkhullyrics.com/artists/${artistData[0].artistId?.name?.toLowerCase()}`,
    keywords: `${artistData[0].artistId?.name}, Tangkhul songs, Tangkhul lyrics, ${artistData[0].artistId?.name} lyrics`,
  });
}

// ✅ Artist page (server component)
export default async function ArtistPage(props: {
  params: Promise<{ artists: string }>;
}) {
  const params = await props.params;
  const lyrics = await fetchFeaturedLyrics(params.artists);
  return <ArtistsSongLists lyrics={lyrics} />;
}
