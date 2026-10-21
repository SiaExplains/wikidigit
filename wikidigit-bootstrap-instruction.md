# WikiDigit — Full Bootstrap Instruction

> **Purpose of this file.** This is a single, self-contained prompt for an AI coding agent (Claude Code or similar) to scaffold a **pixel-and-architecture faithful clone** of WikiDigit.com — a modern, editorial tech-news media site — from an empty directory. It was reverse-engineered from the live codebase, so it reflects the *actual* stack, versions, file layout, design tokens, and conventions in production, not an idealized plan. Follow it top to bottom.
>
> **Last brought in line with the code:** 2026-10-22 (site version 0.8.x). It covers the Phase 1–3 work from the 2026-10-09 audit (canonical host and indexation rules, RSS, structured data, honest trust pages, article types and disclosures, related-article scoring, the env-gated Resend newsletter and contact form), plus Consent Mode v2 with consent-gated Google Analytics, AdSense site verification and the accessibility pass. When you change behaviour described here, update this file in the same PR.

---

## 0. What You Are Building

**WikiDigit** is a server-rendered tech-news publication in the spirit of TechCrunch, but with a calmer, more editorial aesthetic (warm cream background, forest-green + rust palette, serif article body). Articles are authored as **MDX files on disk** — there is no CMS and no database. The business model is **display advertising (Google AdSense)**, so the architecture is SEO-first, ad-slot-aware, and optimized for low layout shift.

**Core characteristics:**
- File-based content: every article is one `.mdx` file with YAML frontmatter under `content/articles/`.
- Fully static-capable: article, category, tag, archive and author pages are statically generated from the MDX files.
- No auth, no DB, no CMS. The only server endpoints are search, the newsletter signup and the contact form; the last two send email through Resend and **appear only when Resend is configured** (env vars), otherwise the site shows honest placeholders.
- Ad slots reserve space and show a dev placeholder in development only; in production they render nothing until a real ad network is wired up.
- Trust and legal pages (About, Editorial Standards, Advertise, Contact, Privacy, Terms, Impressum) plus a cookie-consent banner.
- Editorial rule that shapes the code: nothing pretends to work. No fake forms, no invented stats, no placeholder articles.

---

## 1. Exact Tech Stack & Versions

Use these exact major versions (they are what the project runs on):

| Concern | Choice | Version |
|---|---|---|
| Framework | **Next.js (App Router)** | `16.2.6` |
| UI runtime | **React / React DOM** | `19.2.4` |
| Language | **TypeScript** | `^5` (strict) |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config.ts`) | `^4` |
| PostCSS plugin | `@tailwindcss/postcss` | `^4` |
| MDX rendering | `next-mdx-remote` (RSC entry: `next-mdx-remote/rsc`) | `^6.0.0` |
| Frontmatter parsing | `gray-matter` | `^4.0.3` |
| Dates | `date-fns` | `^4.1.0` |
| Icons | `lucide-react` | `^1.16.0` |
| Read-time | `reading-time` (computes `readTime` from the body) | `^1.5.0` |
| Linting | `eslint` + `eslint-config-next` | `^9` / `16.2.6` |
| Tests | Node's built-in `node:test`, TypeScript via `tsx` | `tsx ^4` |
| Bundler (dev) | **Turbopack** (Next 16 default) | — |

**Node types:** `@types/node ^20`, `@types/react ^19`, `@types/react-dom ^19`.

**`package.json` scripts** (exactly):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --import tsx --test tests/*.test.mjs tests/*.test.ts"
  }
}
```

Package name `wikidigit`, `"private": true`. Every change bumps `version` (semver) and adds a `CHANGELOG.md` entry. CI (`.github/workflows/ci.yml`, Node 22) runs `npm ci → lint → tsc --noEmit → build → test` on every PR; `npm test` reads the build output, so it runs after `npm run build`.

---

## 2. Project Layout (target file tree)

Scaffold **directly in the repo root** — do not nest in a subfolder.

