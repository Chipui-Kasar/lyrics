"use client";

import AddArtists from "@/components/component/Admin/Artists/AddArtists";
import AddNewLyrics from "@/components/component/Admin/Lyrics/AddLyrics";
import { useState } from "react";

export default function AddNewDetailsClient({ artists }: { artists: any[] }) {
  const [activeTab, setActiveTab] = useState("lyrics");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full p-4 bg-white rounded shadow-md">
        <div className="flex justify-around">
          <button
            className={`px-4 py-2 ${
              activeTab === "lyrics" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("lyrics")}
          >
            Artists
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "tab2" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("tab2")}
          >
            Lyrics
          </button>
        </div>
        <div className="mt-4">
          {activeTab === "lyrics" && <AddArtists />}
          {activeTab === "tab2" && <AddNewLyrics artists={artists} />}
        </div>
      </div>
    </div>
  );
}
