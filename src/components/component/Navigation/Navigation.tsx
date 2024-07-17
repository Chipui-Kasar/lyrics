import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LayoutGridIcon, Music2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container m-auto flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold"
          prefetch={false}
        >
          <Music2Icon className="h-6 w-6 text-primary" />
          <span>Tangkhul Lyrics</span>
        </Link>
        <div className="relative flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search for lyrics..."
            className="w-full rounded-full bg-muted pl-8 pr-4 focus:bg-background"
          />
          <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="hidden rounded-full p-2 transition-colors hover:bg-muted md:inline-block"
            prefetch={false}
          >
            <LayoutGridIcon className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link
            href="/contribute"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Contribute Lyrics
          </Link>
          <Avatar className="hidden border md:inline-flex">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