```
/app
  layout.tsx                 ← Root layout: fonts, metadata, Consent Mode defaults in <head>, skip link, CookieConsent + Navbar + main + Footer + GoogleAnalytics
  page.tsx                   ← Home (+ NewsMediaOrganization/WebSite JSON-LD)
  globals.css                ← Tailwind import + @theme tokens + .prose-article styles
  manifest.ts                ← PWA web manifest (MetadataRoute.Manifest)
  robots.ts                  ← robots.txt (MetadataRoute.Robots)
  sitemap.ts                 ← sitemap.xml (canonical, indexable URLs only)
  /rss.xml/route.ts          ← RSS 2.0 feed (force-static, latest 50 posts)
  favicon.ico
  /api/search/route.ts       ← GET search endpoint (JSON)
  /api/newsletter/subscribe/route.ts ← POST: sends the double opt-in confirmation email
  /api/contact/route.ts      ← POST: emails a contact message to CONTACT_TO
  /newsletter/confirm/       ← page.tsx + ConfirmForm.tsx + actions.ts (server action), noindex
  /article/[slug]/page.tsx   ← Full article view (MDX) + JSON-LD + breadcrumbs + TOC + ads
  /category/[slug]/page.tsx  ← Category listing with intro
  /tag/[tag]/page.tsx        ← Tag listing (noindex, known tags only)
  /authors/page.tsx          ← Author index
  /authors/[slug]/page.tsx   ← Author profile + their articles (+ ProfilePage JSON-LD)
  /archive/[month]/page.tsx  ← Monthly archive (/archive/YYYY-MM)
  /search/page.tsx + layout.tsx ← Search UI (client, debounced); layout sets noindex
  /about/page.tsx            ← Includes "How we use AI"
  /editorial-standards/page.tsx ← Sourcing, article types, AI use, review, corrections, independence
  /contact/page.tsx          ← Email address + ContactForm when email is configured
  /advertise/page.tsx        ← Placements and advertiser rules (no audience stats)
  /privacy/page.tsx          ← Includes newsletter, contact form and Resend
  /terms/page.tsx
  /impressum/page.tsx        ← EU/German legal notice

/components
  /layout
    Navbar.tsx               ← "use client": sticky, scroll blur, mobile menu, search toggle
    Footer.tsx               ← Brand + RSS link, coverage, company, legal columns
    Sidebar.tsx              ← Sidebar ad + recent posts + Authors + monthly Archive
  /article
    ArticleCard.tsx          ← variants: "default" | "compact" | "horizontal"
    ArticleHero.tsx          ← Featured story hero (badge unlinked: it sits inside the hero link)
    ArticleBody.tsx          ← Renders MDX via next-mdx-remote/rsc + mid-article ad
    ArticleMeta.tsx          ← Title, description, author, date, Updated date, category, type label, tags, read time
    ArticleTypeLabel.tsx     ← "Analysis" / "Explainer" / "Guide" / "Opinion" (news has no label)
    Disclosure.tsx           ← Conflict-of-interest note above the body
    TableOfContents.tsx      ← "use client": IntersectionObserver active-heading (desktop sidebar)
    MobileToc.tsx            ← <details> "On this page" below lg, no JS
    RelatedArticles.tsx
    ArticleFaq.tsx           ← "Frequently asked questions" section from `faq` frontmatter
    ShareButtons.tsx         ← X, LinkedIn, copy link
  /ads
    AdSlot.tsx               ← Reserved ad space; renders nothing in production
  /seo
    JsonLd.tsx               ← <script type="application/ld+json"> with "<" escaped
  /contact
    ContactForm.tsx          ← "use client": honeypot, start time, states
  /ui
    CategoryBadge.tsx        ← `linked` prop (false inside another link)
    TagChip.tsx
    AuthorAvatar.tsx
    NewsletterStrip.tsx      ← Signup form when email is configured, else "coming soon" + RSS
    NewsletterForm.tsx       ← "use client": honeypot, start time, states
    CookieConsent.tsx        ← "use client": consent banner/dialog (Accept all / Reject all / Customize)
    CookieSettingsButton.tsx ← "use client": footer "Cookie settings" button that reopens the dialog
  /analytics
    GoogleAnalytics.tsx      ← "use client": loads gtag.js only with NEXT_PUBLIC_GA_ID and granted consent
  /mdx
    MDXComponents.tsx        ← Overrides for a/h2/h3/img/table/th/td/blockquote

/content
  /articles/*.mdx            ← All articles (see frontmatter schema §6)
  topic-weights.json         ← Target share of posts per category (drives the daily post)
  cover-log.json             ← Palette/composition each cover used (append-only, by date)

/scripts
  pick-topic.mjs             ← Picks the most under-covered category for the next post
  render-cover.mjs           ← Renders an HTML/SVG cover design to a 1216×521 PNG (headless Chrome)
  cover-style.mjs            ← Suggests, records and checks cover palettes/compositions
  /cover-template/template.html ← Cover template (palette via CSS variables)
  /cover-template/styles.json   ← Menu: 12 palettes (4 light), 12 compositions

/docs
  daily-post-playbook.md     ← Steps for the scheduled daily post (and the on-demand post skill)
  wikidigit-init-prompt.md   ← The original scaffolding prompt (historical)

/lib
  site.ts                    ← SITE_URL, SITE_NAME, SITE_LOGO, CONTACT_EMAIL, RSS_ALTERNATE, ADSENSE_PUBLISHER_ID
  consent.ts                 ← Stored consent (parse/save/expiry), Consent Mode mapping, the inline <head> default script
  mdx.ts                     ← Read/parse MDX, query helpers, related scoring, lastModifiedOf
  utils.ts                   ← formatDate, headingId, extractHeadings, cn, truncate, slugify
  categories.ts              ← Category definitions (+ intro), categorySlug, navCategories
  authors.ts                 ← Author records + lookup
  newsletter-token.ts        ← HMAC-signed, 48-hour confirmation tokens
  validate.ts                ← normalizeEmail, cleanText, looksAutomated
  rate-limit.ts              ← Per-instance sliding-window limiter
  /email
    config.ts                ← getEmailConfig() / emailEnabled() from env (server-only)
    resend.ts                ← Minimal fetch client: sendEmail, subscribeContact
    handlers.ts              ← handleSubscribe / handleConfirm / handleContact (plain, testable)
    request.ts               ← clientIp, isJson, readJson, JSON responses

/types
  article.ts                ← Article, ArticleType, Author, Category interfaces

/tests
  seo.test.mjs               ← Checks the built HTML, sitemap, robots and RSS
  email.test.ts              ← Token, validation, rate-limit and handler tests (fetch stubbed)
  consent.test.ts            ← Consent parsing/migration/expiry, Consent Mode mapping, the head script in a sandbox

/public
  /images/articles/*.png     ← Cover images (new covers 1216×521, 21:9; older ones 1216×640)
  ads.txt                    ← Authorises Google AdSense for our publisher ID (must match ADSENSE_PUBLISHER_ID)
                             (no author photos yet: avatars fall back to initials)
  og-default.png             ← 1200×630 default OG image
  favicon-16x16.png favicon-32x32.png favicon-96x96.png
  apple-touch-icon.png icon-192.png icon-512.png

.env.example                 ← Env vars (placeholders only); .gitignore has !.env.example
.github/workflows/ci.yml
next.config.ts
postcss.config.mjs
eslint.config.mjs
tsconfig.json
next-env.d.ts
```

