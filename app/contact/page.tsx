"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-ink">Message received</h1>
        <p className="mt-3 text-muted">
          Thanks for reaching out. We&apos;ll get back to you within 2–3 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink mb-3">Contact Us</h1>
      <p className="text-muted mb-8">
        For editorial inquiries, story tips, corrections, or advertising, get in touch below.
      </p>

      <div className="bg-amber/10 border border-amber/30 rounded-sm p-4 mb-8 text-sm text-ink/70">
        <strong className="text-ink">Editorial submissions:</strong> We welcome story tips and
        press releases. Please include relevant links and context. We review all submissions but
        cannot reply to every one.
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-ink/15 rounded-sm bg-cream text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-ink/15 rounded-sm bg-cream text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="subject">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-ink/15 rounded-sm bg-cream text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Select a subject…</option>
            <option value="story-tip">Story Tip</option>
            <option value="press-release">Press Release</option>
            <option value="correction">Correction Request</option>
            <option value="advertising">Advertising Inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-ink/15 rounded-sm bg-cream text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-primary text-cream font-semibold text-sm rounded-sm hover:bg-primary-dark transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
