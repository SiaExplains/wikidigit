// Best-effort limiter: state lives in one serverless instance, so it slows down a
// single noisy client but is no substitute for a Vercel Firewall rate-limit rule.

export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return function allow(key: string, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) hits.clear();
    return true;
  };
}
