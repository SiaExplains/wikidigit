import { Category } from "@/types/article";

// Order is editorial priority (most coverage first) and drives the nav order.
// Target coverage shares live in content/topic-weights.json.
export const categories: Category[] = [
  {
    name: "AI",
    slug: "ai",
    description: "Artificial intelligence, machine learning, and LLM breakthroughs",
    intro:
      "AI model launches, the companies building them, and the policy fights around them. We focus on what a release actually changes for the people using it, and we link the benchmarks and announcements behind every claim.",
    color: "#1D402D",
  },
  {
    name: "Startups",
    slug: "startups",
    description: "Funding rounds, founder stories, and emerging companies",
    intro:
      "Funding rounds, launches and pivots at young companies. We report who invested, how much, and what the money is for, and we say so when a valuation comes from anonymous sources rather than the company.",
    color: "#A85527",
  },
  {
    name: "Business",
    slug: "business",
    description: "Tech industry business news, M&A, and market analysis",
    intro:
      "Deals, earnings, acquisitions and restructurings across the tech industry. We read the filings and announcements so we can explain what a deal changes, not just what it costs.",
    color: "#059669",
  },
  {
    name: "Tech",
    slug: "tech",
    description: "Chips, hardware, platforms, and the policy shaping them",
    intro:
      "Chips, hardware and the platforms they run on, plus the trade and export rules that increasingly decide who can buy them.",
    color: "#2563eb",
  },
  {
    name: "Science",
    slug: "science",
    description: "Scientific research, breakthroughs, and tech innovation",
    intro:
      "Research and scientific breakthroughs with real technical consequences. We link the paper or the official announcement, and we separate a published result from a promise.",
    color: "#0891b2",
  },
  {
    name: "Robotics",
    slug: "robotics",
    description: "Humanoids, autonomous machines, and embodied AI",
    intro:
      "Humanoids, autonomous machines and embodied AI: what has been demonstrated, what has shipped, and what is still a prototype.",
    color: "#db2777",
  },
  {
    name: "Finance",
    slug: "finance",
    description: "Fintech, markets, crypto, and the money behind tech",
    intro:
      "Fintech, markets and the money behind technology companies, from IPO filings to the economics of AI infrastructure.",
    color: "#4f46e5",
  },
  {
    name: "Security",
    slug: "security",
    description: "Cybersecurity, vulnerabilities, and privacy news",
    intro:
      "Vulnerabilities, breaches, AI security and privacy. We explain what happened and who is affected, and we never publish working exploit details.",
    color: "#7c3aed",
  },
  {
    name: "Dev Tools",
    slug: "dev-tools",
    description: "Developer tooling, frameworks, and productivity software",
    intro:
      "Languages, runtimes, frameworks and developer tooling. We cover what a release changes for working engineers and link the release notes so you can check the details yourself.",
    color: "#E4A030",
  },
];

// Frontmatter stores the display name ("Dev Tools"); URLs use the slug ("dev-tools").
export function categorySlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const navCategories = categories.map((c) => ({
  name: c.name,
  href: `/category/${c.slug}`,
}));
