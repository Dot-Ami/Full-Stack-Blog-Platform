import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime, absoluteUrl } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { PostContent } from "@/components/posts/PostContent";
import { PostMeta } from "@/components/posts/PostMeta";
import { FeaturedImage } from "@/components/posts/FeaturedImage";
import { CommentList } from "@/components/comments/CommentList";
import { ViewTracker } from "@/components/posts/ViewTracker";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { ReadingProgress } from "@/components/shared/ReadingProgress";
import { TableOfContents } from "@/components/shared/TableOfContents";
import { BookmarkButton } from "@/components/shared/BookmarkButton";
import type { CommentWithReplies } from "@/types";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.post.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      published: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
        },
      },
      categories: true,
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          replies: {
            orderBy: { createdAt: "asc" },
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
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author.name ? [post.author.name] : undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const postUrl = absoluteUrl(`/posts/${post.slug}`);

  return (
    <article>
      {/* View Tracker */}
      <ViewTracker postId={post.id} />
      
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Header */}
      <Container size="md" className="py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-8">
          {post.title}
        </h1>
        <PostMeta
          author={post.author}
          publishedAt={post.publishedAt}
          categories={post.categories}
          commentCount={post._count.comments}
          readingTime={calculateReadingTime(post.content)}
          views={post.views}
        />
        
        {/* Share buttons and bookmark */}
        <div className="flex items-center justify-between mt-6">
          <ShareButtons
            url={postUrl}
            title={post.title}
            description={post.excerpt || undefined}
          />
          <BookmarkButton postId={post.id} showLabel />
        </div>
      </Container>

      {/* Featured Image */}
      {post.featuredImage && (
        <Container size="lg" className="mb-12">
          <FeaturedImage
            src={post.featuredImage}
            alt={post.title}
            priority
            className="shadow-2xl"
          />
        </Container>
      )}

      {/* Content with ToC */}
      <Container size="lg" className="pb-12">
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          <PostContent content={post.content} />
          
          {/* Table of Contents - sticky sidebar on desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>
      </Container>

      {/* Author Bio */}
      {post.author.bio && (
        <Container size="md" className="pb-12">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              About the author
            </p>
            <p className="text-slate-700 dark:text-slate-300">{post.author.bio}</p>
          </div>
        </Container>
      )}

      {/* Comments */}
      <Container size="md" className="py-12 border-t border-slate-200 dark:border-slate-700">
        <CommentList
          comments={post.comments as unknown as CommentWithReplies[]}
          postId={post.id}
          totalCount={post._count.comments}
        />
      </Container>
    </article>
  );
}

