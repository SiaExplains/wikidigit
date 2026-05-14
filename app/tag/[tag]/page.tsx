import type { Metadata } from "next";
import { getArticlesByTag, getAllArticles } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Articles tagged with #${tag} on WikiDigit`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const articles = getArticlesByTag(tag);
  const recentArticles = getAllArticles().slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-ink/10 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-ink">#{tag}</h1>
        <p className="mt-2 text-muted">{articles.length} article{articles.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        <div>
          {articles.length === 0 ? (
            <p className="text-muted">No articles found for this tag.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <Sidebar recentArticles={recentArticles} showAd />
          </div>
        </aside>
      </div>
    </div>
  );
}
