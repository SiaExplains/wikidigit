#!/usr/bin/env node
// Keeps daily-post covers visually different from each other.
//
//   node scripts/cover-style.mjs                      show recent covers and suggest palette+composition pairs
//   node scripts/cover-style.mjs --record <slug> --palette <name> --composition <name> [--subject "<text>"]
//   node scripts/cover-style.mjs --record <slug> --supplied [--subject "<text>"]
//                                                    log a supplied photo used as the cover (not drawn)
//   node scripts/cover-style.mjs --check <slug>       fail if the cover repeats a recent palette/composition
//   node scripts/cover-style.mjs --analyze            measure hue/lightness of the last covers with headless Chrome
//
// Data: scripts/cover-template/styles.json (menu) and content/cover-log.json (what each post used).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const STYLES = path.join(ROOT, "scripts/cover-template/styles.json");
const LOG = path.join(ROOT, "content/cover-log.json");
const ARTICLES = path.join(ROOT, "content/articles");

const PALETTE_WINDOW = 4; // a palette may not repeat within the previous 4 covers
const COMPOSITION_WINDOW = 3; // a composition may not repeat within the previous 3 covers
const LIGHT_EVERY = 4; // at least one light palette in every 4 covers

const styles = JSON.parse(fs.readFileSync(STYLES, "utf8"));
const paletteNames = styles.palettes.map((p) => p.name);
const compositionNames = styles.compositions.map((c) => c.name);

// A supplied photo isn't drawn from the menu, so it neither uses up a palette or
// composition nor counts towards the light-cover rule.
function drawn(log) {
  return log.filter((e) => !e.supplied);
}

function readLog() {
  if (!fs.existsSync(LOG)) return [];
  const log = JSON.parse(fs.readFileSync(LOG, "utf8"));
  return log.sort((a, b) => a.date.localeCompare(b.date));
}

function writeLog(log) {
  log.sort((a, b) => a.date.localeCompare(b.date));
  fs.writeFileSync(LOG, JSON.stringify(log, null, 2) + "\n");
}

function readFrontmatter(slug) {
  const file = path.join(ARTICLES, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const src = fs.readFileSync(file, "utf8");
  const get = (key) => {
    const m = src.match(new RegExp(`^${key}: "?([^"\\n]+)"?$`, "m"));
    return m ? m[1] : null;
  };
  return { date: get("date"), image: get("coverImage") };
}

function previousEntries(log, slug) {
  const idx = log.findIndex((e) => e.slug === slug);
  return idx === -1 ? log : log.slice(0, idx);
}

function violations(log, entry) {
  if (entry.supplied) return [];
  const prev = drawn(previousEntries(log, entry.slug));
  const problems = [];
  if (!paletteNames.includes(entry.palette)) problems.push(`unknown palette "${entry.palette}"`);
  if (!compositionNames.includes(entry.composition)) problems.push(`unknown composition "${entry.composition}"`);
  const recentPalettes = prev.slice(-PALETTE_WINDOW).map((e) => e.palette);
  const recentCompositions = prev.slice(-COMPOSITION_WINDOW).map((e) => e.composition);
  if (recentPalettes.includes(entry.palette)) {
    problems.push(`palette "${entry.palette}" was used in the previous ${PALETTE_WINDOW} covers (${recentPalettes.join(", ")})`);
  }
  if (recentCompositions.includes(entry.composition)) {
    problems.push(`composition "${entry.composition}" was used in the previous ${COMPOSITION_WINDOW} covers (${recentCompositions.join(", ")})`);
  }
  return problems;
}

function isLight(name) {
  return styles.palettes.find((p) => p.name === name)?.light === true;
}

function allowed(fullLog) {
  const log = drawn(fullLog);
  const recentPalettes = log.slice(-PALETTE_WINDOW).map((e) => e.palette);
  const recentCompositions = log.slice(-COMPOSITION_WINDOW).map((e) => e.composition);
  let palettes = styles.palettes.filter((p) => !recentPalettes.includes(p.name));
  const compositions = styles.compositions.filter((c) => !recentCompositions.includes(c.name));
  const lastFew = log.slice(-(LIGHT_EVERY - 1));
  const needLight = lastFew.length === LIGHT_EVERY - 1 && !lastFew.some((e) => isLight(e.palette));
  if (needLight) palettes = palettes.filter((p) => p.light);
  return { palettes, compositions, needLight };
}

function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}

