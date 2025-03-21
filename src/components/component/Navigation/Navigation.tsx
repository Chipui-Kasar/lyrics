"use client";
import { Input } from "@/components/ui/input";
import { Music2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { ILyrics } from "@/models/IObjects";
import { slugMaker } from "@/lib/utils";

interface NavigationProps {
  lyrics: ILyrics[];
}

const Navigation: React.FC<NavigationProps> = ({ lyrics }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLyrics, setFilteredLyrics] = useState<ILyrics[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  // Function to filter lyrics
  const filterLyrics = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        const filtered = lyrics.filter(
          (lyric) =>
            lyric.title?.toLowerCase().includes(query?.toLowerCase()) ||
            lyric.lyrics?.toLowerCase().includes(query?.toLowerCase()) ||
            lyric.artistId?.name?.toLowerCase().includes(query?.toLowerCase())
        );
        setFilteredLyrics(filtered);
      } else {
        setFilteredLyrics([]);
      }
    }, 300),
    [lyrics]
  );

  // Update filtered results when searchQuery changes
  useEffect(() => {
    filterLyrics(searchQuery);
  }, [searchQuery, filterLyrics]);

  //clear search on route change
  useEffect(() => {
    setSearchQuery("");
  }, [pathname]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = searchQuery
      .trim()
      ?.toLowerCase()
      ?.replace(/\s+/g, "-"); // Normalize case

    if (trimmedQuery) {
      router.push(`/search/${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleResultClick = (id: string, title: string, artist: string) => {
    router.push(`/lyrics/${id}/${slugMaker(title)}-${slugMaker(artist)}`);
    setSearchQuery(""); // Clear search after selection
    setFilteredLyrics([]); // Hide results
  };

  return (
    <header className="border-b bg-background">
      <div className="m-auto flex flex-col w-full p-4 gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold"
            prefetch={true}
          >
            <Music2Icon className="h-6 w-6 text-primary" />
            <span>Tangkhul Lyrics</span>
          </Link>
        </div>

        {/* Search Bar (Hidden on /contribute) */}
        {pathname !== "/contribute" && (
          <div className="relative flex-1 w-full md:max-w-[400px]">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search for lyrics..."
                aria-label="Search for lyrics"
                className="w-full rounded-full bg-muted pl-8 pr-4 focus:bg-background bg-gradient-to-r from-[#79095c33] to-[#001fff29]"
                onChange={handleSearchChange}
                value={searchQuery}
              />
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </form>

            {/* Search Results Dropdown */}
            {filteredLyrics.length > 0 && (
              <ul className="absolute left-0 mt-2 w-full bg-background border border-gray-200 rounded-md shadow-lg overflow-hidden z-50">
                {filteredLyrics.map((lyric) => {
                  const regex = new RegExp(searchQuery, "gi");
                  const lines = lyric.lyrics.split("\n"); // Split into lines
                  const matchingLine =
                    lines.find((line) => regex.test(line)) || lyric.lyrics; // Find first matching line

                  return (
                    <li
                      key={lyric._id}
                      onClick={() =>
                        handleResultClick(
                          lyric._id,
                          lyric.title,
                          lyric.artistId?.name
                        )
                      }
                      title={lyric.lyrics}
                      className="cursor-pointer hover:bg-gray-100 transition text-sm text-truncate-2-lines"
                      dangerouslySetInnerHTML={{
                        __html: matchingLine.replace(
                          regex,
                          (match) =>
                            `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${match}</span>`
                        ),
                      }}
                    />
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/allartists"
            className="h-9 flex-1 flex-shrink flex-grow basis-auto rounded-full px-4 py-2 transition-colors md:inline-block text-primary-foreground bg-primary rounded-md text-sm text-center"
            prefetch={true}
          >
            Browse Artists
          </Link>

          <Link
            href="/contribute"
            className="inline-flex flex-1 flex-shrink flex-grow basis-auto h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={true}
          >
            Share Lyrics
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
