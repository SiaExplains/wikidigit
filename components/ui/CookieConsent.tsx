"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  OPEN_SETTINGS_EVENT,
  parseConsent,
  readStoredConsent,
  saveConsent,
  subscribeToConsent,
} from "@/lib/consent";

function getServerSnapshot(): string | null {
  return null; // consent is always unknown on the server
}

export default function CookieConsent() {
  // useSyncExternalStore avoids useEffect setState and is SSR-safe
  const raw = useSyncExternalStore(subscribeToConsent, readStoredConsent, getServerSnapshot);
  const consent = parseConsent(raw);

  // Reopened from the footer's "Cookie settings" link, straight into the details.
  const [reopened, setReopened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    function open() {
      setAnalytics(parseConsent(readStoredConsent())?.analytics ?? false);
      setCustomizing(true);
      setReopened(true);
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  function choose(allowAnalytics: boolean) {
    saveConsent(allowAnalytics);
    setReopened(false);
    setCustomizing(false);
  }

  if (consent !== null && !reopened) return null;

  const buttonClass =
    "px-4 py-2 text-sm rounded-sm border border-cream/30 text-cream/80 hover:border-cream/60 hover:text-cream transition-colors whitespace-nowrap";
  const primaryClass =
    "px-5 py-2 text-sm rounded-sm bg-primary hover:bg-primary-light text-cream font-semibold transition-colors whitespace-nowrap";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie settings"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-ink text-cream rounded-sm shadow-2xl border border-ink/20 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon */}
          <span className="text-2xl select-none shrink-0" aria-hidden>🍪</span>

          {/* Text */}
          <div className="flex-1 text-sm leading-relaxed">
            <p className="font-semibold mb-1">We use cookies</p>
            <p className="text-cream/70">
              WikiDigit uses essential storage to remember this choice. With your permission we
              also use Google Analytics to understand which articles people read. Nothing optional
              loads until you say yes, and you can change your mind any time under Cookie settings
              in the footer. Details are in our{" "}
              <Link href="/privacy" className="underline hover:text-amber transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Actions — rejecting is exactly as easy as accepting */}
          {!customizing && (
            <div className="flex flex-wrap gap-3 shrink-0">
              <button onClick={() => setCustomizing(true)} className={buttonClass}>
                Customize
              </button>
              <button onClick={() => choose(false)} className={primaryClass}>
                Reject all
              </button>
              <button onClick={() => choose(true)} className={primaryClass}>
                Accept all
              </button>
            </div>
          )}
        </div>

        {customizing && (
          <div className="mt-5 pt-5 border-t border-cream/10 text-sm">
            <ul className="space-y-4">
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">Essential</p>
                  <p className="text-cream/60">
                    Remembers your cookie choice. Stored only in your browser. Always on.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Essential storage (always on)"
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
              </li>
              <li className="flex items-start justify-between gap-4">
                <label htmlFor="consent-analytics" className="cursor-pointer">
                  <span className="block font-semibold">Analytics</span>
                  <span className="block text-cream/60">
                    Google Analytics counts visits and pages read, using cookies set by Google.
                  </span>
                </label>
                <input
                  id="consent-analytics"
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                />
              </li>
            </ul>
            <div className="flex flex-wrap justify-end gap-3 mt-5">
              <button onClick={() => choose(false)} className={buttonClass}>
                Reject all
              </button>
              <button onClick={() => choose(analytics)} className={primaryClass}>
                Save choices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
