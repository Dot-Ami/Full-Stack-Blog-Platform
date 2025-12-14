import { Metadata } from "next";
import { Suspense } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/posts/PostList";
import { SearchBar } from "@/components/shared/SearchBar";
import { AuthorFilter } from "@/components/shared/AuthorFilter";
import { PaginationLinks } from "@/components/shared/PaginationLinks";
import type { PostPreview } from "@/types";

export const metadata: Metadata = {
  title: "Explore Posts",
  description: "Discover stories from our community of writers",
};

const POSTS_PER_PAGE = 12;

interface PostsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    author?: string;
    page?: string;
  }>;
}

interface PostsResult {
  posts: PostPreview[];
  total: number;
  totalPages: number;
}

async function getPosts(
  query?: string,
  category?: string,
  authorId?: string,
  page: number = 1
): Promise<PostsResult> {
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

  if (authorId) {
    where.authorId = authorId;
  }

  const skip = (page - 1) * POSTS_PER_PAGE;

  const [rawPosts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true, // Include content for reading time calculation
        featuredImage: true,
        published: true,
        publishedAt: true,
        createdAt: true,
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
    }),
    prisma.post.count({ where }),
  ]);

  // Calculate reading time for each post
  const posts: PostPreview[] = rawPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    published: post.published,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    author: post.author,
    categories: post.categories,
    _count: post._count,
    readingTime: calculateReadingTime(post.content),
  }));

  return {
    posts,
    total,
    totalPages: Math.ceil(total / POSTS_PER_PAGE),
  };
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

async function getAuthors() {
  // Get authors who have published posts
  const authors = await prisma.user.findMany({
    where: {
      posts: {
        some: {
          published: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
    },
    orderBy: { name: "asc" },
  });

  return authors;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const { q, category, author, page } = params;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const [{ posts, total, totalPages }, categories, authors] = await Promise.all([
    getPosts(q, category, author, currentPage),
    getCategories(),
    getAuthors(),
  ]);

  const selectedAuthor = author
    ? authors.find((a) => a.id === author)
    : undefined;

  return (
    <Container size="xl" className="py-12">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          {q
            ? `Search results for "${q}"`
            : category
            ? `Posts in ${category}`
            : selectedAuthor
            ? `Posts by ${selectedAuthor.name || selectedAuthor.username}`
            : "Explore Posts"}
        </h1>
        <p className="text-slate-600 mb-6">
          {q || category || author
            ? `Found ${total} ${total === 1 ? "post" : "posts"}`
            : "Discover stories from our community of writers"}
        </p>
        <SearchBar className="max-w-md" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <a
              href="/posts"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              aria-label="Show all categories"
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
                aria-label={`Filter by ${cat.name} category`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Author Filter */}
        {authors.length > 0 && (
          <Suspense fallback={null}>
            <AuthorFilter authors={authors} selectedAuthorId={author} />
          </Suspense>
        )}
      </div>

      {/* Posts */}
      <PostList
        posts={posts}
        emptyMessage={
          q
            ? "No posts found matching your search. Try different keywords."
            : category || author
            ? "No posts found with the selected filters."
            : "No posts yet. Check back soon!"
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Suspense fallback={null}>
          <PaginationLinks
            currentPage={currentPage}
            totalPages={totalPages}
            className="mt-12"
          />
        </Suspense>
      )}
    </Container>
  );
}
