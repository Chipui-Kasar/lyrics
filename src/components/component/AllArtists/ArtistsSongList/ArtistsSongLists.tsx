"use client";

import { NavigationLink } from "@/components/NavigationLink";

import { ILyrics } from "@/models/IObjects";
import { slugMaker } from "@/lib/utils";

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

  return (
    <>
      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            {displayLyrics[0]?.artistId?.name}
          </h2>
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
      <div className="container mx-auto flex justify-center"></div>
    </>
  );
};

export default ArtistsSongLists;