function printPalette(p) {
  console.log(`  ${p.name}${p.light ? " (light)" : ""}: ${p.mood}`);
  console.log(`    bg0 ${p.bg0}  bg1 ${p.bg1}  ink ${p.ink}  accent ${p.accent}  accent2 ${p.accent2}  highlight ${p.highlight}`);
}

function suggest() {
  const log = readLog();
  console.log(`Last ${Math.min(6, log.length)} covers:`);
  console.table(log.slice(-6).map(({ slug, date, palette, composition }) => ({ slug, date, palette, composition })));
  const { palettes, compositions, needLight } = allowed(log);
  if (needLight) console.log(`The last ${LIGHT_EVERY - 1} covers were all dark, so this one must use a light palette.\n`);
  console.log("Allowed palettes:");
  palettes.forEach(printPalette);
  console.log("\nAllowed compositions:");
  compositions.forEach((c) => console.log(`  ${c.name}: ${c.how}`));
  const comps = pick(compositions, 3);
  const pairs = pick(palettes, 3).map((p, i) => ({ palette: p.name, composition: comps[i % comps.length]?.name }));
  console.log("\nThree starting points (pick the one that fits the story's objects best, or any other allowed pair):");
  pairs.forEach((pair) => console.log(`  ${pair.palette} + ${pair.composition}`));
  console.log("\nWhen the cover is done: node scripts/cover-style.mjs --record <slug> --palette <name> --composition <name> --subject \"<what it shows>\"");
}

function record(args) {
  const slug = args.record;
  const fm = readFrontmatter(slug);
  if (!fm) fail(`No article content/articles/${slug}.mdx`);
  if (!args.supplied && (!args.palette || !args.composition)) fail("--record needs --palette and --composition, or --supplied");
  const existing = readLog();
  const log = existing.filter((e) => e.slug !== slug);
  const entry = args.supplied
    ? { slug, date: fm.date, image: fm.image, palette: "supplied", composition: "supplied", supplied: true, subject: args.subject || "" }
    : { slug, date: fm.date, image: fm.image, palette: args.palette, composition: args.composition, subject: args.subject || "" };
  const problems = violations([...log, entry].sort((a, b) => a.date.localeCompare(b.date)), entry);
  if (problems.length) fail(`Not recorded:\n  - ${problems.join("\n  - ")}`);
  // Re-recording a slug replaces its entry in place, so same-day ordering doesn't shift.
  const at = existing.findIndex((e) => e.slug === slug);
  writeLog(at === -1 ? [...log, entry] : existing.map((e, i) => (i === at ? entry : e)));
  console.log(`Recorded ${slug}: ${entry.palette} + ${entry.composition}`);
}

function check(slug) {
  const log = readLog();
  const entry = log.find((e) => e.slug === slug);
  if (!entry) fail(`${slug} has no entry in content/cover-log.json. Run --record first.`);
  const fm = readFrontmatter(slug);
  if (!fm) fail(`No article content/articles/${slug}.mdx`);
  const problems = violations(log, entry);
  if (fm.image && !fs.existsSync(path.join(ROOT, "public", fm.image))) problems.push(`cover file public${fm.image} is missing`);
  if (problems.length) fail(`Cover check failed for ${slug}:\n  - ${problems.join("\n  - ")}`);
  console.log(`Cover check passed for ${slug}: ${entry.palette} + ${entry.composition}`);
}

