"use client";

import { useState } from "react";

/**
 * Kit (ConvertKit) subscribe form.
 * Replace KIT_FORM_ID with your actual Kit form ID.
 * Find it at: https://app.kit.com → Forms → select form → Settings
 */
const KIT_FORM_ID = process.env.NEXT_PUBLIC_KIT_FORM_ID || "YOUR_FORM_ID";

interface SubscribeFormProps {
  variant?: "inline" | "card" | "minimal";
  className?: string;
}

export default function SubscribeForm({
  variant = "card",
  className = "",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ api_key: process.env.NEXT_PUBLIC_KIT_API_KEY, email }),
        }
      );

      if (res.ok) {
        setStatus("success");
        setMessage("You're in! Check your inbox to confirm.");
        setEmail("");
      } else {
        throw new Error("Subscription failed");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-3 text-[14px]">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="text-[var(--color-fg-muted)]">{message}</span>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[13px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
        {status === "error" && (
          <p className="text-[12px] text-red-500 mt-1">{message}</p>
        )}
      </form>
    );
  }

  if (variant === "inline") {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[14px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
          >
            {status === "loading" ? "Subscribing..." : "Get new issues"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-[12px] text-red-500 mt-2">{message}</p>
        )}
      </div>
    );
  }

  // card variant (default)
  return (
    <div
      className={`rounded-2xl bg-[var(--color-bg-warm)] border border-[var(--color-border)] p-8 sm:p-10 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
          Stay in the loop
        </span>
      </div>

      <h3
        className="text-lg sm:text-xl font-semibold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        New issues, every two weeks
      </h3>

      <p className="text-[13px] text-[var(--color-fg-muted)] leading-[1.7] mb-6 max-w-md">
        Get notified when we publish a new issue. No spam, no fluff — just
        biology, CS, and math that&apos;s actually worth reading.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[14px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-[12px] text-red-500 mt-2">{message}</p>
      )}

      <div className="flex items-center gap-4 mt-5">
        <p className="text-[11px] text-[var(--color-fg-faint)]">
          Biweekly &middot; Unsubscribe anytime
        </p>
        <a
          href="/feed.xml"
          className="flex items-center gap-1.5 text-[11px] text-[var(--color-fg-faint)] hover:text-[var(--color-accent)] transition-colors"
          title="RSS Feed"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
          </svg>
          RSS
        </a>
      </div>
    </div>
  );
}
