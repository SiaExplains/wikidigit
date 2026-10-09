import type { Metadata } from "next";

// The search page is a client component, so its metadata lives here.
// Result pages are endless near-duplicates of the archive: crawl, don't index.
export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
