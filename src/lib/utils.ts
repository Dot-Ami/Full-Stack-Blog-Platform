import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${path}`;
}

/**
 * Calculate reading time from HTML or plain text content.
 * Average reading speed: 200-250 words per minute (we use 200 for accuracy)
 */
export function calculateReadingTime(content: string): number {
  // Strip HTML tags to get plain text
  const plainText = content.replace(/<[^>]*>/g, "");
  
  // Count words (split by whitespace)
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  // Calculate reading time (200 words per minute, minimum 1 minute)
  const minutes = Math.ceil(wordCount / 200);
  
  return Math.max(1, minutes);
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

