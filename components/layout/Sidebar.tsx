import Link from "next/link";
import { Article } from "@/types/article";
import { formatDateShort } from "@/lib/utils";
import { authors } from "@/lib/authors";
import { getArchiveMonths, getArticlesByAuthor } from "@/lib/mdx";
import AdSlot from "@/components/ads/AdSlot";
import AuthorAvatar from "@/components/ui/AuthorAvatar";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface SidebarProps {
  recentArticles?: Article[];
  showAd?: boolean;
}

const headingClass =
  "text-xs font-semibold uppercase tracking-wider text-muted mb-4 pb-2 border-b border-ink/10";

export default function Sidebar({ recentArticles = [], showAd = true }: SidebarProps) {
  const archiveMonths = getArchiveMonths();

  return (
    <aside className="space-y-8">
      {/* AD: sidebar */}
      {showAd && <AdSlot size="sidebar" position="sidebar-top" />}

      {/* Recent articles */}
      {recentArticles.length > 0 && (
        <div>
          <h3 className={headingClass}>Recent Stories</h3>
          <ul className="space-y-4">
            {recentArticles.map((article) => (
              <li key={article.slug}>
                <CategoryBadge category={article.category} size="sm" />
                <Link
                  href={`/article/${article.slug}`}
                  className="block mt-1 text-sm font-medium text-ink hover:text-rust transition-colors leading-snug"
                >
                  {article.title}
                </Link>
                <p className="text-xs text-muted mt-0.5">{formatDateShort(article.date)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Authors */}
      <nav aria-label="Authors">
        <h3 className={headingClass}>Authors</h3>
        <ul className="space-y-3">
          {authors.map((author) => {
            const count = getArticlesByAuthor(author.slug).length;
            return (
              <li key={author.slug}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="flex items-center justify-between gap-3 group"
                >
                  <AuthorAvatar
                    name={author.name}
                    slug={author.slug}
                    avatar={author.avatar}
                    size={28}
                    showName
                    linked={false}
                  />
                  <span className="text-xs text-muted">{count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Monthly archive */}
      {archiveMonths.length > 0 && (
        <nav aria-label="Archive by month">
          <h3 className={headingClass}>Archive</h3>
          <ul className="space-y-2">
            {archiveMonths.map((month) => (
              <li key={month.key}>
                <Link
                  href={`/archive/${month.key}`}
                  className="flex items-center justify-between text-sm text-ink hover:text-rust transition-colors"
                >
                  <span>{month.label}</span>
                  <span className="text-xs text-muted">{month.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}
