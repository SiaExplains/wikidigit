#!/usr/bin/env node
// Picks the category for the next post: the one furthest below its target share
// in content/topic-weights.json. Ties go to the higher-priority (earlier) topic.
// Usage: node scripts/pick-topic.mjs [--json] [--pending "Business,Tech"]
//   --pending: categories of posts sitting in open, unmerged PRs, so they count too.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const { weights } = JSON.parse(fs.readFileSync(path.join(root, "content/topic-weights.json"), "utf8"));

const total = weights.reduce((sum, w) => sum + w.percent, 0);
if (total !== 100) throw new Error(`topic-weights.json percents sum to ${total}, expected 100`);

const dir = path.join(root, "content/articles");
const counts = Object.fromEntries(weights.map((w) => [w.category, 0]));
const unknown = [];
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  if (data.draft) continue;
  if (data.category in counts) counts[data.category]++;
  else unknown.push(`${file} (${data.category})`);
}

const pendingArg = process.argv[process.argv.indexOf("--pending") + 1];
if (process.argv.includes("--pending") && pendingArg) {
  for (const cat of pendingArg.split(",").map((c) => c.trim()).filter(Boolean)) {
    if (cat in counts) counts[cat]++;
    else unknown.push(`pending PR (${cat})`);
  }
}

const posts = Object.values(counts).reduce((a, b) => a + b, 0);
// Deficit = how many posts this topic is short of its target share after one more post.
const rows = weights.map((w, priority) => {
  const target = (w.percent / 100) * (posts + 1);
  return {
    category: w.category,
    priority,
    posts: counts[w.category],
    actualPercent: posts ? +((counts[w.category] / posts) * 100).toFixed(1) : 0,
    targetPercent: w.percent,
    deficit: +(target - counts[w.category]).toFixed(3),
  };
});

const pick = [...rows].sort((a, b) => b.deficit - a.deficit || a.priority - b.priority)[0];

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ pick: pick.category, totalPosts: posts, rows, unknown }, null, 2));
} else {
  console.table(rows);
  if (unknown.length) console.warn("Posts with a category not in topic-weights.json:", unknown);
  console.log(`\nNext topic: ${pick.category}`);
}
