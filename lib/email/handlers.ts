import type { EmailConfig } from "@/lib/email/config";
import { sendEmail, subscribeContact } from "@/lib/email/resend";
import { createToken, verifyToken } from "@/lib/newsletter-token";
import { cleanText, looksAutomated, normalizeEmail } from "@/lib/validate";

// Route logic as plain functions so it can be tested without Next.js.

export interface HandlerResult {
  status: number;
  body: { ok: boolean; message: string };
}

const CHECK_INBOX = "Check your inbox and click the link to confirm your subscription.";
const TRY_AGAIN = "Something went wrong on our side. Please try again in a few minutes.";

export async function handleSubscribe(
  input: Record<string, unknown>,
  config: EmailConfig,
  siteUrl: string,
  now = Date.now()
): Promise<HandlerResult> {
  // Bots get the same answer as people so they learn nothing from it.
  if (looksAutomated(input.website, input.startedAt, now)) {
    return { status: 200, body: { ok: true, message: CHECK_INBOX } };
  }

  const email = normalizeEmail(input.email);
  if (!email) {
    return { status: 400, body: { ok: false, message: "Please enter a valid email address." } };
  }

  const link = `${siteUrl}/newsletter/confirm?token=${encodeURIComponent(createToken(email, config.tokenSecret, now))}`;
  const sent = await sendEmail(config, {
    to: email,
    subject: "Confirm your WikiDigit newsletter subscription",
    text: [
      "Thanks for signing up for the WikiDigit newsletter.",
      "",
      "Please confirm your subscription by opening this link (it expires in 48 hours):",
      link,
      "",
      "If you didn't sign up, ignore this email. Nothing will happen and we won't email you again.",
    ].join("\n"),
  });

  // Same message whether or not the address is already subscribed, so the form
  // can't be used to find out who is on the list.
  return sent
    ? { status: 200, body: { ok: true, message: CHECK_INBOX } }
    : { status: 502, body: { ok: false, message: TRY_AGAIN } };
}

export type ConfirmResult = "subscribed" | "invalid" | "expired" | "error";

export async function handleConfirm(token: unknown, config: EmailConfig, now = Date.now()): Promise<ConfirmResult> {
  const result = verifyToken(token, config.tokenSecret, now);
  if (!result.ok) return result.reason;
  return (await subscribeContact(config, result.email)) ? "subscribed" : "error";
}

export const CONTACT_SUBJECTS: Record<string, string> = {
  "story-tip": "Story tip",
  correction: "Correction request",
  "press-release": "Press release",
  advertising: "Advertising",
  other: "Other",
};

export async function handleContact(
  input: Record<string, unknown>,
  config: EmailConfig,
  now = Date.now()
): Promise<HandlerResult> {
  const sentMessage = "Thanks, your message has been sent. We read everything, but we can't reply to every message.";
  if (looksAutomated(input.website, input.startedAt, now)) {
    return { status: 200, body: { ok: true, message: sentMessage } };
  }

  const email = normalizeEmail(input.email);
  const name = cleanText(input.name, 100);
  const subjectKey = typeof input.subject === "string" ? input.subject : "";
  const subject = CONTACT_SUBJECTS[subjectKey];
  const message = cleanText(input.message, 5000);

  if (!email) return { status: 400, body: { ok: false, message: "Please enter a valid email address." } };
  if (name === null) return { status: 400, body: { ok: false, message: "Please keep your name under 100 characters." } };
  if (!subject) return { status: 400, body: { ok: false, message: "Please choose a subject." } };
  if (!message || message.length < 10) {
    return { status: 400, body: { ok: false, message: "Please write a message of at least 10 characters (up to 5,000)." } };
  }

  const sent = await sendEmail(config, {
    to: config.contactTo,
    replyTo: email,
    // Header-safe: name and subject are single-line, length-limited strings.
    subject: `[WikiDigit contact] ${subject}${name ? ` from ${name.replace(/[\r\n]+/g, " ")}` : ""}`,
    text: [`From: ${name || "(no name)"} <${email}>`, `Subject: ${subject}`, "", message].join("\n"),
  });

  return sent
    ? { status: 200, body: { ok: true, message: sentMessage } }
    : { status: 502, body: { ok: false, message: TRY_AGAIN } };
}
