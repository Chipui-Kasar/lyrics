import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { ILyrics } from "@/models/IObjects";
import { slugMaker } from "@/lib/utils";
interface AllLyricsProps {
  lyrics: ILyrics[];
}
const AllLyrics = ({ lyrics }: AllLyricsProps) => {
  return (
    <div className="col-span-2 md:col-span-2 lg:col-span-1  rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <h2 className="text-2xl font-bold">
        Tangkhul Song Lyrics | Explore and Discover new Lyrics
      </h2>
      <p className="mt-2 text-muted-foreground">
        Explore the growing collection of lyrics from various artists and
        genres.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {lyrics.map((lyric, key) => (
          <Link
            href={`/lyrics/${lyric._id}/${slugMaker(lyric.title)}~${slugMaker(
              lyric.artistId?.name
            )}`}
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

export default AllLyrics;
