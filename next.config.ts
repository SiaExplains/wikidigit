import type { NextConfig } from "next";
import path from "path";

// The CSP only reports for now. GA, and later AdSense with Google's consent message,
// pull in scripts and frames from many Google hosts; enforce once the reports are clean.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "img-src 'self' data: blob: https://*.google-analytics.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  // No `preload` yet: it is hard to undo, so add it once every subdomain is HTTPS-only.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
];

// Photographic covers too large as PNG were re-encoded as JPEG by
// scripts/compress-images.mjs; old URLs keep working for links and cached social cards.
const coversMovedToJpeg = [
  "anthropic-mythos-us-china-ai-guardrails",
  "chatgpt-below-50-ai-market-share-2026",
  "fable-5-returns-safety-classifier-coding-drop",
  "meta-8000-layoffs-ai-capex",
  "musk-vs-altman-openai-trial-verdict",
  "openai-5-percent-government-stake",
  "openai-ipo-trillion-dollar-filing",
  "oracle-21000-ai-layoffs-regulators",
  "recursive-superintelligence-650m-self-improving-ai",
  "south-korea-1-3-trillion-chip-ai-bet",
  "spacex-colossus-ai-compute-landlord",
  "spacexai-exodus-xai-talent-drain",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        // The original post described a "Bun 2.0" that never shipped; it now covers Bun 1.2.
        source: "/article/bun-2-ships-native-sql-and-hot-reload",
        destination: "/article/bun-1-2-built-in-postgres-s3-text-lockfile",
        permanent: true,
      },
      {
        // The original "$1.3 trillion" figure was a pre-announcement estimate; the plan was 4,755 trillion won.
        source: "/article/south-korea-1-3-trillion-chip-ai-bet",
        destination: "/article/south-korea-samsung-sk-4755-trillion-won-chip-ai-plan",
        permanent: true,
      },
      ...coversMovedToJpeg.map((name) => ({
        source: `/images/articles/${name}.png`,
        destination: `/images/articles/${name}.jpg`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
