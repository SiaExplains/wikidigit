"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { parseConsent, readStoredConsent, subscribeToConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function getServerSnapshot(): string | null {
  return null;
}

// gtag.js is only requested once the reader has granted analytics. Withdrawing
// later flips analytics_storage back to denied (see saveConsent), so an
// already-loaded tag stops setting cookies.
export default function GoogleAnalytics() {
  const raw = useSyncExternalStore(subscribeToConsent, readStoredConsent, getServerSnapshot);
  const granted = parseConsent(raw)?.analytics === true;

  if (!GA_ID || !granted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`gtag('js', new Date()); gtag('config', ${JSON.stringify(GA_ID)});`}
      </Script>
    </>
  );
}
