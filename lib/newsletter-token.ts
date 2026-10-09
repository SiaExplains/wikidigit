import { createHmac, timingSafeEqual } from "node:crypto";

// Stateless double opt-in: the confirmation link carries the email and an expiry,
// signed with a server secret, so nothing is stored until the person confirms.

export const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

export type TokenResult = { ok: true; email: string } | { ok: false; reason: "invalid" | "expired" };

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createToken(email: string, secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ e: email, x: now + TOKEN_TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyToken(token: unknown, secret: string, now = Date.now()): TokenResult {
  if (typeof token !== "string" || token.length > 2048) return { ok: false, reason: "invalid" };
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { ok: false, reason: "invalid" };

  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "invalid" };
  }

  let data: { e?: unknown; x?: unknown };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (typeof data.e !== "string" || typeof data.x !== "number") return { ok: false, reason: "invalid" };
  if (now > data.x) return { ok: false, reason: "expired" };
  return { ok: true, email: data.e };
}
