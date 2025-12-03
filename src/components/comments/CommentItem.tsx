"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Reply, Trash2, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { CommentForm } from "./CommentForm";
import type { CommentWithAuthor } from "@/types";

interface CommentItemProps {
  comment: CommentWithAuthor;
  postId: string;
  onDelete?: () => void;
}

export function CommentItem({ comment, postId, onDelete }: CommentItemProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = session?.user?.id === comment.authorId;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete comment");
      }

      toast({
        title: "Comment deleted",
        variant: "success",
      });

      onDelete?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Link href={`/profile/${comment.author.username}`}>
        <Avatar
          src={comment.author.image}
          alt={comment.author.name || comment.author.username}
          size="sm"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/profile/${comment.author.username}`}
              className="font-medium text-slate-900 hover:text-indigo-600 transition-colors truncate"
            >
              {comment.author.name || comment.author.username}
            </Link>
            <span className="text-slate-400">·</span>
            <time className="text-sm text-slate-500 flex-shrink-0">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>

          {isAuthor && (
            <Dropdown
              trigger={
                <button className="p-1 rounded hover:bg-slate-100 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              }
            >
              <DropdownItem danger onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownItem>
            </Dropdown>
          )}
        </div>

        <p className="mt-1 text-slate-700 whitespace-pre-wrap">{comment.content}</p>

        {/* Reply button - only for top-level comments */}
        {!comment.parentId && session?.user && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="text-slate-500 hover:text-slate-700"
            >
              <Reply className="w-4 h-4" />
              Reply
            </Button>
          </div>
        )}

        {/* Reply form */}
        {isReplying && (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onSuccess={() => {
                setIsReplying(false);
                onDelete?.(); // Refresh comments
              }}
              onCancel={() => setIsReplying(false)}
              placeholder="Write a reply..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

