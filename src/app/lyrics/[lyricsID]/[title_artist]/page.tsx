// app/lyrics/[lyricsID]/[title_artist]/page.tsx

import { notFound } from "next/navigation";
import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import {
  generatePageMetadata,
  replaceAllHTMLTagsWithSpace,
  sanitizeAndDeduplicateHTML,
  slugMaker,
} from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";
import { cache } from "react";
import StructuredData from "@/components/StructureDataComponent";

export const dynamic = "force-static";
export const revalidate = 300; // 7 days

const fetchLyric = cache(
  async (
    lyricsID: string,
    title: string,
    artist: string
  ): Promise<ILyrics | null> => {
    return await getSingleLyrics(lyricsID, title, artist);
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lyricsID: string; title_artist: string }>;
}) {
  const resolvedParams = await params;
  const [title, artist] = resolvedParams.title_artist.split("_");
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
  const lyricsPreview =
    replaceAllHTMLTagsWithSpace(
      sanitizeAndDeduplicateHTML(lyric.lyrics)
    )?.slice(0, 155) || "Traditional Tangkhul song";

  return generatePageMetadata({
    title: `${songTitle} by ${artistName} - Lyrics | ${songTitle} Lyrics`,
    description: `${lyricsPreview}... - Complete lyrics to "${songTitle}" by ${artistName} from ${albumName}. Traditional Tangkhul music with cultural context. Tangkhul song lyrics translation`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
      songTitle
    )}_${slugMaker(artistName)}`,
    image: `${
      lyric.thumbnail && lyric.thumbnail !== ""
        ? lyric.thumbnail
        : lyric.artistId?.image ?? "/ogImage.jpg"
    }`,
    keywords: `${songTitle}, ${artistName}, ${albumName}, Tangkhul song lyrics translation, Tangkhul lyrics, Tangkhul songs, traditional music, ${songTitle} lyrics, ${artistName} songs`,
  });
}

const LyricsPage = async ({
  params,
}: {
  params: Promise<{ lyricsID: string; title_artist: string }>;
}) => {
  const resolvedParams = await params;
  const [title, artist] = resolvedParams.title_artist.split("_");
  const lyric = await fetchLyric(resolvedParams?.lyricsID, title, artist);

  if (!lyric) {
    notFound();
  }

  const songTitle = lyric.title || "Untitled";
  const artistName = lyric.artistId?.name || "Unknown Artist";

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
    genre: "Traditional Music",
    inLanguage: "tkh",
    description: `Traditional Tangkhul song "${songTitle}" by ${artistName} | Tangkhul Lyrics | Tangkhul lyrics translation`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
      songTitle
    )}_${slugMaker(artistName)}`,
    datePublished: lyric.createdAt || new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Tangkhul Lyrics",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <Lyrics lyrics={lyric} />
    </>
  );
};

export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts
    .filter((post: ILyrics) => post.artistId?.name) // Filter out posts without artist names
    .map((post: ILyrics) => ({
      lyricsID: post._id,
      title_artist: `${slugMaker(post.title)}_${slugMaker(
        post.artistId?.name || "unknown"
      )}`,
    }));
}

export default LyricsPage;
