import { Category } from "@/types/article";

export const categories: Category[] = [
  {
    name: "AI",
    slug: "ai",
    description: "Artificial intelligence, machine learning, and LLM breakthroughs",
    color: "#1D402D",
  },
  {
    name: "Startups",
    slug: "startups",
    description: "Funding rounds, founder stories, and emerging companies",
    color: "#A85527",
  },
  {
    name: "Dev Tools",
    slug: "dev-tools",
    description: "Developer tooling, frameworks, and productivity software",
    color: "#E4A030",
  },
  {
    name: "Security",
    slug: "security",
    description: "Cybersecurity, vulnerabilities, and privacy news",
    color: "#7c3aed",
  },
  {
    name: "Science",
    slug: "science",
    description: "Scientific research, breakthroughs, and tech innovation",
    color: "#0891b2",
  },
  {
    name: "Business",
    slug: "business",
    description: "Tech industry business news, M&A, and market analysis",
    color: "#059669",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const navCategories = categories.map((c) => ({
  name: c.name,
  href: `/category/${c.slug}`,
}));
