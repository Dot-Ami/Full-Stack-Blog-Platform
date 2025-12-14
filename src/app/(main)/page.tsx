import Link from "next/link";
import { ArrowRight, PenSquare, Users, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { PostList } from "@/components/posts/PostList";
import { Button } from "@/components/ui/Button";
import type { PostPreview } from "@/types";

async function getLatestPosts(): Promise<PostPreview[]> {
  const rawPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
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
  });

  return rawPosts.map((post) => ({
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
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-10" />
        <Container size="xl" className="relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              The modern platform for writers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-6">
              Share your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                stories
              </span>{" "}
              with the world
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A beautiful platform for writers and readers. Create, share, and
              discover stories that matter. Start your writing journey today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg">
                  Start writing for free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/posts">
                <Button variant="outline" size="lg">
                  Explore posts
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <Container size="xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                <PenSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Rich Text Editor
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Write beautiful posts with our powerful editor. Add images,
                links, and formatting with ease.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Engaged Community
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Connect with readers through comments and build your audience
                with every post.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Beautiful Design
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your content looks stunning with our clean, modern design that
                puts your words first.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest Posts */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <Container size="xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Latest Posts
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Discover what our community is writing about
              </p>
            </div>
            <Link href="/posts">
              <Button variant="outline">
                View all
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <PostList posts={posts} />

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                No posts yet. Be the first to share your story!
              </p>
              <Link href="/posts/new">
                <Button>
                  <PenSquare className="w-4 h-4" />
                  Write your first post
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <Container size="md" className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start writing?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Join our community of writers and share your unique perspective with
            the world.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Get started for free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </Container>
      </section>
    </>
  );
}

