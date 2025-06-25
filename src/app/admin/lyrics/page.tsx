import { getAllArtists } from "@/service/allartists";
import AddLyricsClient from "@/components/component/Admin/Lyrics/AddLyricsClient";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function AdminLyricsPage() {
  const artists = await getAllArtists();

  return <AddLyricsClient artists={artists} />;
}
