import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/user";
import { checkRateLimit } from "@/lib/ratelimit";
import { sendVerificationEmail } from "@/lib/email";

// POST /api/users - Register a new user
export async function POST(request: NextRequest) {
  // Apply strict rate limiting for registration to prevent abuse
  const rateLimitResponse = await checkRateLimit(request, "auth");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        name: validatedData.name || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate verification token and send email
    try {
      const verificationToken = crypto.randomBytes(32).toString("hex");

      await prisma.verificationToken.create({
        data: {
          identifier: validatedData.email,
          token: verificationToken,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      await sendVerificationEmail(validatedData.email, verificationToken);
    } catch (emailError) {
      // Log error but don't fail registration if email fails
      console.error("Failed to send verification email:", emailError);
    }

    return NextResponse.json(
      { 
        message: "User registered successfully. Please check your email to verify your account.", 
        data: user 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

