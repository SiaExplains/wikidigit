import type { Metadata } from "next";
import { getAllArticles, getFeaturedArticle } from "@/lib/mdx";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleCard from "@/components/article/ArticleCard";
import NewsletterStrip from "@/components/ui/NewsletterStrip";
import AdSlot from "@/components/ads/AdSlot";
import { categories } from "@/lib/categories";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "WikiDigit — Tech News for the Curious",
  description:
    "Sharp, independent coverage of AI, startups, developer tools, security, and everything shaping the digital world.",
  openGraph: {
    title: "WikiDigit — Tech News for the Curious",
    description:
      "Sharp, independent coverage of AI, startups, developer tools, security, and everything shaping the digital world.",
  },
};

export default function HomePage() {
  const featured = getFeaturedArticle();
  const allArticles = getAllArticles();
  const topStories = allArticles.slice(0, 6);

  return (
    <>
      {/* AD: leaderboard-top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" position="leaderboard-top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero */}
        {featured && (
          <section className="pt-6 pb-10">
            <ArticleHero article={featured} />
          </section>
        )}

        {/* Top Stories */}
        <section className="pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">Top Stories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStories.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        {/* AD: in-feed */}
        <AdSlot size="in-feed" position="between-sections" />

        {/* Category Sections */}
        {categories.slice(0, 4).map((category) => {
          const catArticles = allArticles
            .filter((a) => a.category.toLowerCase() === category.slug)
            .slice(0, 4);

          if (catArticles.length === 0) return null;

          return (
            <section key={category.slug} className="py-8 border-t border-ink/10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-ink">{category.name}</h2>
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-1 text-xs font-medium text-rust hover:underline"
                >
                  See all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {catArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          );
        })}

        {/* AD: in-feed-2 */}
        <AdSlot size="in-feed" position="in-feed-2" />
      </div>

      {/* Newsletter */}
      <NewsletterStrip />
    </>
  );
}
