// SEO regression checks against the production build output. Run `npm run build` first.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const APP = path.join(process.cwd(), ".next/server/app");
const HOST = "https://www.wikidigit.com";

function read(rel) {
  const file = path.join(APP, rel);
  assert.ok(fs.existsSync(file), `missing build output: ${rel} (did you run npm run build?)`);
  return fs.readFileSync(file, "utf8");
}

function articleSlugs() {
  return fs
    .readdirSync(path.join(process.cwd(), "content/articles"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function canonicalOf(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
}

function robotsOf(html) {
  return html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) =>
    JSON.parse(m[1])
  );
}

test("robots.txt allows /_next/ and points at the www sitemap", () => {
  const robots = read("robots.txt.body");
  assert.doesNotMatch(robots, /Disallow: \/_next/);
  assert.match(robots, new RegExp(`Sitemap: ${HOST}/sitemap.xml`));
});

test("sitemap only lists www URLs and no tag or search pages", () => {
  const sitemap = read("sitemap.xml.body");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length > 10, "sitemap looks empty");
  for (const loc of locs) {
    assert.ok(loc.startsWith(HOST), `non-canonical host in sitemap: ${loc}`);
    assert.doesNotMatch(loc, /\/(tag|search)\b/, `noindex page in sitemap: ${loc}`);
  }
  assert.ok(locs.includes(`${HOST}/editorial-standards`));
});

test("every article has a www self-canonical and valid article + BreadcrumbList JSON-LD", () => {
  for (const slug of articleSlugs()) {
    const html = read(`article/${slug}.html`);
    assert.equal(canonicalOf(html), `${HOST}/article/${slug}`, slug);
    const types = jsonLdBlocks(html).map((block) => block["@type"]);
    const articleTypes = ["NewsArticle", "AnalysisNewsArticle", "OpinionNewsArticle", "Article"];
    assert.ok(types.some((t) => articleTypes.includes(t)), `${slug}: no article JSON-LD`);
    assert.ok(types.includes("BreadcrumbList"), `${slug}: no BreadcrumbList JSON-LD`);
  }
});

test("table of contents links resolve to heading ids", () => {
  for (const slug of articleSlugs()) {
    const html = read(`article/${slug}.html`);
    const ids = new Set([...html.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]));
    for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.has(target), `${slug}: TOC link #${target} has no matching heading`);
    }
  }
});

test("search and tag pages are noindex", () => {
  assert.match(robotsOf(read("search.html")) ?? "", /noindex/);
  const tagDir = path.join(APP, "tag");
  const tagPage = fs.readdirSync(tagDir).find((f) => f.endsWith(".html"));
  assert.ok(tagPage, "no prerendered tag pages");
  assert.match(robotsOf(read(`tag/${tagPage}`)) ?? "", /noindex/);
});

test("home page has a canonical and Organization + WebSite JSON-LD", () => {
  const html = read("index.html");
  assert.equal(canonicalOf(html), HOST);
  const types = jsonLdBlocks(html).map((block) => block["@type"]);
  assert.ok(types.includes("NewsMediaOrganization"));
  assert.ok(types.includes("WebSite"));
});

test("RSS feed lists articles with www links", () => {
  const rss = read("rss.xml.body");
  const items = rss.match(/<item>/g) ?? [];
  assert.ok(items.length > 0, "RSS has no items");
  assert.doesNotMatch(rss, /https:\/\/wikidigit\.com/);
});

test("production pages render no ad placeholders", () => {
  for (const rel of ["index.html", "category/ai.html", `article/${articleSlugs()[0]}.html`]) {
    assert.doesNotMatch(read(rel), /AD · |ad-slot-dev/, rel);
  }
});

test("article type drives the JSON-LD subtype and the visible label", () => {
  const analysis = read("article/openai-ipo-trillion-dollar-filing.html");
  assert.ok(jsonLdBlocks(analysis).some((b) => b["@type"] === "AnalysisNewsArticle"));
  assert.match(analysis, />Analysis</);
  const news = read("article/runway-ai-raises-308m-series-d.html");
  assert.ok(jsonLdBlocks(news).some((b) => b["@type"] === "NewsArticle"));
});

test("posts about Emojar disclose the connection", () => {
  for (const slug of ["emojar-emoji-tool-built-with-zero-lines-of-code", "emojar-pivot-264-free-browser-tools"]) {
    assert.match(read(`article/${slug}.html`), /Disclosure:/, slug);
  }
});

test("inline images are not cropped to a fixed aspect ratio", () => {
  const html = read("article/emojar-pivot-264-free-browser-tools.html");
  const img = html.match(/<img[^>]*emojar-pivot-264-free-browser-tools-site[^>]*>/)?.[0];
  assert.ok(img, "inline screenshot not found");
  assert.match(img, /height:auto/);
  assert.doesNotMatch(html, /aspect-video[^"]*"[^>]*>\s*<img[^>]*emojar-pivot-264-free-browser-tools-site/);
});
