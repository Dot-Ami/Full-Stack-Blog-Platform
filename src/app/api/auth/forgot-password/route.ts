import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/ratelimit";

// POST /api/auth/forgot-password
export async function POST(request: NextRequest) {
  // Apply strict rate limiting to prevent abuse
  const rateLimitResponse = await checkRateLimit(request, "auth");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Check if user is an OAuth-only user (no password set)
    if (!user.password) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Delete any existing password reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: normalizedEmail },
    });

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Create password reset token (expires in 1 hour)
    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token: hashedToken,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(normalizedEmail, token);

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
