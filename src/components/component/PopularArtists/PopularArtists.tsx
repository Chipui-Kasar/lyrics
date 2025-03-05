"use client";
import { IArtists } from "@/models/IObjects";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const PopularArtists = () => {
  const [artists, setArtists] = useState<IArtists[]>([]);
  const [songCounts, setSongCounts] = useState<{ [key: string]: number }>({});

  // Fetch artists only once
  const fetchArtists = useCallback(async () => {
    try {
      const res = await fetch("/api/artist");
      const data = await res.json();
      setArtists(data);
    } catch (err) {
      console.error("Failed to fetch artists:", err);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Fetch song counts for all artists after artists are set
  useEffect(() => {
    const fetchAllSongCounts = async () => {
      if (artists.length === 0) return;

      const artistIds = artists.map((artist) => artist._id).join(",");

      try {
        const res = await fetch(
          `/api/lyrics/author/lyricscount?artistIds=${artistIds}`
        );
        const data = await res.json();
        setSongCounts(data); // Store the counts in state
      } catch (err) {
        console.error("Failed to fetch song counts:", err);
      }
    };

    fetchAllSongCounts();
  }, [artists]);

  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <h2 className="text-2xl font-bold">Popular Artists</h2>
      <p className="mt-2 text-muted-foreground">
        Explore the most popular artists on our platform.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {artists.map((artist, key) => (
          <Link
            key={key}
            href={`/artists/${artist.name.replace(/ /g, "-")}?artistId=${
              artist._id
            }`}
            className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
            prefetch={false}
          >
            <Image
              src={artist.image || "/placeholder-user.jpg"}
              width={64}
              height={64}
              alt={artist.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div className="text-center">
              <h3 className="text-sm font-medium">{artist.name}</h3>
              <p className="text-xs text-muted-foreground">
                {songCounts[artist._id] ?? 0} Lyrics
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularArtists;
