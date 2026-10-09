import Link from "next/link";
import { categorySlug } from "@/lib/categories";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
  // Set false when the badge already sits inside a link (a nested <a> breaks hydration).
  linked?: boolean;
}

const categoryColors: Record<string, string> = {
  ai: "bg-primary text-cream",
  startups: "bg-rust text-cream",
  "dev-tools": "bg-amber text-ink",
  security: "bg-purple-700 text-white",
  science: "bg-cyan-700 text-white",
  business: "bg-emerald-700 text-white",
  tech: "bg-blue-600 text-white",
  robotics: "bg-pink-600 text-white",
  finance: "bg-indigo-600 text-white",
};

export default function CategoryBadge({ category, size = "md", linked = true }: CategoryBadgeProps) {
  const slug = categorySlug(category);
  const colorClass = categoryColors[slug] ?? "bg-ink text-cream";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1";
  const className = `inline-block font-semibold tracking-wide uppercase rounded-sm ${colorClass} ${sizeClass}`;

  if (!linked) return <span className={className}>{category}</span>;

  return (
    <Link
      href={`/category/${slug}`}
      className={`${className} hover:opacity-90 transition-opacity`}
    >
      {category}
    </Link>
  );
}
