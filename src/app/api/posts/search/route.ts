import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";

// Force dynamic rendering for this route (uses request.url)
export const dynamic = "force-dynamic";

// GET /api/posts/search?q=query
export async function GET(request: NextRequest) {
  // Apply rate limiting for search to prevent abuse
  const rateLimitResponse = await checkRateLimit(request, "search");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        skip,
        take: limit,
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
          _count: {
            select: { comments: true },
          },
        },
      }),
      prisma.post.count({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total,
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}

