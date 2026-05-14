import Link from "next/link";

interface TagChipProps {
  tag: string;
}

export default function TagChip({ tag }: TagChipProps) {
  return (
    <Link
      href={`/tag/${tag}`}
      className="inline-block text-xs font-medium px-2.5 py-1 rounded-full border border-ink/20 text-ink/70 hover:border-rust hover:text-rust transition-colors"
    >
      #{tag}
    </Link>
  );
}
