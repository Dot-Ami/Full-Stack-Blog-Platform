"use client";

import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href?: string;
  className?: string;
}

/**
 * Skip link for keyboard users to bypass navigation and jump to main content.
 * Visible only when focused.
 */
export function SkipLink({
  href = "#main-content",
  className,
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg",
        "focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        "focus:outline-none transition-all",
        className
      )}
    >
      Skip to main content
    </a>
  );
}
