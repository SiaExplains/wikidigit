# WikiDigit.com — Tech News Media Platform
## Claude Code Project Prompt

---

## Project Overview

I'm building **WikiDigit.com** — a modern tech news media website, similar in spirit to TechCrunch but with a cleaner, more editorial aesthetic. This is a fresh Next.js project in an empty directory.

The business model is **Google AdSense** (display ads), so the architecture must support ad placement zones, fast load times, and SEO-first structure.

---

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MDX** (for all articles and news posts)
- **Neon Postgres** (database — connect later)
- **Drizzle ORM** (set up later)
- **Vercel** (deployment — configure later)

---

## Design System

### Philosophy
Elegant, editorial, minimal. Think premium publishing — not a startup landing page. No sharp neon. No loud gradients. Clean whitespace, strong typography, restrained color use.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#1D402D` | Primary brand, CTAs, nav active states, badges |
| `cream` | `#FFF9EC` | Page background, card backgrounds |
| `rust` | `#A85527` | Accent for category tags, hover states, links |
| `amber` | `#E4A030` | Highlights, featured labels, subtle accents |
| `ink` | `#000004` | Body text, headings |

- **No white (#ffffff)** — use `#FFF9EC` as the lightest surface
- **No harsh black** — use `#000004`
- Avoid gradients unless very subtle (e.g. ink → primary at low opacity)

### Typography
- Font: **Inter** or **Geist** (sans-serif for UI), pair with **Georgia** or **Lora** for article body text (editorial feel)
- Strong typographic hierarchy: large display headings, comfortable reading line-length (~65ch) for articles
- Consistent scale via Tailwind's `font-size` utilities

### Layout
- Max content width: `1280px`
- Article body max width: `720px` (centered, readable)
- Generous whitespace — this is a reading experience

---

## Reference Site

**https://techcrunch.com/** — study the section structure, article card layout, category filtering, and ad placement zones. Do not copy the style — match the *structure and information density* only.

---

## Site Structure & Pages

### 1. Home `/`
- Sticky top navbar
- **Hero section**: Large featured article (full-width card with image, category, title, excerpt, author, date)
- **Top Stories grid**: 3-column card grid of latest articles
- **Category Sections**: Horizontal scrollable rows per category (AI, Startups, Dev Tools, etc.)
- **Newsletter CTA strip**: Minimal inline signup (UI only)
- **Ad zones**: clearly marked `<!-- AD SLOT -->` placeholders between sections (leaderboard, in-feed)

### 2. Category Pages `/category/[slug]`
- Dynamic route for each category (AI, Startups, Security, Dev Tools, Science, Business)
- Filterable article list (by tag)
- 2-column article card grid
- Sidebar with recent posts + ad slot

### 3. Article Page `/article/[slug]`
- MDX-powered full article view
- Author byline, date, category badge, read time estimate
- Table of contents (generated from headings)
- Related articles at the bottom
- **Ad slots**: after intro paragraph, mid-article, end of article (clearly marked placeholders)
- Social share buttons (UI only)
- Responsive image support

### 4. Tag Pages `/tag/[tag]`
- Articles filtered by tag
- Same layout as category page

### 5. Authors `/authors`
- List of all authors/contributors
- Author card: avatar, name, bio, article count

### 6. Author Profile `/authors/[slug]`
- Author bio, social links
- List of their articles

### 7. Search `/search`
- Search input (UI + static filtering for now)
- Results list with article cards
- Debounced input (no API needed yet)

### 8. About `/about`
- About WikiDigit — mission, editorial approach
- Team section (placeholder)

### 9. Contact `/contact`
- Contact form (UI only)
- Editorial submissions note

### 10. Privacy Policy `/privacy`
- Required for AdSense approval
- Placeholder legal text (generic, clearly marked as placeholder)

### 11. Terms of Service `/terms`
- Placeholder

### 12. Advertise `/advertise`
- Ad packages / media kit page (placeholder content)

---

## Architecture Requirements

```
/app
  /page.tsx                        ← Home
  /layout.tsx                      ← Root layout (navbar + footer)
  /category
    /[slug]
      /page.tsx
  /article
    /[slug]
      /page.tsx
  /tag
    /[tag]
      /page.tsx
  /authors
    /page.tsx
    /[slug]
      /page.tsx
  /search
    /page.tsx
  /about
    /page.tsx
  /contact
    /page.tsx
  /privacy
    /page.tsx
  /terms
    /page.tsx
  /advertise
    /page.tsx

/components
  /layout
    Navbar.tsx
    Footer.tsx
    Sidebar.tsx
  /article
    ArticleCard.tsx              ← Used in grids/lists
    ArticleHero.tsx              ← Featured/top article
    ArticleBody.tsx              ← MDX rendered content
    ArticleMeta.tsx              ← Author, date, read time
    TableOfContents.tsx
    RelatedArticles.tsx
  /ads
    AdSlot.tsx                   ← Reusable ad placeholder component
  /ui
    CategoryBadge.tsx
    TagChip.tsx
    AuthorAvatar.tsx
    NewsletterStrip.tsx
    SearchBar.tsx
  /mdx
    MDXComponents.tsx            ← Custom MDX component overrides

/content
  /articles
    sample-ai-article.mdx
    sample-startup-article.mdx
    sample-devtools-article.mdx

/lib
  /mdx.ts                        ← MDX parsing + frontmatter utilities
  /utils.ts                      ← General utilities (readTime, slugify, etc.)
  /categories.ts                 ← Category definitions and metadata

/types
  /article.ts                    ← Article, Author, Category, Tag types

/public
  /images
    /og-default.png              ← Default OG image

next.config.ts
tailwind.config.ts
```

---

## MDX Frontmatter Schema

Every article must support this frontmatter:

```yaml
---
title: "Article Title Here"
slug: "article-slug"
date: "2025-05-14"
author: "Siavash Khalili"
authorSlug: "siavash"
category: "AI"
tags: ["llm", "openai", "industry"]
description: "Short description for SEO and cards (~150 chars)"
coverImage: "/images/articles/cover.jpg"
featured: true
draft: false
readTime: 5
---
```

---

## AdSense Integration Strategy

- Create a reusable `<AdSlot />` component that accepts `size` and `position` props
- Mark all placements clearly with comments: `{/* AD: leaderboard-top */}`
- Standard zones to scaffold:
  - `leaderboard` — below navbar (728×90)
  - `in-feed` — between article grid rows
  - `mid-article` — inside article body
  - `sidebar` — right column on desktop
  - `end-of-article` — after content, before related posts
- No real AdSense script yet — placeholder divs with visible outlines in dev mode

---

## Navigation

- **Top Navbar**: Logo (`WikiDigit`) + category links + search icon + optional dark mode toggle
- Categories in nav: AI, Startups, Dev Tools, Security, Science, Business
- Mobile: hamburger menu with full-screen overlay
- Sticky on scroll, slight backdrop-blur on scroll
- Active link highlighting

**Footer**:
- Logo + tagline
- Links: About, Contact, Privacy, Terms, Advertise
- Social icons (placeholder)
- Copyright

---

## SEO Requirements

Every page must have:
- Dynamic `<title>` and `<meta description>` via Next.js `generateMetadata`
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Twitter card meta
- Canonical URLs
- Structured data (JSON-LD) on article pages: `NewsArticle` schema
- `sitemap.xml` — auto-generated from MDX files
- `robots.txt`

---

## Performance Requirements (AdSense compliance)

- No layout shift (stable CLS) — reserve ad slot dimensions with fixed containers
- Lazy load images (`next/image` with priority on hero only)
- No render-blocking scripts
- Aim for Lighthouse score ≥ 90 on mobile

---

## Sample Content

Scaffold **3 realistic MDX articles** covering:
1. An AI/LLM topic (e.g. a model release or trend)
2. A startup funding story
3. A developer tools deep-dive

Use realistic placeholder content relevant to current tech news — not lorem ipsum.

---

## Git Repository

```
https://github.com/SiaExplains/wikidigit
```

Initialize the project here. Do not create a nested folder — scaffold directly in the repo root.

---

## What To Do Now

1. Clone / initialize in the repo root
2. Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router, ESLint
3. Set up the full folder structure above
4. Configure Tailwind with the custom color palette and typography
5. Install and configure MDX (`next-mdx-remote` recommended)
6. Build shared layout: Navbar + Footer
7. Scaffold all pages with realistic placeholder content
8. Build `ArticleCard`, `ArticleHero`, `AdSlot` components
9. Build the home page with all sections wired to sample MDX content
10. Build a functional article page with TOC and ad slots
11. Set up `generateMetadata` on home and article pages
12. Add `sitemap.xml` and `robots.txt`
13. Ensure `npm run dev` runs with **zero errors or warnings**

---

## Do NOT Do Yet

- Neon / Drizzle database connection
- Real AdSense script injection
- Auth or user accounts
- CMS integration
- Real search API
- Deployment to Vercel
- Newsletter backend

---

## Output After Setup

Provide:
- Full folder structure overview
- All installed packages with versions
- How to run locally
- List of all placeholder content that needs replacing
- Suggested next steps (e.g. CMS, real ads, search)