---

## 3. Configuration Files (copy exactly)

**`next.config.ts`** — Turbopack root pin + permanent redirects for renamed articles. No `images.remotePatterns`: every image is local, and an open pattern would let anyone use the image optimizer as a proxy.
```ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  async redirects() {
    return [
      // A renamed or removed article URL always gets a permanent redirect.
      { source: "/article/<old-slug>", destination: "/article/<new-slug>", permanent: true },
    ];
  },
};

export default nextConfig;
```
Current redirects: `bun-2-ships-native-sql-and-hot-reload` → `bun-1-2-built-in-postgres-s3-text-lockfile`, `south-korea-1-3-trillion-chip-ai-bet` → `south-korea-samsung-sk-4755-trillion-won-chip-ai-plan`.

**`postcss.config.mjs`**:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

**`eslint.config.mjs`** — flat config, extends next core-web-vitals + typescript, ignores `.next`, `out`, `build`, `next-env.d.ts`, and `.claude/**`.

**`tsconfig.json`** — Next.js defaults: `strict: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, path alias `"@/*": ["./*"]`, and `plugins: [{ "name": "next" }]`. Include `.next/types/**/*.ts` and `.next/dev/types/**/*.ts`.

**`.gitignore`** — standard Next.js ignore: `/node_modules`, `/.next/`, `/out/`, `/build`, `.env*` (with `!.env.example`), `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`, `.DS_Store`.

> **Tailwind v4 note:** There is **no `tailwind.config.ts`**. All theme tokens are declared in `app/globals.css` via the `@theme { … }` block (see §4). Do not create a JS/TS Tailwind config.

---

## 4. Design System

### Philosophy
Elegant, editorial, minimal — premium publishing, not a SaaS landing page. No neon, no loud gradients. Warm cream surfaces, forest-green brand, rust/amber accents, near-black ink text. Strong type hierarchy; serif article body for a reading feel.

### Color tokens (declare in `app/globals.css` `@theme`)
```css
@import "tailwindcss";

@theme {
  --color-primary: #1D402D;        /* forest green — brand, CTAs, active nav */
  --color-primary-dark: #152e20;
  --color-primary-light: #2a5a3f;
  --color-cream: #FFF9EC;          /* page + card background (never pure white) */
  --color-cream-dark: #f5eed8;
  --color-rust: #A85527;           /* links, hover, accents */
  --color-rust-dark: #8a4420;
  --color-amber: #E4A030;          /* highlights, featured, ad-slot label */
  --color-ink: #000004;            /* body text / headings (never pure black) */
  --color-ink-soft: #1a1a1e;
  --color-muted: #6b7280;          /* secondary text */

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}
```
Rules: **no `#ffffff`** (use `cream`), **no `#000000`** (use `ink`). Tailwind utilities like `bg-cream`, `text-ink`, `text-rust`, `bg-primary`, opacity modifiers `text-ink/70`, `border-ink/10` are used pervasively.

### Typography
- UI/sans: **Geist** via `next/font/google` (`Geist`), variable `--font-geist-sans`.
- Mono: **Geist Mono** (`Geist_Mono`), variable `--font-geist-mono`.
- Article body: **serif** (Georgia stack) through the `.prose-article` class.
- After `@theme`, `globals.css` also sets base `html`/`body` (bg cream, ink text, antialiased) and a full **`.prose-article`** block styling `h1–h4` (sans, bold, ink), `p` (1.5rem bottom margin, line-height 1.8), `a` (rust → primary on hover, underline offset 3px), `blockquote` (4px primary left border, italic, muted), `code` (mono, cream-dark bg), `pre` (ink-soft bg, cream text, rounded), `ul/ol/li`, and `img` (rounded, centered). Also `.ad-slot-dev` (dashed amber outline + faint amber wash) for the dev ad placeholder.

