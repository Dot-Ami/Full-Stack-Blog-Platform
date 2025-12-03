import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/types";

interface PostMetaProps {
  author: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    bio?: string | null;
  };
  publishedAt: Date | null;
  categories: Category[];
  commentCount: number;
}

export function PostMeta({
  author,
  publishedAt,
  categories,
  commentCount,
}: PostMetaProps) {
  return (
    <div className="space-y-6">
      {/* Author */}
      <div className="flex items-center gap-4">
        <Link href={`/profile/${author.username}`}>
          <Avatar
            src={author.image}
            alt={author.name || author.username}
            size="lg"
          />
        </Link>
        <div>
          <Link
            href={`/profile/${author.username}`}
            className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            {author.name || author.username}
          </Link>
          <p className="text-sm text-slate-500">@{author.username}</p>
        </div>
      </div>

      {/* Date and stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
        {publishedAt && (
          <>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={publishedAt.toISOString()}>
                {format(new Date(publishedAt), "MMM d, yyyy")}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(publishedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4" />
          <span>
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/posts?category=${category.slug}`}>
              <Badge variant="default">{category.name}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

