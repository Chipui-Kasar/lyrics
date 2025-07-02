// app/lyrics/[lyricsID]/[title_artist]/page.tsx

import { notFound } from "next/navigation";
import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import { generatePageMetadata, slugMaker } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";
import { cache } from "react";

export const dynamic = "force-static";
export const dynamicParams = false;
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

  return generatePageMetadata({
    title: `${lyric.title} by ${lyric.artistId?.name} | ${lyric?.album}`,
    description: `Read the lyrics of '${lyric.title}' by ${lyric.artistId?.name}.`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
      lyric.title
    )}_${slugMaker(lyric.artistId?.name)}`,
    image: `${lyric.thumbnail ?? lyric.artistId?.image ?? "/ogImage.jpg"}`,
    keywords: `${lyric.title}, ${lyric.artistId?.name}, Tangkhul lyrics, Tangkhul songs, Tangkhul Laa, ${lyric.title} lyrics, ${lyric.artistId?.name} lyrics`,
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
