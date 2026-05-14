import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/lib/authors";
import AuthorAvatar from "@/components/ui/AuthorAvatar";

export const metadata: Metadata = {
  title: "Authors",
  description: "Meet the journalists and contributors behind WikiDigit.",
};

export default function AuthorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Our Authors</h1>
        <p className="mt-2 text-muted">
          The journalists, researchers, and engineers behind WikiDigit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Link
            key={author.slug}
            href={`/authors/${author.slug}`}
            className="group block p-6 rounded-sm border border-ink/10 hover:border-primary/30 hover:shadow-sm transition-all bg-cream"
          >
            <div className="flex items-center gap-4 mb-4">
              <AuthorAvatar name={author.name} slug={author.slug} avatar={author.avatar} size={56} />
              <div>
                <h2 className="font-bold text-ink group-hover:text-rust transition-colors">
                  {author.name}
                </h2>
                {author.articleCount && (
                  <p className="text-xs text-muted mt-0.5">{author.articleCount} articles</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed line-clamp-3">{author.bio}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
