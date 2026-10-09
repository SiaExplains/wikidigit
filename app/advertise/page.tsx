import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Advertise on WikiDigit",
  description:
    "Sponsorship and advertising on WikiDigit, an independent tech news site covering AI, startups, and developer tools.",
  alternates: { canonical: "/advertise" },
};

const placements = [
  {
    name: "Leaderboard",
    size: "728×90",
    placement: "Top of the homepage, category and article pages",
  },
  {
    name: "Sidebar Rectangle",
    size: "300×250",
    placement: "Right sidebar on desktop",
  },
  {
    name: "In-Feed",
    size: "468×60",
    placement: "Between rows of article cards",
  },
  {
    name: "End of Article",
    size: "728×90",
    placement: "After the article body, before related stories",
  },
];

export default function AdvertisePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mb-14">
        <p className="text-xs text-rust font-semibold uppercase tracking-wider mb-3">Advertising</p>
        <h1 className="text-4xl font-bold text-ink mb-4">Advertise on WikiDigit</h1>
        <p className="text-lg text-muted leading-relaxed">
          WikiDigit is a young, independent publication covering AI, startups, business, and
          developer tools. We&apos;re open to sponsorships and direct ad placements from companies
          whose products are relevant to readers who follow technology closely.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Ask us for current traffic figures; we share real analytics numbers on request rather
          than publishing estimates.
        </p>
      </div>

      <h2 className="text-xl font-bold text-ink mb-6">Ad Placements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {placements.map((slot) => (
          <div key={slot.name} className="p-6 rounded-sm border border-ink/10">
            <h3 className="font-bold text-ink mb-3">{slot.name}</h3>
            <p className="text-xs text-muted font-mono mb-1">{slot.size}</p>
            <p className="text-sm text-muted leading-relaxed">{slot.placement}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-ink mb-4">Our Rules for Advertisers</h2>
      <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed mb-14 max-w-2xl">
        <li>Ads are always labelled and visually separate from articles.</li>
        <li>Advertisers have no say over what we cover or how we cover it.</li>
        <li>
          Sponsored content, if we ever run it, is clearly marked as sponsored. See our{" "}
          <Link href="/editorial-standards" className="text-rust hover:underline">
            Editorial Standards
          </Link>
          .
        </li>
      </ul>

      <div className="bg-primary rounded-sm p-8 text-cream text-center">
        <h2 className="text-2xl font-bold mb-2">Interested?</h2>
        <p className="text-cream/70 mb-6">
          Email us to talk about rates, placements, and audience.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Advertising on WikiDigit")}`}
          className="inline-block px-8 py-3 bg-amber text-ink font-semibold rounded-sm hover:bg-amber/90 transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}
