import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import { ArrowRightIcon } from "lucide-react";

const TopLyrics = () => {
  return (
    <div className="col-span-2 md:col-span-2 lg:col-span-1  rounded-lg bg-muted p-6 shadow-lg">
      <h2 className="text-2xl font-bold">Top Lyrics</h2>
      <p className="mt-2 text-muted-foreground">
        Check out the most popular lyrics on our platform.
      </p>
      <div className="mt-6 grid gap-4">
        <div className="group flex items-center gap-4 rounded-lg bg-background p-4 transition-colors hover:bg-muted">
          <div className="flex-1">
            <h3 className="font-medium">
              <Link href="#" prefetch={false}>
                Starry Night
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href="#"
                className="font-medium hover:underline"
                prefetch={false}
              >
                Vincent Van Gogh
              </Link>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="group flex items-center gap-4 rounded-lg bg-background p-4 transition-colors hover:bg-muted">
          <div className="flex-1">
            <h3 className="font-medium">
              <Link href="#" prefetch={false}>
                Hallelujah
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href="#"
                className="font-medium hover:underline"
                prefetch={false}
              >
                Leonard Cohen
              </Link>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="group flex items-center gap-4 rounded-lg bg-background p-4 transition-colors hover:bg-muted">
          <div className="flex-1">
            <h3 className="font-medium">
              <Link href="#" prefetch={false}>
                Strange Fruit
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">
              by{" "}
              <Link
                href="#"
                className="font-medium hover:underline"
                prefetch={false}
              >
                Billie Holiday
              </Link>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopLyrics;
