// Cookie consent: what the reader chose, where it is stored, and what Google
// Consent Mode v2 is told. The banner only covers Google Analytics. No ad network
// runs yet, so every ad signal stays denied; when AdSense goes live its EEA/UK
// consent comes from Google's certified CMP (see README), not from this banner.

export const CONSENT_STORAGE_KEY = "wd_cookie_consent";
export const CONSENT_CHANGE_EVENT = "wd:consent-change";
export const OPEN_SETTINGS_EVENT = "wd:open-cookie-settings";

// Ask again after a year, so a choice doesn't stand forever.
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export interface ConsentState {
  v: 2;
  analytics: boolean;
  ts: number;
}

type ConsentValue = "granted" | "denied";

export interface GoogleConsent {
  ad_storage: ConsentValue;
  analytics_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Reads the stored value. Version-1 values ("accepted" / "essential", no date)
// carry over so returning readers aren't asked twice.
export function parseConsent(raw: string | null, now = Date.now()): ConsentState | null {
  if (raw === null) return null;
  if (raw === "accepted") return { v: 2, analytics: true, ts: 0 };
  if (raw === "essential") return { v: 2, analytics: false, ts: 0 };
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const { v, analytics, ts } = value as Record<string, unknown>;
    if (v !== 2 || typeof analytics !== "boolean" || typeof ts !== "number") return null;
    if (now - ts > CONSENT_MAX_AGE_MS) return null;
    return { v: 2, analytics, ts };
  } catch {
    return null;
  }
}

export function toGoogleConsent(consent: ConsentState | null): GoogleConsent {
  return {
    ad_storage: "denied",
    analytics_storage: consent?.analytics ? "granted" : "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

export function readStoredConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
  };
}

export function saveConsent(analytics: boolean) {
  const consent: ConsentState = { v: 2, analytics, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  window.gtag?.("consent", "update", toGoogleConsent(consent));
  if (!analytics) clearAnalyticsCookies();
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

// GA sets _ga and _ga_<id> on the registrable domain, so clear both host forms.
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

// Runs inline in <head> before anything else: every Consent Mode signal starts
// denied, then a returning reader's stored choice is applied. Kept as plain ES5 so
// it needs no bundling. It must push `arguments`, not an array, for gtag.js to read it.
export const CONSENT_DEFAULT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',${JSON.stringify({ ...toGoogleConsent(null), wait_for_update: 500 })});
gtag('set','ads_data_redaction',true);
try{var r=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}),a=r==='accepted';
if(r&&r.charAt(0)==='{'){var c=JSON.parse(r);a=c.v===2&&c.analytics===true&&Date.now()-c.ts<=${CONSENT_MAX_AGE_MS};}
if(a)gtag('consent','update',{analytics_storage:'granted'});}catch(e){}`;
