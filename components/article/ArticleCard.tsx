import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDateShort } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <article className="flex gap-4 group">
        <Link
          href={`/article/${article.slug}`}
          className="relative flex-shrink-0 w-24 h-20 sm:w-32 sm:h-24 rounded-sm overflow-hidden bg-cream-dark"
        >
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-primary/10" />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} size="sm" />
          <Link href={`/article/${article.slug}`}>
            <h3 className="mt-1 text-sm font-semibold text-ink leading-snug group-hover:text-rust transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-muted">{formatDateShort(article.date)}</p>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="border-b border-ink/10 pb-4 group">
        <CategoryBadge category={article.category} size="sm" />
        <Link href={`/article/${article.slug}`}>
          <h3 className="mt-1.5 text-sm font-semibold text-ink leading-snug group-hover:text-rust transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-muted">
          {article.author} · {formatDateShort(article.date)}
        </p>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      <Link
        href={`/article/${article.slug}`}
        className="relative aspect-[16/9] rounded-sm overflow-hidden bg-cream-dark mb-3"
      >
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary/30 text-4xl font-serif font-bold">W</span>
          </div>
        )}
      </Link>
      <div className="flex-1 flex flex-col">
        <CategoryBadge category={article.category} />
        <Link href={`/article/${article.slug}`}>
          <h2 className="mt-2 font-bold text-ink text-lg leading-snug group-hover:text-rust transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>
        <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-2">
          {article.description}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span>{article.author}</span>
          <span>·</span>
          <time dateTime={article.date}>{formatDateShort(article.date)}</time>
          <span>·</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
