"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationLinksProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

/**
 * Server-compatible pagination using URL search params.
 * Works with Next.js App Router server components.
 */
export function PaginationLinks({
  currentPage,
  totalPages,
  className,
}: PaginationLinksProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return `/posts${queryString ? `?${queryString}` : ""}`;
  };

  const pages: (number | string)[] = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="Pagination"
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-slate-400"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page as number)}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          aria-label="Go to next page"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
