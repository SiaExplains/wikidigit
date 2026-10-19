"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

export default function SearchBar({ onClose, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative flex items-center w-full">
      <label htmlFor="searchbar-input" className="sr-only">
        Search articles
      </label>
      <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" aria-hidden="true" />
      <input
        id="searchbar-input"
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles…"
        className="w-full pl-10 pr-10 py-2.5 bg-cream-dark border border-ink/10 rounded-sm text-sm text-ink placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-3 text-muted hover:text-ink"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
