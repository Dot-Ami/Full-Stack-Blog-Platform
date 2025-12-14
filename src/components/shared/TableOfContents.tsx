"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

/**
 * Auto-generates a table of contents from heading elements in HTML content.
 * Shows h2 and h3 headings with proper nesting.
 */
export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [headings, setHeadings] = useState<Heading[]>([]);

  // Parse headings from HTML content (client-side only)
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2, h3");

    const items: Heading[] = [];
    headingElements.forEach((el, index) => {
      const text = el.textContent?.trim() || "";
      if (text) {
        // Generate a slug-like ID
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `heading-${index}`;

        items.push({
          id,
          text,
          level: parseInt(el.tagName.charAt(1), 10),
        });
      }
    });

    setHeadings(items);
  }, [content]);

  // Watch for active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements on the page
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Don't render if no headings
  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={cn(
        "bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4",
        className
      )}
      aria-label="Table of contents"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <List className="w-4 h-4" aria-hidden="true" />
          Table of Contents
        </span>
        <span className="text-xs text-slate-400">{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded && (
        <ul className="mt-4 space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: (heading.level - 2) * 16 }}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "text-sm w-full text-left py-1.5 px-2 rounded transition-colors",
                  "hover:bg-slate-200/50 dark:hover:bg-slate-700/50",
                  activeId === heading.id
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 font-medium"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
