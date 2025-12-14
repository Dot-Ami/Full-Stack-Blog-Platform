import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/ratelimit";

// POST /api/auth/send-verification - Send verification email
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await checkRateLimit(request, "auth");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email is already verified",
      });
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email },
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Store token (expires in 24 hours)
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, token);

    return NextResponse.json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
