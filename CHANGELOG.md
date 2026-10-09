# Changelog

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
