"use client";
import AddArtists from "@/components/component/Admin/Artists/AddArtists";
import Sidebar from "@/components/component/Admin/Navigation/AdminNav";

export default function AddLyrics() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8">
        <AddArtists />
      </div>
    </div>
  );
}
