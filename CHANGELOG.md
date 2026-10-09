# Changelog

## 0.5.1 — 2026-10-09

### Fixed
- The sidebar on article, category, tag and archive pages had its own scrollbar next to the page's. It now scrolls with the page; on articles only the "On this page" menu stays pinned.

## 0.5.0 — 2026-10-09

### Added
- Article types: an optional `type` field (news, analysis, explainer, guide, opinion). Anything other than news gets a label next to its category on the article, cards and hero, and a matching schema.org type (`AnalysisNewsArticle`, `OpinionNewsArticle`, `Article`). Nine analysis pieces and two explainers are labelled. The Editorial Standards page explains each label.
- Disclosures: an optional `disclosure` field shown above the article body. Both Emojar articles now disclose that Emojar is owned by WikiDigit's publisher; the first one had no disclosure at all.
- Category pages open with a short intro about what we cover, which also becomes their meta description.
- A collapsible "On this page" menu on phones and tablets, where the sidebar table of contents is hidden.
- Markdown image titles render as captions.

### Changed
- Related articles are ranked by shared tags and category instead of "newest post in the same category", so they are actually related.
- Inline images keep their own shape instead of being cropped to 16:9.
- The daily-post playbook and site spec describe the article types and when to add a disclosure.

## 0.4.1 — 2026-10-09

### Fixed
- Source backfill: 21 articles from May–July 2026 that had no source links were checked claim by claim against primary sources and major outlets. Each now links its sources inline and in a closing **Sources** line. Every one of them also had wrong or unverifiable details: invented figures, misdated events, quotes that were paraphrases, and claims no source supports. These were corrected or removed, and each article carries a dated correction note and an "Updated" date. Two headlines changed because they stated something untrue (Oracle, Qualcomm/Tenstorrent), and several others were reworded.
- The South Korea chip article reported a pre-announcement estimate ($1.3 trillion) as the plan. It is rewritten from the June 29 announcement (about 4,755 trillion won, $3.11 trillion) and moves to `/article/south-korea-samsung-sk-4755-trillion-won-chip-ai-plan`; the old URL permanently redirects there.
- Seven covers that contained garbled AI-generated text were redrawn as code (Decart, Google I/O, Stainless, Nvidia H200, Fable 5 export ban, Qualcomm/Tenstorrent, Together AI).

## 0.4.0 — 2026-10-09

### Added
- RSS feed at `/rss.xml` (the footer already linked to it, but it returned a 404).
- Editorial Standards page (`/editorial-standards`): sourcing, AI use, review, corrections and independence from advertisers. Linked from the footer, About, Contact and Advertise.
- Structured data: NewsMediaOrganization and WebSite on the home page, a ProfilePage for each author, and a breadcrumb trail (visible and in JSON-LD) on articles.
- Optional `updated` frontmatter field. It sets `dateModified`, the sitemap date and an "Updated" line on the article.
- `npm test`: SEO checks against the production build, and a GitHub Actions workflow that runs lint, typecheck, build and tests.

### Changed
- Canonical URLs, the sitemap, robots.txt and RSS now use `https://www.wikidigit.com`, the host the site is actually served from. Before, every canonical pointed at the apex domain, which redirects to www.
- robots.txt no longer blocks `/_next/`, which Google needs to load CSS, scripts and images.
- Search and tag pages are `noindex`. Unknown tags return a 404 instead of an empty page. Empty categories are `noindex` and left out of the sitemap until they have posts.
- Every page now has a canonical URL.
- Read time is computed from the article text instead of being typed by hand.
- Three early articles were rewritten from primary sources, each with a correction note: Runway's Series D, the Claude Opus 4 launch, and Bun 1.2. The Bun article was published as "Bun 2.0", a release that doesn't exist; it moves to `/article/bun-1-2-built-in-postgres-s3-text-lockfile`, and the old URL permanently redirects there. All three get new covers.
- About now describes how AI is actually used: AI-assisted drafts, a human reviews and approves every post. The claim that no AI-generated content is published is gone.
- Advertise no longer shows made-up audience numbers or CPM prices.
- Contact shows the email address instead of a form that only pretended to send. The newsletter strip says the newsletter is coming soon and links to RSS instead of pretending to subscribe people.

### Fixed
- The Dev Tools category page and its home-page row were empty: "Dev Tools" in frontmatter never matched the `dev-tools` slug.
- Table-of-contents links now jump to their headings (headings had no ids).
- Placeholder ad boxes ("AD · Leaderboard 728×90") no longer show in production.

### Removed
- Footer X and LinkedIn icons that linked to `#`, and the unverified `@wikidigit` Twitter handle in the page metadata.
- The open `images.remotePatterns` rule that let the image optimizer fetch any host on the internet; all images are local.

## 0.3.0 — 2026-10-09

### Added
- Author **Sheida Mohassesy**.
- Sidebar widgets for **Authors** (with post counts) and **Archive** (posts per month), on article, category, tag and archive pages.
- Monthly archive pages at `/archive/YYYY-MM`. Author and archive pages are added to the sitemap.

### Changed
- Authors reduced to Siavash Ghanbari and Sheida Mohassesy; Siavash Khalili, Maya Chen and Luca Romano are removed. Every post's byline was reassigned at random between the two (13 each), replacing the "WikiDigit" byline.
- Author article counts are now computed from the posts instead of being hardcoded.
- Avatars fall back to initials (the referenced avatar images never existed, so they showed as broken images). The avatar no longer nests a link inside another link on the Authors and About pages.
- The daily post playbook now picks a random author from `lib/authors.ts`.
- README replaced the create-next-app boilerplate with a description of the project, content and publishing workflow. The bootstrap spec covers the 9 categories, the two authors, FAQ, sidebar, archive and the content pipeline.

## 0.2.0 — 2026-10-09

### Added
- Categories **Tech**, **Robotics** and **Finance**. Category order (and the nav) now follows editorial priority: AI, Startups, Business, Tech, Science, Robotics, Finance, Security, Dev Tools.
- `content/topic-weights.json` with the target share of posts per category, and `scripts/pick-topic.mjs`, which picks the most under-covered topic for the next post.
- `scripts/render-cover.mjs` and `scripts/cover-template/`: hand-drawn HTML/SVG covers rendered to 1216×521 PNGs with headless Chrome.
- Optional `faq` frontmatter: rendered as a "Frequently asked questions" section with FAQPage JSON-LD.
- `docs/daily-post-playbook.md`: the steps for the scheduled daily post.

### Changed
- Article SEO: absolute image URLs in Open Graph, Twitter and JSON-LD; dropped the hardcoded 1200×630 OG size; added keywords, article section, `mainEntityOfPage` and `dateModified`; WikiDigit bylines are now an Organization instead of a Person.
- The NVIDIA H200 and South Korea chip posts move from Business to the new Tech category.
- Homepage and About copy list the full category set.
