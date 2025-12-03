import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PenSquare, FileText, MessageCircle, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your posts and account",
};

async function getStats(userId: string) {
  const [totalPosts, publishedPosts, totalComments] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.post.count({ where: { authorId: userId, published: true } }),
    prisma.comment.count({
      where: { post: { authorId: userId } },
    }),
  ]);

  return { totalPosts, publishedPosts, totalComments };
}

async function getRecentPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      updatedAt: true,
      _count: { select: { comments: true } },
    },
  });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [stats, recentPosts] = await Promise.all([
    getStats(session.user.id),
    getRecentPosts(session.user.id),
  ]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Container size="xl" className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {session.user.name || session.user.username}!
              </h1>
              <p className="text-slate-600">
                Here&apos;s what&apos;s happening with your posts.
              </p>
            </div>
            <Link href="/posts/new">
              <Button>
                <PenSquare className="w-4 h-4" />
                Write a post
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="p-3 rounded-xl bg-indigo-100">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Posts</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalPosts}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="p-3 rounded-xl bg-emerald-100">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Published</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.publishedPosts}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="p-3 rounded-xl bg-purple-100">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Comments</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalComments}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Posts</CardTitle>
              <Link href="/dashboard/posts">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">
                    You haven&apos;t written any posts yet.
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
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="font-medium text-slate-900 hover:text-indigo-600 transition-colors truncate block"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              post.published
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                          <span className="text-sm text-slate-500">
                            {post._count.comments} comments
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
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

