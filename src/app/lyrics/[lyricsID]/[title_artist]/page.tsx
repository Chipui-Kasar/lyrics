// app/lyrics/[lyricsID]/[title_artist]/page.tsx
import { notFound, permanentRedirect } from "next/navigation";
import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import {
  generatePageMetadata,
  replaceAllHTMLTagsWithSpace,
  sanitizeAndDeduplicateHTML,
  slugMaker,
  splitTitleArtistSlug,
  areEquivalentSlugs,
} from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getSingleLyrics, getLyricsPage } from "@/service/allartists";
import { cache } from "react";
import StructuredData from "@/components/StructureDataComponent";

export const dynamic = "force-static";
export const dynamicParams = true; // ISR for newly added lyrics not in build
export const revalidate = 31536000; // 1 year

const fetchLyric = cache(
  async (
    lyricsID: string,
    title: string,
    artist: string,
  ): Promise<ILyrics | null> => {
    return await getSingleLyrics(lyricsID, title, artist);
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lyricsID: string; title_artist: string }>;
}) {
  const resolvedParams = await params;
  const { title, artist } = splitTitleArtistSlug(resolvedParams.title_artist);
  const lyric = await fetchLyric(resolvedParams?.lyricsID, title, artist);

  if (!lyric) {
    return generatePageMetadata({
      title: "Lyrics Not Found",
      description: "Lyrics not available.",
      url: "https://tangkhullyrics.com/lyrics/not-found",
    });
  }

  const songTitle = lyric.title || "Untitled";
  const artistName = lyric.artistId?.name || "Unknown Artist";
  const albumName = lyric.album || "Single";
  const artistUrl = `https://tangkhullyrics.com/artists/${slugMaker(artistName)}`;
  const lyricsPreview =
    replaceAllHTMLTagsWithSpace(
      sanitizeAndDeduplicateHTML(lyric.lyrics),
    )?.slice(0, 155) || "Traditional Tangkhul song";

  return generatePageMetadata({
    title: `${songTitle} Lyrics — ${artistName}`,
    description: `Complete lyrics to "${songTitle}" by ${artistName}${albumName !== "Single" ? ` from ${albumName}` : ""}. ${lyricsPreview}`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
      songTitle,
    )}_${slugMaker(artistName)}`,
    image: `${
      lyric.thumbnail && lyric.thumbnail !== ""
        ? lyric.thumbnail
        : (lyric.artistId?.image ?? "/ogImage.jpg")
    }`,
    keywords: `${songTitle}, ${artistName}, ${albumName}, Tangkhul song lyrics translation, Tangkhul lyrics, Tangkhul songs, traditional music, ${songTitle} lyrics, ${artistName} songs`,
    ogType: "music.song",
    other: {
      "music:musician": artistUrl,
      ...(lyric.releaseYear ? { "music:release_date": `${lyric.releaseYear}` } : {}),
    },
  });
}

const LyricsPage = async ({
  params,
}: {
  params: Promise<{ lyricsID: string; title_artist: string }>;
}) => {
  const resolvedParams = await params;
  const { title, artist } = splitTitleArtistSlug(resolvedParams.title_artist);
  const lyric = await fetchLyric(resolvedParams?.lyricsID, title, artist);

  if (!lyric) {
    notFound();
  }

  const songTitle = lyric.title || "Untitled";
  const artistName = lyric.artistId?.name || "Unknown Artist";
  const artistSlug = slugMaker(artistName);
  const artistUrl = `https://tangkhullyrics.com/artists/${artistSlug}`;

  // Ensure the URL uses the proper slug format
  const expectedSlug = `${slugMaker(songTitle)}_${artistSlug}`;
  if (!areEquivalentSlugs(resolvedParams.title_artist, expectedSlug)) {
    permanentRedirect(`/lyrics/${lyric._id}/${expectedSlug}`);
  }

  const lyricsUrl = `https://tangkhullyrics.com/lyrics/${lyric._id}/${expectedSlug}`;
  const plainLyrics = replaceAllHTMLTagsWithSpace(
    sanitizeAndDeduplicateHTML(lyric.lyrics),
  ) || "";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: songTitle,
    composer: {
      "@type": "Person",
      name: artistName,
    },
    lyricist: {
      "@type": "Person",
      name: artistName,
    },
    byArtist: {
      "@type": "MusicArtist",
      name: artistName,
      url: artistUrl,
      ...(lyric.artistId?.image ? { image: lyric.artistId.image } : {}),
    },
    ...(lyric.album && lyric.album !== "Single"
      ? {
          inAlbum: {
            "@type": "MusicAlbum",
            name: lyric.album,
            byArtist: {
              "@type": "MusicArtist",
              name: artistName,
              url: artistUrl,
            },
          },
        }
      : {}),
    lyrics: {
      "@type": "CreativeWork",
      text: plainLyrics,
      inLanguage: "tkh",
    },
    genre: "Traditional Music",
    inLanguage: "tkh",
    description: `Traditional Tangkhul song "${songTitle}" by ${artistName} | Tangkhul Lyrics | Tangkhul lyrics translation`,
    url: lyricsUrl,
    datePublished: lyric.createdAt || new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Tangkhul Lyrics",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tangkhullyrics.com" },
      { "@type": "ListItem", position: 2, name: "Lyrics", item: "https://tangkhullyrics.com/lyrics" },
      { "@type": "ListItem", position: 3, name: songTitle, item: lyricsUrl },
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData data={breadcrumbSchema} />
      <Lyrics lyrics={lyric} />
    </>
  );
};

export async function generateStaticParams() {
  try {
    // Fetch all lyrics in one shot — only summary fields needed for params
    const { items, pagination } = await getLyricsPage({
      page: 1,
      limit: 1000,
      fields: "summary",
    });

    // If there are more pages, fetch them all
    const allItems = [...items];
    if (pagination.totalPages > 1) {
      const remaining = await Promise.all(
        Array.from({ length: pagination.totalPages - 1 }, (_, i) =>
          getLyricsPage({ page: i + 2, limit: 1000, fields: "summary" })
        )
      );
      remaining.forEach((r) => allItems.push(...r.items));
    }

    return allItems
      .filter((post: ILyrics) => post._id && post.artistId?.name)
      .map((post: ILyrics) => ({
        lyricsID: String(post._id),
        title_artist: `${slugMaker(post.title)}_${slugMaker(post.artistId?.name || "unknown")}`,
      }));
  } catch {
    return [];
  }
}

export default LyricsPage;
