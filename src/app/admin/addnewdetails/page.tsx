import AddNewDetailsClient from "@/components/component/Admin/AddNewDetailsClient/AddNewDetailsClient";
import { getAllArtists } from "@/service/allartists";

export const dynamic = "force-static";
export const revalidate = 3600; // Regenerate every 1 hour

export default async function AddNewDetailsPage() {
  const artists = await getAllArtists();

  return <AddNewDetailsClient artists={artists} />;
}
