import Link from "next/link";
import { Container } from "./Container";
import { Github, Twitter, Linkedin, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50">
      <Container size="xl">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-bold text-xl tracking-tight"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">B</span>
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Blogify
                </span>
              </Link>
              <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-sm">
                A modern blog platform for writers and readers. Share your thoughts,
                ideas, and stories with the world.
              </p>
              <div className="flex gap-4 mt-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href="/feed"
                  className="p-2 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="RSS Feed"
                >
                  <Rss className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/posts"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Explore
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts/new"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Write
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feed"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    RSS Feed
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Blogify. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

