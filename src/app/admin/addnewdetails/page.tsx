"use client";
import AddNewDetailsClient from "@/components/component/Admin/AddNewDetailsClient/AddNewDetailsClient";
import { getAllArtists } from "@/service/allartists";
import { useEffect, useState } from "react";

export default function AddNewDetailsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await getAllArtists();
        setArtists(artistsData);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <AddNewDetailsClient artists={artists} />;
}
