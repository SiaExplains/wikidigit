import Link from "next/link";
import { Article } from "@/types/article";
import { formatDateShort } from "@/lib/utils";
import AdSlot from "@/components/ads/AdSlot";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface SidebarProps {
  recentArticles?: Article[];
  showAd?: boolean;
}

export default function Sidebar({ recentArticles = [], showAd = true }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* AD: sidebar */}
      {showAd && <AdSlot size="sidebar" position="sidebar-top" />}

      {/* Recent articles */}
      {recentArticles.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 pb-2 border-b border-ink/10">
            Recent Stories
          </h3>
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
    </aside>
  );
}
