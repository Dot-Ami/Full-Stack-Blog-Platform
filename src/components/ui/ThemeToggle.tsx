"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  /** Show all three options (light, dark, system) or just toggle between light/dark */
  showSystemOption?: boolean;
}

export function ThemeToggle({
  className,
  showSystemOption = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (showSystemOption) {
    return (
      <div
        className={cn(
          "flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg",
          className
        )}
        role="radiogroup"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "p-2 rounded-md transition-colors",
            theme === "light"
              ? "bg-white dark:bg-slate-700 shadow-sm text-amber-500"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
          aria-label="Light theme"
          aria-checked={theme === "light"}
          role="radio"
        >
          <Sun className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "p-2 rounded-md transition-colors",
            theme === "dark"
              ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-500"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
          aria-label="Dark theme"
          aria-checked={theme === "dark"}
          role="radio"
        >
          <Moon className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={cn(
            "p-2 rounded-md transition-colors",
            theme === "system"
              ? "bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-300"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          )}
          aria-label="System theme"
          aria-checked={theme === "system"}
          role="radio"
        >
          <Monitor className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  // Simple toggle between light and dark
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
        "text-slate-600 dark:text-slate-400",
        className
      )}
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
    >
      {resolvedTheme === "light" ? (
        <Moon className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Sun className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}
