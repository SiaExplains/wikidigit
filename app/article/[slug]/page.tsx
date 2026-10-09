import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
  lastModifiedOf,
} from "@/lib/mdx";
import { categorySlug, getCategoryBySlug } from "@/lib/categories";
import ArticleMeta from "@/components/article/ArticleMeta";
import ArticleBody from "@/components/article/ArticleBody";
import RelatedArticles from "@/components/article/RelatedArticles";
import TableOfContents from "@/components/article/TableOfContents";
import ShareButtons from "@/components/article/ShareButtons";
import ArticleFaq from "@/components/article/ArticleFaq";
import Disclosure from "@/components/article/Disclosure";
import MobileToc from "@/components/article/MobileToc";
import { extractHeadings } from "@/lib/utils";
import AdSlot from "@/components/ads/AdSlot";
import Sidebar from "@/components/layout/Sidebar";
import JsonLd from "@/components/seo/JsonLd";
import type { ArticleType } from "@/types/article";
import { SITE_LOGO, SITE_NAME, SITE_URL } from "@/lib/site";

// schema.org subtypes so machines can tell reporting from analysis and opinion.
const schemaType: Record<ArticleType, string> = {
  news: "NewsArticle",
  analysis: "AnalysisNewsArticle",
  opinion: "OpinionNewsArticle",
  explainer: "Article",
  guide: "Article",
};

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

  const image = article.coverImage ? `${SITE_URL}${article.coverImage}` : undefined;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/article/${slug}`,
      type: "article",
      publishedTime: article.date,
      modifiedTime: lastModifiedOf(article),
      authors: [article.author],
      section: article.category,
      tags: article.tags,
      images: image ? [{ url: image, alt: article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: `${SITE_URL}/article/${slug}`,
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

  const articleUrl = `${SITE_URL}/article/${slug}`;
  const category = getCategoryBySlug(categorySlug(article.category));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType[article.type],
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: lastModifiedOf(article),
    author:
      article.authorSlug === "wikidigit"
        ? { "@type": "Organization", name: article.author, url: SITE_URL }
        : { "@type": "Person", name: article.author, url: `${SITE_URL}/authors/${article.authorSlug}` },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: SITE_LOGO, width: 512, height: 512 },
    },
    ...(article.coverImage && { image: `${SITE_URL}${article.coverImage}` }),
    articleSection: article.category,
    keywords: article.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    url: articleUrl,
  };

  const faq = article.faq ?? [];
  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...(category
        ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/category/${category.slug}` }]
        : []),
      { "@type": "ListItem", position: category ? 3 : 2, name: article.title, item: articleUrl },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      {/* AD: leaderboard-top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" position="article-top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 xl:gap-16">
          {/* Main content */}
          <article className="max-w-[720px]">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-rust transition-colors">
                    Home
                  </Link>
                </li>
                {category && (
                  <>
                    <li aria-hidden="true">›</li>
                    <li>
                      <Link href={`/category/${category.slug}`} className="hover:text-rust transition-colors">
                        {category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>
            <ArticleMeta
              title={article.title}
              description={article.description}
              author={article.author}
              authorSlug={article.authorSlug}
              date={article.date}
              updated={article.updated}
              category={article.category}
              type={article.type}
              tags={article.tags}
              readTime={article.readTime}
            />

            <ShareButtons url={articleUrl} title={article.title} />

            {article.disclosure && <Disclosure text={article.disclosure} />}

            <MobileToc headings={headings} />

            {article.content && <ArticleBody content={article.content} />}

            <ArticleFaq items={faq} />

            {/* AD: end-of-article */}
            <AdSlot size="end-of-article" position="end-of-article" />

            <RelatedArticles articles={related} />
          </article>

          {/* Sidebar */}
          {/* Only the TOC stays pinned; a sticky, height-capped sidebar needed its own
              scrollbar next to the page's. The aside spans the full grid row, so the TOC
              stays stuck for the whole article. */}
          <aside className="hidden lg:block space-y-8">
            {headings.length > 0 && (
              <div className="sticky top-20 z-10 bg-cream pb-4">
                <TableOfContents headings={headings} />
              </div>
            )}
            <Sidebar recentArticles={recentArticles} showAd />
          </aside>
        </div>
      </div>
    </>
  );
}
