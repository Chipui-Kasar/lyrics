"use client";

import AddNewLyrics from "./AddLyrics";
import Sidebar from "@/components/component/Admin/Navigation/AdminNav";
import { IArtists } from "@/models/IObjects";

export default function AddLyricsClient({ artists }: { artists: IArtists[] }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8">
        <AddNewLyrics artists={artists} />
      </div>
    </div>
  );
}
