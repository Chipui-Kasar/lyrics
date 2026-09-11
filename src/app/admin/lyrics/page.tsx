import { getAllArtists } from "@/service/allartists";
import AddLyricsClient from "@/components/component/Admin/Lyrics/AddLyricsClient";

// Fetched fresh on every visit so an artist added on /admin/artists shows
// up immediately here instead of being served from a stale router cache.
export const dynamic = "force-dynamic";

export default async function AdminLyricsPage() {
  const artists = await getAllArtists();
  return <AddLyricsClient artists={artists} />;
}
