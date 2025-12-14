"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  postId: string;
}

/**
 * Component that tracks post views when mounted.
 * Uses a ref to ensure views are only tracked once per page load.
 */
export function ViewTracker({ postId }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per component mount
    if (hasTracked.current) return;
    hasTracked.current = true;

    // Track view after a short delay to avoid counting bots/quick bounces
    const timeout = setTimeout(() => {
      fetch(`/api/posts/${postId}/view`, {
        method: "POST",
      }).catch((error) => {
        // Silently fail - view tracking shouldn't block the user
        console.error("Failed to track view:", error);
      });
    }, 1000); // Wait 1 second before tracking

    return () => clearTimeout(timeout);
  }, [postId]);

  // This component doesn't render anything
  return null;
}