// Measures each recent cover's mean lightness, saturation and dominant hue so a run can see
// whether the new cover actually looks different, not just whether it was labelled differently.
function analyze(count = 6) {
  const log = readLog().slice(-count);
  const images = log.map((e) => ({ slug: e.slug, url: pathToFileURL(path.join(ROOT, "public", e.image)).href }));
  const chrome = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean).find((p) => fs.existsSync(p));
  if (!chrome) fail("Chrome not found. Set CHROME_PATH.");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wd-cover-analyze-"));
  const page = path.join(tmp, "page.html");
  fs.writeFileSync(
    page,
    `<!doctype html><html><body><pre id="out"></pre><script>
const images = ${JSON.stringify(images)};
function stats(img) {
  const c = document.createElement("canvas"); c.width = 152; c.height = 65;
  const g = c.getContext("2d"); g.drawImage(img, 0, 0, c.width, c.height);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const bins = new Array(12).fill(0); let L = 0, S = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255;
    const max = Math.max(r, gg, b), min = Math.min(r, gg, b), l = (max + min) / 2;
    const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (max !== min) {
      if (max === r) h = ((gg - b) / (max - min)) % 6; else if (max === gg) h = (b - r) / (max - min) + 2; else h = (r - gg) / (max - min) + 4;
      h = (h * 60 + 360) % 360;
    }
    L += l; S += s; n++;
    if (s > 0.15 && l > 0.08 && l < 0.95) bins[Math.floor(h / 30)] += 1;
  }
  const top = bins.indexOf(Math.max(...bins));
  const names = ["red","orange","yellow","lime","green","mint","cyan","azure","blue","violet","magenta","rose"];
  return { lightness: +(L / n).toFixed(2), saturation: +(S / n).toFixed(2), hue: names[top], hueShare: +(bins[top] / Math.max(1, bins.reduce((a, b) => a + b, 0))).toFixed(2) };
}
Promise.all(images.map((im) => new Promise((res) => { const img = new Image(); img.onload = () => res({ slug: im.slug, ...stats(img) }); img.onerror = () => res({ slug: im.slug, error: "load failed" }); img.src = im.url; })))
  .then((rows) => { document.getElementById("out").textContent = "WDSTATS" + JSON.stringify(rows) + "WDEND"; });
</script></body></html>`,
  );
  let dom = "";
  try {
    dom = execFileSync(
      chrome,
      ["--headless=new", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=8000", `--user-data-dir=${path.join(tmp, "profile")}`, "--dump-dom", pathToFileURL(page).href],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 20_000 },
    );
  } catch (err) {
    // Headless Chrome often writes the DOM and then never exits; the output is still usable.
    dom = typeof err.stdout === "string" ? err.stdout : "";
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const m = dom.match(/WDSTATS(.*?)WDEND/s);
  if (!m) fail("Analysis failed: no stats in page output.");
  const rows = JSON.parse(m[1]);
  console.log("Measured from the PNGs (hue = dominant hue of saturated pixels; lightness 0 dark .. 1 light):");
  console.table(rows);
  const last = rows[rows.length - 1];
  const before = rows.slice(0, -1);
  if (last && !last.error && before.length) {
    const sameHue = before.filter((r) => r.hue === last.hue).length;
    const closeLight = before.filter((r) => Math.abs(r.lightness - last.lightness) < 0.08).length;
    if (sameHue >= Math.min(2, before.length) && closeLight >= Math.min(2, before.length)) {
      console.log(`Warning: ${last.slug} has the same dominant hue (${last.hue}) and similar lightness as ${sameHue} of the previous ${before.length} covers. It will look like a repeat; change the palette or the background.`);
      process.exitCode = 2;
    }
  }
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) { out[key] = next; i++; } else out[key] = true;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (args.record) record(args);
else if (args.check) check(args.check);
else if (args.analyze) analyze(typeof args.analyze === "string" ? Number(args.analyze) : 6);
else suggest();
