"use client";
import { Input } from "@/components/ui/input";
import { Music2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import debounce from "lodash/debounce";
import { ILyrics } from "@/models/IObjects";
import { sanitizeAndDeduplicateHTML, slugMaker } from "@/lib/utils";
import Form from "next/form";

const Navigation: React.FC = () => {
  const [lyrics, setLyrics] = useState<ILyrics[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLyrics, setFilteredLyrics] = useState<ILyrics[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only fetch when user starts searching to improve FCP/LCP
    if (searchQuery.length > 2) {
      const fetchLyrics = async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`
          );
          if (res.ok) {
            setLyrics(await res.json());
          }
        } catch (error) {
          console.error("Failed to fetch lyrics", error);
        }
      };
      fetchLyrics();
    } else {
      setLyrics([]);
      setFilteredLyrics([]);
    }
  }, [searchQuery]);

  const searchIndex = useMemo(
    () =>
      lyrics.map((lyric) => ({
        ...lyric,
        _search: [lyric.title || "", lyric.artistId?.name || ""]
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase(),
      })),
    [lyrics]
  );

  // Enhanced debounced search with performance optimization
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length > 2) {
        // Use requestIdleCallback for better performance
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => setSearchQuery(query), { timeout: 100 });
        } else {
          setSearchQuery(query);
        }
      } else {
        setSearchQuery("");
      }
    }, 300),
    []
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Enhanced debounced search for filtering results
  const debouncedFilter = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setFilteredLyrics([]);
        return;
      }

      const filtered = searchIndex
        .filter((lyric) => lyric._search.includes(query.toLowerCase()))
        .slice(0, 5); // Reduced from 8 to 5 for better performance
      setFilteredLyrics(filtered);
    }, 300), // Increased to 300ms for better performance
    [searchIndex]
  );

  useEffect(() => {
    debouncedFilter(searchQuery);
    return () => {
      debouncedFilter.cancel();
    };
  }, [searchQuery, debouncedFilter]);

  useEffect(() => {
    setSearchQuery("");
    setFilteredLyrics([]);
  }, [pathname]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleResultClick = useCallback(
    (id: string, title: string, artist: string) => {
      router.push(`/lyrics/${id}/${slugMaker(title)}_${slugMaker(artist)}`);
      setSearchQuery("");
      setFilteredLyrics([]);
    },
    [router]
  );

  return (
    <nav
      className="border-b bg-background"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="m-auto flex flex-col w-full p-4 gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold"
            prefetch={true}
            aria-label="Tangkhul Lyrics - Home"
            rel="noopener noreferrer"
          >
            <Music2Icon className="h-6 w-6 text-primary" aria-hidden="true" />
            <span>Tangkhul Lyrics</span>
          </Link>
        </div>

        {/* Search Bar (Hidden on /contribute) */}
        {pathname !== "/contribute" && (
          <div className="relative flex-1 w-full md:max-w-[400px]">
            <Form
              action="/search"
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                setFilteredLyrics([]);
                router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
              }}
            >
              <Input
                // type="search"
                placeholder="Search for lyrics..."
                aria-label="Search for lyrics"
                className="w-full rounded-full bg-muted pl-8 pr-4 focus:bg-background bg-gradient-to-r from-[#79095c33] to-[#001fff29]"
                onChange={handleSearchChange}
                value={searchQuery}
                name="query"
              />
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </Form>

            {/* Search Results Dropdown */}
            {filteredLyrics.length > 0 && (
              <ul className="search-dropdown absolute left-0 mt-2 w-full bg-background border border-gray-200 rounded-md shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                {filteredLyrics.map((lyric) => {
                  const regex = new RegExp(searchQuery, "gi");
                  // Use only title for display to improve performance
                  const displayText = lyric.title || "Untitled";

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
                      className="cursor-pointer hover:bg-gray-100 transition text-sm p-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: sanitizeAndDeduplicateHTML(
                              displayText
                            ).replace(
                              regex,
                              (match) =>
                                `<span class="bg-yellow-200 text-yellow-800">${match}</span>`
                            ),
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        by {lyric.artistId?.name || "Unknown Artist"}
                      </div>
                    </li>
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
            rel="noopener noreferrer"
          >
            Browse Artists
          </Link>

          <Link
            href="/contribute"
            className="inline-flex flex-1 flex-shrink flex-grow basis-auto h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={true}
            rel="noopener noreferrer"
          >
            Share Lyrics
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
