import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send WikiDigit story tips, correction requests, press releases, or advertising questions.",
  alternates: { canonical: "/contact" },
};

const topics = [
  {
    subject: "Story tip",
    text: "Something we should cover? Include links and any context you can share.",
  },
  {
    subject: "Correction request",
    text: "Tell us the article, the claim you think is wrong, and a source that shows it.",
  },
  {
    subject: "Press release",
    text: "Send the release and a link to the official announcement.",
  },
  {
    subject: "Advertising",
    text: "Questions about sponsorships and ad placements.",
  },
];

function mailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`WikiDigit: ${subject}`)}`;
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink mb-3">Contact Us</h1>
      <p className="text-muted mb-8">
        The fastest way to reach us is email:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-rust font-medium hover:underline">
          {CONTACT_EMAIL}
        </a>
        . We read everything, but we can&apos;t reply to every message.
      </p>

      <ul className="space-y-4">
        {topics.map((topic) => (
          <li key={topic.subject} className="p-5 rounded-sm border border-ink/10">
            <a
              href={mailto(topic.subject)}
              className="font-semibold text-ink hover:text-rust transition-colors"
            >
              {topic.subject} →
            </a>
            <p className="mt-1 text-sm text-muted">{topic.text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-muted">
        How we handle corrections is described in our{" "}
        <Link href="/editorial-standards#corrections" className="text-rust hover:underline">
          Editorial Standards
        </Link>
        .
      </p>
    </div>
  );
}
