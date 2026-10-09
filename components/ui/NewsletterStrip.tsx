import { Rss } from "lucide-react";

// Placeholder until a real double opt-in signup exists. It must never pretend to
// subscribe someone.
export default function NewsletterStrip() {
  return (
    <section className="bg-primary text-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Ahead of Tech</h2>
          <p className="text-cream/70 mb-6 text-sm">
            Our email newsletter is coming soon. Until then, follow new stories in any feed reader.
          </p>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber text-ink font-semibold text-sm rounded-sm hover:bg-amber/90 transition-colors"
          >
            <Rss className="w-4 h-4" aria-hidden="true" />
            Subscribe via RSS
          </a>
        </div>
      </div>
    </section>
  );
}
