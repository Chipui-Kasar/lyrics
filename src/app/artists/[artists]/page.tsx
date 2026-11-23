import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import StructuredData from "@/components/StructureDataComponent";
import {
  generatePageMetadata,
  generateArtistBio,
  slugMaker,
  removeSlug,
} from "@/lib/utils";
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

  const artistBio =
    artistData[0].artistId?.bio ||
    generateArtistBio({
      name: artistName,
      songCount,
      songs: artistData.map((l) => ({
        title: l.title,
        releaseYear: l.releaseYear,
      })),
    });

  return generatePageMetadata({
    title: `${artistName} - Tangkhul Songs & Lyrics Collection`,
    description: artistBio,
    url: `https://tangkhullyrics.com/artists/${slugMaker(artistName)}`,
    keywords: `${artistName}, Tangkhul songs, Tangkhul lyrics, ${artistName} lyrics, traditional music, Manipur music`,
    ogType: "profile",
    other: {
      "profile:username": slugMaker(artistName),
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: artistName,
      genre: "Traditional Music",
      url: `https://tangkhullyrics.com/artists/${slugMaker(artistName)}`,
      description: artistBio,
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
  // Next.js leaves non-ASCII params percent-encoded (e.g. "kashy%C3%A9alo"),
  // while slugMaker returns the decoded form ("kashyéalo"). Compare decoded
  // values, otherwise accented slugs redirect to themselves forever.
  const expectedSlug = slugMaker(resolvedParams.artists);
  let currentSlug = resolvedParams.artists;
  try {
    currentSlug = decodeURIComponent(currentSlug);
  } catch {
    // keep raw value
  }
  if (currentSlug !== expectedSlug) {
    permanentRedirect(`/artists/${encodeURIComponent(expectedSlug)}`);
  }

  const lyrics = await fetchFeaturedLyrics(expectedSlug);

  if (!lyrics || lyrics.length === 0) {
    notFound();
  }

  const artistName = lyrics[0]?.artistId?.name || "Unknown Artist";
  const artistSlug = slugMaker(artistName);
  const artistUrl = `https://tangkhullyrics.com/artists/${artistSlug}`;

  const musicGroupSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artistName,
    url: artistUrl,
    track: lyrics.map((l: ILyrics) => ({
      "@type": "MusicRecording",
      name: l.title,
      url: `https://tangkhullyrics.com/lyrics/${l._id}/${slugMaker(l.title)}_${artistSlug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tangkhullyrics.com" },
      { "@type": "ListItem", position: 2, name: "Artists", item: "https://tangkhullyrics.com/allartists" },
      { "@type": "ListItem", position: 3, name: artistName, item: artistUrl },
    ],
  };

  return (
    <>
      <StructuredData data={musicGroupSchema} />
      <StructuredData data={breadcrumbSchema} />
      <ArtistsSongLists lyrics={lyrics} />
    </>
  );
}
