import type { NextRequest } from "next/server";
import { getEmailConfig } from "@/lib/email/config";
import { handleSubscribe } from "@/lib/email/handlers";
import { clientIp, isJson, readJson, respond, tooMany, unavailable, unsupported } from "@/lib/email/request";
import { createRateLimiter } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";

const allow = createRateLimiter(5, 10 * 60 * 1000);

export async function POST(req: NextRequest) {
  const config = getEmailConfig();
  if (!config) return unavailable();
  if (!isJson(req)) return unsupported();
  if (!allow(clientIp(req))) return tooMany();
  return respond(await handleSubscribe(await readJson(req), config, SITE_URL));
}
