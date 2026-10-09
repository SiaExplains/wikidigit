import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ must stay crawlable: it serves the CSS, JS and optimized images
        // Google needs to render pages and index covers. /search is kept out of the
        // index with a noindex tag instead, which crawlers can only see if allowed in.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
