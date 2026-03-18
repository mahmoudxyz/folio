import type { Metadata } from "next";
import Link from "next/link";
import { getLatestIssue, getAllIssues, getPiece, LENSES } from "@/lib/content";
import { getAllSearchItems } from "@/lib/search";
import SearchBox from "@/components/SearchBox";
import type { Piece } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Folio — Biology, CS, and Math",
  description:
    "A human-curated magazine at the intersection of biology, computer science, and mathematics. No AI-generated content — every piece is written by hand.",
};

/* ─── Discipline Indicator ────────────────────────────
   Three small bars showing which fields a piece touches.
   This is the visual signature of The Folio — you see it
   and instantly know this isn't a regular blog.
   ──────────────────────────────────────────────────── */

const FIELD_COLORS: Record<string, string> = {
  // Biology-adjacent threads
  "sequence-analysis": "bio", evolution: "bio", genomics: "bio",
  // CS-adjacent threads
  "data-structures": "cs", algorithms: "cs", "neural-networks": "cs",
  // Math-adjacent threads
  probability: "math", "linear-algebra": "math", statistics: "math",
  "graph-theory": "math", optimization: "math", "information-theory": "math",
};

function FieldBars({ threads }: { threads: string[] }) {
  const has = { bio: false, cs: false, math: false };
  for (const t of threads) {
    const field = FIELD_COLORS[t];
    if (field) has[field as keyof typeof has] = true;
  }
  return (
    <div className="flex items-center gap-[3px]" title="Biology · CS · Math">
      <div className={`w-[3px] h-3 rounded-full transition-colors ${has.bio ? "bg-emerald-500" : "bg-[var(--color-border)]"}`} />
      <div className={`w-[3px] h-3 rounded-full transition-colors ${has.cs ? "bg-blue-500" : "bg-[var(--color-border)]"}`} />
      <div className={`w-[3px] h-3 rounded-full transition-colors ${has.math ? "bg-amber-500" : "bg-[var(--color-border)]"}`} />
    </div>
  );
}

function LensBadge({ lens }: { lens: string }) {
  const info = LENSES[lens];
  return <span className={`badge lens-${lens}`}>{info?.name ?? lens}</span>;
}

