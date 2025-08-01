"use client";
import {
  highlightFuzzyMatch,
  sanitizeAndDeduplicateHTML,
  slugMaker,
  removeSlug,
} from "@/lib/utils";
import { IArtists, ILyrics } from "@/models/IObjects";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResultProps {
  params: string;
  lyrics: {
    lyrics: ILyrics[];
    artists: IArtists[];
  };
}

const SearchResult = ({ params, lyrics }: SearchResultProps) => {
  const [searchInput, setSearchInput] = useState(params || "");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const ITEMS_PER_PAGE = 10;

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setCurrentPage(1); // Reset to first page on new search
    }
  };

  // Safely create regex only if params exists and is not empty
  let highlightRegex: RegExp | null = null;
  let testRegex: RegExp | null = null;

  if (params && params.trim()) {
    try {
      highlightRegex = new RegExp(params, "gi");
      testRegex = new RegExp(params, "i");
    } catch (error) {
      console.error("Invalid regex pattern:", params);
    }
  }

  // Calculate total results and pagination
  const totalLyricsResults = lyrics.lyrics?.length || 0;
  const totalArtistsResults = lyrics.artists?.length || 0;
  const totalResults = totalLyricsResults + totalArtistsResults;

  // Combine all results for pagination
  const allResults = [
    ...(lyrics.lyrics || []).map((item) => ({ ...item, type: "lyric" })),
    ...(lyrics.artists || []).map((item) => ({ ...item, type: "artist" })),
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResults = allResults.slice(startIndex, endIndex);

  // Separate current page results
  const currentLyrics = currentResults.filter((item) => item.type === "lyric");
  const currentArtists = currentResults.filter(
    (item) => item.type === "artist"
  );

  // Determine what results to show and create result summary
  const getResultSummary = () => {
    if (totalResults === 0) {
      return "No results found";
    }

    const resultTypes = [];
    if (totalLyricsResults > 0) {
      resultTypes.push(
        `${totalLyricsResults} song${totalLyricsResults !== 1 ? "s" : ""}`
      );
    }
    if (totalArtistsResults > 0) {
      resultTypes.push(
        `${totalArtistsResults} artist${totalArtistsResults !== 1 ? "s" : ""}`
      );
    }

    const startResult = startIndex + 1;
    const endResult = Math.min(endIndex, totalResults);

    return `Showing ${startResult}-${endResult} of ${totalResults} result${
      totalResults !== 1 ? "s" : ""
    } (${resultTypes.join(", ")})`;
  };

  return (
    <div className="container mx-auto py-12">
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8 px-4">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for songs, artists, or lyrics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between mb-8 px-4">
        <div>
          {params && (
            <>
              <h1 className="text-3xl font-bold mb-2">Search Results</h1>
              <p className="text-muted-foreground">{getResultSummary()}</p>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-8">
        <div className="grid gap-4 px-4">
          {!params ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  🔍 Search Tangkhul Lyrics
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Discover your favorite Tangkhul songs and artists. Search by
                  song title, artist name, or even lyrics content.
                </p>
                <div className="grid gap-2 text-sm text-gray-400">
                  <p>💡 Try searching for:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Song titles</li>
                    <li>Artist names</li>
                    <li>Lyrics phrases</li>
                    <li>Village names</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : totalResults > 0 ? (
            <>
              {/* Mixed results with pagination */}
              <div className="mb-6">
                <div className="space-y-2">
                  {currentResults.map((result: any, index) => {
                    if (result.type === "lyric") {
                      const lyric = result;
                      const matchingLine = testRegex
                        ? lyric.lyrics
                            .split("\n")
                            .find((line: string) => testRegex!.test(line)) ||
                          lyric.lyrics
                        : lyric.lyrics;

                      return (
                        <Link
                          href={`/lyrics/${lyric._id}/${slugMaker(
                            lyric.title
                          )}_${slugMaker(lyric.artistId?.name)}`}
                          className="group"
                          prefetch={true}
                          key={`lyric-${index}`}
                        >
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                  Song
                                </span>
                              </div>
                              <h2 className="text-lg font-medium group-hover:underline">
                                &#39;{lyric.title}&#39; by{" "}
                                {lyric.artistId?.name}
                              </h2>
                              <span
                                className="text-muted-foreground line-clamp-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightRegex
                                    ? highlightFuzzyMatch(
                                        sanitizeAndDeduplicateHTML(
                                          matchingLine.replace(/<[^>]+>/g, "")
                                        ).replace(
                                          highlightRegex,
                                          (match) =>
                                            `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${match}</span>`
                                        ),
                                        removeSlug(params)
                                      )
                                    : sanitizeAndDeduplicateHTML(
                                        matchingLine.replace(/<[^>]+>/g, "")
                                      ),
                                }}
                              />
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </Link>
                      );
                    } else {
                      const artist = result;
                      return (
                        <Link
                          href={`/artists/${slugMaker(artist.name)}`}
                          className="group"
                          prefetch={true}
                          key={`artist-${index}`}
                        >
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/50 transition-colors bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                  Artist
                                </span>
                              </div>
                              <h2 className="text-lg font-medium group-hover:underline">
                                &#39;
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightRegex
                                      ? highlightFuzzyMatch(
                                          sanitizeAndDeduplicateHTML(
                                            artist.name
                                          ).replace(
                                            highlightRegex,
                                            (match) =>
                                              `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${match}</span>`
                                          ),
                                          removeSlug(params)
                                        )
                                      : sanitizeAndDeduplicateHTML(artist.name),
                                  }}
                                />
                                &#39; from{" "}
                                <article
                                  dangerouslySetInnerHTML={{
                                    __html: highlightRegex
                                      ? highlightFuzzyMatch(
                                          sanitizeAndDeduplicateHTML(
                                            artist.village
                                          ).replace(
                                            highlightRegex,
                                            (match) =>
                                              `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${match}</span>`
                                          ),
                                          removeSlug(params)
                                        )
                                      : sanitizeAndDeduplicateHTML(
                                          artist.village
                                        ),
                                  }}
                                />
                              </h2>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </Link>
                      );
                    }
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="max-w-md">
                <p className="text-2xl font-medium text-gray-600 dark:text-gray-400 mb-4">
                  😔 No results found
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  We couldn't find any songs or artists matching "{params}".
                </p>
                <div className="grid gap-2 text-sm text-gray-400">
                  <p>💡 Try:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Checking your spelling</li>
                    <li>Using different keywords</li>
                    <li>Searching for partial matches</li>
                    <li>Using English or Tangkhul terms</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalResults > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and 2 pages around current
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2
                    );
                  })
                  .map((page, index, arr) => {
                    // Add ellipsis if there's a gap
                    const prevPage = arr[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-2 py-1 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            currentPage === page
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
