# WikiDigit — Full Bootstrap Instruction

> **Purpose of this file.** This is a single, self-contained prompt for an AI coding agent (Claude Code or similar) to scaffold a **pixel-and-architecture faithful clone** of WikiDigit.com — a modern, editorial tech-news media site — from an empty directory. It was reverse-engineered from the live codebase, so it reflects the *actual* stack, versions, file layout, design tokens, and conventions in production, not an idealized plan. Follow it top to bottom.

---

## 0. What You Are Building

**WikiDigit** is a server-rendered tech-news publication in the spirit of TechCrunch, but with a calmer, more editorial aesthetic (warm cream background, forest-green + rust palette, serif article body). Articles are authored as **MDX files on disk** — there is no CMS and no database. The business model is **display advertising (Google AdSense)**, so the architecture is SEO-first, ad-slot-aware, and optimized for low layout shift.

**Core characteristics:**
- File-based content: every article is one `.mdx` file with YAML frontmatter under `content/articles/`.
- Fully static-capable: article, category, tag, and author pages are statically generated from the MDX files.
- No auth, no DB, no CMS, no newsletter backend — all such UIs are presentational only.
- Ad slots are scaffolded as visible dev placeholders (no real AdSense script yet).
- Legal/compliance pages (Privacy, Terms, Impressum, cookie consent) exist for AdSense approval.

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
| Read-time (optional util) | `reading-time` | `^1.5.0` |
| Linting | `eslint` + `eslint-config-next` | `^9` / `16.2.6` |
| Bundler (dev) | **Turbopack** (Next 16 default) | — |

**Node types:** `@types/node ^20`, `@types/react ^19`, `@types/react-dom ^19`.

**`package.json` scripts** (exactly):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

Package name `wikidigit`, `version` `0.1.0`, `"private": true`.

---

## 2. Project Layout (target file tree)

Scaffold **directly in the repo root** — do not nest in a subfolder.

```
/app
  layout.tsx                 ← Root layout: fonts, metadata, Navbar + main + Footer + CookieConsent
  page.tsx                   ← Home
  globals.css                ← Tailwind import + @theme tokens + .prose-article styles
  manifest.ts                ← PWA web manifest (MetadataRoute.Manifest)
  robots.ts                  ← robots.txt (MetadataRoute.Robots)
  sitemap.ts                 ← sitemap.xml (MetadataRoute.Sitemap)
  favicon.ico
  /api/search/route.ts       ← GET search endpoint (JSON)
  /article/[slug]/page.tsx   ← Full article view (MDX) + JSON-LD + TOC + ads
  /category/[slug]/page.tsx  ← Category listing
  /tag/[tag]/page.tsx        ← Tag listing
  /authors/page.tsx          ← Author index
  /authors/[slug]/page.tsx   ← Author profile + their articles
  /search/page.tsx           ← Search UI (client, debounced, hits /api/search)
  /about/page.tsx
  /contact/page.tsx          ← Contact form (UI only)
  /advertise/page.tsx        ← Media-kit / ad packages (placeholder)
  /privacy/page.tsx          ← AdSense-required legal placeholder
  /terms/page.tsx
  /impressum/page.tsx        ← EU/German legal notice placeholder

/components
  /layout
    Navbar.tsx               ← "use client": sticky, scroll blur, mobile menu, search toggle
    Footer.tsx               ← Brand, coverage, company, legal columns + social SVGs
    Sidebar.tsx              ← Recent posts + optional sidebar ad
  /article
    ArticleCard.tsx          ← variants: "default" | "compact" | "horizontal"
    ArticleHero.tsx          ← Featured story hero
    ArticleBody.tsx          ← Renders MDX via next-mdx-remote/rsc + mid-article ad
    ArticleMeta.tsx          ← Title, description, author, date, category, tags, read time
    TableOfContents.tsx      ← "use client": IntersectionObserver active-heading
    RelatedArticles.tsx
    ShareButtons.tsx         ← UI-only social share
  /ads
    AdSlot.tsx               ← Reusable ad placeholder (size + position props)
  /ui
    CategoryBadge.tsx
    TagChip.tsx
    AuthorAvatar.tsx
    NewsletterStrip.tsx      ← Inline newsletter CTA (UI only)
    SearchBar.tsx
    CookieConsent.tsx        ← "use client": useSyncExternalStore + localStorage
  /mdx
    MDXComponents.tsx        ← Custom overrides for a/img/table/th/td/blockquote

/content
  /articles/*.mdx            ← All articles (see frontmatter schema §6)

/lib
  mdx.ts                     ← Read/parse MDX, query helpers
  utils.ts                   ← slugify, formatDate, readTime, extractHeadings, cn, truncate
  categories.ts              ← Category definitions + navCategories
  authors.ts                 ← Author records + lookup

/types
  article.ts                ← Article, Author, Category interfaces

/public
  /images/articles/*.png     ← Cover images (16:9)
  /images/authors/*.jpg      ← Author avatars
  og-default.png             ← 1200×630 default OG image
  favicon-16x16.png favicon-32x32.png favicon-96x96.png
  apple-touch-icon.png icon-192.png icon-512.png

next.config.ts
postcss.config.mjs
eslint.config.mjs
tsconfig.json
next-env.d.ts
```

