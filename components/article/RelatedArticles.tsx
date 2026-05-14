import { Article } from "@/types/article";
import ArticleCard from "@/components/article/ArticleCard";

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-ink/10 pt-10 mt-10">
      <h2 className="text-xl font-bold text-ink mb-6">More to Read</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
