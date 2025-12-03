"use client";

import { cn } from "@/lib/utils";

interface PostContentProps {
  content: string;
  className?: string;
}

export function PostContent({ content, className }: PostContentProps) {
  return (
    <div
      className={cn(
        "prose prose-slate prose-lg max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        "prose-p:text-slate-600 prose-p:leading-relaxed",
        "prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-indigo-500 prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg",
        "prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-slate-900 prose-pre:rounded-xl",
        "prose-img:rounded-xl prose-img:shadow-lg",
        "prose-hr:border-slate-200",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

