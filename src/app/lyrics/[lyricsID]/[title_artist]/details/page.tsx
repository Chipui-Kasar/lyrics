// app/lyrics/[lyricsID]/[title_artist]/details/page.tsx

import { notFound } from "next/navigation";
import SongDetails from "@/components/component/AllArtists/ArtistsSongList/SongDetails/SongDetails";
import {
  generatePageMetadata,
  replaceAllHTMLTagsWithSpace,
  sanitizeAndDeduplicateHTML,
  slugMaker,
  removeSlug,
} from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getSingleLyrics } from "@/service/allartists";
import { cache } from "react";

export const dynamic = "force-dynamic";
// export const revalidate = 300; // 5 minutes

// ✅ Cache DB fetches
const fetchLyric = cache(
  async (
    lyricsID: string,
    title: string,
    artist: string,
  ): Promise<ILyrics | null> => {
    return await getSingleLyrics(
      lyricsID,
      removeSlug(title),
      removeSlug(artist),
    );
  },
);

// ✅ Dynamic metadata generation
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
    replaceAllHTMLTagsWithSpace(
      sanitizeAndDeduplicateHTML(lyric.lyrics),
    )?.slice(0, 140) || "Traditional Tangkhul song";

  return generatePageMetadata({
    title: `${songTitle} by ${artistName} - Lyrics | ${songTitle} Details`,
    description: `${lyricsPreview}... - Complete lyrics to "${songTitle}" by ${artistName} from ${albumName}. Traditional Tangkhul music with cultural context. Tangkhul song lyrics translation`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
      songTitle,
    )}_${slugMaker(artistName)}/details`,
    image: `${
      lyric.thumbnail && lyric.thumbnail !== ""
        ? lyric.thumbnail
        : (lyric.artistId?.image ?? "/ogImage.jpg")
    }`,
    keywords: `${songTitle}, ${artistName}, ${albumName}, Tangkhul song lyrics translation, Tangkhul lyrics, Tangkhul songs, traditional music, ${songTitle} lyrics, ${artistName} songs`,
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
      description: `Traditional Tangkhul song "${songTitle}" by ${artistName} | Tangkhul Lyrics | Tangkhul lyrics translation`,
      url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
        songTitle,
      )}_${slugMaker(artistName)}/details`,
      datePublished: lyric.createdAt || new Date().toISOString(),
      publisher: {
        "@type": "Organization",
        name: "Tangkhul Lyrics",
      },
    },
  });
}

// ✅ Generate SSG params
// export async function generateStaticParams() {
//   const posts = await getLyrics();

//   return posts
//     .filter((post: ILyrics) => post.artistId?.name) // Filter out posts without artist names
//     .map((post: ILyrics) => ({
//       lyricsID: post._id,
//       title_artist: `${slugMaker(post.title)}_${slugMaker(
//         post.artistId?.name
//       )}`,
//     }));
// }

// ✅ Page Component
export default async function SongDetailsPage({
  params,
}: {
  params: Promise<{ lyricsID: string; title_artist: string }>;
}) {
  const resolvedParams = await params; // Resolve the promise to get the actual params
  const [title, artist] = resolvedParams.title_artist.split("_");
  const songLyrics = await fetchLyric(resolvedParams?.lyricsID, title, artist);

  if (!songLyrics) {
    notFound();
  }

  return <SongDetails songLyrics={songLyrics} />;
}
