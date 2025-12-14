"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }

      const scrollProgress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      setProgress(scrollProgress);
    };

    // Calculate initial progress
    calculateProgress();

    // Add scroll listener
    window.addEventListener("scroll", calculateProgress, { passive: true });
    window.addEventListener("resize", calculateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/50 dark:bg-slate-700/50",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