function PieceCard({ slug, piece, variant = "default" }: { slug: string; piece: Piece; variant?: "featured" | "default" }) {
  const fm = piece.frontmatter;
  const isFeatured = variant === "featured";

  // Lens accent colors for the left border
  const lensAccents: Record<string, string> = {
    foundations: "#3d8c5c",
    "deep-dive": "#3d6b8e",
    connections: "#b8860b",
    "tools-craft": "#7c3aed",
    "papers-classics": "#9d174d",
    "visual-explainers": "#0e7490",
  };
  const accentColor = lensAccents[fm.lens] ?? "var(--color-border-strong)";

  return (
    <Link
      href={`/piece/${slug}`}
      className={`group block bg-[var(--color-bg-elevated)] border border-[var(--color-border)] transition-all hover:border-[var(--color-border-strong)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 overflow-hidden ${
        isFeatured ? "rounded-2xl" : "rounded-xl"
      }`}
    >
      <div className="flex">
        {/* Left accent strip */}
        <div
          className={`flex-shrink-0 ${isFeatured ? "w-1.5" : "w-1"}`}
          style={{ background: accentColor }}
        />

        {/* Content */}
        <div className={isFeatured ? "p-8 sm:p-10 flex-1 min-w-0" : "p-5 sm:p-6 flex-1 min-w-0"}>
          {/* Top row: field bars + lens + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <FieldBars threads={fm.threads} />
            <LensBadge lens={fm.lens} />
            <span className="text-[11px] text-[var(--color-fg-faint)]">{fm.difficulty}</span>
            <span className="text-[11px] text-[var(--color-fg-faint)]">{fm.time}</span>
          </div>

          {/* Title */}
          <h3
            className={`font-medium tracking-tight leading-snug group-hover:text-[var(--color-accent)] transition-colors ${
              isFeatured
                ? "text-[1.375rem] sm:text-2xl mb-4"
                : "text-base sm:text-[1.0625rem] mb-3"
            }`}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {fm.title}
          </h3>

          {/* Description */}
          <p
            className={`text-[var(--color-fg-muted)] leading-[1.7] ${
              isFeatured
                ? "text-[14px] sm:text-[15px] line-clamp-3 max-w-2xl"
                : "text-[13px] line-clamp-2"
            }`}
          >
            {fm.description}
          </p>

          {/* Thread tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {fm.threads.map((t) => (
              <span key={t} className="thread-tag">{t}</span>
            ))}
          </div>

          {/* Read link — featured only */}
          {isFeatured && (
            <div className="mt-7 text-[13px] font-medium text-[var(--color-accent)] flex items-center gap-1.5 group-hover:gap-3 transition-all">
              Read this piece
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const latest = getLatestIssue();
  const allIssues = getAllIssues();
  const searchItems = getAllSearchItems();

  if (!latest) {
    return (
      <div className="container-wide py-40 text-center">
        <h1 className="text-4xl font-medium" style={{ fontFamily: "var(--font-serif)" }}>
          The Folio
        </h1>
        <p className="text-[var(--color-fg-muted)] mt-4">First issue coming soon.</p>
      </div>
    );
  }

  const pieces = latest.pieces
    .map((slug) => ({ slug, piece: getPiece(slug) }))
    .filter((p): p is { slug: string; piece: Piece } => p.piece !== null);

  const [featured, ...rest] = pieces;
  const olderIssues = allIssues.filter((i) => i.number !== latest.number);

  return (
    <div className="fade-in mt-10">

      {/* ═══════════════════════════════════════════════════
          HERO / PITCH
          ═══════════════════════════════════════════════════ */}
      <section className="container-wide mt-10 pt-24 sm:pt-32 pb-16 sm:pb-20 text-center">
        {/* Discipline dots — visual identity at the very top */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-[var(--color-fg-faint)] tracking-wide">Biology</span>
          <span className="text-[var(--color-fg-faint)] text-[11px]">&middot;</span>
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[11px] text-[var(--color-fg-faint)] tracking-wide">Computer Science</span>
          <span className="text-[var(--color-fg-faint)] text-[11px]">&middot;</span>
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[11px] text-[var(--color-fg-faint)] tracking-wide">Mathematics</span>
        </div>

        <h1
          className="text-[2.25rem] sm:text-5xl md:text-[3.5rem] font-medium tracking-tight leading-[1.1] mb-7"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Where biology, CS,
          <br className="hidden sm:block" />
          {" "}and math converge
        </h1>

        <p className="text-[var(--color-fg-muted)] text-[15px] sm:text-base leading-[1.75] max-w-xl mx-auto mb-12">
          A human-curated magazine of the best content for people who think
          across disciplines. No AI slop — every piece is written or selected by hand.
        </p>

        {/* Full-width search */}
        <div className="max-w-2xl mx-auto">
          <SearchBox
            items={searchItems}
            placeholder="Search for anything — Bayes, suffix arrays, PCA, evolution..."
          />
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          LATEST ISSUE
          ═══════════════════════════════════════════════════ */}
      <section className="container-wide">
        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent mb-16 sm:mb-20" />

        {/* Issue header — large number as watermark */}
        <div className="relative mb-12 sm:mb-14">
          {/* Watermark number */}
          <span
            className="absolute -top-6 -left-2 text-[7rem] sm:text-[10rem] font-bold leading-none text-[var(--color-fg)]/[0.03] select-none pointer-events-none"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {String(latest.number).padStart(2, "0")}
          </span>

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="decorative-line" />
              <span className="section-label">Latest Issue</span>
              <span className="text-[11px] text-[var(--color-fg-faint)]">
                #{String(latest.number).padStart(3, "0")} &middot; {latest.date}
              </span>
            </div>

            <h2
              className="text-[1.75rem] sm:text-3xl font-medium tracking-tight mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {latest.title}
            </h2>

            <p className="text-[var(--color-fg-muted)] text-[15px] leading-[1.75] max-w-2xl">
              {latest.editorial}
            </p>
          </div>
        </div>

        {/* Featured piece */}
        {featured && (
          <div className="mb-6">
            <PieceCard slug={featured.slug} piece={featured.piece} variant="featured" />
          </div>
        )}

        {/* Rest of pieces */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            {rest.map(({ slug, piece }) => (
              <PieceCard key={slug} slug={slug} piece={piece} />
            ))}
          </div>
        )}
      </section>


      {/* ═══════════════════════════════════════════════════
          PAST ISSUES
          ═══════════════════════════════════════════════════ */}
      {olderIssues.length > 0 && (
        <section className="container-wide mt-24 sm:mt-32">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent mb-16 sm:mb-20" />

          <div className="flex items-center gap-3 mb-10">
            <div className="decorative-line" />
            <h2 className="section-label">Past Issues</h2>
          </div>

          <div className="space-y-5">
            {olderIssues.map((issue) => {
              const issuePieces = issue.pieces
                .map((slug) => getPiece(slug))
                .filter((p): p is Piece => p !== null);

              return (
                <Link
                  key={issue.number}
                  href={`/issues/${issue.number}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 p-6 sm:p-7 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-sm transition-all"
                >
                  <div className="flex items-baseline gap-5 min-w-0">
                    <span
                      className="text-[2rem] font-light text-[var(--color-fg-faint)]/30 flex-shrink-0 leading-none"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {String(issue.number).padStart(3, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-medium group-hover:text-[var(--color-accent)] transition-colors">
                        {issue.title}
                      </h3>
                      <p className="text-[13px] text-[var(--color-fg-muted)] mt-1.5 line-clamp-1 leading-relaxed">
                        {issue.editorial}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[12px] text-[var(--color-fg-faint)] flex-shrink-0 pl-16 sm:pl-0">
                    <span>{issue.date}</span>
                    <span>&middot;</span>
                    <span>{issuePieces.length} pieces</span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      className="text-[var(--color-fg-faint)] group-hover:text-[var(--color-accent)] transition-colors hidden sm:block"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════ */}
      <section className="container-wide mt-30 sm:mt-32 mb-8">
        <div className="rounded-2xl bg-[var(--color-bg-warm)] border border-[var(--color-border)] p-10 sm:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
          <div className="max-w-md">
            <p className="section-label mb-4">Open Source</p>
            <h2
              className="text-xl sm:text-2xl font-medium tracking-tight mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Written by humans, for humans
            </h2>
            <p className="text-[14px] text-[var(--color-fg-muted)] leading-[1.75]">
              Every piece is carefully written or curated. We don&apos;t accept
              AI-generated content. Want to write something?
            </p>
          </div>
          <a
            href="https://github.com/mahmoudxyz/folio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[var(--color-fg)] text-[var(--color-bg)] text-[14px] font-medium hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Contribute on GitHub
          </a>
        </div>
      </section>

    </div>
  );
}
