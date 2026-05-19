"use client";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { YouTubePlayer } from "@/components/ui/video";
import { handleShare, sanitizeAndDeduplicateHTML, slugMaker } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getCachedLyric,
  revalidateLyricCache,
  seedLyricCache,
} from "@/lib/cacheService";

const Lyrics: React.FC<{ lyrics: ILyrics }> = ({ lyrics }) => {
  if (!lyrics._id) notFound();
  const [displayLyrics, setDisplayLyrics] = useState(lyrics);

  useEffect(() => {
    let cancelled = false;

    seedLyricCache(lyrics).catch((error) => {
      console.error("Failed to seed lyric cache:", error);
    });

    getCachedLyric(lyrics._id)
      .then(({ data }) => {
        if (!cancelled && data) {
          setDisplayLyrics(data);
        }
      })
      .catch((error) => {
        console.error("Failed to read lyric cache:", error);
      });

    revalidateLyricCache(lyrics._id)
      .then((fresh) => {
        if (!cancelled && fresh) {
          setDisplayLyrics(fresh);
        }
      })
      .catch((error) => {
        console.error("Failed to refresh lyric cache:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [lyrics]);

  const sanitizedLyrics = useMemo(
    () => sanitizeAndDeduplicateHTML(displayLyrics.lyrics || ""),
    [displayLyrics.lyrics]
  );

  const escapeApostrophe = (text: string) => {
    return text?.replace(/'/g, "&apos;");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <main className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[1fr_300px] md:gap-12 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              Lyrics
            </div>
            <h1 className="text-3xl font-bold">
              {escapeApostrophe(displayLyrics.title)}
            </h1>
            {displayLyrics.artistId?.name && (
              <Link
                href={`/artists/${slugMaker(displayLyrics.artistId.name)}`}
                className="text-muted-foreground underline-offset-4 hover:underline"
              >
                {escapeApostrophe(displayLyrics.artistId.name)}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap w-full items-start gap-6">
            {displayLyrics.streamingLinks?.youtube !== "" &&
            displayLyrics.streamingLinks?.youtube ? (
              <YouTubePlayer videoUrl={displayLyrics.streamingLinks.youtube} />
            ) : (
              <Video
                width="200"
                height="200"
                className="aspect-square overflow-hidden rounded-lg object-cover"
              />
            )}

            <div
              className="prose text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: sanitizedLyrics,
              }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                Song Details
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare(displayLyrics)}
              >
                <ShareIcon className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Artist:</span>
                {displayLyrics.artistId?.name ? (
                  <Link
                    href={`/artists/${slugMaker(displayLyrics.artistId.name)}`}
                    className="text-right underline-offset-4 hover:underline"
                  >
                    {displayLyrics.artistId.name}
                  </Link>
                ) : (
                  <span>Unknown Artist</span>
                )}
              </div>
              <div className="flex items-start justify-between">
                <span>Album:</span>
                <span>{displayLyrics.album}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Release Date:</span>
                <span>{displayLyrics.releaseYear}</span>
              </div>
            </div>
            <div className="mt-4">
              {(displayLyrics.streamingLinks?.youtube ||
                displayLyrics.streamingLinks?.spotify) && (
                <Link
                  href={
                    displayLyrics.streamingLinks?.youtube ||
                    displayLyrics.streamingLinks?.spotify ||
                    "#"
                  }
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stream now
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Lyrics;

function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
