import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "WikiDigit Terms of Service — the rules governing your use of wikidigit.com and related services operated by Siavash Ghanbari.",
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs text-muted uppercase tracking-wider mb-4">Legal</p>
      <h1 className="text-3xl font-bold text-ink mb-3">Terms of Service</h1>
      <p className="text-sm text-muted mb-10">Last updated: May 16, 2026</p>

      <div className="prose-article space-y-10">

        {/* 1 */}
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using WikiDigit (&ldquo;the Service&rdquo;, &ldquo;the Site&rdquo;,{" "}
            <strong>wikidigit.com</strong>), you agree to be bound by these Terms of Service and
            all applicable laws and regulations. If you do not agree with any part of these terms,
            you must not use the Service.
          </p>
          <p>
            WikiDigit is operated by <strong>Siavash Ghanbari</strong>, an individual based in
            Berlin, Germany, who also operates <strong>Emojar</strong> (emojar.com). Both services
            are provided under the same legal entity and the same governing terms where applicable.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2>2. Description of the Service</h2>
          <p>
            WikiDigit is an independent technology news publication covering AI, startups, developer
            tools, security, and adjacent topics. The Site is free to access and is supported by
            display advertising. No account creation is required to read content.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            All original content published on WikiDigit — including articles, editorials, images
            created for the Site, and the WikiDigit name and logo — is the intellectual property of
            Siavash Ghanbari and is protected under applicable copyright and trademark law.
          </p>
          <p>
            You may share short excerpts (up to 150 words) from articles for commentary or
            educational purposes, provided you include a visible attribution link to the original
            article on wikidigit.com. Full reproduction, scraping, or republication without express
            written permission is prohibited.
          </p>
          <p>
            Third-party trademarks, product names, and company names referenced in articles are the
            property of their respective owners and are used for editorial identification only.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2>4. Permitted Use</h2>
          <p>You may use WikiDigit for personal, non-commercial reading and research. You must not:</p>
          <ul>
            <li>
              Scrape, crawl, or automatically harvest content from the Site without prior written
              consent
            </li>
            <li>
              Use the Site in any way that could damage, disable, or impair its servers or
              infrastructure
            </li>
            <li>
              Reproduce, republish, or commercially exploit any content from the Site without
              written permission
            </li>
            <li>
              Circumvent any technical measures used to deliver or protect the Service
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2>5. Advertising</h2>
          <p>
            WikiDigit is supported by display advertising served through Google AdSense and
            potentially other advertising networks. Advertisements are clearly distinguished from
            editorial content. WikiDigit does not accept native advertising or paid editorial
            content unless explicitly labelled as &ldquo;Sponsored&rdquo;.
          </p>
          <p>
            Advertisers have no influence over editorial decisions, story selection, or the
            conclusions reached in published articles.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            Content on WikiDigit is provided for informational purposes only. We make no
            representations or warranties, express or implied, as to the accuracy, completeness,
            reliability, or timeliness of any content.
          </p>
          <p>
            Technology reporting involves covering fast-moving subjects where facts may change
            rapidly. WikiDigit publishes corrections when material errors are identified, but cannot
            guarantee that all content reflects the current state of affairs at the time you read it.
          </p>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
            warranty of any kind.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Siavash Ghanbari shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages arising from
            your use of, or inability to use, the Service — including damages for loss of profits,
            goodwill, data, or other intangible losses.
          </p>
          <p>
            In jurisdictions that do not allow exclusion of certain warranties or limitation of
            liability, liability is limited to the maximum extent permitted by law.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2>8. Third-Party Links</h2>
          <p>
            WikiDigit articles may contain links to external websites. These links are provided for
            your convenience and do not constitute an endorsement of the linked site or its content.
            We have no control over, and assume no responsibility for, the content or practices of
            any third-party sites.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2>9. Privacy</h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by
            reference.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. When we make material changes,
            we will update the &ldquo;Last updated&rdquo; date at the top of this page. Continued
            use of the Service after the date of any change constitutes your acceptance of the
            revised Terms. It is your responsibility to review these Terms periodically.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Federal Republic of Germany. Any disputes
            arising under or in connection with these Terms shall be subject to the exclusive
            jurisdiction of the courts of Berlin, Germany, unless mandatory consumer protection law
            in your country of residence provides otherwise.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2>12. Contact</h2>
          <p>
            For legal inquiries, please contact:{" "}
            <a href="mailto:siaexplains@gmail.com">siaexplains@gmail.com</a>
          </p>
        </section>

      </div>
    </div>
  );
}
