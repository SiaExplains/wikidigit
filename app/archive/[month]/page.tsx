import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  formatArchiveMonth,
  getAllArticles,
  getArchiveMonths,
  getArticlesByMonth,
} from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ month: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getArchiveMonths().map((m) => ({ month: m.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const label = formatArchiveMonth(month);
  return {
    title: `${label} Archive`,
    description: `Every WikiDigit story published in ${label}.`,
    alternates: { canonical: `${SITE_URL}/archive/${month}` },
  };
}

export default async function ArchivePage({ params }: Props) {
  const { month } = await params;
  const articles = getArticlesByMonth(month);
  if (articles.length === 0) notFound();

  const recentArticles = getAllArticles().slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-ink/10 pb-6 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Archive</p>
        <h1 className="text-3xl font-bold text-ink mt-1">{formatArchiveMonth(month)}</h1>
        <p className="mt-2 text-muted">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 content-start">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <Sidebar recentArticles={recentArticles} showAd />
          </div>
        </aside>
      </div>
    </div>
  );
}
