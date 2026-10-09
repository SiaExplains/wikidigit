"use client";

import { useActionState } from "react";
import Link from "next/link";
import { confirmSubscription } from "./actions";

const messages = {
  subscribed: "You're subscribed. Thanks for reading WikiDigit.",
  invalid: "This confirmation link isn't valid. Please sign up again.",
  expired: "This confirmation link has expired. Please sign up again.",
  error: "Something went wrong on our side. Please try again in a few minutes.",
} as const;

// A button rather than confirming on page load: email security scanners open
// links automatically and would otherwise subscribe people who never clicked.
export default function ConfirmForm({ token }: { token: string }) {
  const [result, action, pending] = useActionState(confirmSubscription, null);

  if (result) {
    return (
      <div role="status" className="space-y-4">
        <p className="text-lg text-ink">{messages[result]}</p>
        <Link href="/" className="inline-block text-rust font-medium hover:underline">
          Go to the homepage →
        </Link>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      <button
        type="submit"
        disabled={pending}
        className="px-6 py-3 bg-primary text-cream font-semibold rounded-sm hover:bg-primary-light transition-colors disabled:opacity-60"
      >
        {pending ? "Confirming…" : "Confirm subscription"}
      </button>
    </form>
  );
}
