import { Category } from "@/types/article";

// Order is editorial priority (most coverage first) and drives the nav order.
// Target coverage shares live in content/topic-weights.json.
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
    name: "Business",
    slug: "business",
    description: "Tech industry business news, M&A, and market analysis",
    color: "#059669",
  },
  {
    name: "Tech",
    slug: "tech",
    description: "Chips, hardware, platforms, and the policy shaping them",
    color: "#2563eb",
  },
  {
    name: "Science",
    slug: "science",
    description: "Scientific research, breakthroughs, and tech innovation",
    color: "#0891b2",
  },
  {
    name: "Robotics",
    slug: "robotics",
    description: "Humanoids, autonomous machines, and embodied AI",
    color: "#db2777",
  },
  {
    name: "Finance",
    slug: "finance",
    description: "Fintech, markets, crypto, and the money behind tech",
    color: "#4f46e5",
  },
  {
    name: "Security",
    slug: "security",
    description: "Cybersecurity, vulnerabilities, and privacy news",
    color: "#7c3aed",
  },
  {
    name: "Dev Tools",
    slug: "dev-tools",
    description: "Developer tooling, frameworks, and productivity software",
    color: "#E4A030",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const navCategories = categories.map((c) => ({
  name: c.name,
  href: `/category/${c.slug}`,
}));
