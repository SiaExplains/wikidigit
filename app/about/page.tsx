import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/lib/authors";
import AuthorAvatar from "@/components/ui/AuthorAvatar";

export const metadata: Metadata = {
  title: "About WikiDigit",
  description:
    "WikiDigit is an independent tech news publication from Berlin covering AI, startups, developer tools, and the forces reshaping the digital world.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-ink mb-6">About WikiDigit</h1>

      <div className="prose-article">
        <p>
          WikiDigit is an independent technology news publication. We cover artificial intelligence,
          startups, business, tech, science, robotics, finance, security, and developer tools — with an editorial focus on depth,
          accuracy, and writing that respects the reader&apos;s intelligence.
        </p>

        <h2>Our Editorial Approach</h2>
        <p>
          We don&apos;t chase every press release. We look for the story behind the story — the
          structural shifts, the unexpected implications, the context that turns a funding
          announcement into something you actually need to understand.
        </p>

        <h2>How We Use AI</h2>
        <p>
          We use AI tools to help research and draft articles. A person on our team reviews and
          approves every post before it is published; nothing goes live automatically. Our
          standard is that factual claims are checked against primary sources (company
          announcements, filings, documentation, research papers) and linked in the article.
          Some of our older articles don&apos;t meet that standard yet, and we are adding sources
          to them.
        </p>
        <p>
          When we get something wrong, we correct it openly and say so at the top of the article.
          Our full sourcing, AI and corrections rules are in our{" "}
          <Link href="/editorial-standards">Editorial Standards</Link>.
        </p>

        <h2>Who We Are</h2>
        <p>
          WikiDigit is run from Berlin by Siavash Ghanbari, a software developer and indie maker
          who writes about the intersection of code, creativity, and the modern development stack,
          and Sheida Mohassesy, who covers AI, startups, and the business of technology.
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
              <AuthorAvatar name={author.name} slug={author.slug} avatar={author.avatar} size={48} linked={false} />
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
