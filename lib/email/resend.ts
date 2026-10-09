import type { EmailConfig } from "@/lib/email/config";

// Minimal Resend REST client. Plain fetch keeps it dependency-free and easy to stub.

const TIMEOUT_MS = 8000;

async function call(config: EmailConfig, path: string, method: string, body?: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${config.apiBase}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface OutgoingEmail {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export function sendEmail(config: EmailConfig, email: OutgoingEmail): Promise<boolean> {
  return call(config, "/emails", "POST", {
    from: config.from,
    to: [email.to],
    subject: email.subject,
    text: email.text,
    ...(email.html && { html: email.html }),
    ...(email.replyTo && { reply_to: email.replyTo }),
  });
}

// Creates the contact in the newsletter segment. If it already exists (an earlier
// subscriber, or someone who unsubscribed and has now confirmed again), it is
// resubscribed and added to the segment and topic instead.
export async function subscribeContact(config: EmailConfig, email: string): Promise<boolean> {
  const topics = config.topicId ? [{ id: config.topicId, subscription: "opt_in" }] : undefined;

  const created = await call(config, "/contacts", "POST", {
    email,
    unsubscribed: false,
    segments: [{ id: config.segmentId }],
    ...(topics && { topics }),
  });
  if (created) return true;

  const contact = encodeURIComponent(email);
  const updated = await call(config, `/contacts/${contact}`, "PATCH", { unsubscribed: false });
  if (!updated) return false;
  const inSegment = await call(config, `/contacts/${contact}/segments/${encodeURIComponent(config.segmentId)}`, "POST");
  if (!inSegment) return false;
  return topics ? call(config, `/contacts/${contact}/topics`, "PATCH", topics) : true;
}
