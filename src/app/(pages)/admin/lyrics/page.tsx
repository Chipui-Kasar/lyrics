"use client";
import AddNewLyrics from "@/components/component/Admin/Lyrics/AddLyrics";
import { Sidebar } from "@/components/component/AllArtists/AdminNav";
import React, { useEffect, useState } from "react";

const AddLyrics = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`)
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("Failed to fetch artists:", err));
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex w-full p-4 bg-white rounded shadow-md min-h-[95vh]">
        <Sidebar />
        <AddNewLyrics artists={artists} />
      </div>
    </div>
  );
};

export default AddLyrics;
