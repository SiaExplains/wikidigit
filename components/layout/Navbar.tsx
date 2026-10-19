"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { navCategories } from "@/lib/categories";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setMobileOpen(false);
      setSearchOpen(false);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  // Escape closes whichever panel is open and hands focus back to its toggle.
  useEffect(() => {
    if (!searchOpen && !mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (searchOpen) {
        setSearchOpen(false);
        searchToggleRef.current?.focus();
      } else {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, mobileOpen]);

  // The panel stays mounted (hidden) so aria-controls always resolves; focus the field on open.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-sm border-b border-ink/10"
            : "bg-cream border-b border-ink/10"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              href="/"
              className="font-bold text-xl text-primary tracking-tight hover:text-primary-dark transition-colors"
            >
              Wiki<span className="text-rust">Digit</span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {navCategories.map((cat) => {
                const isActive = pathname.startsWith(cat.href);
                return (
                  <li key={cat.href}>
                    <Link
                      href={cat.href}
                      className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                        isActive
                          ? "text-primary bg-primary/8"
                          : "text-ink/70 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                ref={searchToggleRef}
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-sm text-ink/60 hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                aria-controls="navbar-search"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                ref={menuToggleRef}
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-sm text-ink/60 hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X className="w-4 h-4" aria-hidden="true" /> : <Menu className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div id="navbar-search" hidden={!searchOpen} className="border-t border-ink/10 py-3">
            <form role="search" onSubmit={handleSearch} className="flex items-center gap-2">
              <label htmlFor="navbar-search-input" className="sr-only">
                Search WikiDigit
              </label>
              <Search className="w-4 h-4 text-muted flex-shrink-0" aria-hidden="true" />
              <input
                id="navbar-search-input"
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search WikiDigit…"
                className="flex-1 text-sm bg-transparent text-ink placeholder-muted focus:outline-none"
              />
              <button type="submit" className="text-xs font-medium text-rust hover:underline">
                Search
              </button>
            </form>
          </div>
        </nav>

        {/* Mobile menu */}
        <div id="mobile-menu" hidden={!mobileOpen} className="lg:hidden bg-cream border-t border-ink/10">
          <ul className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navCategories.map((cat) => {
              const isActive = pathname.startsWith(cat.href);
              return (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className={`block px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                      isActive
                        ? "text-primary bg-primary/8"
                        : "text-ink/70 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
            <li className="border-t border-ink/10 pt-2 mt-2">
              <Link href="/about" className="block px-3 py-2 text-sm text-muted hover:text-primary">
                About
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
