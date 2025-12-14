import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createCommentSchema } from "@/lib/validations/comment";
import { checkRateLimit } from "@/lib/ratelimit";

// POST /api/comments - Create a comment (authenticated)
export async function POST(request: NextRequest) {
  // Apply stricter rate limiting for write operations
  const rateLimitResponse = await checkRateLimit(request, "write");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // If parentId provided, verify parent comment exists
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }

      // Prevent deeply nested replies (max 1 level)
      if (parentComment.parentId) {
        return NextResponse.json(
          { error: "Cannot reply to a reply" },
          { status: 400 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        postId: validatedData.postId,
        parentId: validatedData.parentId || null,
        authorId: session.user.id,
      },
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
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

