import { MetadataRoute } from "next";
import { getAllArticles, getArchiveMonths, getArticlesByCategory, lastModifiedOf } from "@/lib/mdx";
import { authors } from "@/lib/authors";
import { categories } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";
import type { Article } from "@/types/article";

function latest(articles: Article[]): Date | undefined {
  const dates = articles.map(lastModifiedOf).sort();
  return dates.length ? new Date(dates[dates.length - 1]) : undefined;
}

// Only canonical, indexable URLs. Tag and search pages are noindex, and empty
// categories stay out until they have a post.
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/article/${article.slug}`,
    lastModified: new Date(lastModifiedOf(article)),
    changeFrequency: "monthly",
    priority: 0.8,
    ...(article.coverImage && {
      images: [`${SITE_URL}${article.coverImage}`],
    }),
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.flatMap((cat) => {
    const posts = getArticlesByCategory(cat.slug);
    if (posts.length === 0) return [];
    return [
      {
        url: `${SITE_URL}/category/${cat.slug}`,
        lastModified: latest(posts),
        changeFrequency: "daily" as const,
        priority: 0.6,
      },
    ];
  });

  const authorUrls: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${SITE_URL}/authors/${author.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const archiveUrls: MetadataRoute.Sitemap = getArchiveMonths().map((month) => ({
    url: `${SITE_URL}/archive/${month.key}`,
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: latest(articles), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/editorial-standards`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/authors`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/advertise`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/impressum`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [...staticUrls, ...categoryUrls, ...authorUrls, ...archiveUrls, ...articleUrls];
}
