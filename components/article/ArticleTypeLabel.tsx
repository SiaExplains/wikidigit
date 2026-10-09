import type { ArticleType } from "@/types/article";

// News is the default and gets no label; everything else is called out so
// analysis and opinion are never mistaken for straight reporting.
const labels: Partial<Record<ArticleType, string>> = {
  analysis: "Analysis",
  explainer: "Explainer",
  guide: "Guide",
  opinion: "Opinion",
};

interface ArticleTypeLabelProps {
  type: ArticleType;
  // "onDark" for use over the hero image.
  tone?: "default" | "onDark";
}

export default function ArticleTypeLabel({ type, tone = "default" }: ArticleTypeLabelProps) {
  const label = labels[type];
  if (!label) return null;
  const toneClass = tone === "onDark" ? "border-cream/40 text-cream/80" : "border-ink/25 text-ink/70";
  return (
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm border ${toneClass}`}
    >
      {label}
    </span>
  );
}
