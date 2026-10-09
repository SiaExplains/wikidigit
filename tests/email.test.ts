// Unit and handler tests for the newsletter and contact flows. Resend is never
// called: fetch is replaced with a stub that records requests.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createToken, verifyToken, TOKEN_TTL_MS } from "@/lib/newsletter-token";
import { normalizeEmail, looksAutomated } from "@/lib/validate";
import { createRateLimiter } from "@/lib/rate-limit";
import { handleConfirm, handleContact, handleSubscribe } from "@/lib/email/handlers";
import type { EmailConfig } from "@/lib/email/config";

const config: EmailConfig = {
  apiKey: "re_test",
  apiBase: "https://resend.test",
  from: "WikiDigit <hi@wikidigit.com>",
  contactTo: "inbox@example.com",
  segmentId: "seg_1",
  topicId: "topic_1",
  tokenSecret: "test-secret",
};

const NOW = 1_800_000_000_000;
const human = { startedAt: NOW - 10_000, website: "" };

interface Recorded {
  url: string;
  method: string;
  body: unknown;
}
let requests: Recorded[] = [];
let respondWith: (req: Recorded) => number = () => 200;
const realFetch = globalThis.fetch;

beforeEach(() => {
  requests = [];
  respondWith = () => 200;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const req = {
      url: String(input),
      method: init?.method ?? "GET",
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    };
    requests.push(req);
    return new Response("{}", { status: respondWith(req) });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

test("tokens round-trip, expire, and reject tampering or the wrong secret", () => {
  const token = createToken("reader@example.com", "s", NOW);
  assert.deepEqual(verifyToken(token, "s", NOW + 1000), { ok: true, email: "reader@example.com" });
  assert.deepEqual(verifyToken(token, "s", NOW + TOKEN_TTL_MS + 1), { ok: false, reason: "expired" });
  assert.deepEqual(verifyToken(token, "other", NOW), { ok: false, reason: "invalid" });
  const [payload, sig] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ e: "evil@example.com", x: NOW + TOKEN_TTL_MS })).toString("base64url");
  assert.deepEqual(verifyToken(`${forged}.${sig}`, "s", NOW), { ok: false, reason: "invalid" });
  assert.deepEqual(verifyToken(`${payload}.`, "s", NOW), { ok: false, reason: "invalid" });
  assert.deepEqual(verifyToken(undefined, "s", NOW), { ok: false, reason: "invalid" });
});

test("emails are trimmed, the domain is lowercased, and bad input is rejected", () => {
  assert.equal(normalizeEmail("  Reader@Example.COM "), "Reader@example.com");
  for (const bad of ["", "no-at-sign", "a@b", "a b@example.com", 42, null, `${"x".repeat(250)}@example.com`]) {
    assert.equal(normalizeEmail(bad), null, String(bad));
  }
});

test("honeypot and too-fast submissions count as automated", () => {
  assert.equal(looksAutomated("", NOW - 10_000, NOW), false);
  assert.equal(looksAutomated("http://spam", NOW - 10_000, NOW), true);
  assert.equal(looksAutomated("", NOW - 500, NOW), true);
  assert.equal(looksAutomated("", undefined, NOW), true);
});

test("rate limiter allows the limit, then blocks until the window passes", () => {
  const allow = createRateLimiter(2, 1000);
  assert.equal(allow("ip", 0), true);
  assert.equal(allow("ip", 10), true);
  assert.equal(allow("ip", 20), false);
  assert.equal(allow("other", 20), true);
  assert.equal(allow("ip", 1500), true);
});

test("subscribe sends a confirmation email with a working token link", async () => {
  const result = await handleSubscribe({ ...human, email: "Reader@Example.com" }, config, "https://www.wikidigit.com", NOW);
  assert.equal(result.status, 200);
  assert.equal(requests.length, 1);
  const sent = requests[0];
  assert.equal(sent.url, "https://resend.test/emails");
  const body = sent.body as { to: string[]; text: string; from: string };
  assert.deepEqual(body.to, ["Reader@example.com"]);
  assert.equal(body.from, config.from);
  const link = body.text.match(/https:\/\/www\.wikidigit\.com\/newsletter\/confirm\?token=(\S+)/);
  assert.ok(link, "confirmation link missing");
  assert.deepEqual(verifyToken(decodeURIComponent(link[1]), config.tokenSecret, NOW), {
    ok: true,
    email: "Reader@example.com",
  });
  // No contact is created until the person confirms.
  assert.ok(!requests.some((r) => r.url.includes("/contacts")));
});