---

## 3. Configuration Files (copy exactly)

**`next.config.ts`** — Turbopack root pin + allow remote images from any HTTPS host:
```ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
```

**`postcss.config.mjs`**:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

**`eslint.config.mjs`** — flat config, extends next core-web-vitals + typescript, ignores `.next`, `out`, `build`, `next-env.d.ts`, and `.claude/**`.

**`tsconfig.json`** — Next.js defaults: `strict: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, path alias `"@/*": ["./*"]`, and `plugins: [{ "name": "next" }]`. Include `.next/types/**/*.ts` and `.next/dev/types/**/*.ts`.

**`.gitignore`** — standard Next.js ignore: `/node_modules`, `/.next/`, `/out/`, `/build`, `.env*`, `.vercel`, `*.tsbuildinfo`, `next-env.d.ts`, `.DS_Store`.

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
- Article page is a two-column grid on `lg`: `lg:grid-cols-[1fr_280px]` with a sticky aside (TOC + Sidebar).
- Border radius is small and restrained: mostly `rounded-sm`.
- Card images use `aspect-[16/9]` with `object-cover` and a subtle `group-hover:scale-105` transition.

---

## 5. Data Model (`/types/article.ts`)

```ts
export interface Author {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
  articleCount?: number;
}

export interface Article {
  title: string;
  slug: string;
  date: string;          // ISO "YYYY-MM-DD"
  author: string;
  authorSlug: string;
  category: string;      // display name, e.g. "AI"
  tags: string[];
  description: string;   // ~150 chars, used for SEO + cards
  coverImage: string;    // /images/articles/…
  featured: boolean;
  draft: boolean;
  readTime: number;      // minutes
  content?: string;      // MDX body (populated when read from disk)
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  color: string;         // hex
}

export type ArticleFrontmatter = Omit<Article, "content">;
```

### Categories (`/lib/categories.ts`)
Six categories, in nav order. Export `categories: Category[]`, `getCategoryBySlug(slug)`, and `navCategories = categories.map(c => ({ name, href: /category/${slug} }))`.

| Name | slug | color |
|---|---|---|
| AI | `ai` | `#1D402D` |
| Startups | `startups` | `#A85527` |
| Dev Tools | `dev-tools` | `#E4A030` |
| Security | `security` | `#7c3aed` |
| Science | `science` | `#0891b2` |
| Business | `business` | `#059669` |

### Authors (`/lib/authors.ts`)
Export `authors: Author[]` and `getAuthorBySlug(slug)`. Seed with a small editorial team (name, slug, bio, avatar path under `/images/authors/`, optional twitter/linkedin, articleCount). Example roster used: `siavash` (Siavash Khalili), `siavash-ghanbari`, `maya-chen`, `luca-romano`.

### MDX access layer (`/lib/mdx.ts`)
Reads from `content/articles`. Provide these exact functions:
- `getArticleSlugs(): string[]` — list `.mdx` basenames.
- `getArticleBySlug(slug): Article | null` — read file, `gray-matter` parse, merge frontmatter + `slug` + `content`, default `tags`/`featured`/`draft`.
- `getAllArticles(): Article[]` — all non-draft, **sorted by date descending**.
- `getArticlesByCategory(category)`, `getArticlesByTag(tag)`, `getArticlesByAuthor(authorSlug)` — case-insensitive filters over `getAllArticles()`.
- `getFeaturedArticle(): Article | null` — first `featured`, else newest, else null.
- `getRelatedArticles(article, limit = 3)` — same category or shared tag, excluding self.

### Utilities (`/lib/utils.ts`)
- `slugify(text)`, `formatDate(iso)` → `"MMMM d, yyyy"` (via `date-fns`), `formatDateShort` → `"MMM d, yyyy"`.
- `estimateReadTime(content)` — 200 wpm, min 1.
- `truncate(text, length)`, `cn(...classes)` (filter falsy, join).
- `extractHeadings(content)` — regex `^#{2,3}\s+(.+)$` over MDX, returns `{ id, text, level }[]` (id = slugified text). Powers the TOC. Export the `Heading` interface.

---

## 6. MDX Article Format

