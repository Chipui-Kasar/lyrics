"use client";
import { Input } from "@/components/ui/input";
import { Music2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <header className="border-b bg-background">
      <div className="container m-auto flex flex-col w-full py-4 gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold"
            prefetch={false}
          >
            <Music2Icon className="h-6 w-6 text-primary" />
            <span>Tangkhul Lyrics</span>
          </Link>
        </div>
        <div className="relative flex-1 w-full md:max-w-[400px]">
          <form onSubmit={handleSubmit}>
            <Input
              type="search"
              placeholder="Search for lyrics..."
              className="w-full rounded-full bg-muted pl-8 pr-4 focus:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </form>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/allartists"
            className="h-9 rounded-full p-2 transition-colors md:inline-block border text-primary-foreground bg-primary rounded-md text-sm text-center"
            prefetch={false}
          >
            Browse Artists
          </Link>

          <Link
            href="/contribute"
            className="inline-flex flex-1 h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Share Lyrics
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
