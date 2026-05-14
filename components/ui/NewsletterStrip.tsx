"use client";

import { useState } from "react";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="bg-primary text-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Ahead of Tech</h2>
          <p className="text-cream/70 mb-6 text-sm">
            Get the most important tech stories delivered to your inbox every morning.
          </p>
          {submitted ? (
            <p className="text-amber font-medium">You&apos;re on the list. Welcome aboard.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-2.5 rounded-sm bg-primary-dark border border-cream/20 text-cream placeholder-cream/40 text-sm focus:outline-none focus:border-amber"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber text-ink font-semibold text-sm rounded-sm hover:bg-amber/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-cream/40 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
