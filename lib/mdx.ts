import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article, ArticleFrontmatter } from "@/types/article";

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
  };
}

export function getAllArticles(): Article[] {
  return getArticleSlugs()
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => a !== null && !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  );
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

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter(
      (a) =>
        a.slug !== article.slug &&
        (a.category === article.category ||
          a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, limit);
}
