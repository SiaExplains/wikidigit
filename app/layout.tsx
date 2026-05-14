import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wikidigit.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WikiDigit — Tech News for the Curious",
    template: "%s | WikiDigit",
  },
  description:
    "Sharp, independent coverage of AI, startups, developer tools, and everything shaping the digital world.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "WikiDigit",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "WikiDigit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@wikidigit",
    creator: "@wikidigit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-cream text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
