import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/mdx";
import ArticleMeta from "@/components/article/ArticleMeta";
import ArticleBody from "@/components/article/ArticleBody";
import RelatedArticles from "@/components/article/RelatedArticles";
import TableOfContents from "@/components/article/TableOfContents";
import ShareButtons from "@/components/article/ShareButtons";
import { extractHeadings } from "@/lib/utils";
import AdSlot from "@/components/ads/AdSlot";
import Sidebar from "@/components/layout/Sidebar";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wikidigit.com";

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${siteUrl}/article/${slug}`,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.coverImage
        ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${siteUrl}/article/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.draft) notFound();

  const related = getRelatedArticles(article, 3);
  const recentArticles = getAllArticles().slice(0, 5);
  const headings = extractHeadings(article.content ?? "");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wikidigit.com";
  const articleUrl = `${siteUrl}/article/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "WikiDigit",
      url: siteUrl,
    },
    ...(article.coverImage && { image: article.coverImage }),
    url: articleUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* AD: leaderboard-top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" position="article-top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">
          {/* Main content */}
          <article className="max-w-[720px]">
            <ArticleMeta
              title={article.title}
              description={article.description}
              author={article.author}
              authorSlug={article.authorSlug}
              date={article.date}
              category={article.category}
              tags={article.tags}
              readTime={article.readTime}
            />

            <ShareButtons url={articleUrl} title={article.title} />

            {article.content && <ArticleBody content={article.content} />}

            {/* AD: end-of-article */}
            <AdSlot size="end-of-article" position="end-of-article" />

            <RelatedArticles articles={related} />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              {headings.length > 0 && <TableOfContents headings={headings} />}
              <Sidebar recentArticles={recentArticles} showAd />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
