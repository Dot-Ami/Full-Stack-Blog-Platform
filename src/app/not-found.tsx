import Link from "next/link";
import { FileQuestion, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
          <FileQuestion className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">
          Page not found
        </h2>
        <p className="text-slate-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
          been moved or deleted.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4" />
              Go home
            </Button>
          </Link>
          <Link href="/posts">
            <Button variant="outline">
              <Search className="w-4 h-4" />
              Browse posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

