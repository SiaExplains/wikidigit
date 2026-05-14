import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthorBySlug, authors } from "@/lib/authors";
import { getArticlesByAuthor } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";
import AuthorAvatar from "@/components/ui/AuthorAvatar";
function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.731-8.836L1.254 2.25H8.08l4.261 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: author.name,
    description: author.bio,
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = getArticlesByAuthor(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Author header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 pb-10 border-b border-ink/10 mb-10">
        <AuthorAvatar name={author.name} slug={author.slug} avatar={author.avatar} size={80} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-ink">{author.name}</h1>
          <p className="mt-2 text-muted leading-relaxed max-w-xl">{author.bio}</p>
          <div className="flex gap-3 mt-4">
            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
              >
                <XIcon className="w-4 h-4" />
                @{author.twitter}
              </a>
            )}
            {author.linkedin && (
              <a
                href={`https://linkedin.com/in/${author.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
              >
                <LinkedInIcon className="w-4 h-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-ink mb-6">
        Articles by {author.name.split(" ")[0]}
      </h2>
      {articles.length === 0 ? (
        <p className="text-muted">No articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