### Layout metrics
- Global content max width: **`max-w-7xl` (1280px)**, horizontal padding `px-4 sm:px-6 lg:px-8`.
- Article body column: **`max-w-[720px]`** for readability.
- Article page is a two-column grid on `lg`: `lg:grid-cols-[1fr_280px]`. Only the TOC is sticky (inside the full-height sidebar column); the Sidebar scrolls with the page. Never give a sidebar its own capped-height scroll area: it shows a second scrollbar.
- Border radius is small and restrained: mostly `rounded-sm`.
- Card images use `aspect-[16/9]` with `object-cover` and a subtle `group-hover:scale-105` transition.

---

## 5. Data Model (`/types/article.ts`)

```ts
export interface Author {
  name: string;
  slug: string;
  bio: string;
  avatar?: string;       // optional; initials are shown when absent
  twitter?: string;
  linkedin?: string;
}

export interface Article {
  title: string;
  slug: string;
  date: string;          // ISO "YYYY-MM-DD"
  updated?: string;      // ISO; only after a substantive change → dateModified + "Updated" line
  author: string;
  authorSlug: string;
  category: string;      // display name, e.g. "AI"
  type: "news" | "analysis" | "explainer" | "guide" | "opinion"; // default "news"; labelled + JSON-LD subtype
  disclosure?: string;   // shown above the body when we cover something we're connected to
  tags: string[];
  description: string;   // ~150 chars, used for SEO + cards
  coverImage: string;    // /images/articles/…
  featured: boolean;
  draft: boolean;
  readTime: number;      // minutes, computed from the body in lib/mdx.ts (frontmatter ignored)
  faq?: { question: string; answer: string }[]; // rendered + FAQPage JSON-LD
  content?: string;      // MDX body (populated when read from disk)
}

export interface Category {
  name: string;
  slug: string;
  description: string;   // one-line summary (not rendered at the moment; `intro` is what pages show)
  intro: string;         // 2–3 sentences: shown under the category H1 and used as its meta description
  color: string;         // hex
}

export type ArticleFrontmatter = Omit<Article, "content">;
```

### Categories (`/lib/categories.ts`)
Nine categories, in nav order (= editorial priority). Export `categories: Category[]`, `getCategoryBySlug(slug)`, `categorySlug(name)` (frontmatter stores the display name, e.g. "Dev Tools"; URLs use the slug, `dev-tools` — always compare through `categorySlug`), and `navCategories = categories.map(c => ({ name, href: /category/${slug} }))`.

| Name | slug | color |
|---|---|---|
| AI | `ai` | `#1D402D` |
| Startups | `startups` | `#A85527` |
| Business | `business` | `#059669` |
| Tech | `tech` | `#2563eb` |
| Science | `science` | `#0891b2` |
| Robotics | `robotics` | `#db2777` |
| Finance | `finance` | `#4f46e5` |
| Security | `security` | `#7c3aed` |
| Dev Tools | `dev-tools` | `#E4A030` |

Target share of posts per category lives in `content/topic-weights.json`: AI 25, Startups 20, Business 15, Tech 10, Science 10, Robotics 5, Finance 5, Security 5, Dev Tools 5.

### Authors (`/lib/authors.ts`)
Export `authors: Author[]` and `getAuthorBySlug(slug)`. The roster is two real writers: `siavash-ghanbari` (Siavash Ghanbari) and `sheida-mohassesy` (Sheida Mohassesy). Optional avatar path and twitter/linkedin. Article counts are computed from the posts (`getArticlesByAuthor`), never stored.

### MDX access layer (`/lib/mdx.ts`)
Reads from `content/articles`. Provide these exact functions:
- `getArticleSlugs(): string[]` — list `.mdx` basenames.
- `getArticleBySlug(slug): Article | null` — read file, `gray-matter` parse, merge frontmatter + `slug` + `content`, default `tags`/`featured`/`draft`/`type: "news"`, and compute `readTime` with `reading-time` (any frontmatter value is ignored).
- `getAllArticles(): Article[]` — all non-draft, **sorted by date descending**.
- `getArticlesByCategory(category)` (slug or name, compared via `categorySlug`), `getArticlesByTag(tag)`, `getArticlesByAuthor(authorSlug)` — case-insensitive filters over `getAllArticles()`.
- `getAllTags()` — every tag, lowercased, for the tag pages' `generateStaticParams`.
- `lastModifiedOf(article)` — `updated` if later than `date`, else `date`. Feeds `dateModified`, OG `modifiedTime` and sitemap `lastModified`.
- `getFeaturedArticle(): Article | null` — first `featured`, else newest, else null.
- `getRelatedArticles(article, limit = 3)` — scores candidates: shared tags × 3, same category +2, same type +1 (only with a shared tag), newest breaks ties; keeps scores ≥ 3 (at least one shared tag), then fills from the same category.
- `getArchiveMonths()` — `{ key: "YYYY-MM", label, count }[]`, newest first; `getArticlesByMonth(key)`; `formatArchiveMonth(key)`.

