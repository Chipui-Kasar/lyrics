"use client";

import AddNewLyrics from "./AddLyrics";
import { Sidebar } from "@/components/component/Admin/Navigation/AdminNav";
import { IArtists } from "@/models/IObjects";

export default function AddLyricsClient({ artists }: { artists: IArtists[] }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex w-full p-4 bg-white rounded shadow-md min-h-[95vh]">
        <Sidebar />
        <AddNewLyrics artists={artists} />
      </div>
    </div>
  );
}
