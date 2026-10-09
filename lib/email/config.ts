// Server-only email settings. Every value comes from the environment; nothing
// here may be imported into a client component.

export interface EmailConfig {
  apiKey: string;
  apiBase: string;
  from: string;
  contactTo: string;
  segmentId: string;
  topicId?: string;
  tokenSecret: string;
}

export function getEmailConfig(): EmailConfig | null {
  const env = process.env;
  if (!env.RESEND_API_KEY || !env.RESEND_SEGMENT_ID || !env.NEWSLETTER_TOKEN_SECRET) return null;
  return {
    apiKey: env.RESEND_API_KEY,
    // Overridable only so tests and local previews can point at a stub.
    apiBase: (env.RESEND_API_BASE || "https://api.resend.com").replace(/\/+$/, ""),
    from: env.EMAIL_FROM || "WikiDigit <hi@wikidigit.com>",
    contactTo: env.CONTACT_TO || "siaexplains@gmail.com",
    segmentId: env.RESEND_SEGMENT_ID,
    topicId: env.RESEND_TOPIC_ID || undefined,
    tokenSecret: env.NEWSLETTER_TOKEN_SECRET,
  };
}

// Forms render only when the provider is configured; otherwise the site keeps
// its "coming soon" newsletter strip and plain contact email.
export function emailEnabled(): boolean {
  return getEmailConfig() !== null;
}
