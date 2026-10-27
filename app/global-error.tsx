"use client";

// Replaces the root layout when the layout itself fails, so it can't rely on
// globals.css, fonts or the navbar: everything here is inline.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF9EC",
          color: "#000004",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main style={{ maxWidth: 520, padding: "0 16px" }}>
          <h1 style={{ fontSize: 32, margin: "0 0 12px" }}>WikiDigit is having trouble</h1>
          <p style={{ lineHeight: 1.6, margin: "0 0 24px", color: "#6b7280" }}>
            Something went wrong while loading the site. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderRadius: 2,
              background: "#1D402D",
              color: "#FFF9EC",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
