import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { formatDistanceToNow } from "date-fns";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PenSquare, Edit, Trash2, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "My Posts",
  description: "Manage your blog posts",
};

async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
    include: {
      categories: true,
      _count: { select: { comments: true } },
    },
  });
}

export default async function MyPostsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  const posts = await getUserPosts(session.user.id);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Container size="xl" className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Posts</h1>
              <p className="text-slate-600">
                Manage and edit your blog posts
              </p>
            </div>
            <Link href="/posts/new">
              <Button>
                <PenSquare className="w-4 h-4" />
                New post
              </Button>
            </Link>
          </div>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>All Posts ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">
                    You haven&apos;t created any posts yet.
                  </p>
                  <Link href="/posts/new">
                    <Button>
                      <PenSquare className="w-4 h-4" />
                      Write your first post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between py-5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate"
                          >
                            {post.title}
                          </Link>
                          <Badge
                            variant={post.published ? "success" : "warning"}
                          >
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>
                            Updated{" "}
                            {formatDistanceToNow(new Date(post.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <span>{post._count.comments} comments</span>
                          {post.categories.length > 0 && (
                            <span>
                              {post.categories.map((c) => c.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/posts/${post.slug}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
}

