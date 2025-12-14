"use client";

import { useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";
import { useCodeHighlight } from "@/components/shared/CodeHighlight";

interface PostContentProps {
  content: string;
  className?: string;
}

/**
 * Add IDs to heading elements for table of contents navigation.
 */
function addHeadingIds(html: string): string {
  // Use regex to find and add IDs to h2 and h3 elements
  return html.replace(
    /<(h[23])([^>]*)>([^<]+)<\/h[23]>/gi,
    (match, tag, attrs, text) => {
      // Generate slug from heading text
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      // Check if ID already exists
      if (attrs.includes('id=')) {
        return match;
      }
      
      return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
    }
  );
}

export function PostContent({ content, className }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Memoize sanitization and ID addition
  const processedContent = useMemo(() => {
    const sanitized = sanitizeHtml(content);
    return addHeadingIds(sanitized);
  }, [content]);

  // Apply syntax highlighting to code blocks
  useCodeHighlight([processedContent]);

  // Add IDs to complex headings that regex might miss
  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll("h2, h3");
    let index = 0;

    headings.forEach((heading) => {
      if (!heading.id) {
        const text = heading.textContent?.trim() || "";
        const id =
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `heading-${index}`;
        heading.id = id;
        index++;
      }
    });
  }, [processedContent]);

  return (
    <div
      ref={contentRef}
      className={cn(
        "prose prose-slate prose-lg max-w-none dark:prose-invert",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        "prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed",
        "prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-indigo-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg",
        "prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:rounded-xl",
        "prose-img:rounded-xl prose-img:shadow-lg",
        "prose-hr:border-slate-200 dark:prose-hr:border-slate-700",
        className
      )}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

