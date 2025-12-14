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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CommentForm } from "./CommentForm";
import { cn } from "@/lib/utils";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const isAuthor = session?.user?.id === comment.authorId;
  const isDeleted = comment.deleted;

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
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

      setShowDeleteConfirm(false);
      
      // Trigger fade-out animation before refreshing
      setIsFadingOut(true);
      setTimeout(() => {
        onDelete?.();
      }, 500); // Wait for animation to complete
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  // Render deleted comment with fade styling
  if (isDeleted) {
    return (
      <div className="flex gap-4 opacity-50">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <span className="text-slate-400 dark:text-slate-500 text-xs">?</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 dark:text-slate-500 italic">[deleted]</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <time className="text-sm text-slate-400 dark:text-slate-500 flex-shrink-0">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
          <p className="mt-1 text-slate-400 dark:text-slate-500 italic">[This comment has been deleted]</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-4 transition-all duration-500",
        isFadingOut && "opacity-0 scale-95"
      )}
    >
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
              className="font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
            >
              {comment.author.name || comment.author.username}
            </Link>
            <span className="text-slate-400 dark:text-slate-500">·</span>
            <time className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>

          {isAuthor && !isFadingOut && (
            <Dropdown
              trigger={
                <button
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Comment options"
                >
                  <MoreHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                </button>
              }
              label="Comment options"
            >
              <DropdownItem danger onClick={handleDeleteClick} disabled={isDeleting}>
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Delete
              </DropdownItem>
            </Dropdown>
          )}
        </div>

        <p className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.content}</p>

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

        {/* Delete confirmation dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}

