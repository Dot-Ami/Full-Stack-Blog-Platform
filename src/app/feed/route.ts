import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const SITE_NAME = "Blogify";
const SITE_DESCRIPTION = "A modern blog platform for writers and readers";

export async function GET() {
  try {
    // Get the latest published posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
      include: {
        author: {
          select: { name: true, username: true },
        },
        categories: true,
      },
    });

    // Build RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.ico</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 200) + "...")}</description>
      <pubDate>${post.publishedAt?.toUTCString() || new Date(post.createdAt).toUTCString()}</pubDate>
      <author>${escapeXml(post.author.name || post.author.username)}</author>
      ${post.categories.map((cat) => `<category>${escapeXml(cat.name)}</category>`).join("\n      ")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating feed", { status: 500 });
  }
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
