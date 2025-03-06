"use client";
import AddArtists from "@/components/component/Admin/Artists/AddArtists";
import AddNewLyrics from "@/components/component/Admin/Lyrics/AddLyrics";
import { IArtists } from "@/models/IObjects";
import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("lyrics");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`)
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("Failed to fetch artists:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="p-6">
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
              <AddNewLyrics />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