### Utilities (`/lib/utils.ts`)
- `slugify(text)`, `formatDate(iso)` → `"MMMM d, yyyy"` (via `date-fns`), `formatDateShort` → `"MMM d, yyyy"`.
- `estimateReadTime(content)` — 200 wpm, min 1. Currently unused (`readTime` comes from `reading-time` in `lib/mdx.ts`).
- `truncate(text, length)`, `cn(...classes)` (filter falsy, join).
- `headingId(text)` — the id for a heading. Used by both `extractHeadings` (from raw markdown) and the MDX `h2`/`h3` overrides (from React children), so TOC links always resolve.
- `extractHeadings(content)` — regex `^(#{2,3})\s+(.+)$` over MDX, strips inline link/code/emphasis syntax, returns `{ id, text, level }[]`. Powers both TOCs. Export the `Heading` interface.

---

## 6. MDX Article Format

Each article is `content/articles/<slug>.mdx`. Frontmatter schema (YAML):
```yaml
---
title: "Article Title Here"
slug: "article-slug"                # must match filename
date: "2025-05-14"                  # ISO, controls sort order
updated: "2026-10-09"               # optional; only after a substantive change
author: "Siavash Ghanbari"
authorSlug: "siavash-ghanbari"      # must match a lib/authors.ts slug
category: "AI"                      # display name matching lib/categories.ts
type: "analysis"                    # optional: news (default) | analysis | explainer | guide | opinion
disclosure: "One sentence."         # optional: when we cover something we're connected to
tags: ["llm", "openai", "industry"]
description: "~150-char SEO + card summary."
coverImage: "/images/articles/cover.png"
featured: true
draft: false
faq:                                # optional, 3-4 entries; rendered + FAQPage JSON-LD
  - question: "A question readers search for?"
    answer: "A direct, self-contained 1-3 sentence answer."
---
```
Body is standard Markdown/MDX: `##`/`###` headings (these feed the TOC), `>` blockquotes, tables, `code`, images. Every article reports real events: each factual claim links a primary source, and nothing is invented (no quotes, figures, test results or "confirmed to WikiDigit"). Never generate placeholder "realistic" articles to fill the grid; publish fewer posts instead. See `/editorial-standards`.

**Corrections:** when a published fact was wrong, fix it, set `updated`, and put a dated italic note as the first paragraph: `*Correction (Month D, YYYY): what was wrong and what changed.*` Never edit facts out silently. If the slug itself states something false, move the post to a new slug and add a permanent redirect (§3).

---

## 7. Key Component & Page Behaviors

**Site constants (`lib/site.ts`):** `SITE_URL = (NEXT_PUBLIC_SITE_URL || "https://www.wikidigit.com")` with trailing slashes trimmed — production serves **www** and the apex 308-redirects there, so every absolute URL (canonicals, sitemap, robots, RSS, JSON-LD) must use it. Never inline the host anywhere else. Also `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_LOGO` (`/icon-512.png`), `CONTACT_EMAIL`, and `RSS_ALTERNATE` (spread into a page's `alternates.types`, because a page that sets its own `alternates` replaces the layout's).

**Root layout (`app/layout.tsx`):** load Geist + Geist Mono as CSS variables; `metadataBase: new URL(SITE_URL)`; title template `"%s | WikiDigit"`, default `"WikiDigit — Tech News for the Curious"`; `alternates.types` = RSS feed; full icon set + `manifest: "/manifest.webmanifest"`; OpenGraph (website, `/images/og-default.png` 1200×630) + Twitter `summary_large_image` (no `site`/`creator` handle until a real account exists); `robots` index/follow. `other: { "google-adsense-account": ADSENSE_PUBLISHER_ID }` for AdSense verification (no ad script). `<head>` gets the inline `CONSENT_DEFAULT_SCRIPT` (`lib/consent.ts`) before anything else. Body: `min-h-screen flex flex-col bg-cream text-ink` wrapping a "Skip to content" link (first Tab stop), `<CookieConsent/>` (early in the DOM so keyboard users reach it before the nav; it is fixed to the bottom visually), `<Navbar/>`, `<main id="main-content" tabIndex={-1} className="flex-1">{children}</main>`, `<Footer/>`, `<GoogleAnalytics/>`.

**Every page sets a self-canonical** (`alternates.canonical`, relative paths resolve against `metadataBase`).

**Home (`app/page.tsx`):** canonical `/` + RSS alternate; `NewsMediaOrganization` (logo, email, `publishingPrinciples` and `correctionsPolicy` → `/editorial-standards`) and `WebSite` JSON-LD; leaderboard ad → featured `ArticleHero` → "Top Stories" 3-col grid (first 6) → in-feed ad → first 4 categories each rendered as a titled row (up to 4 cards via `getArticlesByCategory`, "See all →" link) with `border-t` separators → second in-feed ad → `NewsletterStrip`.