Each article is `content/articles/<slug>.mdx`. Frontmatter schema (YAML):
```yaml
---
title: "Article Title Here"
slug: "article-slug"                # must match filename
date: "2025-05-14"                  # ISO, controls sort order
author: "Siavash Khalili"
authorSlug: "siavash"               # must match a lib/authors.ts slug
category: "AI"                      # display name matching lib/categories.ts
tags: ["llm", "openai", "industry"]
description: "~150-char SEO + card summary."
coverImage: "/images/articles/cover.png"
featured: true
draft: false
readTime: 7
---
```
Body is standard Markdown/MDX: `##`/`###` headings (these feed the TOC), `>` blockquotes, tables, `code`, images. Write **realistic, current tech-news prose** — never lorem ipsum. Seed with a spread across categories (AI model releases, startup funding, dev tools, layoffs/business, security, science). Aim for a dozen-plus articles so the home grid, category rows, and related-articles all populate.

---

## 7. Key Component & Page Behaviors

**Root layout (`app/layout.tsx`):** load Geist + Geist Mono as CSS variables; set `metadataBase` from `process.env.NEXT_PUBLIC_SITE_URL || "https://wikidigit.com"`; title template `"%s | WikiDigit"`, default `"WikiDigit — Tech News for the Curious"`; full icon set + `manifest: "/manifest.webmanifest"`; OpenGraph (website, `/images/og-default.png` 1200×630) + Twitter `summary_large_image` (`@wikidigit`); `robots` index/follow. Body: `min-h-screen flex flex-col bg-cream text-ink` wrapping `<Navbar/>`, `<main className="flex-1">{children}</main>`, `<Footer/>`, `<CookieConsent/>`.

**Home (`app/page.tsx`):** leaderboard ad → featured `ArticleHero` → "Top Stories" 3-col grid (first 6) → in-feed ad → first 4 categories each rendered as a titled row (up to 4 cards, "See all →" link) with `border-t` separators → second in-feed ad → `NewsletterStrip`.

**Article page (`app/article/[slug]/page.tsx`):** `generateStaticParams` from slugs; `generateMetadata` with per-article title/description, OG `type:"article"` (publishedTime, authors, cover image), Twitter card, canonical `${siteUrl}/article/${slug}`. Renders a `NewsArticle` **JSON-LD** `<script>`, a top leaderboard ad, then the two-column grid: `<article className="max-w-[720px]">` with `ArticleMeta` → `ShareButtons` → `ArticleBody` (MDX) → end-of-article ad → `RelatedArticles`; aside has sticky `TableOfContents` + `Sidebar` (recent posts + sidebar ad). `notFound()` for missing/draft.

**ArticleBody:** renders through `MDXRemote` from `next-mdx-remote/rsc` with the custom `MDXComponents` map, wrapped in `.prose-article`, and injects a mid-article `AdSlot`.

**MDXComponents:** override `a` (internal → `next/link`, external → new tab `rel="noopener noreferrer"`), `img` → `next/image` `fill` inside an `aspect-video` wrapper, plus styled `table`/`th`/`td`/`blockquote`.

**AdSlot (`components/ads/AdSlot.tsx`):** props `size: "leaderboard" | "in-feed" | "mid-article" | "sidebar" | "end-of-article"`, optional `position`, `className`. Fixed dimensions per size (leaderboard 728×90, in-feed 468×60, mid-article 336×280, sidebar 300×250, end-of-article 728×90) to reserve space (stable CLS). Renders a dashed-outline (`ad-slot-dev`) box with a `data-ad-size`/`data-ad-position` and an "AD · <label>" caption, `role="complementary"`, `aria-label="Advertisement"`. **No real AdSense script.**

**Navbar (`"use client"`):** sticky `top-0 z-50`; adds `backdrop-blur-md` + shadow after `scrollY > 10`; logo `Wiki<span text-rust>Digit</span>`; desktop category links with active state via `usePathname().startsWith(href)`; search icon toggles an inline search form that navigates to `/search?q=`; mobile hamburger overlay. Closes menus on route change.

**Footer:** four columns — Brand (logo, tagline, X/LinkedIn inline SVG icons + RSS link to `/rss.xml`), Coverage (categories), Company (About/Authors/Advertise/Contact), Legal (Privacy/Terms/Impressum) — plus `© {year} WikiDigit`.

**CookieConsent (`"use client"`):** SSR-safe via `useSyncExternalStore` reading `localStorage["wd_cookie_consent"]`; fixed bottom banner offering "Essential only" / "Accept all"; hides once a value is stored; links to `/privacy`. Mentions Google Analytics + AdSense.

**TableOfContents (`"use client"`):** `IntersectionObserver` (`rootMargin: "-80px 0px -60% 0px"`) highlights the active heading; indents `h3` entries.

