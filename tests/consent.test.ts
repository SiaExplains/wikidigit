// Cookie consent: parsing what's stored, the Consent Mode signals sent to Google,
// and the inline <head> script, run in a sandbox with a stub localStorage.
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  CONSENT_DEFAULT_SCRIPT,
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  parseConsent,
  toGoogleConsent,
} from "@/lib/consent";

const NOW = 1_800_000_000_000;

test("parseConsent: nothing stored means no choice yet", () => {
  assert.equal(parseConsent(null, NOW), null);
});

test("parseConsent: old banner values carry over", () => {
  assert.deepEqual(parseConsent("accepted", NOW), { v: 2, analytics: true, ts: 0 });
  assert.deepEqual(parseConsent("essential", NOW), { v: 2, analytics: false, ts: 0 });
});

test("parseConsent: reads a current choice", () => {
  const raw = JSON.stringify({ v: 2, analytics: true, ts: NOW - 1000 });
  assert.deepEqual(parseConsent(raw, NOW), { v: 2, analytics: true, ts: NOW - 1000 });
});

test("parseConsent: a choice older than a year is asked again", () => {
  const raw = JSON.stringify({ v: 2, analytics: true, ts: NOW - CONSENT_MAX_AGE_MS - 1 });
  assert.equal(parseConsent(raw, NOW), null);
});

test("parseConsent: malformed or unknown values are treated as no choice", () => {
  for (const raw of ["", "yes", "{", "null", "[]", '{"v":1,"analytics":true,"ts":1}', '{"v":2,"analytics":"true","ts":1}']) {
    assert.equal(parseConsent(raw, NOW), null, raw);
  }
});

test("toGoogleConsent: everything denied without a choice", () => {
  assert.deepEqual(toGoogleConsent(null), {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
});

test("toGoogleConsent: accepting analytics grants analytics only", () => {
  const google = toGoogleConsent({ v: 2, analytics: true, ts: NOW });
  assert.equal(google.analytics_storage, "granted");
  assert.equal(google.ad_storage, "denied");
  assert.equal(google.ad_user_data, "denied");
  assert.equal(google.ad_personalization, "denied");
});

// Runs the head script and returns what it pushed to dataLayer as plain arrays.
function runHeadScript(stored: string | null): unknown[][] {
  const window: Record<string, unknown> = {};
  const localStorage = { getItem: (key: string) => (key === CONSENT_STORAGE_KEY ? stored : null) };
  const context = vm.createContext({ window, localStorage, Date });
  // The script reads bare `dataLayer`, as it would on a real page where window is global.
  Object.defineProperty(context, "dataLayer", { get: () => window.dataLayer });
  vm.runInContext(CONSENT_DEFAULT_SCRIPT, context);
  // JSON round-trip: objects built inside the sandbox have the sandbox's prototypes.
  return JSON.parse(JSON.stringify((window.dataLayer as ArrayLike<unknown>[]).map((args) => Array.from(args))));
}

test("head script: defaults every signal to denied first", () => {
  const calls = runHeadScript(null);
  assert.deepEqual(calls[0], [
    "consent",
    "default",
    { ...toGoogleConsent(null), wait_for_update: 500 },
  ]);
  assert.ok(!calls.some((c) => c[1] === "update"));
});

test("head script: re-applies a returning reader's yes", () => {
  const stored = JSON.stringify({ v: 2, analytics: true, ts: Date.now() });
  const calls = runHeadScript(stored);
  assert.equal(calls[0][1], "default");
  assert.deepEqual(calls.at(-1), ["consent", "update", { analytics_storage: "granted" }]);
  assert.deepEqual(runHeadScript("accepted").at(-1), ["consent", "update", { analytics_storage: "granted" }]);
});

test("head script: a no, an expired yes or junk grants nothing", () => {
  const expired = JSON.stringify({ v: 2, analytics: true, ts: Date.now() - CONSENT_MAX_AGE_MS - 1000 });
  for (const stored of [JSON.stringify({ v: 2, analytics: false, ts: Date.now() }), "essential", expired, "{bad"]) {
    assert.ok(!runHeadScript(stored).some((c) => c[1] === "update"), stored);
  }
});
