import { Fragment } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/mdx";
import { SITE_URL } from "@/lib/site";
import { getCategoryBySlug, categories } from "@/lib/categories";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import AdSlot from "@/components/ads/AdSlot";
import { getAllArticles } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const articles = getArticlesByCategory(slug);
  const ogImage = articles[0]?.coverImage ?? "/images/og-default.png";

  return {
    title: `${category.name} News`,
    description: category.intro,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
    // An empty category is a thin page; keep it out of the index until it has posts.
    ...(articles.length === 0 && { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${category.name} News | WikiDigit`,
      description: category.intro,
      url: `${SITE_URL}/category/${slug}`,
      type: "website",
      images: [{ url: ogImage, alt: `${category.name} — WikiDigit` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} News | WikiDigit`,
      description: category.intro,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);
  const recentArticles = getAllArticles().slice(0, 5);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" position="category-top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="border-b border-ink/10 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-ink">{category.name}</h1>
          <p className="mt-3 text-muted leading-relaxed max-w-3xl">{category.intro}</p>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Article grid */}
          <div>
            {articles.length === 0 ? (
              <p className="text-muted">No articles yet in this category. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {articles.map((article, i) => (
                  <Fragment key={article.slug}>
                    <ArticleCard article={article} />
                    {/* AD: in-feed every 6 articles */}
                    {(i + 1) % 6 === 0 && (
                      <div className="col-span-full">
                        <AdSlot size="in-feed" position={`in-feed-${i}`} />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <Sidebar recentArticles={recentArticles} showAd />
          </aside>
        </div>
      </div>
    </>
  );
}
