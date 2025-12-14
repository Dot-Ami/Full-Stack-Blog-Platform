import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Clock, BookOpen } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatReadingTime } from "@/lib/utils";
import type { PostPreview } from "@/types";

interface PostCardProps {
  post: PostPreview;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-lg hover:border-slate-300/60 dark:hover:border-slate-600/60 transition-all duration-300">
      {post.featuredImage && (
        <Link href={`/posts/${post.slug}`} className="block relative">
          <div className="relative h-52 w-full overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <Link key={category.id} href={`/posts?category=${category.slug}`}>
                <Badge variant="default">{category.name}</Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <Link
            href={`/profile/${post.author.username}`}
            className="flex items-center gap-3 group/author"
          >
            <Avatar
              src={post.author.image}
              alt={post.author.name || post.author.username}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover/author:text-indigo-600 dark:group-hover/author:text-indigo-400 transition-colors">
                {post.author.name || post.author.username}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <time dateTime={post.publishedAt?.toISOString()}>
                  {post.publishedAt
                    ? formatDistanceToNow(new Date(post.publishedAt), {
                        addSuffix: true,
                      })
                    : "Draft"}
                </time>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            {post.readingTime && (
              <div className="flex items-center gap-1" aria-label={`${post.readingTime} minute read`}>
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">{formatReadingTime(post.readingTime)}</span>
              </div>
            )}
            <div className="flex items-center gap-1" aria-label={`${post._count.comments} comments`}>
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">{post._count.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

