export interface Author {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
  articleCount?: number;
}

export interface Article {
  title: string;
  slug: string;
  date: string;
  author: string;
  authorSlug: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: string;
  featured: boolean;
  draft: boolean;
  readTime: number;
  // Optional Q&A pairs: rendered under the article and emitted as FAQPage JSON-LD.
  faq?: ArticleFaq[];
  content?: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  color: string;
}

export type ArticleFrontmatter = Omit<Article, 'content'>;
