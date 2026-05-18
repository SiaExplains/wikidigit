import Link from "next/link";
import { Rss } from "lucide-react";
import { navCategories } from "@/lib/categories";

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.731-8.836L1.254 2.25H8.08l4.261 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold text-cream hover:text-amber transition-colors"
            >
              Wiki<span className="text-rust">Digit</span>
            </Link>
            <p className="mt-3 text-sm text-cream/50 leading-relaxed">
              Sharp coverage of tech, startups, and the ideas reshaping the digital world.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                aria-label="Twitter"
                className="text-cream/40 hover:text-amber transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-cream/40 hover:text-amber transition-colors"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="/rss.xml"
                aria-label="RSS"
                className="text-cream/40 hover:text-amber transition-colors"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cream/40 mb-4">
              Coverage
            </h3>
            <ul className="space-y-2">
              {navCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cream/40 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Authors", href: "/authors" },
                { label: "Advertise", href: "/advertise" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cream/40 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Impressum", href: "/impressum" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/30">
            © {currentYear} WikiDigit. All rights reserved.
          </p>
          <p className="text-xs text-cream/20">
            Built with Next.js · Powered by curiosity
          </p>
        </div>
      </div>
    </footer>
  );
}
