import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { highlightFuzzyMatch, removeSlug, slugMaker } from "@/lib/utils";
import { IArtists, ILyrics } from "@/models/IObjects";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";
interface SearchResultProps {
  params: string;
  lyrics: {
    lyrics: ILyrics[];
    artists: IArtists[];
  };
}
const SearchResult = ({ params, lyrics }: SearchResultProps) => {
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-wrap items-center justify-between mb-8 px-4">
        <h1 className="text-3xl font-bold">{params}</h1>
        <p className="text-muted-foreground">Showing 1-10 of 32 results</p>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-4 px-4">
          {lyrics.lyrics && lyrics.lyrics.length > 0 ? (
            lyrics.lyrics.map((lyric, key) => (
              <Link
                href={`/lyrics/${lyric._id}/${slugMaker(
                  lyric.title
                )}~${slugMaker(lyric.artistId?.name)}`}
                className="group"
                prefetch={true}
                key={key}
              >
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
                  <div className="flex-1">
                    <h2 className="text-lg font-medium group-hover:underline">
                      &#39;{lyric.title}&#39; by {lyric.artistId?.name}
                    </h2>
                    <p
                      className="text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightFuzzyMatch(
                          lyric.lyrics,
                          removeSlug(params)
                        ),
                      }}
                    ></p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-lg font-medium text-gray-500">
                No results found
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your search query.
              </p>
            </div>
          )}
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
