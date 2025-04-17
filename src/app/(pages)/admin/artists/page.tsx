"use client";
import AddArtists from "@/components/component/Admin/Artists/AddArtists";
import { Sidebar } from "@/components/component/AllArtists/AdminNav";
import React from "react";

const AddLyrics = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex w-full p-4 bg-white rounded shadow-md min-h-[95vh]">
        <Sidebar />
        <AddArtists />
      </div>
    </div>
  );
};

export default AddLyrics;
