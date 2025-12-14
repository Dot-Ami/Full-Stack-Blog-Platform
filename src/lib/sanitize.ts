"use client";

import DOMPurify from "dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Only runs on the client side since DOMPurify requires a DOM environment.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") {
    // Return as-is on server (sanitization happens on client render)
    return dirty;
  }

  return DOMPurify.sanitize(dirty, {
    // Allow safe HTML tags for rich text content
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "a", "img",
      "hr", "div", "span",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt", "title",
      "class", "id", "style",
      "width", "height",
    ],
    // Force links to have safe attributes
    ADD_ATTR: ["target", "rel"],
    // Configure link behavior for security
    ALLOW_DATA_ATTR: false,
    // Transform hooks for additional security
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover"],
  });
}

/**
 * Strip all HTML tags, returning only text content.
 * Useful for excerpts, meta descriptions, etc.
 */
export function stripHtml(html: string): string {
  if (typeof window === "undefined") {
    // Simple regex fallback for server-side
    return html.replace(/<[^>]*>/g, "");
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
