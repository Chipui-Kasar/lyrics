/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kqDlEjkR9OG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import SongDetails from "@/components/component/AllArtists/ArtistsSongList/SongDetails/SongDetails";

const fetchSingleLyrics = async (artistName: string, songTitle: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics/author/singleLyrics?artistName=${artistName}&songTitle=${songTitle}`,
      { next: { revalidate: 60 } }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching featured lyrics:", error);
    return [];
  }
};
export default async function SongDetailsPage({
  params,
}: {
  params: { artists: string; songTitle: string };
}) {
  const songLyrics = await fetchSingleLyrics(params.artists, params.songTitle);

  return <SongDetails songLyrics={songLyrics} />;
}
