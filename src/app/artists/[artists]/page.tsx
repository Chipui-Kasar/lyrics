import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { generatePageMetadata, slugMaker, removeSlug } from "@/lib/utils";
import { IArtists, ILyrics } from "@/models/IObjects";
import {
  getAllArtists,
  getSingleArtistWithSongCount,
} from "@/service/allartists";
import { cache } from "react";

// Make the route statically rendered and revalidated weekly
export const dynamic = "force-static";
export const revalidate = 300;

// Cache the lyrics fetch per artist
const fetchFeaturedLyrics = cache(async (artistName: string) => {
  return await getSingleArtistWithSongCount(removeSlug(artistName));
});

// ✅ Pre-generate all artist paths for SSG
export async function generateStaticParams() {
  const artists = await getAllArtists();
  return artists.map((artist: IArtists) => ({
    artists: slugMaker(artist.name?.toLowerCase() || ""),
  }));
}

// ✅ Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ artists: string }>;
}) {
  const artists = await params; // Resolve the promise to get the actual params
  const artistData: ILyrics[] = await fetchFeaturedLyrics(artists.artists);

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

// ✅ Page component
export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artists: string }>;
}) {
  const resolvedParams = await params; // Resolve the promise to get the actual params
  const lyrics = await fetchFeaturedLyrics(resolvedParams.artists);
  return <ArtistsSongLists lyrics={lyrics} />;
}
