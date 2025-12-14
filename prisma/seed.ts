import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: {
        name: "Technology",
        slug: "technology",
        description: "Posts about technology, programming, and software development",
      },
    }),
    prisma.category.upsert({
      where: { slug: "lifestyle" },
      update: {},
      create: {
        name: "Lifestyle",
        slug: "lifestyle",
        description: "Posts about lifestyle, wellness, and personal growth",
      },
    }),
    prisma.category.upsert({
      where: { slug: "travel" },
      update: {},
      create: {
        name: "Travel",
        slug: "travel",
        description: "Posts about travel, adventures, and exploring the world",
      },
    }),
    prisma.category.upsert({
      where: { slug: "design" },
      update: {},
      create: {
        name: "Design",
        slug: "design",
        description: "Posts about design, UI/UX, and creativity",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create a demo user
  // NOTE: This is a demo password for development/testing purposes only.
  // In production, users create accounts with their own passwords.
  // Use DEMO_PASSWORD env var if available, otherwise use default for development
  const demoPassword = process.env.DEMO_PASSWORD || "Demo1234";
  const hashedPassword = await bcrypt.hash(demoPassword, 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      username: "demouser",
      name: "Demo User",
      password: hashedPassword,
      bio: "Welcome to Blogify! This is a demo account to explore the platform.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);

  // Create demo posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: "getting-started-with-nextjs" },
      update: {},
      create: {
        title: "Getting Started with Next.js 14",
        slug: "getting-started-with-nextjs",
        excerpt: "Learn how to build modern web applications with Next.js 14 and the App Router.",
        content: `
          <h2>Introduction to Next.js 14</h2>
          <p>Next.js 14 brings exciting new features and improvements that make building web applications even more enjoyable. In this post, we'll explore the key features and how to get started.</p>
          
          <h3>Why Next.js?</h3>
          <p>Next.js is a React framework that provides a great developer experience with features like:</p>
          <ul>
            <li>Server-side rendering and static site generation</li>
            <li>File-based routing with the App Router</li>
            <li>Built-in optimizations for images and fonts</li>
            <li>API routes for building backends</li>
          </ul>
          
          <h3>Getting Started</h3>
          <p>To create a new Next.js project, run:</p>
          <pre><code>npx create-next-app@latest my-app</code></pre>
          
          <p>This will set up a new project with all the necessary configurations. Happy coding!</p>
        `,
        featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
        published: true,
        publishedAt: new Date(),
        authorId: demoUser.id,
        categories: {
          connect: [{ slug: "technology" }],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: "beautiful-ui-design-principles" },
      update: {},
      create: {
        title: "Beautiful UI Design Principles",
        slug: "beautiful-ui-design-principles",
        excerpt: "Discover the key principles that make user interfaces beautiful and functional.",
        content: `
          <h2>The Art of UI Design</h2>
          <p>Great user interface design is about more than just making things look pretty. It's about creating experiences that are intuitive, accessible, and delightful to use.</p>
          
          <h3>Key Principles</h3>
          <p>Here are some fundamental principles to follow:</p>
          
          <h4>1. Consistency</h4>
          <p>Use consistent colors, typography, and spacing throughout your design. This creates a cohesive experience that users can easily understand.</p>
          
          <h4>2. Hierarchy</h4>
          <p>Establish a clear visual hierarchy to guide users' attention to the most important elements first.</p>
          
          <h4>3. White Space</h4>
          <p>Don't be afraid of empty space. It helps content breathe and improves readability.</p>
          
          <h4>4. Accessibility</h4>
          <p>Design for everyone. Ensure sufficient color contrast and consider users with different abilities.</p>
        `,
        featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
        published: true,
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        authorId: demoUser.id,
        categories: {
          connect: [{ slug: "design" }],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} demo posts`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

