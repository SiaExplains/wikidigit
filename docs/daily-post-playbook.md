# Daily Post Playbook

The routine behind the scheduled WikiDigit post (every day at 10:00). A run follows these steps in order and ends with an open PR for Sia to review. **A run never merges.**

## 0. Workspace

- Repo: `git@github.com:SiaExplains/wikidigit.git`; local clone at `~/Areas/Ventures/WikiDigit/wikidigit-src`.
- Never work in the main checkout (it may be on another branch with local changes). Fetch, then create a fresh worktree from `origin/main`:
  `git -C <clone> fetch origin && git -C <clone> worktree add -b post/<slug> ../wikidigit-daily-<YYYY-MM-DD> origin/main`
  (Pick the slug after step 3; use a temp branch name before that and rename it with `git branch -m`.)
- Run `npm ci` in the worktree.

## 1. Pick the topic (by weight)

Targets live in `content/topic-weights.json` (AI 25, Startups 20, Business 15, Tech 10, Science 10, Robotics 5, Finance 5, Security 5, Dev Tools 5). The order of that list is the priority.

1. List open daily-post PRs so unmerged posts count too:
   `gh pr list --state open --json title,headRefName,body`. Keep the ones whose `headRefName` starts with `post/`.
   Each daily PR body has a `Category: <name>` line. Collect those categories.
2. Run `node scripts/pick-topic.mjs --pending "<comma-separated categories>"`.
3. The script picks the topic furthest below its target share. Ties go to the higher-priority topic. Use its pick. Don't override it with your own judgement.

## 2. Find the hottest story in that topic

Look at the last 24–48 hours only. Use as many of these as work:

- **Reddit:** `https://www.reddit.com/r/<sub>/top.json?t=day&limit=25` (or the `/hot` page). Subreddits by topic:
  - AI: r/artificial, r/MachineLearning, r/OpenAI, r/LocalLLaMA, r/singularity
  - Startups: r/startups, r/venturecapital, r/Entrepreneur
  - Business: r/business, r/technology, r/stocks
  - Tech: r/technology, r/gadgets, r/hardware, r/apple, r/Android
  - Science: r/science, r/space, r/Futurology
  - Robotics: r/robotics, r/singularity, r/Futurology
  - Finance: r/fintech, r/investing, r/CryptoCurrency, r/economics
  - Security: r/cybersecurity, r/netsec, r/privacy
  - Dev Tools: r/programming, r/webdev, r/ExperiencedDevs, r/devops
- **X (x.com):** search the topic's keywords sorted by Top/Latest (for example `https://x.com/search?q=<keywords>&f=top`). Use the browser and only read: never post, like, follow or reply. If X needs a login or blocks access, skip it.
- **Fallback:** web search for the topic's news from the last 24 hours.

