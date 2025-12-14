"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { PenSquare, Menu, X, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Container } from "./Container";
import { SearchBar } from "@/components/shared/SearchBar";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60">
      <Container size="xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/posts"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Explore
            </Link>
            <SearchBar />
            <ThemeToggle />
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : session?.user ? (
              <>
                <Link href="/posts/new">
                  <Button size="sm" variant="outline">
                    <PenSquare className="w-4 h-4" />
                    Write
                  </Button>
                </Link>
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                      <Avatar
                        src={session.user.image}
                        alt={session.user.name || session.user.username}
                        size="sm"
                      />
                    </button>
                  }
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {session.user.name || session.user.username}
                    </p>
                    <p className="text-xs text-slate-500">@{session.user.username}</p>
                  </div>
                  <Link href="/dashboard">
                    <DropdownItem>
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </DropdownItem>
                  </Link>
                  <Link href={`/profile/${session.user.username}`}>
                    <DropdownItem>
                      <User className="w-4 h-4" />
                      Profile
                    </DropdownItem>
                  </Link>
                  <Link href="/dashboard/settings">
                    <DropdownItem>
                      <Settings className="w-4 h-4" />
                      Settings
                    </DropdownItem>
                  </Link>
                  <DropdownDivider />
                  <DropdownItem danger onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Theme toggle + menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Container>
            <div className="py-4 space-y-4">
              <SearchBar className="w-full" />
              <Link
                href="/posts"
                className="block py-2 text-sm font-medium text-slate-600 dark:text-slate-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              {session?.user ? (
                <>
                  <Link
                    href="/posts/new"
                    className="block py-2 text-sm font-medium text-slate-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Write a post
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-sm font-medium text-slate-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="block py-2 text-sm font-medium text-slate-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-sm font-medium text-rose-600"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Get started</Button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}

