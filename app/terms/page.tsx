import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "WikiDigit Terms of Service — the rules governing use of our platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs text-muted uppercase tracking-wider mb-4">Legal</p>
      <h1 className="text-3xl font-bold text-ink mb-3">Terms of Service</h1>
      <p className="text-sm text-muted mb-10">Last updated: May 14, 2025</p>

      <div className="bg-amber/10 border border-amber/30 rounded-sm p-4 mb-8 text-sm text-ink/70">
        <strong>Placeholder:</strong> Replace this with actual legal Terms of Service documentation.
      </div>

      <div className="prose-article space-y-8">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing WikiDigit (&ldquo;the Site&rdquo;), you agree to be bound by these Terms
            of Service. If you do not agree to these terms, please do not use the Site.
          </p>
        </section>

        <section>
          <h2>2. Intellectual Property</h2>
          <p>
            All content on WikiDigit — including articles, images, graphics, and code — is the
            property of WikiDigit or its content suppliers and is protected by applicable copyright
            laws. You may not reproduce, distribute, or create derivative works without express
            written permission.
          </p>
        </section>

        <section>
          <h2>3. Disclaimer of Warranties</h2>
          <p>
            Content on WikiDigit is provided for informational purposes only. We make no
            representations or warranties of any kind, express or implied, about the completeness,
            accuracy, or reliability of the information.
          </p>
        </section>

        <section>
          <h2>4. Limitation of Liability</h2>
          <p>
            WikiDigit shall not be liable for any indirect, incidental, special, or consequential
            damages arising from your use of the Site or its content.
          </p>
        </section>

        <section>
          <h2>5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the Site after
            changes constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>
            For legal inquiries, contact us at{" "}
            <a href="mailto:legal@wikidigit.com">legal@wikidigit.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
