import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { checkRateLimit } from "@/lib/ratelimit";

// GET /api/bookmarks - Get user's bookmarks
export async function GET(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, "api");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
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
        },
      },
    });

    return NextResponse.json({ data: bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, "write");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists and is published
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || !post.published) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Post already bookmarked" },
        { status: 400 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });

    return NextResponse.json({ data: bookmark }, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, "write");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Delete bookmark
    await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    return NextResponse.json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
