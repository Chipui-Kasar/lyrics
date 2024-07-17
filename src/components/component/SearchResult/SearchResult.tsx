import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

const SearchResult = ({ params }: { params: string }) => {
  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{params}</h1>
        <p className="text-muted-foreground">Showing 1-10 of 32 results</p>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-4">
          <Link href="#" className="group" prefetch={false}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  "Imagine" by John Lennon
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Imagine there's no heaven, it's easy if you try...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  "Bohemian Rhapsody" by Queen
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Is this the real life? Is this just fantasy?
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  "Hallelujah" by Leonard Cohen
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Now I've heard there was a secret chord, that David played and
                  it pleased the Lord...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  "Smells Like Teen Spirit" by Nirvana
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  With the lights out, it's less dangerous, here we are now,
                  entertain us...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  "Stairway to Heaven" by Led Zeppelin
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  There's a lady who's sure all that glitters is gold, and she's
                  buying a stairway to heaven...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={false}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  "Wonderwall" by Oasis
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Today is gonna be the day that they're gonna throw it back to
                  you...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
