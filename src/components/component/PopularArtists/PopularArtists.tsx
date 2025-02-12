import { AllArtistsJson } from "@/service/allartists";
import Link from "next/link";
import React from "react";

const PopularArtists = () => {
  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <h2 className="text-2xl font-bold">Popular Artists</h2>
      <p className="mt-2 text-muted-foreground">
        Explore the most popular artists on our platform.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {AllArtistsJson.map((artist, key) => {
          return (
            <Link
              key={key}
              href={artist.href}
              className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
              prefetch={true}
            >
              <img
                src={artist.imgSrc}
                width={64}
                height={64}
                alt={artist.imgAlt}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="text-center">
                <h3 className="text-sm font-medium">{artist.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {artist.songsCount}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PopularArtists;
