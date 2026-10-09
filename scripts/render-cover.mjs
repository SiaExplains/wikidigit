#!/usr/bin/env node
// Renders a hand-drawn HTML/SVG cover design to a PNG with headless Chrome.
// Usage: node scripts/render-cover.mjs <design.html|design.svg> <out.png> [width] [height]
// Defaults to 1216x521 (21:9, matches the article hero).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const [input, output, width = "1216", height = "521"] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/render-cover.mjs <design.html|design.svg> <out.png> [width] [height]");
  process.exit(1);
}

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = chromeCandidates.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error("Chrome not found. Set CHROME_PATH.");
  process.exit(1);
}

const src = path.resolve(input);
const out = path.resolve(output);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wd-cover-"));

// Wrap a bare SVG so it renders edge to edge at the exact size.
let pageFile = src;
if (src.endsWith(".svg")) {
  pageFile = path.join(tmp, "page.html");
  fs.writeFileSync(
    pageFile,
    `<!doctype html><html><body style="margin:0;width:${width}px;height:${height}px;overflow:hidden">${fs.readFileSync(src, "utf8")}</body></html>`,
  );
}

const shot = path.join(tmp, "shot.png");
// Chrome helpers can still be flushing the profile after the main process dies.
const cleanup = () => {
  try {
    fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // Leftover temp dir is harmless; the OS clears tmp.
  }
};
const proc = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=3000",
    `--user-data-dir=${path.join(tmp, "profile")}`,
    `--window-size=${width},${height}`,
    `--screenshot=${shot}`,
    pathToFileURL(pageFile).href,
  ],
  { stdio: "ignore" },
);

// Headless Chrome sometimes writes the screenshot but never exits, so poll for
// the file and kill the process once it has finished writing.
const deadline = Date.now() + 60_000;
let lastSize = -1;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 500));
  if (!fs.existsSync(shot)) continue;
  const size = fs.statSync(shot).size;
  if (size > 0 && size === lastSize) break;
  lastSize = size;
}
const exited = new Promise((r) => proc.once("exit", r));
proc.kill("SIGKILL");
await Promise.race([exited, new Promise((r) => setTimeout(r, 2000))]);

if (!fs.existsSync(shot) || fs.statSync(shot).size === 0) {
  cleanup();
  console.error("Render failed: no screenshot produced.");
  process.exit(1);
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.copyFileSync(shot, out);
cleanup();
console.log(`Rendered ${out} (${width}x${height})`);
