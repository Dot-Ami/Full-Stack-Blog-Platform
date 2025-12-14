import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Check if Redis is configured
const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create Redis client only if configured
const redis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Rate limiter configurations for different endpoints.
 * Adjust limits based on your needs.
 */
export const rateLimiters = {
  // Auth endpoints - strict limits to prevent brute force
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
        analytics: true,
        prefix: "@blog/ratelimit/auth",
      })
    : null,

  // API endpoints - moderate limits
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "60 s"), // 30 requests per minute
        analytics: true,
        prefix: "@blog/ratelimit/api",
      })
    : null,

  // Write operations (POST, PUT, DELETE) - stricter limits
  write: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 writes per minute
        analytics: true,
        prefix: "@blog/ratelimit/write",
      })
    : null,

  // Search endpoints - prevent abuse
  search: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "60 s"), // 20 searches per minute
        analytics: true,
        prefix: "@blog/ratelimit/search",
      })
    : null,
};

type RateLimiterType = keyof typeof rateLimiters;

/**
 * Get the client IP address from the request headers.
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  // Check common headers in order of preference
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Vercel-specific header
  const vercelForwardedFor = headersList.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0].trim();
  }

  // Fallback for development
  return "127.0.0.1";
}

/**
 * Check rate limit for a request.
 * Returns null if within limit, or a NextResponse if rate limited.
 */
export async function checkRateLimit(
  request: NextRequest,
  type: RateLimiterType = "api"
): Promise<NextResponse | null> {
  const limiter = rateLimiters[type];

  // If Redis is not configured, allow all requests (development mode)
  if (!limiter) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Rate limiting disabled: UPSTASH_REDIS credentials not configured`);
    }
    return null;
  }

  try {
    const ip = await getClientIp();
    const { success, limit, reset, remaining } = await limiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Please slow down and try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null;
  } catch (error) {
    // If rate limiting fails, log error but don't block the request
    console.error("Rate limit check failed:", error);
    return null;
  }
}

/**
 * Higher-order function to wrap API route handlers with rate limiting.
 */
export function withRateLimit<T extends NextRequest>(
  handler: (request: T) => Promise<NextResponse>,
  type: RateLimiterType = "api"
) {
  return async (request: T): Promise<NextResponse> => {
    const rateLimitResponse = await checkRateLimit(request, type);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    return handler(request);
  };
}
