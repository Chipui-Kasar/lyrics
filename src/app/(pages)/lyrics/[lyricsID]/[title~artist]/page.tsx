// app/lyrics/[lyricsID]/[title~artist]/page.tsx

import NotFound from "@/app/not-found";
import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import { generatePageMetadata } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";
export const revalidate = 604800;
// 🔹 Generate Metadata Dynamically
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lyricsID: string; "title~artist": string }>;
}) {
  const awaitedParams = await params;
  const [title, artist] = awaitedParams["title~artist"].split("~");
  const lyric: ILyrics = await getSingleLyrics(
    awaitedParams.lyricsID,
    title,
    artist
  );

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
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${lyric.title}~${lyric.artistId?.name}`,
    image: `${lyric.thumbnail ?? lyric.artistId?.image ?? "/ogImage.jpg"}`,
    keywords: `${lyric.title}, ${lyric.artistId?.name}, Tangkhul lyrics, Tangkhul songs, Tangkhul Laa, ${lyric.title} lyrics, ${lyric.artistId?.name} lyrics`,
  });
}

// 🔹 Generate Static Params for SSG
export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    lyricsID: post._id,
    "title~artist": `${post.title}~${post.artistId?.name}`,
  }));
}

// 🔹 Page Component (Server Component)
const LyricsPage = async ({
  params,
}: {
  params: Promise<{ lyricsID: string; "title~artist": string }>;
}) => {
  const awaitedParams = await params; // <-- Await here

  const [title, artist] = awaitedParams["title~artist"].split("~");
  const lyric = await getSingleLyrics(awaitedParams.lyricsID, title, artist);

  if (!lyric) {
    return <NotFound />;
  }

  return <Lyrics lyrics={lyric} />;
};
export default LyricsPage;
