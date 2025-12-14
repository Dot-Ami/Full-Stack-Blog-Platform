"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { CommentReplies } from "./CommentReplies";
import type { CommentWithReplies } from "@/types";

interface CommentListProps {
  comments: CommentWithReplies[];
  postId: string;
  totalCount: number;
}

export function CommentList({ comments, postId, totalCount }: CommentListProps) {
  const router = useRouter();
  const [, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    router.refresh();
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Comments ({totalCount})
        </h2>
      </div>

      {/* Comment form */}
      <CommentForm postId={postId} onSuccess={handleRefresh} />

      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <CommentItem
                comment={comment}
                postId={postId}
                onDelete={handleRefresh}
              />
              {comment.replies && comment.replies.length > 0 && (
                <CommentReplies
                  replies={comment.replies}
                  postId={postId}
                  onDelete={handleRefresh}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

