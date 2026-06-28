"use client";

import { NavigationLink } from "@/components/NavigationLink";
import Image from "next/image";
import Link from "next/link";

import { ILyrics } from "@/models/IObjects";
import { cloudinaryWebP, slugMaker } from "@/lib/utils";

import { useEffect, useMemo, useState } from "react";
import {
  getCachedArtistPage,
  revalidateArtistPageCache,
  seedArtistPageCache,
} from "@/lib/cacheService";

const ArtistsSongLists = ({ lyrics }: { lyrics: ILyrics[] }) => {
  const initialSlug = slugMaker(lyrics[0]?.artistId?.name || "");
  const [displayLyrics, setDisplayLyrics] = useState(lyrics || []);

  useEffect(() => {
    if (!initialSlug || lyrics.length === 0) return;
    let cancelled = false;

    seedArtistPageCache(initialSlug, lyrics).catch((error) => {
      console.error("Failed to seed artist cache:", error);
    });

    getCachedArtistPage(initialSlug)
      .then(({ data }) => {
        if (!cancelled && data.length > 0) {
          setDisplayLyrics(data);
        }
      })
      .catch((error) => {
        console.error("Failed to read artist cache:", error);
      });

    revalidateArtistPageCache(initialSlug)
      .then((fresh) => {
        if (!cancelled && fresh.length > 0) {
          setDisplayLyrics(fresh);
        }
      })
      .catch((error) => {
        console.error("Failed to refresh artist cache:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [initialSlug, lyrics]);

  const sortedLyrics = useMemo(
    () => [...displayLyrics].sort((a, b) => a.title.localeCompare(b.title)),
    [displayLyrics]
  );

  const artist = displayLyrics[0]?.artistId;
  const artistName = artist?.name || "";
  const artistImage = cloudinaryWebP(artist?.image) || "/placeholder-user.jpg";
  const artistGenres = artist?.genre?.join(", ") || "";
  const artistVillage = artist?.village || "";

  return (
    <>
      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-1">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/allartists" className="hover:underline">Artists</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground font-medium truncate max-w-[200px]">
                {artistName}
              </li>
            </ol>
          </nav>

          {/* Artist profile header */}
          <div className="flex items-center gap-6 mb-8">
            <Image
              src={artistImage}
              alt={artistName}
              width={96}
              height={96}
              className="rounded-full object-cover w-24 h-24 border"
            />
            <div>
              <h1 className="text-3xl font-bold">{artistName}</h1>
              {(artistGenres || artistVillage) && (
                <p className="mt-1 text-muted-foreground text-sm">
                  {[artistGenres, artistVillage].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                {sortedLyrics.length} song{sortedLyrics.length !== 1 ? "s" : ""}
              </p>
              <p className="mt-2 text-sm text-muted-foreground italic">
                No bio available yet.
              </p>
            </div>
          </div>

          {/* Song list */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 text-left">Song Title</th>
                </tr>
              </thead>
              <tbody>
                {sortedLyrics.map((lyric) => (
                  <tr className="border-b hover:bg-muted/20" key={lyric._id}>
                    <td className="py-3 px-4 text-left">
                      <NavigationLink
                        href={`/lyrics/${lyric._id}/${slugMaker(
                          lyric.title
                        )}_${slugMaker(lyric.artistId?.name)}`}
                        className="font-medium hover:underline"
                        prefetch={true}
                        rel="noopener noreferrer"
                      >
                        {lyric.title}
                      </NavigationLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default ArtistsSongLists;
