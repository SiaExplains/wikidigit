export interface Author {
  name: string;
  slug: string;
  bio: string;
  // Path under /public; when absent the avatar shows the author's initials.
  avatar?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Article {
  title: string;
  slug: string;
  date: string;
  // Set only when the article was substantively changed after publication.
  updated?: string;
  author: string;
  authorSlug: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: string;
  featured: boolean;
  draft: boolean;
  // Computed from the body in lib/mdx.ts; any frontmatter value is ignored.
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
