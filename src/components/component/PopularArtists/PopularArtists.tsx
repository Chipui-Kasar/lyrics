import { IArtists } from "@/models/IObjects";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PopularArtistsProps {
  artists: IArtists[];
}

const PopularArtists = ({ artists }: PopularArtistsProps) => {
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
            href={`/artists/${artist.name.replace(/ /g, "-")}`}
            className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
            prefetch={true}
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
                {artist.songCount ?? 0} Lyrics
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularArtists;
