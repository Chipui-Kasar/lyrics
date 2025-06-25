// app/lyrics/[lyricsID]/[title_artist]/details/page.tsx

import { notFound } from "next/navigation";
import SongDetails from "@/components/component/AllArtists/ArtistsSongList/SongDetails/SongDetails";
import { generatePageMetadata, slugMaker } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";
import { cache } from "react";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 604800;

// ✅ Cache DB fetches
const fetchLyric = cache(
  async (
    lyricsID: string,
    title: string,
    artist: string
  ): Promise<ILyrics | null> => {
    return await getSingleLyrics(lyricsID, title, artist);
  }
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

  return generatePageMetadata({
    title: `${lyric.title} by ${lyric.artistId?.name}`,
    description: `Read the lyrics of '${lyric.title}' by ${lyric.artistId?.name}.`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${slugMaker(
      lyric.title
    )}_${slugMaker(lyric.artistId?.name)}/details`,
    image: `${lyric.thumbnail ?? lyric.artistId?.image ?? "/ogImage.jpg"}`,
    keywords: `${lyric.title}, ${lyric.artistId?.name}, Tangkhul lyrics, Tangkhul songs, Tangkhul Laa`,
  });
}

// ✅ Generate SSG params
export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    lyricsID: post._id,
    title_artist: `${slugMaker(post.title)}_${slugMaker(post.artistId?.name)}`,
  }));
}

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
