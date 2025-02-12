import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { ArrowRightIcon } from "lucide-react";

const FeaturedLyrics = () => {
  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <h2 className="text-2xl font-bold">Featured Lyrics</h2>
      <p className="mt-2 text-muted-foreground">
        Check out the latest featured song lyrics.
      </p>
      <div className="mt-6 grid gap-4">
        <div className="group flex items-center gap-4 rounded-lg bg-background p-4 transition-colors hover:bg-muted">
          <div className="flex-1">
            <h3 className="font-medium">
              <Link
                href="/artists/Vincent/details/Starry-Night"
                prefetch={true}
              >
                Manarim
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href="/artists/Vincent"
                className="font-medium hover:underline"
                prefetch={true}
              >
                Achui Soro
              </Link>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="group-hover:opacity-100"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="group flex items-center gap-4 rounded-lg bg-background p-4 transition-colors hover:bg-muted">
          <div className="flex-1">
            <h3 className="font-medium">
              <Link
                href="/artists/Vincent/details/Starry-Night"
                prefetch={true}
              >
                Ishava Chida Horanu
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href="/artists/Vincent"
                className="font-medium hover:underline"
                prefetch={true}
              >
                Oshim
              </Link>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="group-hover:opacity-100"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedLyrics;