**Article page (`app/article/[slug]/page.tsx`):** `generateStaticParams` from slugs; `generateMetadata` with per-article title/description, OG `type:"article"` (publishedTime, modifiedTime, authors, cover image), Twitter card, canonical `${SITE_URL}/article/${slug}`. JSON-LD via `<JsonLd>`:
- the article object, whose `@type` follows `type`: news → `NewsArticle`, analysis → `AnalysisNewsArticle`, opinion → `OpinionNewsArticle`, explainer/guide → `Article`; with `dateModified = lastModifiedOf`, absolute image URL, keywords, articleSection, mainEntityOfPage, Person author (author-page URL) and publisher with logo;
- `BreadcrumbList` (Home › Category › Article), matching a small visible breadcrumb above the header;
- `FAQPage` when `faq` is set.

Layout: top leaderboard ad, then the two-column grid. `<article className="max-w-[720px]">`: breadcrumb → `ArticleMeta` (category badge + type label, title, description, author, date, "Updated …" when later, read time, tags) → `ShareButtons` → `Disclosure` (if set) → `MobileToc` (3+ headings, below `lg`) → `ArticleBody` → `ArticleFaq` → end-of-article ad → `RelatedArticles`. Aside (`hidden lg:block space-y-8`): a `sticky top-20 bg-cream` wrapper holding `TableOfContents`, then `Sidebar`. `notFound()` for missing/draft.

**ArticleBody:** renders through `MDXRemote` from `next-mdx-remote/rsc` with the custom `MDXComponents` map, wrapped in `.prose-article`, and injects a mid-article `AdSlot`.

**MDXComponents:** override `a` (internal → `next/link`, external → new tab `rel="noopener noreferrer"`); `h2`/`h3` with `id={headingId(textOf(children))}` and `scroll-mt-24`; `img` → `next/image` with `width={0} height={0} sizes="(max-width: 768px) 100vw, 720px" style={{ width: "100%", height: "auto" }}` so images keep their own aspect ratio (never crop screenshots), wrapped in a `span` (MDX puts a standalone image inside a `<p>`, so no `<figure>`), with the markdown title rendered as a caption; plus styled `table`/`th`/`td`/`blockquote`.

**AdSlot (`components/ads/AdSlot.tsx`):** props `size: "leaderboard" | "in-feed" | "mid-article" | "sidebar" | "end-of-article"`, optional `position`, `className`. **Returns `null` when `NODE_ENV === "production"`** until a real ad network is integrated. In development it renders a fixed-size dashed-outline (`ad-slot-dev`) box (leaderboard 728×90, in-feed 468×60, mid-article 336×280, sidebar 300×250, end-of-article 728×90) with `data-ad-size`/`data-ad-position` and an "AD · <label>" caption.

**Navbar (`"use client"`):** sticky `top-0 z-50`; adds `backdrop-blur-md` + shadow after `scrollY > 10`; logo `Wiki<span text-rust>Digit</span>`; desktop category links with active state via `usePathname().startsWith(href)`; search icon toggles an inline search form that navigates to `/search?q=`; mobile hamburger overlay. Closes menus on route change.

**Footer:** four columns — Brand (logo, tagline, "RSS feed" link to `/rss.xml`; no social icons until real accounts exist, never `href="#"`), Coverage (categories), Company (About/Editorial Standards/Authors/Advertise/Contact), Legal (Privacy/Terms/Impressum + a "Cookie settings" button) — plus `© {year} WikiDigit`. Column titles are `<h2>` (pages whose only other heading is the `<h1>` must not jump to `<h3>`); small print stays at `text-cream/60` or brighter for WCAG AA contrast.

**Consent (`lib/consent.ts`, `CookieConsent`, `GoogleAnalytics`):** Google Consent Mode v2 starts with `ad_storage`, `analytics_storage`, `ad_user_data` and `ad_personalization` all `denied` in `<head>`; a returning reader's stored yes is re-applied there. The choice is stored as `{ v: 2, analytics, ts }` in `localStorage["wd_cookie_consent"]` (old `accepted`/`essential` values migrate) and expires after 12 months. The banner offers Accept all / Reject all (equal weight) / Customize (Analytics toggle) and calls `gtag('consent','update', …)`; withdrawing deletes `_ga*` cookies. The footer's Cookie settings button reopens it with focus inside; Escape closes a reopened dialog without changing the choice and focus returns to the button. A first-visit banner never steals focus. The banner covers analytics only: ad signals stay `denied` until AdSense goes live with Google's certified CMP. GA loads only when `NEXT_PUBLIC_GA_ID` is set and analytics is granted.

**TableOfContents (`"use client"`):** `IntersectionObserver` (`rootMargin: "-80px 0px -60% 0px"`) highlights the active heading; indents `h3` entries. **MobileToc:** the same headings in a `<details>` for small screens.

**Search:** `app/api/search/route.ts` is a `GET` that reads `?q=`, lowercases, and AND-matches every query word against a haystack of title+description+author+category+tags, returning `{ articles }` (max 20). `app/search/page.tsx` is a debounced client UI that calls it; `app/search/layout.tsx` holds its metadata (`noindex, follow`).

