# WikiDigit

Source for [wikidigit.com](https://wikidigit.com), an independent tech-news site covering AI, startups, business, tech, science, robotics, finance, security and developer tools.

Next.js 16 (App Router) + React 19 + Tailwind CSS v4. Articles are MDX files on disk; there is no database or CMS. The full architecture spec is in [`wikidigit-bootstrap-instruction.md`](wikidigit-bootstrap-instruction.md).

## Run it

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

`NEXT_PUBLIC_SITE_URL` sets the canonical site URL. It defaults to `https://wikidigit.com`.

## Content

- **Posts:** `content/articles/<slug>.mdx`. The frontmatter schema is in the bootstrap spec (§6). Optional `faq` entries render as a FAQ section with FAQPage JSON-LD.
- **Covers:** `public/images/articles/<slug>.png`, drawn as HTML/SVG and rendered with
  `node scripts/render-cover.mjs <design.html> <out.png>` (1216×521). Start from `scripts/cover-template/template.html`.
- **Categories:** `lib/categories.ts`. The target share per category is in `content/topic-weights.json`, and `node scripts/pick-topic.mjs` shows which category is most under-covered.
- **Authors:** `lib/authors.ts` (Siavash Ghanbari, Sheida Mohassesy). Each post's `authorSlug` must match an entry there.
- **Archive:** `/archive/YYYY-MM` pages and the sidebar Archive widget are generated from post dates.

## Publishing workflow

Every post ships as its own `post/<slug>` branch and PR to `main`; merging the PR publishes it.

- **Daily:** a Claude scheduled task runs at 10:00 and follows [`docs/daily-post-playbook.md`](docs/daily-post-playbook.md). It picks the topic by weight, researches it, writes the post, draws the cover, does the SEO/AEO pass, opens a PR and sends a notification. A human reviews and merges.
- **On demand:** run the `/wikidigit-post-author` skill in Claude Code to write a post about a specific subject, with the topic, title and author you choose.

See [`CHANGELOG.md`](CHANGELOG.md) for site changes.
