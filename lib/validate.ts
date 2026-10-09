// Server-side input checks shared by the newsletter and contact endpoints.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Lowercases only the domain: the local part is case-sensitive in theory, and
// changing it could send mail to a different mailbox.
export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim();
  if (email.length === 0 || email.length > 254 || !EMAIL_RE.test(email)) return null;
  const at = email.lastIndexOf("@");
  return `${email.slice(0, at)}@${email.slice(at + 1).toLowerCase()}`;
}

export function cleanText(input: unknown, max: number): string | null {
  if (typeof input !== "string") return null;
  const text = input.trim();
  if (text.length > max) return null;
  return text;
}

// Bots fill hidden fields and submit instantly; people do neither.
export function looksAutomated(honeypot: unknown, startedAt: unknown, now = Date.now()): boolean {
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;
  const started = typeof startedAt === "number" ? startedAt : Number(startedAt);
  if (!Number.isFinite(started)) return true;
  return now - started < 2000;
}
