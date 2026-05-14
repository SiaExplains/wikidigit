import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface ArticleHeroProps {
  article: Article;
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <article className="group relative overflow-hidden rounded-sm bg-ink">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="relative aspect-[21/9] min-h-[320px]">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover opacity-70 group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-3xl">
            <CategoryBadge category={article.category} />
            <h1 className="mt-3 text-2xl sm:text-4xl font-bold text-cream leading-tight group-hover:text-amber transition-colors">
              {article.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-cream/70 leading-relaxed line-clamp-2 max-w-2xl">
              {article.description}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-cream/50">
              <span className="font-medium text-cream/80">{article.author}</span>
              <span>·</span>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span>·</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
