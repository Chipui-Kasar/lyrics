"use client";
import { Input } from "@/components/ui/input";
import {
  Music2Icon,
  SearchIcon,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ILyrics } from "@/models/IObjects";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  sanitizeAndDeduplicateHTML,
  slugMaker,
  highlightFuzzyMatch,
  getMatchingLyricsExcerpt,
} from "@/lib/utils";
import Form from "next/form";

// Simple debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  const debouncedFunction = (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
  debouncedFunction.cancel = () => clearTimeout(timeoutId);
  return debouncedFunction;
};

// Cache search results to avoid redundant API calls
const searchCache = new Map<string, ILyrics[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const Navigation: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLyrics, setFilteredLyrics] = useState<ILyrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced search with caching
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length <= 2) {
        setFilteredLyrics([]);
        setIsLoading(false);
        return;
      }

      // Check cache first
      const cachedResult = searchCache.get(query.toLowerCase());
      if (cachedResult) {
        setFilteredLyrics(cachedResult);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&limit=8`,
          {
            signal: controller.signal,
            headers: {
              "Cache-Control":
                "public, max-age=300, stale-while-revalidate=600",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const lyricsData = data.lyrics || [];

          const searchRegex = new RegExp(query, "i");
          const filteredResults = lyricsData
            .filter((lyric: ILyrics) => {
              const title = lyric.title || "";
              const artist = lyric.artistId?.name || "";
              const album = lyric.album || "";
              const lyricsContent = lyric.lyrics || "";

              return (
                searchRegex.test(title) ||
                searchRegex.test(artist) ||
                searchRegex.test(album) ||
                searchRegex.test(lyricsContent)
              );
            })
            .map((lyric: ILyrics) => {
              const lyricsContent = lyric.lyrics || "";
              const hasLyricsMatch = searchRegex.test(lyricsContent);

              return {
                ...lyric,
                _hasLyricsMatch: hasLyricsMatch,
                _lyricsExcerpt: hasLyricsMatch
                  ? getMatchingLyricsExcerpt(lyricsContent, query)
                  : "",
              };
            })
            .slice(0, 8);

          // Cache results
          searchCache.set(query.toLowerCase(), filteredResults);
          
          // Clear old cache entries after 5 minutes
          setTimeout(() => {
            searchCache.delete(query.toLowerCase());
          }, CACHE_DURATION);

          setFilteredLyrics(filteredResults);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to fetch lyrics", error);
          setFilteredLyrics([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500), // Increased debounce to 500ms
    []
  );

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen) {
        const target = event.target as Element;
        if (!target.closest(".profile-dropdown")) {
          setIsProfileOpen(false);
        }
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Cleanup debounced function and abort controller on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchQuery("");
    setFilteredLyrics([]);
    setIsSubmitted(false);
  }, [pathname]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setIsSubmitted(false); // Reset submitted state when typing
      debouncedSearch(value);
    },
    [debouncedSearch]
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
                setIsSubmitted(true);
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsSubmitted(true);
                    setFilteredLyrics([]);
                  }
                }}
              />
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </Form>

            {/* Search Results Dropdown */}
            {!isSubmitted &&
              (filteredLyrics.length > 0 ||
                isLoading ||
                (searchQuery.length > 2 && !isLoading)) && (
                <ul className="search-dropdown absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto backdrop-blur-sm">
                  {isLoading ? (
                    <li className="p-3 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                        Searching...
                      </div>
                    </li>
                  ) : filteredLyrics.length > 0 ? (
                    filteredLyrics.map((lyric: ILyrics) => {
                      const displayText = lyric.title || "Untitled";
                      const artistName =
                        lyric.artistId?.name || "Unknown Artist";

                      // Use lyrics excerpt as main content if available, otherwise use title
                      const mainDisplayText = lyric.lyrics;

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
                          className="cursor-pointer hover:bg-gray-100 transition text-sm p-3 border-b border-gray-100 last:border-b-0 relative"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeAndDeduplicateHTML(
                                      highlightFuzzyMatch(
                                        mainDisplayText
                                          .split(/\s+/)
                                          .slice(0, 8)
                                          .join(" "),
                                        searchQuery
                                      )
                                    ),
                                  }}
                                />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                "{displayText}" by{" "}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightFuzzyMatch(
                                      artistName,
                                      searchQuery
                                    ),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : searchQuery.length > 2 ? (
                    <li className="p-3 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-1">
                        <span>No results found for "{searchQuery}"</span>
                        <span className="text-xs text-gray-400">
                          Try a different spelling or shorter terms
                        </span>
                      </div>
                    </li>
                  ) : null}
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

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            {session ? (
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-muted dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setIsProfileOpen(false);
                          // Add edit profile functionality here
                          alert("Edit profile functionality coming soon!");
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Desktop: Show both buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={() => signIn()}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <Link
                    href="/signup"
                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Mobile: Show single user icon with dropdown */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="User menu"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setIsProfileOpen(false);
                            signIn();
                          }}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </button>
                        <Link
                          href="/signup"
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
