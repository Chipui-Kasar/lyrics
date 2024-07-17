/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kqDlEjkR9OG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import SongDetails from "@/components/component/AllArtists/ArtistsSongList/SongDetails/SongDetails";

export default function SongDetailsPage({
  params,
}: {
  params: { artists: string; songTitle: string };
}) {
  return <SongDetails params={params} />;
}
