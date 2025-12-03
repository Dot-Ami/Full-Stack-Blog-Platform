import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/posts/PostList";
import { SearchBar } from "@/components/shared/SearchBar";
import type { PostPreview } from "@/types";

export const metadata: Metadata = {
  title: "Explore Posts",
  description: "Discover stories from our community of writers",
};

interface PostsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

async function getPosts(
  query?: string,
  category?: string
): Promise<PostPreview[]> {
  const where: Prisma.PostWhereInput = {
    published: true,
  };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { excerpt: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.categories = {
      some: { slug: category },
    };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: 20,
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
      _count: {
        select: { comments: true },
      },
    },
  });

  return posts as unknown as PostPreview[];
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const { q, category } = params;
  const [posts, categories] = await Promise.all([
    getPosts(q, category),
    getCategories(),
  ]);

  return (
    <Container size="xl" className="py-12">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          {q
            ? `Search results for "${q}"`
            : category
            ? `Posts in ${category}`
            : "Explore Posts"}
        </h1>
        <p className="text-slate-600 mb-6">
          {q
            ? `Found ${posts.length} ${posts.length === 1 ? "post" : "posts"}`
            : "Discover stories from our community of writers"}
        </p>
        <SearchBar className="max-w-md" />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/posts"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/posts?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat.slug
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      )}

      {/* Posts */}
      <PostList
        posts={posts}
        emptyMessage={
          q
            ? "No posts found matching your search. Try different keywords."
            : "No posts yet. Check back soon!"
        }
      />
    </Container>
  );
}
