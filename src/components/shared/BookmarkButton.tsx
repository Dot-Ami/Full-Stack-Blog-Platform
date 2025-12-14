"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface BookmarkButtonProps {
  postId: string;
  className?: string;
  /** Show text label alongside icon */
  showLabel?: boolean;
  /** Initial bookmark state (for SSR) */
  initialBookmarked?: boolean;
}

export function BookmarkButton({
  postId,
  className,
  showLabel = false,
  initialBookmarked = false,
}: BookmarkButtonProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  // Check if post is bookmarked on mount
  useEffect(() => {
    if (!session?.user) return;

    const checkBookmark = async () => {
      try {
        const response = await fetch("/api/bookmarks");
        if (response.ok) {
          const { data } = await response.json();
          const bookmarked = data.some(
            (bookmark: { postId: string }) => bookmark.postId === postId
          );
          setIsBookmarked(bookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    };

    checkBookmark();
  }, [session?.user, postId]);

  const handleToggle = async () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark posts.",
        variant: "default",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?postId=${postId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove bookmark");
        }

        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          variant: "default",
        });
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        if (!response.ok) {
          throw new Error("Failed to add bookmark");
        }

        setIsBookmarked(true);
        toast({
          title: "Post bookmarked",
          description: "You can find this in your saved posts.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isBookmarked
          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
        className
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Bookmark className="w-5 h-5" aria-hidden="true" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isBookmarked ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
