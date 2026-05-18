import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum (Legal Notice) for WikiDigit and Emojar — mandatory disclosure under German law (§ 5 TMG / § 18 MStV).",
  robots: { index: true, follow: false },
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs text-muted uppercase tracking-wider mb-4">Legal</p>
      <h1 className="text-3xl font-bold text-ink mb-3">Impressum</h1>
      <p className="text-sm text-muted mb-10">
        Legal notice pursuant to § 5 TMG (Telemediengesetz) and § 18 MStV
        (Medienstaatsvertrag) — Germany
      </p>

      <div className="prose-article space-y-10">

        {/* Provider */}
        <section>
          <h2>Service Provider</h2>
          <address className="not-italic p-5 bg-cream-dark rounded-sm text-sm leading-7">
            <strong>Siavash Ghanbari</strong>
            <br />
            Berlin, Germany
            <br />
            <br />
            <span className="text-muted">E-mail:</span>{" "}
            <a href="mailto:siaexplains@gmail.com">siaexplains@gmail.com</a>
          </address>
          <p className="mt-4 text-sm text-muted">
            This Impressum applies to all web services operated under the same entity, including:
          </p>
          <ul className="text-sm mt-2">
            <li>
              <strong>WikiDigit</strong> —{" "}
              <a href="https://wikidigit.com" target="_blank" rel="noopener noreferrer">
                wikidigit.com
              </a>
            </li>
            <li>
              <strong>Emojar</strong> —{" "}
              <a href="https://emojar.com" target="_blank" rel="noopener noreferrer">
                emojar.com
              </a>
            </li>
          </ul>
        </section>

        {/* Editorial responsibility */}
        <section>
          <h2>Responsible for Content (§ 18 Abs. 2 MStV)</h2>
          <address className="not-italic p-5 bg-cream-dark rounded-sm text-sm leading-7">
            <strong>Siavash Ghanbari</strong>
            <br />
            Berlin, Germany
          </address>
        </section>

        {/* DSA */}
        <section>
          <h2>DSA — Single Point of Contact</h2>
          <p>
            Pursuant to Regulation (EU) 2022/2065 (Digital Services Act), the single point of
            contact for authorities and the European Commission is:
          </p>
          <address className="not-italic mt-3 p-5 bg-cream-dark rounded-sm text-sm leading-7">
            <strong>Siavash Ghanbari</strong>
            <br />
            Berlin, Germany
            <br />
            <a href="mailto:siaexplains@gmail.com">siaexplains@gmail.com</a>
          </address>
          <p className="mt-4 text-sm text-muted">
            WikiDigit and Emojar are classified as micro-enterprises under the DSA and are
            therefore exempt from certain obligations applicable to larger platforms.
          </p>
        </section>

        {/* Dispute resolution */}
        <section>
          <h2>EU Online Dispute Resolution</h2>
          <p>
            The European Commission provides a platform for online dispute resolution (ODR):{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
          <p>
            We are not obligated to participate in dispute resolution proceedings before a consumer
            arbitration board and do not generally participate in such proceedings.
          </p>
        </section>

        {/* Liability for content */}
        <section>
          <h2>Liability for Content</h2>
          <p>
            The contents of this website have been prepared with great care. However, we cannot
            guarantee the accuracy, completeness, or timeliness of the content. As a service
            provider, we are responsible for our own content on these pages in accordance with
            general law (§ 7 Abs. 1 TMG). According to §§ 8 to 10 TMG, however, we are not
            obligated to monitor transmitted or stored third-party information or to investigate
            circumstances that indicate illegal activity.
          </p>
          <p>
            Obligations to remove or block the use of information under general law remain
            unaffected. However, liability in this regard is only possible from the point in time
            at which knowledge of a specific legal violation becomes known. Upon becoming aware of
            corresponding legal violations, we will remove this content immediately.
          </p>
        </section>

        {/* Liability for links */}
        <section>
          <h2>Liability for Links</h2>
          <p>
            Our website contains links to external third-party websites over whose content we have
            no control. Therefore, we cannot assume any liability for these external contents. The
            respective provider or operator of the linked pages is always responsible for their
            content. The linked pages were checked for possible legal violations at the time of
            linking. Illegal content was not recognisable at the time of linking.
          </p>
          <p>
            Permanent monitoring of the content of linked pages is not reasonable without concrete
            indications of a legal violation. Upon becoming aware of legal violations, we will
            remove such links immediately.
          </p>
        </section>

        {/* Copyright */}
        <section>
          <h2>Copyright</h2>
          <p>
            The content and works created by the site operator on these pages are subject to
            German copyright law. Duplication, editing, distribution, and any kind of exploitation
            outside the limits of copyright law require the written consent of the respective
            author or creator. Downloads and copies of this site are only permitted for private,
            non-commercial use.
          </p>
          <p>
            Insofar as the content on this site was not created by the operator, the copyrights
            of third parties are respected. Should you nevertheless become aware of a copyright
            infringement, please inform us accordingly. Upon becoming aware of legal violations,
            we will remove such content immediately.
          </p>
        </section>

      </div>
    </div>
  );
}
