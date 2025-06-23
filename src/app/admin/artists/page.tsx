import AddArtists from "@/components/component/Admin/Artists/AddArtists";
import { Sidebar } from "@/components/component/Admin/Navigation/AdminNav";
export const dynamic = "force-static";

export default function AddLyrics() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex w-full p-4 bg-white rounded shadow-md min-h-[95vh]">
        <Sidebar />
        <AddArtists />
      </div>
    </div>
  );
}
