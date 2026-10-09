import Link from "next/link";
import { Rss } from "lucide-react";
import { navCategories } from "@/lib/categories";

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
                href="/rss.xml"
                className="flex items-center gap-1.5 text-sm text-cream/40 hover:text-amber transition-colors"
              >
                <Rss className="w-4 h-4" aria-hidden="true" />
                RSS feed
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
                { label: "Editorial Standards", href: "/editorial-standards" },
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
