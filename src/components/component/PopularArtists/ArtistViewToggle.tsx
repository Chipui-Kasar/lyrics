"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LayoutGrid, List } from "lucide-react";

type View = "grid" | "list";

const STORAGE_KEY = "tl-artist-view";

const LAYOUT: Record<View, string> = {
  grid: "gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  list: "gap-x-6 gap-y-0 grid-cols-1 sm:grid-cols-2",
};

/**
 * Grid/list switch for the homepage artist block. The artist items are
 * server-rendered children; this only toggles a `data-view` attribute and the
 * container's columns, and items restyle themselves with
 * `group-data-[view=list]:` classes (list view hides the photo and shows the
 * song count beside the name; hidden lazy images aren't downloaded). The header sits on the left of
 * the same row as the buttons. The choice is remembered per browser.
 */
export default function ArtistViewToggle({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  const [view, setView] = useState<View>("grid");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "grid" || saved === "list") setView(saved);
    } catch {
      // Storage unavailable (private mode, blocked): keep the default.
    }
  }, []);

  const choose = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the choice just won't be remembered.
    }
  };

  const buttonClass = (active: boolean) =>
    `inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md transition-colors ${
      active
        ? "bg-primary text-primary-foreground shadow"
        : "text-muted-foreground hover:bg-background hover:text-foreground"
    }`;

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">{header}</div>
        <div
          className="inline-flex shrink-0 gap-1 rounded-lg bg-background/60 p-1"
          role="group"
          aria-label="Artist layout"
        >
          <button
            type="button"
            onClick={() => choose("grid")}
            className={buttonClass(view === "grid")}
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => choose("list")}
            className={buttonClass(view === "list")}
            aria-pressed={view === "list"}
            aria-label="List view"
            title="List view"
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        data-view={view}
        className={`group mt-6 grid ${LAYOUT[view]}`}
      >
        {children}
      </div>
    </>
  );
}
