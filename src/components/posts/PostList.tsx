import { PostCard } from "./PostCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PostPreview } from "@/types";

interface PostListProps {
  posts: PostPreview[];
  emptyMessage?: string;
}

export function PostList({ posts, emptyMessage }: PostListProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description={emptyMessage || "Be the first to share your thoughts with the world."}
        action={{
          label: "Write a post",
          href: "/posts/new",
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

