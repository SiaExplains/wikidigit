#!/usr/bin/env node
// Keeps article images small. Covers double as OG images and the card grid
// loads several at once, so the target is 200 KB or less per file.
//
//   node scripts/compress-images.mjs                 dry run: report what would change
//   node scripts/compress-images.mjs --apply         rewrite oversized images
//   node scripts/compress-images.mjs --max-kb 150    change the target
//
// Each PNG over the target is re-encoded as a palette PNG (same file name, no visible
// change for drawn covers). If that still misses the target, which happens with
// photographic images, it becomes a JPEG instead: references in content/ are updated
// and the script prints the redirects to add to next.config.ts for the old .png URL.
//
// sharp comes with Next.js (it powers next/image), so there's no extra dependency.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIR = path.join(ROOT, "public/images/articles");
const CONTENT = path.join(ROOT, "content");

export async function palettePng(file) {
  return sharp(file).png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer();
}

// Re-encode in place when it saves space. Used by render-cover.mjs for new covers.
export async function compressPngInPlace(file) {
  const before = fs.statSync(file).size;
  const out = await palettePng(file);
  if (out.length < before) fs.writeFileSync(file, out);
  return { before, after: Math.min(out.length, before) };
}

function contentFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return contentFiles(p);
    return /\.(mdx|json)$/.test(d.name) ? [p] : [];
  });
}

function replaceReferences(from, to) {
  const changed = [];
  for (const file of contentFiles(CONTENT)) {
    const src = fs.readFileSync(file, "utf8");
    if (!src.includes(from)) continue;
    fs.writeFileSync(file, src.split(from).join(to));
    changed.push(path.relative(ROOT, file));
  }
  return changed;
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const maxIdx = args.indexOf("--max-kb");
  const maxBytes = (maxIdx !== -1 ? Number(args[maxIdx + 1]) : 200) * 1024;
  const kb = (n) => `${Math.round(n / 1024)} KB`;

  const redirects = [];
  let saved = 0;
  for (const name of fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).sort()) {
    const file = path.join(DIR, name);
    const before = fs.statSync(file).size;
    if (before <= maxBytes) continue;

    const png = await palettePng(file);
    if (png.length <= maxBytes) {
      console.log(`png   ${name}: ${kb(before)} -> ${kb(png.length)}`);
      if (apply) fs.writeFileSync(file, png);
      saved += before - png.length;
      continue;
    }

    const jpgName = name.replace(/\.png$/, ".jpg");
    const jpg = await sharp(file).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    console.log(`jpg   ${name}: ${kb(before)} -> ${jpgName} ${kb(jpg.length)}`);
    saved += before - jpg.length;
    const from = `/images/articles/${name}`;
    const to = `/images/articles/${jpgName}`;
    redirects.push({ source: from, destination: to });
    if (apply) {
      fs.writeFileSync(path.join(DIR, jpgName), jpg);
      fs.unlinkSync(file);
      const refs = replaceReferences(from, to);
      console.log(`      updated ${refs.join(", ") || "no references"}`);
    }
  }

  console.log(`\n${apply ? "Saved" : "Would save"} ${kb(saved)}.`);
  if (redirects.length) {
    console.log("\nAdd these permanent redirects to next.config.ts so old links and cached social cards still work:");
    for (const r of redirects) console.log(`  ["${r.source}", "${r.destination}"],`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
