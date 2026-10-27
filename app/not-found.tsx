import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAllArticles } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

// Next.js adds its own "noindex" here; overriding the layout's "index, follow" keeps the
// two robots tags from contradicting each other.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const recent = getAllArticles().slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-rust">404</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-4 text-muted">
        The link may be old, or the article may have moved. Try a search, or start from one of our
        latest stories.
      </p>

      {/* A plain GET form: works without JavaScript and lands on /search?q=… */}
      <form role="search" action="/search" method="get" className="relative mt-8">
        <label htmlFor="not-found-search" className="sr-only">
          Search articles
        </label>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="not-found-search"
          name="q"
          type="search"
          placeholder="Search articles, topics, authors…"
          className="w-full pl-12 pr-4 py-3 text-base bg-cream-dark border border-ink/10 rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-ink placeholder-muted"
        />
      </form>

      {recent.length > 0 && (
        <section className="mt-12" aria-labelledby="not-found-recent">
          <h2 id="not-found-recent" className="text-lg font-bold text-ink mb-4">
            Latest stories
          </h2>
          <ul className="space-y-5">
            {recent.map((article) => (
              <li key={article.slug}>
                <CategoryBadge category={article.category} size="sm" />
                <Link
                  href={`/article/${article.slug}`}
                  className="block mt-1 font-semibold text-ink hover:text-rust transition-colors leading-snug"
                >
                  {article.title}
                </Link>
                <p className="text-xs text-muted mt-0.5">{formatDateShort(article.date)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12">
        <Link href="/" className="text-rust font-medium underline">
          Go to the home page
        </Link>
      </p>
    </div>
  );
}
