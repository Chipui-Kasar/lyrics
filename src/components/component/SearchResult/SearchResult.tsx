import {
  highlightFuzzyMatch,
  sanitizeAndDeduplicateHTML,
  slugMaker,
  removeSlug,
} from "@/lib/utils";
import { IArtists, ILyrics } from "@/models/IObjects";
import { ArrowRightIcon } from "lucide-react";
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
  // Use separate regex instances for test and replace to avoid lastIndex issues
  const highlightRegex = new RegExp(params, "gi");
  const testRegex = new RegExp(params, "i");

  const renderLyrics = () =>
    lyrics.lyrics.map((lyric, key) => {
      const matchingLine =
        lyric.lyrics.split("\n").find((line) => testRegex.test(line)) ||
        lyric.lyrics;

      return (
        <Link
          href={`/lyrics/${lyric._id}/${slugMaker(lyric.title)}~${slugMaker(
            lyric.artistId?.name
          )}`}
          className="group"
          prefetch={true}
          key={key}
        >
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
            <div className="flex-1">
              <h2 className="text-lg font-medium group-hover:underline">
                &#39;{lyric.title}&#39; by {lyric.artistId?.name}
              </h2>
              <span
                className="text-muted-foreground line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: highlightFuzzyMatch(
                    sanitizeAndDeduplicateHTML(
                      matchingLine.replace(/<[^>]+>/g, "")
                    ).replace(
                      highlightRegex,
                      (match) =>
                        `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${match}</span>`
                    ),
                    removeSlug(params)
                  ),
                }}
              />
            </div>
            <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
      );
    });

  const renderArtists = () =>
    lyrics.artists.map((artist, key) => {
      const matchingLine = artist.name;
      const villageLine = artist.village;

      return (
        <Link
          href={`/artists/${slugMaker(artist.name)}`}
          className="group"
          prefetch={true}
          key={key}
        >
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
            <div className="flex-1">
              <h2 className="text-lg font-medium group-hover:underline">
                &#39;
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightFuzzyMatch(
                      sanitizeAndDeduplicateHTML(matchingLine).replace(
                        highlightRegex,
                        (match) =>
                          `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${match}</span>`
                      ),
                      removeSlug(params)
                    ),
                  }}
                />
                &#39; from{" "}
                <article
                  dangerouslySetInnerHTML={{
                    __html: highlightFuzzyMatch(
                      sanitizeAndDeduplicateHTML(villageLine).replace(
                        highlightRegex,
                        (match) =>
                          `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${match}</span>`
                      ),
                      removeSlug(params)
                    ),
                  }}
                />
              </h2>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>
      );
    });

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-wrap items-center justify-between mb-8 px-4">
        <h1 className="text-3xl font-bold">{params}</h1>
        <p className="text-muted-foreground">Showing 1-10 of 32 results</p>
      </div>
      <div className="grid gap-8">
        <div className="grid gap-4 px-4">
          {lyrics.lyrics && lyrics.lyrics.length > 0 ? (
            renderLyrics()
          ) : lyrics.artists && lyrics.artists.length > 0 ? (
            renderArtists()
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
          {/* pagination */}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
