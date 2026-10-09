import type { Heading } from "@/lib/utils";

// The sidebar TOC is desktop-only; this collapsible version covers smaller screens
// without any client JavaScript.
export default function MobileToc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;

  return (
    <details className="lg:hidden mb-8 rounded-sm border border-ink/10 bg-cream-dark px-4 py-3 text-sm">
      <summary className="cursor-pointer font-semibold text-ink text-xs uppercase tracking-wider">
        On this page
      </summary>
      <ul className="mt-3 space-y-2">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.75rem" : 0 }}>
            <a href={`#${h.id}`} className="block leading-snug text-muted hover:text-rust">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
