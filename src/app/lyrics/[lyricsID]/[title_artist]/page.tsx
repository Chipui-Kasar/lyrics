// app/lyrics/[lyricsID]/[title_artist]/page.tsx

import { notFound } from "next/navigation";
import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import { generatePageMetadata, slugMaker } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";
import { cache } from "react";

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

// ✅ FIXED: No Promise<> on params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lyricsID: string; title_artist: string }>;
}) {
  const resolvedParams = await params; // Resolve the promise to get the actual params
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
    lyric.lyrics?.slice(0, 140) || "Traditional Tangkhul song";

  return generatePageMetadata({
    title: `${songTitle} by ${artistName} - Lyrics & Meaning`,
    description: `${lyricsPreview}... - Complete lyrics to "${songTitle}" by ${artistName} from ${albumName}. Traditional Tangkhul music with cultural context.`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
      songTitle
    )}_${slugMaker(artistName)}`,
    image: `${lyric.thumbnail ?? lyric.artistId?.image ?? "/ogImage.jpg"}`,
    keywords: `${songTitle}, ${artistName}, ${albumName}, Tangkhul lyrics, Tangkhul songs, traditional music, ${songTitle} lyrics, ${artistName} songs`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MusicComposition",
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
      description: `Traditional Tangkhul song "${songTitle}" by ${artistName}`,
      url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
        songTitle
      )}_${slugMaker(artistName)}`,
      datePublished: lyric.createdAt || new Date().toISOString(),
      publisher: {
        "@type": "Organization",
        name: "Tangkhul Lyrics",
      },
    },
  });
}

// ✅ FIXED: No Promise<> on params
const LyricsPage = async ({
  params,
}: {
  params: Promise<{ lyricsID: string; title_artist: string }>;
}) => {
  const resolvedParams = await params; // Resolve the promise to get the actual params
  const [title, artist] = resolvedParams.title_artist.split("_");
  const lyric = await fetchLyric(resolvedParams?.lyricsID, title, artist);

  if (!lyric) {
    notFound();
  }

  return <Lyrics lyrics={lyric} />;
};

export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    lyricsID: post._id,
    title_artist: `${slugMaker(post.title)}_${slugMaker(post.artistId?.name)}`,
  }));
}

export default LyricsPage;