**Sidebar:** sidebar ad → Recent Stories → Authors (avatar, name, post count, links to `/authors/[slug]`) → Archive (one link per month to `/archive/YYYY-MM` with its post count). Used on article, category, tag and archive pages; it scrolls with the page (not sticky). It renders as `<section aria-label="More from WikiDigit">` and the page column around it is a plain `<div>`, never `<aside>`: a complementary landmark inside `<main>` fails axe.

**Category pages:** H1 + `category.intro`; meta description = intro; `noindex, follow` while the category has no posts. **Tag pages:** `generateStaticParams` from `getAllTags()` with `dynamicParams = false` (unknown tags 404, and a known tag with no posts calls `notFound()`), `noindex, follow`, self-canonical. **Archive pages:** `dynamicParams = false`. **Author pages:** bio + social + their articles, `ProfilePage` JSON-LD with a `Person` main entity (`sameAs` from twitter/linkedin).

**Trust pages:** About explains how AI is used (AI-assisted drafts, a person approves every post, older posts being sourced). Editorial Standards covers sourcing, article types, AI use, review, corrections (`#corrections`) and independence/disclosures. Advertise lists placements and rules for advertisers, and shows **no** audience numbers or prices unless they are real. Contact shows the email address and, when email is configured, the form.

**Email (`lib/email/*`, Resend):** enabled only when `RESEND_API_KEY`, `RESEND_SEGMENT_ID` and `NEWSLETTER_TOKEN_SECRET` are set (`emailEnabled()`); otherwise the endpoints return 503 and the UI shows placeholders. Server-only — never import `lib/email/*` or `lib/newsletter-token` into a client component, never use `NEXT_PUBLIC_` for these vars.
- Newsletter (double opt-in): `POST /api/newsletter/subscribe` → validate, honeypot + 2-second minimum fill time (bots get a fake success), per-IP limit (5/10 min), then email a link to `/newsletter/confirm?token=…`. The token is `base64url(payload).HMAC-SHA256`, payload `{ e: email, x: expiry }`, valid 48 h. Same response for every valid address (no enumeration); 400 invalid email; 502 provider failure. Nothing is stored before confirmation.
- Confirm: the page verifies the token up front, then a **button** submits a server action (links opened by email scanners must not subscribe anyone). It creates the contact in the segment (and topic, if `RESEND_TOPIC_ID`); if create fails it PATCHes the existing contact to `unsubscribed: false`, adds it to the segment and opts it into the topic.
- Contact: `POST /api/contact` → same protections; subject from a fixed list, name ≤ 100 chars with newlines stripped, message 10–5000 chars; plain-text email to `CONTACT_TO` with `reply_to` = sender. Nothing stored.
- Both endpoints require `Content-Type: application/json` (415 otherwise), so a cross-site form post can't reach them.

**metadata routes:** `app/sitemap.ts` lists only canonical, indexable URLs: static pages (incl. `/editorial-standards`), categories that have posts, author pages, archive months and all articles (with cover images), using `lastModifiedOf` for dates; no `new Date()` on static pages, no tag or search URLs. `app/robots.ts` allows `/`, disallows only `/api/` (never `/_next/`, which serves CSS/JS/images; `/search` stays crawlable so its `noindex` is seen), points at `${SITE_URL}/sitemap.xml`. `app/rss.xml/route.ts` returns RSS 2.0 (title, link, guid, pubDate, `dc:creator`, category, description; XML-escaped). `app/manifest.ts` returns the PWA manifest (name WikiDigit, cream `background_color`, primary `theme_color`, icon set).

---

## 7b. Content pipeline

- **Daily post:** a Claude desktop scheduled task (`wikidigit-daily-post`, 10:00) follows `docs/daily-post-playbook.md`. It picks the topic with `node scripts/pick-topic.mjs --pending "<categories of open post PRs>"`, researches Reddit/X, writes the MDX (random author from `lib/authors.ts`), draws the cover, does the SEO/AEO pass, opens a `post/<slug>` PR and sends a push notification. It never merges.
- **On-demand post:** the `/wikidigit-post-author` Claude Code skill does the same for a subject, topics, title and author that Sia gives it.
- **Covers** are drawn as HTML/SVG from `scripts/cover-template/template.html` and rendered with `node scripts/render-cover.mjs <design.html> public/images/articles/<slug>.png` (1216×521, 21:9 to match the hero). No text or logos; keep the subject in x 236–980 because cards crop to 16:9. No image-generation models.
- **Cover variety:** `node scripts/cover-style.mjs` suggests a palette and composition from `scripts/cover-template/styles.json`, `--record` logs the choice in `content/cover-log.json`, `--check <slug>` validates it and `--analyze` measures the PNGs. Rules: no palette from the previous 4 covers, no composition from the previous 3, at least one light palette in every 4.
- **Merge conflicts in `cover-log.json`:** two open post PRs both append to it. Resolve by keeping both entries in date order, then re-run `node scripts/cover-style.mjs --check <slug>`.

---

## 8. SEO & Performance Requirements

