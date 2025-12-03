import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { PostForm } from "@/components/posts/PostForm";

export const metadata: Metadata = {
  title: "Write a New Post",
  description: "Create and publish a new blog post",
};

async function getCategories() {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/posts/new");
  }

  const categories = await getCategories();

  return (
    <Container size="md" className="py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Write a new post
        </h1>
        <p className="text-slate-600">
          Share your thoughts, ideas, and stories with the world.
        </p>
      </div>
      <PostForm categories={categories} />
    </Container>
  );
}

