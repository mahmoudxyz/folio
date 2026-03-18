"use client";

import { useState, useEffect, useCallback } from "react";
import type { AiContribution, AiContributionCategory } from "@/lib/content";

const CATEGORY_META: Record<
  AiContributionCategory,
  { label: string; detail: string }
> = {
  proofreading: {
    label: "Proofreading",
    detail: "AI checked for typos, clarity, and readability",
  },
  "grammar-fixes": {
    label: "Grammar & Style Fixes",
    detail: "AI corrected grammar, punctuation, or phrasing",
  },
  "code-generation": {
    label: "Code Generation",
    detail: "AI helped write code examples or implementations",
  },
  "code-review": {
    label: "Code Review",
    detail: "AI reviewed code for correctness and best practices",
  },
  "content-drafting": {
    label: "Content Drafting",
    detail: "AI assisted with writing portions of the text",
  },
  "content-restructuring": {
    label: "Content Restructuring",
    detail: "AI helped reorganize or restructure the article",
  },
  "research-assistance": {
    label: "Research Assistance",
    detail: "AI helped gather, summarize, or verify references",
  },
  "diagram-generation": {
    label: "Diagram Generation",
    detail: "AI generated diagrams or visual illustrations",
  },
  translation: {
    label: "Translation",
    detail: "AI assisted with translating content between languages",
  },
  "math-verification": {
    label: "Math Verification",
    detail: "AI verified equations, proofs, or calculations",
  },
};

export default function AiDisclosure({ ai }: { ai: AiContribution }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Trigger button */}
      <button
        className="aid-trigger"
        onClick={() => setOpen(true)}
        aria-label="View AI contribution details"
      >
        <span className="aid-trigger-dot" />
        <span>AI-assisted</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="aid-trigger-arrow"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4m0-4h.01" />
        </svg>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="aid-overlay" onClick={close} aria-modal="true" role="dialog">
          <div className="aid-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="aid-modal-header">
              <div className="aid-modal-title-group">
                <div className="aid-modal-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="aid-modal-title">AI Transparency</h3>
                  <p className="aid-modal-subtitle">
                    How AI contributed to this piece
                  </p>
                </div>
              </div>
              <button
                className="aid-modal-close"
                onClick={close}
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Category checklist */}
            <div className="aid-modal-body">
              <ul className="aid-checklist">
                {ai.categories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <li key={cat} className="aid-check-item">
                      <span className="aid-check-icon">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <div className="aid-check-text">
                        <span className="aid-check-label">{meta.label}</span>
                        <span className="aid-check-detail">{meta.detail}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Author note */}
              {ai.description && (
                <div className="aid-author-note">
                  <div className="aid-author-note-label">Author note</div>
                  <p className="aid-author-note-text">{ai.description}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="aid-modal-footer">
              <p>
                All AI-assisted content is reviewed, verified, and approved by
                the author before publishing. The author takes full
                responsibility for accuracy.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