- Every page: dynamic `<title>`/`<meta description>` via `generateMetadata` (or static `metadata`), OpenGraph + Twitter tags, a self-canonical on the www host.
- Structured data: article subtype + `BreadcrumbList` (+ `FAQPage`) on articles, `NewsMediaOrganization` + `WebSite` on home, `ProfilePage` on authors. JSON-LD must match what the page shows.
- Indexation: tag pages, `/search` and empty categories are `noindex, follow`; drafts 404; renamed slugs 308-redirect.
- Auto-generated `sitemap.xml`, `robots.txt` and `rss.xml` from the MDX corpus.
- AEO: answer-first ledes, self-contained sections, `faq` where readers really ask questions, visible "Updated" dates, sources linked inline and in a closing list.
- Stable CLS: ad slots reserve fixed dimensions; `next/image` everywhere, `priority` only on the hero.
- No render-blocking scripts. Target Lighthouse ≥ 90 mobile.

---

## 9. Legal / Compliance (for AdSense approval)

Real pages: `/privacy` (describes actual data flows: server logs, Resend for the newsletter and contact form; Google Analytics with consent and withdrawal via Cookie settings; its AdSense section still reads as if ads were live and needs rewriting when they are), `/terms`, `/impressum` (needs a full postal address and DDG citations; open task), `/editorial-standards`, plus the cookie-consent banner. Legal copy should be reviewed by counsel; never claim a compliance mechanism (e.g. a data-transfer framework) that hasn't been verified. AdSense in the EEA/UK also needs a Google-certified CMP (TCF v2.2) — the homemade banner is not enough.

---

## 10. Explicitly OUT OF SCOPE (do not build)

- No database (Neon/Postgres/Supabase), no ORM — content stays in MDX files; newsletter subscribers live in Resend.
- No AdSense ad script until the site is approved and Google's certified consent message (IAB TCF v2.2) is published for the EEA/UK/CH. Verification is ads.txt + the meta tag only.
- No auth / user accounts, no CMS, no comment system.
- Deployment: Vercel deploys `main`, so merging a PR publishes.

---

## 11. Build Order (do this, in order)

1. `npx create-next-app@latest` → TypeScript, App Router, ESLint, Tailwind, `@/*` alias, **no `src/` dir**, scaffold in repo root.
2. Pin dependencies to the versions in §1; install `next-mdx-remote`, `gray-matter`, `date-fns`, `lucide-react`, `reading-time`.
3. Replace `app/globals.css` with the `@import "tailwindcss"` + `@theme` tokens + `.prose-article` + `.ad-slot-dev` styles (§4).
4. Apply the config files from §3 (`next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`). Delete any generated `tailwind.config.*`.
5. Create `types/article.ts`, then `lib/{categories,authors,utils,mdx}.ts` (§5).
6. Build `components/` in dependency order: `ui/*` → `ads/AdSlot` → `mdx/MDXComponents` → `article/*` → `layout/*`.
7. Write `app/layout.tsx` (fonts, metadata, chrome) (§7).
8. Add articles only from real, sourced reporting (§6) with code-drawn covers in `public/images/articles/` — never placeholder articles.
9. Build pages: home → article → category → tag → authors (+ `[slug]`) → archive → search (+ `api/search`) → about/editorial-standards/contact/advertise/privacy/terms/impressum.
10. Add `app/{sitemap,robots,manifest}.ts`, `app/rss.xml/route.ts` and the favicon/icon/OG assets in `public/`.
11. Add `lib/email/*`, the two API routes and `/newsletter/confirm`, gated on env vars (§7), plus `.env.example`.
12. Add `tests/` and the CI workflow. Run `npm run lint` (zero errors and zero warnings), `npx tsc --noEmit`, `npm run build`, `npm test`. Verify home, an article (TOC + JSON-LD + breadcrumb), category, tag, author, search and RSS render, with a clean console.

---

## 12. Acceptance Checklist

- [ ] `npm run dev` and `npm run build` succeed with no errors/warnings.
- [ ] `npm test` passes (SEO checks on the build + email handler tests).
- [ ] Home shows hero + top stories + per-category rows + newsletter strip; no ad placeholders in production.
- [ ] Article page renders MDX with serif body, breadcrumb, type label, working TOC (desktop and mobile), related articles, share buttons and valid JSON-LD.
- [ ] Category, tag, archive and author pages statically generate and filter correctly; unknown tags 404.
- [ ] Search box → `/search?q=` returns AND-matched results from `/api/search`.
- [ ] `sitemap.xml`, `robots.txt`, `rss.xml` and `manifest.webmanifest` resolve, all on the www host.
- [ ] Without Resend env vars the newsletter strip says "coming soon" and the endpoints return 503; with them, signup → confirm → contact all work.
- [ ] Cookie consent banner appears once, persists choice, links to `/privacy`.
- [ ] Palette obeyed: no `#ffffff`, no `#000000`; cream background, forest-green brand, rust links.
- [ ] All images via `next/image`; ad slots hold fixed dimensions (no layout shift).
```
