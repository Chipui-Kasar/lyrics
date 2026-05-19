import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { generatePageMetadata, slugMaker, removeSlug } from "@/lib/utils";
import { permanentRedirect, notFound } from "next/navigation";
import { ILyrics, IArtists } from "@/models/IObjects";
import {
  getAllArtists,
  getSingleArtistWithSongCount,
} from "@/service/allartists";
import { cache } from "react";

export const dynamic = "force-static";
export const dynamicParams = true; // ISR for newly added artists not in build
export const revalidate = 604800; // 1 week

// Cache the lyrics fetch per artist
const fetchFeaturedLyrics = cache(async (artistName: string) => {
  return await getSingleArtistWithSongCount(removeSlug(artistName));
});

export async function generateStaticParams() {
  try {
    const artists = await getAllArtists();
    return (artists as IArtists[])
      .filter((a) => a.name)
      .map((a) => ({ artists: slugMaker(a.name) }));
  } catch {
    return [];
  }
}

// ✅ Enhanced dynamic metadata generation with structured data
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

  const artistName = artistData[0].artistId?.name || "Unknown Artist";
  const songCount = artistData.length;

  return generatePageMetadata({
    title: `${artistName} - Tangkhul Songs & Lyrics Collection`,
    description: `Discover ${songCount} songs by ${artistName}. Explore traditional and contemporary Tangkhul music with complete lyrics and cultural context.`,
    url: `https://tangkhullyrics.com/artists/${slugMaker(artistName)}`,
    keywords: `${artistName}, Tangkhul songs, Tangkhul lyrics, ${artistName} lyrics, traditional music, Manipur music`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: artistName,
      genre: "Traditional Music",
      url: `https://tangkhullyrics.com/artists/${slugMaker(artistName)}`,
      description: `Tangkhul artist with ${songCount} songs`,
      numberOfTracks: songCount,
      musicBy: {
        "@type": "Person",
        name: artistName,
      },
    },
  });
}

// ✅ Page component
export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artists: string }>;
}) {
  const resolvedParams = await params; // Resolve the promise to get the actual params
  
  // Ensure the URL uses the proper slug format
  const expectedSlug = slugMaker(resolvedParams.artists);
  if (resolvedParams.artists !== expectedSlug) {
    permanentRedirect(`/artists/${expectedSlug}`);
  }

  const lyrics = await fetchFeaturedLyrics(expectedSlug);
  
  if (!lyrics || lyrics.length === 0) {
    notFound();
  }

  return <ArtistsSongLists lyrics={lyrics} />;
}
