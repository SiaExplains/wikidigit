import type { Metadata } from "next";
import Link from "next/link";
import { getEmailConfig } from "@/lib/email/config";
import { verifyToken } from "@/lib/newsletter-token";
import ConfirmForm from "./ConfirmForm";

export const metadata: Metadata = {
  title: "Confirm your subscription",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ConfirmPage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  const config = getEmailConfig();
  // Checked up front so an expired or broken link says so before anyone clicks.
  const check = config ? verifyToken(token, config.tokenSecret) : null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-ink mb-4">Confirm your subscription</h1>
      {!check ? (
        <p className="text-muted">The newsletter isn&apos;t available right now.</p>
      ) : !check.ok ? (
        <div className="space-y-4">
          <p className="text-muted">
            {check.reason === "expired"
              ? "This confirmation link has expired. Links are valid for 48 hours."
              : "This confirmation link isn't valid."}
          </p>
          <Link href="/#newsletter" className="inline-block text-rust font-medium hover:underline">
            Sign up again →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-muted">
            Click the button to start receiving the WikiDigit newsletter. You can unsubscribe at any
            time with the link in every email.
          </p>
          <ConfirmForm token={token} />
        </div>
      )}
    </div>
  );
}
