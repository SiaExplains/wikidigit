import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { HandlerResult } from "@/lib/email/handlers";

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// Requiring a JSON content type means a plain cross-site <form> post can't reach
// these endpoints: browsers preflight JSON requests from other origins.
export function isJson(req: NextRequest): boolean {
  return (req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json");
}

export const unsupported = () =>
  NextResponse.json({ ok: false, message: "Unsupported request." }, { status: 415 });

// Small JSON bodies only; anything else is treated as an empty submission.
export async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const text = await req.text();
    if (text.length > 20_000) return {};
    const data: unknown = JSON.parse(text);
    return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function respond(result: HandlerResult): NextResponse {
  return NextResponse.json(result.body, { status: result.status });
}

export const tooMany = () =>
  NextResponse.json({ ok: false, message: "Too many attempts. Please try again later." }, { status: 429 });

export const unavailable = () =>
  NextResponse.json({ ok: false, message: "This form isn't available right now." }, { status: 503 });
