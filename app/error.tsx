"use client";

import Link from "next/link";

// Shown inside the normal layout when a page throws while rendering.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-rust">Error</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-4 text-muted">
        This page didn&apos;t load properly. It&apos;s usually temporary, so try again. If it keeps
        happening, let us know through the contact page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 text-sm rounded-sm bg-primary hover:bg-primary-light text-cream font-semibold transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 text-sm rounded-sm border border-ink/20 text-ink hover:border-ink/40 transition-colors"
        >
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
