"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { ILyrics } from "@/models/IObjects";

interface FeaturedLyricsProps {
  lyrics: ILyrics[];
}

const FeaturedLyrics = ({ lyrics }: FeaturedLyricsProps) => {
  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <h2 className="text-2xl font-bold">Featured Lyrics</h2>
      <p className="mt-2 text-muted-foreground">
        Check out the latest featured song lyrics.
      </p>
      <div className="mt-6 grid gap-4">
        {lyrics.map((lyric, key) => (
          <Link
            href={`/artists/${
              lyric.artistId?.name ?? "unknown"
            }/lyrics/${lyric.title.replace(/'/g, "&apos;")}`}
            prefetch={true}
            className="group flex items-center gap-4 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
            key={key}
          >
            <div className="flex-1">
              <h3 className="font-medium">{lyric.title}</h3>{" "}
              {/* ✅ Removed nested <Link> */}
              <p className="text-sm text-muted-foreground">
                by{" "}
                <span className="font-medium">
                  {lyric.artistId?.name ?? "Unknown Artist"}
                </span>{" "}
                {/* ✅ No nested <Link> */}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="group-hover:opacity-100"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedLyrics;
