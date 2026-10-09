# WikiDigit

Source for [wikidigit.com](https://wikidigit.com), an independent tech-news site covering AI, startups, business, tech, science, robotics, finance, security and developer tools.

Next.js 16 (App Router) + React 19 + Tailwind CSS v4. Articles are MDX files on disk; there is no database or CMS. The full architecture spec is in [`wikidigit-bootstrap-instruction.md`](wikidigit-bootstrap-instruction.md).

## Run it

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint
npm run build
npm test         # email unit tests + SEO checks against the build output; run after a build
```

`NEXT_PUBLIC_SITE_URL` sets the canonical site URL (`lib/site.ts`). It defaults to `https://www.wikidigit.com`, the host production serves; the apex domain redirects there.

## Newsletter and contact form (Resend)

Both forms are off until Resend is configured; until then the site shows a "newsletter coming soon" strip with RSS, and the contact page shows the email address only. To turn them on:

1. Create a [Resend](https://resend.com) account and add the domain `wikidigit.com`. Add the DNS records Resend shows (SPF and DKIM), plus a DMARC record such as `_dmarc  TXT  "v=DMARC1; p=none; rua=mailto:siaexplains@gmail.com"`. Wait until the domain shows as Verified.
2. In Resend, create a segment called "Newsletter" (and optionally a topic for per-topic unsubscribe) and copy the IDs.
3. Create an API key with sending and contacts access.
4. In Vercel → Settings → Environment Variables (Production), set the variables in [`.env.example`](.env.example). Generate `NEWSLETTER_TOKEN_SECRET` with `openssl rand -base64 32`. Redeploy.
5. Recommended: add a Vercel Firewall rate-limit rule for `/api/newsletter/subscribe` and `/api/contact`. The built-in limiter is per server instance only.

How it works: signup sends a confirmation email with a signed link valid for 48 hours (`lib/newsletter-token.ts`). Nothing is stored until the reader clicks **Confirm subscription** on `/newsletter/confirm`, which adds them to the segment in Resend. Newsletters are sent as Resend Broadcasts to that segment; include `{{{RESEND_UNSUBSCRIBE_URL}}}` in every broadcast. Contact messages are emailed to `CONTACT_TO` with Reply-To set to the sender and aren't stored.

## Content

- **Posts:** `content/articles/<slug>.mdx`. The frontmatter schema is in the bootstrap spec (§6). Optional `faq` entries render as a FAQ section with FAQPage JSON-LD.
- **Covers:** `public/images/articles/<slug>.png`, drawn as HTML/SVG and rendered with
  `node scripts/render-cover.mjs <design.html> <out.png>` (1216×521). Start from `scripts/cover-template/template.html`.
- **Categories:** `lib/categories.ts`. The target share per category is in `content/topic-weights.json`, and `node scripts/pick-topic.mjs` shows which category is most under-covered.
- **Authors:** `lib/authors.ts` (Siavash Ghanbari, Sheida Mohassesy). Each post's `authorSlug` must match an entry there.
- **Dates:** `date` is the publish date. Add `updated` only after a substantive change; it becomes `dateModified` and an "Updated" line. Read time is computed from the body.
- **Feeds and SEO:** `/rss.xml`, `app/sitemap.ts` and `app/robots.ts`. Tag and search pages are `noindex`; empty categories are `noindex` and left out of the sitemap.
- **Archive:** `/archive/YYYY-MM` pages and the sidebar Archive widget are generated from post dates.

## Publishing workflow

Every post ships as its own `post/<slug>` branch and PR to `main`; merging the PR publishes it.

- **Daily:** a Claude scheduled task runs at 10:00 and follows [`docs/daily-post-playbook.md`](docs/daily-post-playbook.md). It picks the topic by weight, researches it, writes the post, draws the cover, does the SEO/AEO pass, opens a PR and sends a notification. A human reviews and merges.
- **On demand:** run the `/wikidigit-post-author` skill in Claude Code to write a post about a specific subject, with the topic, title and author you choose.

See [`CHANGELOG.md`](CHANGELOG.md) for site changes.
