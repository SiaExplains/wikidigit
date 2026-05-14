import { formatDate } from "@/lib/utils";
import AuthorAvatar from "@/components/ui/AuthorAvatar";
import CategoryBadge from "@/components/ui/CategoryBadge";
import TagChip from "@/components/ui/TagChip";
import { Clock, Calendar } from "lucide-react";

interface ArticleMetaProps {
  title: string;
  description: string;
  author: string;
  authorSlug: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
}

export default function ArticleMeta({
  title,
  description,
  author,
  authorSlug,
  date,
  category,
  tags,
  readTime,
}: ArticleMetaProps) {
  return (
    <header className="mb-8">
      <CategoryBadge category={category} />
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-ink leading-tight max-w-3xl">
        {title}
      </h1>
      <p className="mt-3 text-lg text-muted leading-relaxed max-w-2xl">{description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted border-t border-b border-ink/10 py-4">
        <AuthorAvatar name={author} slug={authorSlug} showName size={36} />
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{readTime} min read</span>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}
    </header>
  );
}
