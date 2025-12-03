"use client";

import { CommentItem } from "./CommentItem";
import type { CommentWithAuthor } from "@/types";

interface CommentRepliesProps {
  replies: CommentWithAuthor[];
  postId: string;
  onDelete?: () => void;
}

export function CommentReplies({ replies, postId, onDelete }: CommentRepliesProps) {
  return (
    <div className="ml-12 pl-6 border-l-2 border-slate-100 space-y-4">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