test("subscribe ignores bots without telling them, and rejects invalid email", async () => {
  const bot = await handleSubscribe({ email: "a@example.com", website: "x", startedAt: NOW - 10_000 }, config, "https://w", NOW);
  assert.equal(bot.status, 200);
  assert.equal(requests.length, 0);
  const invalid = await handleSubscribe({ ...human, email: "nope" }, config, "https://w", NOW);
  assert.equal(invalid.status, 400);
});

test("subscribe gives the same answer for any valid address, and 502 when the provider fails", async () => {
  const a = await handleSubscribe({ ...human, email: "new@example.com" }, config, "https://w", NOW);
  const b = await handleSubscribe({ ...human, email: "existing@example.com" }, config, "https://w", NOW);
  assert.deepEqual(a, b);
  respondWith = () => 500;
  const failed = await handleSubscribe({ ...human, email: "x@example.com" }, config, "https://w", NOW);
  assert.equal(failed.status, 502);
});

test("confirm creates the contact in the segment and topic", async () => {
  const token = createToken("reader@example.com", config.tokenSecret, NOW);
  assert.equal(await handleConfirm(token, config, NOW + 1000), "subscribed");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://resend.test/contacts");
  assert.deepEqual(requests[0].body, {
    email: "reader@example.com",
    unsubscribed: false,
    segments: [{ id: "seg_1" }],
    topics: [{ id: "topic_1", subscription: "opt_in" }],
  });
});

test("confirm resubscribes an existing contact when create fails", async () => {
  respondWith = (req) => (req.url.endsWith("/contacts") && req.method === "POST" ? 409 : 200);
  const token = createToken("back@example.com", config.tokenSecret, NOW);
  assert.equal(await handleConfirm(token, config, NOW), "subscribed");
  assert.deepEqual(
    requests.map((r) => `${r.method} ${r.url.replace("https://resend.test", "")}`),
    [
      "POST /contacts",
      "PATCH /contacts/back%40example.com",
      "POST /contacts/back%40example.com/segments/seg_1",
      "PATCH /contacts/back%40example.com/topics",
    ]
  );
});

test("confirm rejects expired and invalid tokens without calling Resend", async () => {
  const token = createToken("reader@example.com", config.tokenSecret, NOW);
  assert.equal(await handleConfirm(token, config, NOW + TOKEN_TTL_MS + 1), "expired");
  assert.equal(await handleConfirm("garbage", config, NOW), "invalid");
  assert.equal(requests.length, 0);
});

test("contact form emails us with Reply-To and validates input", async () => {
  const ok = await handleContact(
    { ...human, name: "Ana", email: "ana@example.com", subject: "correction", message: "The date in your article is wrong." },
    config,
    NOW
  );
  assert.equal(ok.status, 200);
  const body = requests[0].body as { to: string[]; reply_to: string; subject: string; text: string };
  assert.deepEqual(body.to, ["inbox@example.com"]);
  assert.equal(body.reply_to, "ana@example.com");
  assert.match(body.subject, /Correction request from Ana/);
  assert.match(body.text, /The date in your article is wrong\./);

  const cases: Record<string, unknown>[] = [
    { email: "bad", subject: "other", message: "long enough message" },
    { email: "a@example.com", subject: "nope", message: "long enough message" },
    { email: "a@example.com", subject: "other", message: "short" },
    { email: "a@example.com", subject: "other", message: "x".repeat(5001) },
  ];
  for (const input of cases) {
    assert.equal((await handleContact({ ...human, ...input }, config, NOW)).status, 400, JSON.stringify(input).slice(0, 60));
  }
});

test("contact strips newlines from the name so it can't inject headers", async () => {
  await handleContact(
    { ...human, name: "Eve\r\nBcc: victim@example.com", email: "eve@example.com", subject: "other", message: "hello there friend" },
    config,
    NOW
  );
  const body = requests[0].body as { subject: string };
  assert.doesNotMatch(body.subject, /[\r\n]/);
});
