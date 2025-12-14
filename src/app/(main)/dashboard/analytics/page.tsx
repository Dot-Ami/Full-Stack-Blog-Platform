import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { format, subDays } from "date-fns";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BarChart3,
  TrendingUp,
  FileText,
  MessageCircle,
  Eye,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics",
  description: "View your blog analytics and insights",
};

async function getAnalytics(userId: string) {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const sevenDaysAgo = subDays(now, 7);

  // Get overall stats
  const [
    totalPosts,
    publishedPosts,
    totalComments,
    recentComments,
    postsLast30Days,
    postsLast7Days,
  ] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.post.count({ where: { authorId: userId, published: true } }),
    prisma.comment.count({ where: { post: { authorId: userId } } }),
    prisma.comment.count({
      where: {
        post: { authorId: userId },
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        published: true,
        publishedAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        published: true,
        publishedAt: { gte: sevenDaysAgo },
      },
    }),
  ]);

  // Get top posts by comments
  const topPosts = await prisma.post.findMany({
    where: { authorId: userId, published: true },
    orderBy: { comments: { _count: "desc" } },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      _count: { select: { comments: true } },
    },
  });

  // Get recent comments
  const latestComments = await prisma.comment.findMany({
    where: { post: { authorId: userId } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: { name: true, username: true },
      },
      post: {
        select: { title: true, slug: true },
      },
    },
  });

  // Get posts per category
  const categoriesWithPosts = await prisma.category.findMany({
    where: {
      posts: {
        some: { authorId: userId, published: true },
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: {
            where: { authorId: userId, published: true },
          },
        },
      },
    },
  });

  return {
    totalPosts,
    publishedPosts,
    draftPosts: totalPosts - publishedPosts,
    totalComments,
    recentComments,
    postsLast30Days,
    postsLast7Days,
    topPosts,
    latestComments,
    categoriesWithPosts,
  };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/analytics");
  }

  const analytics = await getAnalytics(session.user.id);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Container size="xl" className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Analytics
            </h1>
            <p className="text-slate-600 mt-1">
              Track your blog&apos;s performance and engagement.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="p-3 rounded-xl bg-indigo-100">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Posts</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.totalPosts}
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
                    {analytics.publishedPosts}
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
                  <p className="text-sm text-slate-500">Total Comments</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.totalComments}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <div className="p-3 rounded-xl bg-amber-100">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Comments (7 days)</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.recentComments}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Top Posts by Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.topPosts.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">
                    No published posts yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-50"
                      >
                        <span className="text-lg font-bold text-slate-400 w-6">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <a
                            href={`/posts/${post.slug}`}
                            className="font-medium text-slate-900 hover:text-indigo-600 truncate block"
                          >
                            {post.title}
                          </a>
                          <p className="text-sm text-slate-500">
                            {post._count.comments} comments
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  Recent Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.latestComments.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">
                    No comments yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {analytics.latestComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 rounded-lg bg-slate-50"
                      >
                        <p className="text-sm text-slate-700 line-clamp-2">
                          &quot;{comment.content}&quot;
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                          <span>
                            by{" "}
                            <span className="font-medium">
                              {comment.author.name || comment.author.username}
                            </span>{" "}
                            on{" "}
                            <a
                              href={`/posts/${comment.post.slug}`}
                              className="text-indigo-600 hover:underline"
                            >
                              {comment.post.title}
                            </a>
                          </span>
                          <span>
                            {format(new Date(comment.createdAt), "MMM d")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Categories Breakdown */}
          {analytics.categoriesWithPosts.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Posts by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analytics.categoriesWithPosts.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 rounded-lg bg-slate-50 text-center"
                    >
                      <p className="text-2xl font-bold text-slate-900">
                        {category._count.posts}
                      </p>
                      <p className="text-sm text-slate-500">{category.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Publishing Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Publishing Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-indigo-50 text-center">
                  <p className="text-3xl font-bold text-indigo-600">
                    {analytics.postsLast7Days}
                  </p>
                  <p className="text-slate-600">Posts in last 7 days</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {analytics.postsLast30Days}
                  </p>
                  <p className="text-slate-600">Posts in last 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
}
