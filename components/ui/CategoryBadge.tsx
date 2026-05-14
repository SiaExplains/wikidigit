import Link from "next/link";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
}

const categoryColors: Record<string, string> = {
  ai: "bg-primary text-cream",
  startups: "bg-rust text-cream",
  "dev-tools": "bg-amber text-ink",
  security: "bg-purple-700 text-white",
  science: "bg-cyan-700 text-white",
  business: "bg-emerald-700 text-white",
};

export default function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  const colorClass = categoryColors[slug] ?? "bg-ink text-cream";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1";

  return (
    <Link
      href={`/category/${slug}`}
      className={`inline-block font-semibold tracking-wide uppercase rounded-sm ${colorClass} ${sizeClass} hover:opacity-90 transition-opacity`}
    >
      {category}
    </Link>
  );
}
