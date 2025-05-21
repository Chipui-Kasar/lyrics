import React from "react";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) return null;

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pageNumbers = [
    1,
    ...(showLeftEllipsis ? ["..."] : []),
    ...range(leftSibling, rightSibling),
    ...(showRightEllipsis ? ["..."] : []),
    totalPages,
  ].filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates

  return (
    <nav className="flex gap-1 items-center">
      <button
        className="px-2 py-1 rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous"
      >
        &lt;
      </button>
      {pageNumbers.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 py-1">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`px-2 py-1 rounded ${
              page === currentPage
                ? "bg-primary text-white"
                : "bg-muted text-primary"
            }`}
            onClick={() => onPageChange(Number(page))}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}
      <button
        className="px-2 py-1 rounded disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next"
      >
        &gt;
      </button>
    </nav>
  );
};
