"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ArticleCard from "@/components/article/ArticleCard";
import { Search } from "lucide-react";
import type { Article } from "@/types/article";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setArticles([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-ink mb-8">Search</h1>

      <form onSubmit={handleSubmit} className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, topics, authors…"
          autoFocus
          className="w-full pl-12 pr-4 py-4 text-base bg-cream-dark border border-ink/10 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-ink placeholder-muted"
        />
      </form>

      {loading && (
        <div className="flex items-center gap-2 text-muted text-sm">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Searching…
        </div>
      )}

      {!loading && query.trim() && articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-sm text-muted/60 mt-2">Try a different search term</p>
        </div>
      )}

      {articles.length > 0 && (
        <>
          <p className="text-sm text-muted mb-6">
            {articles.length} result{articles.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </>
      )}

      {!query.trim() && (
        <div className="text-center py-16">
          <p className="text-muted text-lg">Start typing to search</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-muted">Loading…</div>}>
      <SearchResults />
    </Suspense>
  );
}
