"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({
  url,
  title,
  description,
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const buttonBase =
    "p-2.5 rounded-lg transition-colors flex items-center justify-center";
  const buttonHover = "hover:scale-105 active:scale-95 transition-transform";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
        Share:
      </span>

      {/* Twitter/X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonBase,
          buttonHover,
          "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
          "hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/50 dark:hover:text-sky-400"
        )}
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" aria-hidden="true" />
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonBase,
          buttonHover,
          "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
          "hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400"
        )}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" aria-hidden="true" />
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonBase,
          buttonHover,
          "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
          "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/50 dark:hover:text-blue-400"
        )}
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" aria-hidden="true" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={cn(
          buttonBase,
          buttonHover,
          copied
            ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400"
        )}
        aria-label={copied ? "Link copied!" : "Copy link to clipboard"}
      >
        {copied ? (
          <Check className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Link2 className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
