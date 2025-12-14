import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/ratelimit";

// POST /api/auth/reset-password
export async function POST(request: NextRequest) {
  // Apply strict rate limiting
  const rateLimitResponse = await checkRateLimit(request, "auth");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the password reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // Delete all other reset tokens for this user (security measure)
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetToken.email },
    });

    return NextResponse.json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
