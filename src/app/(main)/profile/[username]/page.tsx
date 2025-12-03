import { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { Avatar } from "@/components/ui/Avatar";
import { PostList } from "@/components/posts/PostList";
import type { PostPreview } from "@/types";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

async function getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      bio: true,
      image: true,
      createdAt: true,
      posts: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          categories: true,
          _count: { select: { comments: true } },
        },
      },
      _count: {
        select: { posts: { where: { published: true } } },
      },
    },
  });

  return user;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return { title: "User Not Found" };
  }

  return {
    title: `${user.name || user.username} - Profile`,
    description: user.bio || `Check out ${user.name || user.username}'s posts on Blogify`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  return (
    <Container size="xl" className="py-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <Avatar
          src={user.image}
          alt={user.name || user.username}
          size="xl"
          className="w-24 h-24"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {user.name || user.username}
          </h1>
          <p className="text-lg text-slate-500 mb-4">@{user.username}</p>
          {user.bio && (
            <p className="text-slate-600 mb-4 max-w-2xl">{user.bio}</p>
          )}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{user._count.posts} posts</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Joined {format(new Date(user.createdAt), "MMMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Posts</h2>
        <PostList
          posts={user.posts as unknown as PostPreview[]}
          emptyMessage={`${user.name || user.username} hasn't published any posts yet.`}
        />
      </div>
    </Container>
  );
}

