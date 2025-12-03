"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-rose-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Something went wrong!
        </h1>
        <p className="text-slate-600 mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={reset} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4" />
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

