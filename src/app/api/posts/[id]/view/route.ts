import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/posts/[id]/view - Increment post view count
export async function POST(request: NextRequest, { params }: RouteParams) {
  // Apply rate limiting to prevent abuse
  const rateLimitResponse = await checkRateLimit(request, "api");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;

    // Increment view count atomically
    await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently fail for view tracking
    console.error("Error tracking view:", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
