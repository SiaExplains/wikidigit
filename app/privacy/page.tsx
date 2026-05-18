import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "WikiDigit Privacy Policy — how we collect, use, and protect your personal data in compliance with GDPR.",
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs text-muted uppercase tracking-wider mb-4">Legal</p>
      <h1 className="text-3xl font-bold text-ink mb-3">Privacy Policy</h1>
      <p className="text-sm text-muted mb-10">Last updated: May 16, 2026</p>

      <div className="prose-article space-y-10">

        {/* 1 */}
        <section>
          <h2>1. Data Controller</h2>
          <p>
            The data controller responsible for the processing of your personal data on this
            website is:
          </p>
          <address className="not-italic mt-3 p-4 bg-cream-dark rounded-sm text-sm leading-relaxed">
            <strong>Siavash Ghanbari</strong>
            <br />
            Berlin, Germany
            <br />
            E-mail:{" "}
            <a href="mailto:siaexplains@gmail.com">siaexplains@gmail.com</a>
          </address>
          <p className="mt-4">
            This Privacy Policy applies to <strong>WikiDigit</strong> (wikidigit.com) and{" "}
            <strong>Emojar</strong> (emojar.com), both operated under the same legal entity.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2>2. What Data We Collect</h2>

          <h3>2.1 Server Logs</h3>
          <p>
            When you visit this website, our web server automatically records standard log data,
            including your IP address, browser type and version, operating system, referring URL,
            pages visited, and date/time of access. These logs are retained for up to 30 days for
            security and operational purposes and are then deleted.
          </p>
          <p>
            <strong>Legal basis:</strong> Legitimate interest (Art. 6(1)(f) GDPR) — ensuring
            technical security and preventing abuse.
          </p>

          <h3>2.2 Analytics (Google Analytics)</h3>
          <p>
            With your consent, we use Google Analytics (provided by Google LLC, 1600 Amphitheatre
            Parkway, Mountain View, CA 94043, USA) to understand how visitors interact with the
            Site. Google Analytics uses cookies to collect pseudonymous usage data such as pages
            visited, time on site, and approximate geographic region. This data is transmitted to
            and stored on Google servers.
          </p>
          <p>
            IP anonymisation is enabled; your IP address is truncated within the EU before
            transmission. Google may transfer data to the USA under the EU–US Data Privacy
            Framework.
          </p>
          <p>
            <strong>Legal basis:</strong> Consent (Art. 6(1)(a) GDPR). You can withdraw consent
            at any time via the &ldquo;Essential only&rdquo; option in our cookie banner, or by
            installing the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>

          <h3>2.3 Advertising (Google AdSense)</h3>
          <p>
            With your consent, we display advertisements via Google AdSense (Google LLC). AdSense
            uses cookies and similar technologies to show ads that are relevant to you based on
            your prior browsing activity. Google and its partners may collect data about your
            interactions with ads.
          </p>
          <p>
            <strong>Legal basis:</strong> Consent (Art. 6(1)(a) GDPR). You can manage your ad
            personalisation preferences at{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              adssettings.google.com
            </a>
            .
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2>3. Cookies</h2>
          <p>
            We use the following categories of cookies:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="text-left py-2 pr-4 font-semibold">Category</th>
                  <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                  <th className="text-left py-2 font-semibold">Consent required?</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-ink/5">
                  <td className="py-2 pr-4">Essential</td>
                  <td className="py-2 pr-4">Cookie consent preference storage</td>
                  <td className="py-2">No</td>
                </tr>
                <tr className="border-b border-ink/5">
                  <td className="py-2 pr-4">Analytics</td>
                  <td className="py-2 pr-4">Google Analytics — traffic measurement</td>
                  <td className="py-2">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Advertising</td>
                  <td className="py-2 pr-4">Google AdSense — ad personalisation</td>
                  <td className="py-2">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            You can manage your cookie preferences at any time by clearing your browser cookies
            and revisiting the Site, which will re-display our consent banner.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal data. Data may be shared with:
          </p>
          <ul>
            <li>
              <strong>Google LLC</strong> — for analytics and advertising as described above.
              Google operates as a data processor under a Data Processing Agreement.
            </li>
            <li>
              <strong>Hosting provider</strong> — server logs may be stored by our infrastructure
              provider, subject to contractual data processing obligations.
            </li>
          </ul>
          <p>
            No other third parties receive your personal data.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2>5. International Transfers</h2>
          <p>
            Google may process your data outside the European Economic Area (EEA), in particular in
            the United States. Google LLC participates in the EU–US Data Privacy Framework, which
            provides an adequacy decision under Art. 45 GDPR.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2>6. Data Retention</h2>
          <p>
            Server log data is deleted after a maximum of 30 days. Analytics and advertising data
            is retained according to Google&apos;s own data retention policies, over which we have
            limited control. Your cookie consent preference is stored in your browser&apos;s local
            storage and is not transmitted to any server.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2>7. Your Rights (GDPR)</h2>
          <p>
            Under the General Data Protection Regulation (GDPR), you have the following rights
            regarding your personal data:
          </p>
          <ul>
            <li>
              <strong>Right of access</strong> (Art. 15) — request a copy of the data we hold
              about you.
            </li>
            <li>
              <strong>Right to rectification</strong> (Art. 16) — request correction of inaccurate
              data.
            </li>
            <li>
              <strong>Right to erasure</strong> (Art. 17) — request deletion of your data where
              no legitimate grounds exist for its continued processing.
            </li>
            <li>
              <strong>Right to restriction</strong> (Art. 18) — request that we restrict
              processing of your data in certain circumstances.
            </li>
            <li>
              <strong>Right to object</strong> (Art. 21) — object to processing based on
              legitimate interests.
            </li>
            <li>
              <strong>Right to withdraw consent</strong> (Art. 7(3)) — withdraw consent for
              analytics and advertising cookies at any time (this does not affect the lawfulness
              of prior processing).
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:siaexplains@gmail.com">siaexplains@gmail.com</a>. We will respond
            within 30 days. You also have the right to lodge a complaint with a supervisory
            authority — in Germany, the relevant authority is the{" "}
            <a
              href="https://www.bfdi.bund.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              Federal Commissioner for Data Protection and Freedom of Information (BfDI)
            </a>
            .
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2>8. Children&apos;s Privacy</h2>
          <p>
            WikiDigit and Emojar are not directed at children under the age of 16. We do not
            knowingly collect personal data from children. If you believe a child has submitted
            personal data to us, please contact us and we will delete it promptly.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
            date at the top of the page will reflect the most recent revision. We encourage you to
            review this page periodically.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2>10. Contact</h2>
          <p>
            For all privacy-related questions or requests, please contact:{" "}
            <a href="mailto:siaexplains@gmail.com">siaexplains@gmail.com</a>
          </p>
        </section>

      </div>
    </div>
  );
}
