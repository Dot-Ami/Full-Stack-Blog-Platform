import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { PostForm } from "@/components/posts/PostForm";
import type { PostWithDetails } from "@/types";

export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit your blog post",
};

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string, userId: string) {
  const post = await prisma.post.findFirst({
    where: { id, authorId: userId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          email: true,
          createdAt: true,
        },
      },
      categories: true,
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
      _count: { select: { comments: true } },
    },
  });

  return post;
}

async function getCategories() {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPost(id, session.user.id),
    getCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <Container size="md" className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit post</h1>
        <p className="text-slate-600">Make changes to your post.</p>
      </div>
      <PostForm post={post as unknown as PostWithDetails} categories={categories} />
    </Container>
  );
}

