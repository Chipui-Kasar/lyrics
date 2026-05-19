import { cn } from "@/lib/utils";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageHref?: (page: number) => string;
  siblingCount?: number;
}

const range = (start: number, end: number) => {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const DOTS = "...";

export const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const leftSibling = Math.max(safeCurrentPage - siblingCount, 1);
  const rightSibling = Math.min(safeCurrentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const totalPageNumbers = siblingCount * 2 + 6; // show first + last two + siblings
  let pageNumbers: Array<number | typeof DOTS>;

  if (totalPages <= totalPageNumbers) {
    pageNumbers = range(1, totalPages);
  } else {
    const startPage = Math.max(2, safeCurrentPage - siblingCount);
    const endPage = Math.min(totalPages - 2, safeCurrentPage + siblingCount);

    pageNumbers = [1];

    if (startPage > 2) {
      pageNumbers.push(DOTS);
    }

    pageNumbers.push(...range(startPage, endPage));

    if (endPage < totalPages - 2) {
      pageNumbers.push(DOTS);
    }

    pageNumbers.push(totalPages - 1, totalPages);
  }

  const handleLinkClick =
    (page: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onPageChange(page);
    };

  const pageLinkClassName = (page: number) =>
    cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
      page === safeCurrentPage
        ? "bg-primary text-primary-foreground shadow-sm"
        : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
    );

  return (
    <nav
      className="inline-flex flex-row flex-nowrap items-center gap-1 rounded-full border border-border/60 bg-background/80 p-1 shadow-sm backdrop-blur"
      aria-label="Pagination"
    >
      <a
        href={getPageHref?.(safeCurrentPage - 1) ?? "#"}
        className={cn(
          "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
          safeCurrentPage === 1 && "pointer-events-none opacity-50"
        )}
        onClick={handleLinkClick(safeCurrentPage - 1)}
        aria-label="Previous"
        aria-disabled={safeCurrentPage === 1}
      >
        Prev
      </a>
      {pageNumbers.map((page, idx) =>
        page === DOTS ? (
          <span
            key={`dots-${idx}`}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <a
            key={`page-${page}`}
            href={getPageHref?.(Number(page)) ?? "#"}
            className={pageLinkClassName(Number(page))}
            onClick={handleLinkClick(Number(page))}
            aria-current={page === safeCurrentPage ? "page" : undefined}
          >
            {page}
          </a>
        )
      )}
      <a
        href={getPageHref?.(safeCurrentPage + 1) ?? "#"}
        className={cn(
          "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
          safeCurrentPage === totalPages && "pointer-events-none opacity-50"
        )}
        onClick={handleLinkClick(safeCurrentPage + 1)}
        aria-label="Next"
        aria-disabled={safeCurrentPage === totalPages}
      >
        Next
      </a>
    </nav>
  );
};
