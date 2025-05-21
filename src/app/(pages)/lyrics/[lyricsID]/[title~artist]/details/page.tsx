/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kqDlEjkR9OG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import NotFound from "@/app/not-found";
import SongDetails from "@/components/component/AllArtists/ArtistsSongList/SongDetails/SongDetails";
import { generatePageMetadata, slugMaker } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";
import { cache } from "react";
export const revalidate = 604800;

// Cache DB fetches during request lifecycle
const fetchLyric = cache(
  async (
    lyricsID: string,
    title: string,
    artist: string
  ): Promise<ILyrics | null> => {
    return await getSingleLyrics(lyricsID, title, artist);
  }
);
// 🔹 Generate Metadata Dynamically
export async function generateMetadata(props: {
  params: Promise<{ lyricsID: string; "title~artist": string }>;
}) {
  const params = await props.params;
  const [title, artist] = params["title~artist"].split("~"); // Split the title and artist
  const lyricsID = params.lyricsID;

  const lyric = await fetchLyric(lyricsID, title, artist);

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
    )}~${slugMaker(lyric.artistId?.name)}/details`,
    image: `${lyric.thumbnail ?? lyric.artistId.image ?? "/ogImage.jpg"}`, // ✅ Use a valid image
    keywords: `${lyric.title}, ${lyric.artistId?.name}, Tangkhul lyrics, Tangkhul songs, Tangkhul Laa`,
  });
}

// 🔹 Generate Static Params for SSG
export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    lyricsID: post._id, // ✅ Matches route param
    "title~artist": `${slugMaker(post.title)}~${slugMaker(
      post.artistId?.name
    )}`, // ✅ Matches dynamic segment
  }));
}

// 🔹 Page Component
export default async function SongDetailsPage(props: {
  params: Promise<{ lyricsID: string; "title~artist": string }>;
}) {
  const params = await props.params;
  const [title, artist] = params["title~artist"].split("~");
  const lyricsID = params.lyricsID;

  const songLyrics = await fetchLyric(lyricsID, title, artist);
  if (!songLyrics) {
    return <NotFound />;
  }

  return <SongDetails songLyrics={songLyrics} />;
}
