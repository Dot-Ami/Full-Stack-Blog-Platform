import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-12 flex-col justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-white">Blogify</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Share your stories
            <br />
            with the world
          </h1>
          <p className="text-indigo-200 text-lg max-w-md">
            Join thousands of writers and readers on the modern platform for
            sharing ideas, knowledge, and creativity.
          </p>
        </div>

        <p className="text-indigo-300 text-sm">
          © {new Date().getFullYear()} Blogify. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link
              href="/"
              className="flex items-center justify-center gap-2.5 font-bold text-xl tracking-tight"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Blogify
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

