import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Article, ArticleFrontmatter } from "@/types/article";
import { categorySlug } from "@/lib/categories";

const articlesDir = path.join(process.cwd(), "content/articles");

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as ArticleFrontmatter;

  return {
    ...frontmatter,
    slug,
    content,
    tags: frontmatter.tags || [],
    featured: frontmatter.featured ?? false,
    draft: frontmatter.draft ?? false,
    type: frontmatter.type ?? "news",
    readTime: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

export function getAllTags(): string[] {
  return [...new Set(getAllArticles().flatMap((a) => a.tags.map((t) => t.toLowerCase())))].sort();
}

// The newest date an article was published or substantively updated.
export function lastModifiedOf(article: Article): string {
  return article.updated && article.updated > article.date ? article.updated : article.date;
}

export function getAllArticles(): Article[] {
  return getArticleSlugs()
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => a !== null && !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Accepts a slug or a display name; both sides are normalized to the slug.
export function getArticlesByCategory(category: string): Article[] {
  const slug = categorySlug(category);
  return getAllArticles().filter((a) => categorySlug(a.category) === slug);
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((a) =>
    a.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return getAllArticles().filter((a) => a.authorSlug === authorSlug);
}

export function getFeaturedArticle(): Article | null {
  return getAllArticles().find((a) => a.featured) ?? getAllArticles()[0] ?? null;
}

// Scores by topical overlap rather than recency, so a busy category (AI) doesn't
// turn "related" into "latest". Falls back to the same category when nothing overlaps.
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const all = getAllArticles().filter((a) => a.slug !== article.slug);
  const tags = new Set(article.tags.map((t) => t.toLowerCase()));
  const category = categorySlug(article.category);

  const scored = all
    .map((candidate, index) => {
      const sharedTags = candidate.tags.filter((t) => tags.has(t.toLowerCase())).length;
      const sameCategory = categorySlug(candidate.category) === category;
      const score =
        sharedTags * 3 + (sameCategory ? 2 : 0) + (sharedTags > 0 && candidate.type === article.type ? 1 : 0);
      // `all` is newest first, so a lower index breaks ties toward recent posts.
      return { candidate, score, index };
    })
    .filter((s) => s.score >= 3)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((s) => s.candidate);

  if (scored.length < limit) {
    for (const candidate of all) {
      if (scored.length >= limit) break;
      if (!scored.includes(candidate) && categorySlug(candidate.category) === category) {
        scored.push(candidate);
      }
    }
  }

  return scored.slice(0, limit);
}

export interface ArchiveMonth {
  key: string; // "2026-10"
  label: string; // "October 2026"
  count: number;
}

// Months that have published posts, newest first.
export function getArchiveMonths(): ArchiveMonth[] {
  const counts = new Map<string, number>();
  for (const article of getAllArticles()) {
    const key = article.date.slice(0, 7);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, count]) => ({ key, label: formatArchiveMonth(key), count }));
}

export function getArticlesByMonth(key: string): Article[] {
  return getAllArticles().filter((a) => a.date.startsWith(`${key}-`));
}

export function formatArchiveMonth(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
