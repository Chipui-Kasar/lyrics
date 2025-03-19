/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kqDlEjkR9OG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import SongDetails from "@/components/component/AllArtists/ArtistsSongList/SongDetails/SongDetails";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";
import { notFound } from "next/navigation";

const fetchSingleLyrics = async (artistName: string, songTitle: string) => {
  return await getSingleLyrics(artistName, songTitle);
};

export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    artists: post.artistId.name,
    songTitle: post.title,
  }));
}

export default async function SongDetailsPage({
  params,
}: {
  params: { artists: string; songTitle: string };
}) {
  const songLyrics = await fetchSingleLyrics(params.artists, params.songTitle);
  if (!songLyrics) return notFound();

  return <SongDetails songLyrics={songLyrics} />;
}
