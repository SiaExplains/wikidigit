"use client";

import { useSyncExternalStore, useCallback } from "react";
import Link from "next/link";

const STORAGE_KEY = "wd_cookie_consent";

// useSyncExternalStore subscribers / snapshots
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function getClientSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function getServerSnapshot(): string | null {
  return null; // consent is always unknown on the server
}

export default function CookieConsent() {
  // useSyncExternalStore avoids useEffect setState and is SSR-safe
  const consent = useSyncExternalStore(
    subscribeToStorage,
    getClientSnapshot,
    getServerSnapshot,
  );

  const save = useCallback((value: "accepted" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      // Dispatch a storage event so useSyncExternalStore re-reads the value
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
    } catch {
      // ignore
    }
  }, []);

  // Hide once consent has been stored
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-ink text-cream rounded-sm shadow-2xl border border-ink/20 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <span className="text-2xl select-none shrink-0" aria-hidden>🍪</span>

        {/* Text */}
        <div className="flex-1 text-sm leading-relaxed">
          <p className="font-semibold mb-1">We use cookies</p>
          <p className="text-cream/70">
            WikiDigit uses essential cookies to keep the site working and optional cookies (Google
            Analytics, Google AdSense) to understand readership and serve relevant ads. Your data
            is handled in line with our{" "}
            <Link href="/privacy" className="underline hover:text-amber transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => save("essential")}
            className="px-4 py-2 text-sm rounded-sm border border-cream/30 text-cream/80 hover:border-cream/60 hover:text-cream transition-colors whitespace-nowrap"
          >
            Essential only
          </button>
          <button
            onClick={() => save("accepted")}
            className="px-5 py-2 text-sm rounded-sm bg-primary hover:bg-primary-light text-cream font-semibold transition-colors whitespace-nowrap"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
