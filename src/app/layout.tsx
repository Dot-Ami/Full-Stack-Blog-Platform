import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Blogify - Modern Blog Platform",
    template: "%s | Blogify",
  },
  description:
    "A modern blog platform for writers and readers. Share your thoughts, ideas, and stories with the world.",
  keywords: ["blog", "writing", "posts", "articles", "stories"],
  authors: [{ name: "Blogify" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Blogify",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