**Search:** `app/api/search/route.ts` is a `GET` that reads `?q=`, lowercases, and AND-matches every query word against a haystack of title+description+author+category+tags, returning `{ articles }` (max 20). `app/search/page.tsx` is a debounced client UI that calls it.

**Category / Tag / Author pages:** list `ArticleCard`s filtered by the respective `lib/mdx` helper, with `generateMetadata` and `generateStaticParams` where the route is dynamic; category page shows a sidebar. Author profile shows bio + social + their articles.

**metadata routes:** `app/sitemap.ts` enumerates static pages + all categories + all articles (with cover images) using `MetadataRoute.Sitemap`; `app/robots.ts` allows `/`, disallows `/api/` and `/_next/`, points at `${siteUrl}/sitemap.xml`; `app/manifest.ts` returns the PWA manifest (name WikiDigit, cream `background_color`, primary `theme_color`, icon set).

All `siteUrl` reads use `process.env.NEXT_PUBLIC_SITE_URL || "https://wikidigit.com"`.

---

## 8. SEO & Performance Requirements

- Every page: dynamic `<title>`/`<meta description>` via `generateMetadata` (or static `metadata`), OpenGraph + Twitter tags, canonical URLs.
- Article pages: `NewsArticle` JSON-LD structured data.
- Auto-generated `sitemap.xml` + `robots.txt` from the MDX corpus.
- Stable CLS: ad slots reserve fixed dimensions; `next/image` everywhere, `priority` only on the hero.
- No render-blocking scripts. Target Lighthouse ≥ 90 mobile.

---

## 9. Legal / Compliance (for AdSense approval)

Ship placeholder-but-real pages: `/privacy`, `/terms`, `/impressum`, plus the cookie-consent banner. Clearly mark legal copy as placeholder to be reviewed by counsel. These are required for ad-network approval and EU compliance.

---

## 10. Explicitly OUT OF SCOPE (do not build)

- No database (Neon/Postgres), no ORM (Drizzle) — content stays in MDX files.
- No real Google AdSense script injection (slots stay as dev placeholders).
- No auth / user accounts, no CMS, no comment system.
- No newsletter backend (the strip is UI only), no working RSS feed generation (link is a stub).
- No deployment automation — targets Vercel but that is configured later.

---

## 11. Build Order (do this, in order)

1. `npx create-next-app@latest` → TypeScript, App Router, ESLint, Tailwind, `@/*` alias, **no `src/` dir**, scaffold in repo root.
2. Pin dependencies to the versions in §1; install `next-mdx-remote`, `gray-matter`, `date-fns`, `lucide-react`, `reading-time`.
3. Replace `app/globals.css` with the `@import "tailwindcss"` + `@theme` tokens + `.prose-article` + `.ad-slot-dev` styles (§4).
4. Apply the config files from §3 (`next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`). Delete any generated `tailwind.config.*`.
5. Create `types/article.ts`, then `lib/{categories,authors,utils,mdx}.ts` (§5).
6. Build `components/` in dependency order: `ui/*` → `ads/AdSlot` → `mdx/MDXComponents` → `article/*` → `layout/*`.
7. Write `app/layout.tsx` (fonts, metadata, chrome) (§7).
8. Author 12+ realistic MDX articles under `content/articles/` with cover images in `public/images/articles/` (§6).
9. Build pages: home → article → category → tag → authors (+ `[slug]`) → search (+ `api/search`) → about/contact/advertise/privacy/terms/impressum.
10. Add `app/{sitemap,robots,manifest}.ts` and the favicon/icon/OG assets in `public/`.
11. Run `npm run dev` and `npm run lint` — must be **zero errors and zero warnings**. Verify home, an article (TOC + JSON-LD + ads), category, tag, author, and search all render.

---

## 12. Acceptance Checklist

- [ ] `npm run dev` and `npm run build` succeed with no errors/warnings.
- [ ] Home shows hero + top stories + per-category rows + newsletter + ad slots.
- [ ] Article page renders MDX with serif body, working TOC scroll-spy, related articles, share buttons, JSON-LD, and 3 ad zones (top/mid/end + sidebar).
- [ ] Category, tag, and author pages statically generate and filter correctly.
- [ ] Search box → `/search?q=` returns AND-matched results from `/api/search`.
- [ ] `sitemap.xml`, `robots.txt`, and `manifest.webmanifest` all resolve with correct URLs.
- [ ] Cookie consent banner appears once, persists choice, links to `/privacy`.
- [ ] Palette obeyed: no `#ffffff`, no `#000000`; cream background, forest-green brand, rust links.
- [ ] All images via `next/image`; ad slots hold fixed dimensions (no layout shift).
```
