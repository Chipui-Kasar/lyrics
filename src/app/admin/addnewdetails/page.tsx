import AddNewDetailsClient from "@/components/component/Admin/AddNewDetailsClient/AddNewDetailsClient";
import { getAllArtists } from "@/service/allartists";

export const dynamic = "force-dynamic"; // Use dynamic rendering for this page

export default async function AddNewDetailsPage() {
  const artists = await getAllArtists();

  return <AddNewDetailsClient artists={artists} />;
}
