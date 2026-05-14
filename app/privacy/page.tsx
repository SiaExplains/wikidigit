import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "WikiDigit Privacy Policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs text-muted uppercase tracking-wider mb-4">Legal</p>
      <h1 className="text-3xl font-bold text-ink mb-3">Privacy Policy</h1>
      <p className="text-sm text-muted mb-10">Last updated: May 14, 2025</p>

      <div className="bg-amber/10 border border-amber/30 rounded-sm p-4 mb-8 text-sm text-ink/70">
        <strong>Placeholder:</strong> This is a template privacy policy. Replace this with your
        actual legal documentation before publishing.
      </div>

      <div className="prose-article space-y-8">
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            WikiDigit (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects
            information you provide directly to us (such as your email address when subscribing to
            our newsletter) and information collected automatically when you use our website.
          </p>
          <p>
            Automatically collected information may include your IP address, browser type, referring
            URLs, and pages visited. This information is collected through standard web server logs
            and analytics tools.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Deliver newsletters and email communications you have requested</li>
            <li>Analyze site traffic and improve our content and user experience</li>
            <li>Comply with legal obligations</li>
            <li>Serve relevant advertisements through Google AdSense</li>
          </ul>
        </section>

        <section>
          <h2>3. Cookies and Advertising</h2>
          <p>
            WikiDigit uses Google AdSense to display advertisements. Google and its partners may use
            cookies to serve ads based on your prior visits to our website or other websites. You
            can opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            .
          </p>
          <p>
            We also use analytics cookies to understand how visitors interact with our content.
            These cookies do not collect personally identifiable information.
          </p>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share information with service
            providers who assist in operating our website (such as email delivery services and
            analytics providers), subject to confidentiality agreements.
          </p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>
            We retain your email address for as long as you remain subscribed to our newsletter. You
            may unsubscribe at any time via the link included in each email.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the right to access, correct, or delete
            your personal data. To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@wikidigit.com">privacy@wikidigit.com</a>.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            For privacy-related questions, contact us at{" "}
            <a href="mailto:privacy@wikidigit.com">privacy@wikidigit.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
