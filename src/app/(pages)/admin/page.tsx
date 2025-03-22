"use client";
import AddArtists from "@/components/component/Admin/Artists/AddArtists";
import AddNewLyrics from "@/components/component/Admin/Lyrics/AddLyrics";
import { IArtists } from "@/models/IObjects";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AdminLogin from "./signin/page";
import { LogOutIcon } from "lucide-react";
import { getAllArtists } from "@/service/allartists";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("lyrics");
  const { data: session } = useSession();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    getAllArtists().then((data) => setArtists(data));
  }, []);
  if (!session) {
    return <AdminLogin />;
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="p-6">
        <Button
          onClick={() => signOut()}
          className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-all"
        >
          <LogOutIcon className="h-5 w-5" />
          Sign Out
        </Button>

        <h1 className="text-xl font-bold mb-4">Artists List</h1>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Genre</th>
              <th className="border p-2">Village</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist: IArtists) => (
              <tr key={artist._id} className="border-b">
                <td className="border p-2">{artist.name}</td>
                <td className="border p-2">{artist.genre.join(", ")}</td>
                <td className="border p-2">{artist.village}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full p-4 bg-white rounded shadow-md">
        <div className="flex justify-around">
          <button
            className={`px-4 py-2 ${
              activeTab === "lyrics" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("lyrics")}
          >
            Artists
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "tab2" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("tab2")}
          >
            Lyrics
          </button>
        </div>
        <div className="mt-4">
          {activeTab === "lyrics" && (
            <div>
              <AddArtists />
            </div>
          )}
          {activeTab === "tab2" && (
            <div>
              <AddNewLyrics artists={artists} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
