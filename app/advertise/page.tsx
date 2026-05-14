import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertise on WikiDigit",
  description:
    "Reach a highly engaged audience of tech professionals, developers, and startup founders.",
};

const adPackages = [
  {
    name: "Leaderboard",
    size: "728×90",
    placement: "Above the fold, all pages",
    cpm: "$12",
    description: "Maximum visibility. The first ad unit visitors see on every page.",
  },
  {
    name: "Sidebar Rectangle",
    size: "300×250",
    placement: "Right sidebar, article pages",
    cpm: "$9",
    description: "Persistent visibility throughout the article reading experience.",
  },
  {
    name: "In-Feed",
    size: "468×60",
    placement: "Between article grid rows",
    cpm: "$7",
    description: "Native placement within the content feed. High scroll depth.",
  },
  {
    name: "Mid-Article",
    size: "336×280",
    placement: "Inside article body",
    cpm: "$11",
    description: "Placed within engaged readers mid-article. Strong click-through.",
  },
];

export default function AdvertisePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mb-14">
        <p className="text-xs text-rust font-semibold uppercase tracking-wider mb-3">Media Kit</p>
        <h1 className="text-4xl font-bold text-ink mb-4">Advertise on WikiDigit</h1>
        <p className="text-lg text-muted leading-relaxed">
          Reach a highly engaged audience of technology professionals, developers, startup founders,
          and early adopters who are actively making purchasing decisions.
        </p>
      </div>

      {/* Stats — placeholder */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          { label: "Monthly Readers", value: "85K+" },
          { label: "Avg. Session Duration", value: "4:32" },
          { label: "Newsletter Subscribers", value: "12K+" },
          { label: "Articles Published", value: "500+" },
        ].map((stat) => (
          <div key={stat.label} className="bg-cream-dark rounded-sm p-5 text-center">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Ad packages */}
      <h2 className="text-xl font-bold text-ink mb-6">Ad Placements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {adPackages.map((pkg) => (
          <div
            key={pkg.name}
            className="p-6 rounded-sm border border-ink/10 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-ink">{pkg.name}</h3>
              <span className="text-sm font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-sm">
                {pkg.cpm} CPM
              </span>
            </div>
            <p className="text-xs text-muted font-mono mb-1">{pkg.size}</p>
            <p className="text-xs text-amber font-medium mb-3">{pkg.placement}</p>
            <p className="text-sm text-muted leading-relaxed">{pkg.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-sm p-8 text-cream text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to advertise?</h2>
        <p className="text-cream/70 mb-6">
          Contact us to discuss rates, custom placements, or sponsored content opportunities.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-amber text-ink font-semibold rounded-sm hover:bg-amber/90 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
