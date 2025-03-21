/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kqDlEjkR9OG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import SongDetails from "@/components/component/AllArtists/ArtistsSongList/SongDetails/SongDetails";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";

const fetchSingleLyrics = async (id: string, title: string, artist: string) => {
  return await getSingleLyrics(id, title, artist);
};

export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    id: post._id,
    title: post.title,
    artist: post.artistId?.name,
  }));
}

export default async function SongDetailsPage({
  params,
}: {
  params: { lyricsID: string; "title~artist": string };
}) {
  const [title, artist] = params["title~artist"].split("~");
  const id = params.lyricsID;
  const songLyrics = await fetchSingleLyrics(id, title, artist);

  return <SongDetails songLyrics={songLyrics} />;
}
