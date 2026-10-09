import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Standards",
  description:
    "How WikiDigit sources stories, uses AI, reviews articles before publication, and handles corrections.",
  alternates: { canonical: "/editorial-standards" },
};

export default function EditorialStandardsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-ink mb-6">Editorial Standards</h1>

      <div className="prose-article">
        <p>
          WikiDigit covers AI, startups, business, and developer tools. This page explains how we
          decide what is true enough to publish, how AI fits into our work, and what happens when
          we get something wrong.
        </p>

        <h2 id="sourcing">Sourcing</h2>
        <ul>
          <li>
            We base factual claims on primary sources wherever possible: official announcements,
            company blogs, regulatory filings, court documents, product documentation, and research
            papers. We link those sources in the article so you can check them.
          </li>
          <li>
            When we rely on another outlet&apos;s reporting, we name and link it.
          </li>
          <li>
            Figures that come from people who were not named, such as a valuation &ldquo;according
            to people familiar with the matter&rdquo;, are labelled that way.
          </li>
          <li>
            We do not invent quotes, sources, test results, or hands-on experience. If we say we
            tested something, we did.
          </li>
          <li>
            Analysis and opinion are written as such. We keep them separate from the facts they
            are about.
          </li>
        </ul>

        <h2 id="ai">How we use AI</h2>
        <p>
          We use AI tools to help with research and first drafts. AI output is treated as a draft,
          never as a source: every factual claim must trace back to a source we can link. A person
          on our team reviews and approves every article before it is published. Nothing is
          published automatically.
        </p>

        <h2 id="review">Review before publication</h2>
        <p>Before an article goes live, we check:</p>
        <ul>
          <li>names, dates, numbers, and quotes against the linked sources;</li>
          <li>that the headline and summary match what the article actually says;</li>
          <li>that images are ones we created or are allowed to use.</li>
        </ul>

        <h2 id="corrections">Corrections</h2>
        <p>
          If we publish something wrong, we fix it and say so. A correction note at the top of the
          article explains what changed and when, and the article&apos;s &ldquo;Updated&rdquo;
          date changes with it. We don&apos;t quietly edit facts out of published articles.
        </p>
        <p>
          To report an error, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("WikiDigit: Correction request")}`}>
            {CONTACT_EMAIL}
          </a>{" "}
          with the article, the claim, and a source that shows the correct information.
        </p>

        <h2 id="independence">Independence and advertising</h2>
        <p>
          Advertisers and sponsors have no influence over what we cover or what we say. Ads are
          labelled and kept visually separate from articles. If we ever publish sponsored content
          or use affiliate links, they will be clearly disclosed on the page where they appear.
        </p>

        <h2 id="contact">Contact</h2>
        <p>
          Questions about these standards are welcome; see our <Link href="/contact">contact
          page</Link>. The people responsible for WikiDigit are listed on our{" "}
          <Link href="/authors">authors page</Link> and in the <Link href="/impressum">Impressum</Link>.
        </p>
      </div>
    </div>
  );
}
