import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllIssues, getIssue, getPiece, LENSES } from "@/lib/content";
import type { Piece } from "@/lib/content";

export function generateStaticParams() {
  return getAllIssues().map((i) => ({ number: String(i.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const issue = getIssue(parseInt(number));
  if (!issue) return {};
  return {
    title: `Issue #${String(issue.number).padStart(3, "0")}: ${issue.title}`,
    description: issue.editorial,
  };
}

export default async function IssuePage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const issue = getIssue(parseInt(number));
  if (!issue) notFound();

  const pieces = issue.pieces
    .map((slug) => ({ slug, piece: getPiece(slug) }))
    .filter((p): p is { slug: string; piece: Piece } => p.piece !== null);

  const allIssues = getAllIssues();
  const currentIdx = allIssues.findIndex((i) => i.number === issue.number);
  const prevIssue = currentIdx < allIssues.length - 1 ? allIssues[currentIdx + 1] : null;
  const nextIssue = currentIdx > 0 ? allIssues[currentIdx - 1] : null;

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="container-wide pt-16 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="decorative-line" />
          <span className="section-label">
            Issue {String(issue.number).padStart(3, "0")}
          </span>
          <span className="text-[11px] text-[var(--color-fg-faint)]">{issue.date}</span>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1] mb-5"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {issue.title}
        </h1>
        <p className="text-[var(--color-fg-muted)] leading-relaxed text-[15px] max-w-2xl">
          {issue.editorial}
        </p>
      </section>

      {/* Pieces */}
      <section className="container-wide pb-16">
        <div className="space-y-4">
          {pieces.map(({ slug, piece }, i) => {
            const fm = piece.frontmatter;
            const lensInfo = LENSES[fm.lens];
            const difficultyColors: Record<string, string> = {
              beginner: "#4a9e6e",
              intermediate: "#c49a3c",
              advanced: "#c45d3e",
            };

            return (
              <Link
                key={slug}
                href={`/piece/${slug}`}
                className={`group block piece-card ${i === 0 ? "piece-card-featured" : ""}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`badge lens-${fm.lens}`}>
                    {lensInfo?.name ?? fm.lens}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-fg-muted)]">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: difficultyColors[fm.difficulty] ?? "#999" }}
                    />
                    {fm.difficulty}
                  </span>
                  <span className="text-[11px] text-[var(--color-fg-faint)]">{fm.time}</span>
                </div>
                <h3
                  className={`font-medium tracking-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors ${
                    i === 0 ? "text-2xl" : "text-lg"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {fm.title}
                </h3>
                <p className="text-[13px] text-[var(--color-fg-muted)] leading-relaxed max-w-lg">
                  {fm.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {fm.threads.map((t) => (
                    <span key={t} className="thread-tag">{t}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Issue navigation */}
      <section className="container-wide pb-12">
        <div className="pt-8 border-t border-[var(--color-border)] flex items-center justify-between">
          {prevIssue ? (
            <Link
              href={`/issues/${prevIssue.number}`}
              className="text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Issue {String(prevIssue.number).padStart(3, "0")}
            </Link>
          ) : (
            <div />
          )}
          <Link
            href="/"
            className="text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            Latest issue
          </Link>
          {nextIssue ? (
            <Link
              href={`/issues/${nextIssue.number}`}
              className="text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors flex items-center gap-2"
            >
              Issue {String(nextIssue.number).padStart(3, "0")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
