"use client";

import { useEffect, useRef, useState } from "react";

type Status = { state: "idle" | "sending" } | { state: "done" | "error"; message: string };

const SUBJECTS = [
  { value: "story-tip", label: "Story tip" },
  { value: "correction", label: "Correction request" },
  { value: "press-release", label: "Press release" },
  { value: "advertising", label: "Advertising" },
  { value: "other", label: "Other" },
];

const field =
  "w-full px-4 py-2.5 rounded-sm bg-cream border border-ink/15 text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot.current?.value ?? "", startedAt: startedAt.current }),
      });
      const data: { ok?: boolean; message?: string } = await res.json().catch(() => ({}));
      const message = data.message ?? "Something went wrong. Please try again.";
      setStatus(res.ok && data.ok ? { state: "done", message } : { state: "error", message });
    } catch {
      setStatus({ state: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (status.state === "done") {
    return (
      <p role="status" className="p-5 rounded-sm border border-primary/30 bg-primary/5 text-ink">
        {status.message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-ink mb-1.5">
            Name <span className="text-muted font-normal">(optional)</span>
          </label>
          <input id="contact-name" name="name" maxLength={100} autoComplete="name" value={form.name} onChange={update} className={field} />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-ink mb-1.5">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={update} className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-ink mb-1.5">
          Subject
        </label>
        <select id="contact-subject" name="subject" required value={form.subject} onChange={update} className={field}>
          <option value="">Select a subject…</option>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-ink mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={form.message}
          onChange={update}
          className={field}
        />
      </div>
      <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {status.state === "error" && (
        <p role="alert" className="text-sm text-rust">
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={status.state === "sending"}
        className="px-6 py-3 bg-primary text-cream font-semibold rounded-sm hover:bg-primary-light transition-colors disabled:opacity-60"
      >
        {status.state === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="text-xs text-muted">
        Your message is emailed to us and not stored on this website. See our{" "}
        <a href="/privacy" className="underline hover:text-rust">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
