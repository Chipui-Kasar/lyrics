import React from "react";
import { cn } from "@/lib/utils";

export const LyricsCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-4 w-full skeleton-loading h-[200px]",
        className
      )}
    >
      <div className="h-6 w-3/4 bg-muted/50 rounded mb-4 animate-pulse" />
      <div className="h-4 w-1/2 bg-muted/50 rounded mb-2 animate-pulse" />
      <div className="h-4 w-full bg-muted/50 rounded mb-2 animate-pulse" />
      <div className="h-4 w-5/6 bg-muted/50 rounded mt-6 animate-pulse" />
    </div>
  );
};

export const ArtistCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-4 w-full flex items-center space-x-4 skeleton-loading h-[80px]",
        className
      )}
    >
      <div className="h-12 w-12 rounded-full bg-muted/50 animate-pulse" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-muted/50 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-muted/50 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  );
};
