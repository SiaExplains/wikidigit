// Canonical origin for every absolute URL (canonicals, sitemap, RSS, JSON-LD).
// Production serves www; the apex host redirects to it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.wikidigit.com").replace(
  /\/+$/,
  ""
);

export const SITE_NAME = "WikiDigit";
export const SITE_DESCRIPTION =
  "Sharp, independent coverage of AI, startups, developer tools, and everything shaping the digital world.";
export const SITE_LOGO = `${SITE_URL}/icon-512.png`;
export const CONTACT_EMAIL = "siaexplains@gmail.com";

// A page that sets its own `alternates` replaces the layout's, so pages that should
// advertise the feed spread this in next to their canonical.
export const RSS_ALTERNATE = {
  "application/rss+xml": [{ url: "/rss.xml", title: SITE_NAME }],
};
