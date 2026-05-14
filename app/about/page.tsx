import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/lib/authors";
import AuthorAvatar from "@/components/ui/AuthorAvatar";

export const metadata: Metadata = {
  title: "About WikiDigit",
  description:
    "WikiDigit is an independent tech news publication covering AI, startups, developer tools, and the forces reshaping the digital world.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-ink mb-6">About WikiDigit</h1>

      <div className="prose-article">
        <p>
          WikiDigit is an independent technology news publication. We cover artificial intelligence,
          startups, developer tools, security, and science — with an editorial focus on depth,
          accuracy, and writing that respects the reader&apos;s intelligence.
        </p>

        <h2>Our Editorial Approach</h2>
        <p>
          We don&apos;t chase every press release. We look for the story behind the story — the
          structural shifts, the unexpected implications, the context that turns a funding
          announcement into something you actually need to understand.
        </p>
        <p>
          Every article is written by a human journalist with domain expertise. We do not publish
          AI-generated content, and we are transparent when AI tools assist in research or
          synthesis.
        </p>

        <h2>Who We Are</h2>
        <p>
          WikiDigit was founded in 2025 by Siavash Khalili, a former software engineer and
          technology journalist with a decade of experience covering the intersection of technology
          and business.
        </p>
      </div>

      {/* Team */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-ink mb-6">The Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {authors.map((author) => (
            <Link
              key={author.slug}
              href={`/authors/${author.slug}`}
              className="flex items-center gap-4 p-4 rounded-sm border border-ink/10 hover:border-primary/30 transition-all group"
            >
              <AuthorAvatar name={author.name} slug={author.slug} size={48} />
              <div>
                <p className="font-semibold text-ink group-hover:text-rust transition-colors text-sm">
                  {author.name}
                </p>
                <p className="text-xs text-muted mt-0.5 line-clamp-1">{author.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
