import Link from "next/link";
import React from "react";

const PopularArtists = () => {
  return (
    <div className="rounded-lg bg-muted p-6 shadow-lg">
      <h2 className="text-2xl font-bold">Popular Artists</h2>
      <p className="mt-2 text-muted-foreground">
        Explore the most popular artists on our platform.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <Link
          href="#"
          className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
          prefetch={false}
        >
          <img
            src="/placeholder.svg"
            width={64}
            height={64}
            alt="Vincent Van Gogh"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="text-center">
            <h3 className="text-sm font-medium">Vincent Van Gogh</h3>
            <p className="text-xs text-muted-foreground">10,000 songs</p>
          </div>
        </Link>
        <Link
          href="#"
          className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
          prefetch={false}
        >
          <img
            src="/placeholder.svg"
            width={64}
            height={64}
            alt="Leonard Cohen"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="text-center">
            <h3 className="text-sm font-medium">Leonard Cohen</h3>
            <p className="text-xs text-muted-foreground">8,000 songs</p>
          </div>
        </Link>
        <Link
          href="#"
          className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
          prefetch={false}
        >
          <img
            src="/placeholder.svg"
            width={64}
            height={64}
            alt="Billie Holiday"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="text-center">
            <h3 className="text-sm font-medium">Billie Holiday</h3>
            <p className="text-xs text-muted-foreground">7,500 songs</p>
          </div>
        </Link>
        <Link
          href="#"
          className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
          prefetch={false}
        >
          <img
            src="/placeholder.svg"
            width={64}
            height={64}
            alt="Bob Dylan"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="text-center">
            <h3 className="text-sm font-medium">Bob Dylan</h3>
            <p className="text-xs text-muted-foreground">9,000 songs</p>
          </div>
        </Link>
        <Link
          href="#"
          className="group flex flex-col items-center gap-2 rounded-lg bg-background p-4 transition-colors hover:bg-muted"
          prefetch={false}
        >
          <img
            src="/placeholder.svg"
            width={64}
            height={64}
            alt="Joni Mitchell"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="text-center">
            <h3 className="text-sm font-medium">Joni Mitchell</h3>
            <p className="text-xs text-muted-foreground">6,800 songs</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PopularArtists;