Score candidates by engagement (upvotes, comments, reposts), how new they are, and how many separate sources cover them. Pick one story that:
- Isn't already covered. Check `content/articles/` titles and slugs, and the open PRs.
- Can be confirmed by at least **two reputable sources** (the company's own post, filings, or established outlets). A Reddit or X post alone is a lead, not a source.

## 3. Write a viral title

Follow WikiDigit's house style: a concrete event plus a twist, often two short sentences. Examples:
- "Oracle Laid Off 21,000 People. It Told Regulators AI Made It Do It."
- "America Approved the Chips. China Said No."
- "Decart Raises $300M to Break NVIDIA's CUDA Lock-In — And NVIDIA Invested Anyway"

Rules: no clickbait that the article doesn't deliver, no "X Announces Y", ideally under about 90 characters, and the key entity near the start. Write 5 candidates and pick the strongest. Slug: lowercase, hyphenated, 4–8 words with the key entity and number, e.g. `oracle-21000-ai-layoffs-regulators`.

## 4. Write the post

Create `content/articles/<slug>.mdx`:

```yaml
---
title: "<title>"
slug: "<slug>"
date: "<YYYY-MM-DD, today>"
author: "<Siavash Ghanbari | Sheida Mohassesy>"
authorSlug: "<siavash-ghanbari | sheida-mohassesy>"
category: "<picked topic, exactly as in topic-weights.json>"
type: "<news | analysis | explainer | guide | opinion>"   # omit for news
tags: ["<5-7 lowercase, hyphenated tags: entities first, then themes>"]
description: "<150-160 chars: the hook plus the key fact, ending on the tension>"
coverImage: "/images/articles/<slug>.png"
featured: false
draft: false
faq:
  - question: "<a question a reader would actually search for>"
    answer: "<a direct 1-3 sentence answer>"
---
```

Pick the type on purpose. **News** reports what happened: lede with the core fact, what happened, why it matters. **Analysis** interprets: the claim, the evidence for it, the strongest counterpoint. **Explainer** answers "what is it and how does it work": what it is, how it works, what changed. If the post covers a company or product WikiDigit's people are connected to (for example Emojar), add `disclosure: "<one sentence>"`.

Read time is computed from the body at build time, so don't add `readTime`. Add `updated: "<YYYY-MM-DD>"` only when a published post is changed in substance, and put a dated correction note at the top of the body when a fact was wrong.

Author: pick one of the authors in `lib/authors.ts` at random (currently Siavash Ghanbari or Sheida Mohassesy). Never use a "WikiDigit" byline or invent an author.

Body (700–1,000 words):
- **Lede:** one dense paragraph that answers who, what, when and why it matters in the first two sentences. Answer engines quote this, so state the core fact plainly.
- 3–5 `##` sections with specific, newsy headings (not "Background" or "Conclusion").
- Voice: a knowledgeable tech colleague, confident and plain, with numbers and named people. No filler, no "In today's fast-paced world".
- Every number, quote and claim must come from your sources. If something is unconfirmed, say so.
- Link 2–3 related WikiDigit posts inline as `[anchor text](/article/<slug>)`, with descriptive anchor text, wherever they fit naturally.
- End with `## Sources` as a bullet list of 3–6 external links (primary sources first).
- Add 3–4 `faq` entries in the frontmatter. The page shows them as a "Frequently asked questions" section and emits FAQPage JSON-LD, so don't repeat them in the body.

## 5. Draw the cover image (1216×521)

Draw it as code (SVG/HTML), not with a model. Every cover must look different from the ones before it: a different palette, a different composition, and the objects of this story. Readers see the covers side by side on the home page, so "navy background, blue glow, perspective grid" every day reads as one image repeated.

1. Run `node scripts/cover-style.mjs`. It prints the last six covers (from `content/cover-log.json`), the palettes and compositions that are still allowed, and three starting pairs. The rules it enforces: a palette may not repeat within the previous 4 covers, a composition may not repeat within the previous 3, and at least one cover in every four uses a light palette. The menu lives in `scripts/cover-template/styles.json` (12 palettes, 12 compositions). Pick the pair whose mood fits the story; don't default to `midnight` + `neon-scene` because the template used to look like that.
2. Open the last four PNGs in `public/images/articles/` and look at them, so you know what "different" means today.
3. Copy `scripts/cover-template/template.html` to a temp folder, paste the palette's six hex values into the `:root` variables, and replace the example subject with an illustration of **this specific story** in the chosen composition: a chip die, a robot arm, a courtroom, a rocket, a vault, a network graph, a bar chart that breaks out, and so on. Use real shapes with depth and light appropriate to the composition (flat shapes for a poster, outlines for a blueprint, layered shadows for paper cut-outs). Not a generic abstract blob, and not the same chart-with-glow every time.
4. Follow the template rules: no text, letters, numbers or logos; keep the subject in the centre safe zone (x 236–980) because cards crop to 16:9; keep the bottom third calm because the hero overlays the title there (it adds its own dark gradient, so light palettes are fine); use the category colour as an accent where it fits.
5. Render: `node scripts/render-cover.mjs <design.html> public/images/articles/<slug>.png`
6. Open the PNG and look at it. If it's sparse, off-topic or broken, improve the design and render again (at most 3 rounds).
7. Record what you used: `node scripts/cover-style.mjs --record <slug> --palette <name> --composition <name> --subject "<one line: what the picture shows>"`. The command refuses a palette or composition that is too recent.
8. Run `node scripts/cover-style.mjs --analyze`. It measures the dominant hue and lightness of the last covers from the PNGs themselves and warns (exit code 2) when the new one has the same hue and similar lightness as the previous ones. If it warns, change the background or palette and render again. This catches a "paper" cover that was drawn mostly in blue anyway.

## 6. SEO and AEO pass

- `description` is 150–160 characters, includes the main entity, and is unique among existing posts.
- The title and the first paragraph contain the main entity and the core fact.
- Tags reuse existing tags where they fit (check other posts) so the tag pages build up.
- Add a link to the new post from 1–2 of the most related existing posts: one natural sentence each, not a "related" dump. Keep these edits small.
- The FAQ answers are self-contained and factual: they're what AI answer engines will quote.
- Check: `npx eslint`, `npm run build`, `node scripts/pick-topic.mjs` (no unknown categories) and `node scripts/cover-style.mjs --check <slug>` (the cover is recorded and doesn't repeat a recent palette or composition). All must pass.
- Start the build (`npx next start -p <free port>`), open `/article/<slug>` and check that the cover, the FAQ section and the JSON-LD (`script[type="application/ld+json"]`) render. Then stop the server.

## 7. PR and notification

- Commit: `feat(blog): add post - <Title>`
- Push the `post/<slug>` branch and open a PR to `main`:
  - Title: `feat(blog): add post - <Title>`
  - Body: a summary, then the lines `Category: <topic>` (this line is required; step 1 reads it) and `Topic weights: <the pick-topic table as markdown, before this post>` and `Cover: <palette> + <composition>`, then sources, the SEO changes made, and a test plan.
- Send Sia one push notification: `New WikiDigit post ready to review: <Title> — <PR URL>`
- Remove the worktree (`git worktree remove`). Leave the branch for the PR.

## Failure rules

- If no story can be confirmed by two reputable sources, don't publish a weak post. Try the next-highest-deficit topic once. If that fails too, notify Sia that the run was skipped and why.
- If lint or build fails and the fix isn't obvious, still don't open a PR: notify Sia with the error.
- Never merge, force-push, change `main`, or edit posts beyond the small inbound-link edits in step 6.
- Never skip the cover-style steps to save time. A post with a repeated-looking cover is worse than a post that took one more render.
