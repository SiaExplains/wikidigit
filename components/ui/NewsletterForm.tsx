"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Status = { state: "idle" | "sending" } | { state: "done" | "error"; message: string };

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // When the form mounted; instant submissions are treated as bots by the server.
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot.current?.value ?? "", startedAt: startedAt.current }),
      });
      const data: { ok?: boolean; message?: string } = await res.json().catch(() => ({}));
      const message = data.message ?? "Something went wrong. Please try again.";
      setStatus(res.ok && data.ok ? { state: "done", message } : { state: "error", message });
    } catch {
      setStatus({ state: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (status.state === "done") {
    return (
      <p role="status" className="text-amber font-medium">
        {status.message}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto"
    >
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 min-w-0 px-4 py-2.5 rounded-sm bg-primary-dark border border-cream/20 text-cream placeholder-cream/40 text-sm focus:outline-none focus:border-amber"
        />
        {/* Hidden from people and assistive tech; bots tend to fill it in. */}
        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="px-5 py-2.5 bg-amber text-ink font-semibold text-sm rounded-sm hover:bg-amber/90 transition-colors disabled:opacity-60"
        >
          {status.state === "sending" ? "Sending…" : "Subscribe"}
        </button>
      </div>
      {status.state === "error" && (
        <p role="alert" className="mt-3 text-sm text-amber">
          {status.message}
        </p>
      )}
      <p className="text-cream/50 text-xs mt-3">
        We&apos;ll email you a link to confirm. Unsubscribe anytime. See our{" "}
        <Link href="/privacy" className="underline hover:text-cream">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
