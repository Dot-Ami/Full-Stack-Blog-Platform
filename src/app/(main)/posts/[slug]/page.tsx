import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/layout/Container";
import { PostContent } from "@/components/posts/PostContent";
import { PostMeta } from "@/components/posts/PostMeta";
import { FeaturedImage } from "@/components/posts/FeaturedImage";
import { CommentList } from "@/components/comments/CommentList";
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

  return (
    <article>
      {/* Header */}
      <Container size="md" className="py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-8">
          {post.title}
        </h1>
        <PostMeta
          author={post.author}
          publishedAt={post.publishedAt}
          categories={post.categories}
          commentCount={post._count.comments}
        />
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

      {/* Content */}
      <Container size="md" className="pb-12">
        <PostContent content={post.content} />
      </Container>

      {/* Author Bio */}
      {post.author.bio && (
        <Container size="md" className="pb-12">
          <div className="p-6 bg-slate-50 rounded-2xl">
            <p className="text-sm font-medium text-slate-500 mb-2">
              About the author
            </p>
            <p className="text-slate-700">{post.author.bio}</p>
          </div>
        </Container>
      )}

      {/* Comments */}
      <Container size="md" className="py-12 border-t border-slate-200">
        <CommentList
          comments={post.comments as unknown as CommentWithReplies[]}
          postId={post.id}
          totalCount={post._count.comments}
        />
      </Container>
    </article>
  );
}

