import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ILyrics } from "@/models/IObjects";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
interface SearchResultProps {
  params: string;
  lyrics: ILyrics[];
}
const SearchResult = ({ params, lyrics }: SearchResultProps) => {
  console.log(lyrics);

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-wrap items-center justify-between mb-8 px-4">
        <h1 className="text-3xl font-bold">{params}</h1>
        <p className="text-muted-foreground">Showing 1-10 of 32 results</p>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-4 px-4">
          <Link href="#" className="group" prefetch={true}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  &#39;Imagine&#39; by John Lennon
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Imagine there&#39;s no heaven, it&#39;s easy if you try...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={true}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  &#39;Bohemian Rhapsody&#39; by Queen
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Is this the real life? Is this just fantasy?
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={true}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  &apos;Hallelujah&apos; by Leonard Cohen
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Now I&apos;ve heard there was a secret chord, that David
                  played and it pleased the Lord...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={true}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  &#39;Smells Like Teen Spirit&#39; by Nirvana
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  With the lights out, it&#39;s less dangerous, here we are now,
                  entertain us...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={true}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  &#39;Stairway to Heaven&#39; by Led Zeppelin
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  There&#39;s a lady who&#39;s sure all that glitters is gold,
                  and she&#39;s buying a stairway to heaven...
                </p>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="#" className="group" prefetch={true}>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
              <div className="flex-1">
                <h2 className="text-lg font-medium group-hover:underline">
                  &#39;Wonderwall&#39; by Oasis
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  Today is gonna be the day that they&#39;re gonna throw it back
                  to you...
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
