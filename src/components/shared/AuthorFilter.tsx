"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Author {
  id: string;
  name: string | null;
  username: string;
}

interface AuthorFilterProps {
  authors: Author[];
  selectedAuthorId?: string;
  className?: string;
}

export function AuthorFilter({
  authors,
  selectedAuthorId,
  className,
}: AuthorFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedAuthor = authors.find((a) => a.id === selectedAuthorId);

  const handleAuthorChange = (authorId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (authorId) {
      params.set("author", authorId);
    } else {
      params.delete("author");
    }
    
    // Reset to page 1 when filter changes
    params.delete("page");
    
    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className={cn("relative group", className)}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
          selectedAuthorId
            ? "bg-indigo-100 text-indigo-700"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        )}
        aria-label="Filter by author"
        aria-expanded="false"
        aria-haspopup="listbox"
      >
        <User className="w-4 h-4" />
        {selectedAuthor
          ? selectedAuthor.name || selectedAuthor.username
          : "All Authors"}
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      <div className="absolute left-0 mt-2 min-w-[200px] max-h-[300px] overflow-auto rounded-xl bg-white border border-slate-200 shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
        {/* Clear filter option */}
        <button
          type="button"
          onClick={() => handleAuthorChange(null)}
          className={cn(
            "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2",
            !selectedAuthorId
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-700 hover:bg-slate-50"
          )}
          role="option"
          aria-selected={!selectedAuthorId}
        >
          {selectedAuthorId && <X className="w-4 h-4" />}
          All Authors
        </button>

        <div className="my-1 border-t border-slate-100" />

        {/* Author list */}
        {authors.map((author) => (
          <button
            key={author.id}
            type="button"
            onClick={() => handleAuthorChange(author.id)}
            className={cn(
              "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2",
              selectedAuthorId === author.id
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-700 hover:bg-slate-50"
            )}
            role="option"
            aria-selected={selectedAuthorId === author.id}
          >
            {author.name || author.username}
          </button>
        ))}

        {authors.length === 0 && (
          <div className="px-4 py-2.5 text-sm text-slate-500">
            No authors found
          </div>
        )}
      </div>
    </div>
  );
}
