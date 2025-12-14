"use client";

import { useEffect } from "react";
import Prism from "prismjs";

// Import commonly used language syntaxes
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";

/**
 * Hook to apply Prism.js syntax highlighting to code blocks.
 * Call this in any component that renders code blocks.
 */
export function useCodeHighlight(deps: React.DependencyList = []) {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      Prism.highlightAll();
    }, 0);

    return () => clearTimeout(timeout);
  }, deps);
}

/**
 * Component that triggers code highlighting on mount.
 * Place this inside any component that renders code blocks.
 */
export function CodeHighlighter() {
  useCodeHighlight([]);
  return null;
}
