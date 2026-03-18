import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllThreads, getPiecesByThread, LENSES } from "@/lib/content";
import type { Piece } from "@/lib/content";

export function generateStaticParams() {
  return getAllThreads().map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = getAllThreads().find((t) => t.id === id);
  if (!thread) return {};
  return {
    title: `${thread.name} — Explore`,
    description: thread.description,
  };
}

function DifficultyDot({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    beginner: "#4a9e6e",
    intermediate: "#c49a3c",
    advanced: "#c45d3e",
  };
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-fg-muted)]">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[difficulty] ?? "#999" }} />
      {difficulty}
    </span>
  );
}

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = getAllThreads().find((t) => t.id === id);
  if (!thread) notFound();

  const pieces = getPiecesByThread(id);

  // Group by difficulty for nice ordering
  const grouped: Record<string, Piece[]> = { beginner: [], intermediate: [], advanced: [] };
  for (const p of pieces) {
    const d = p.frontmatter.difficulty;
    if (grouped[d]) grouped[d].push(p);
    else grouped[d] = [p];
  }

  const allThreads = getAllThreads();
  const relatedThreads = allThreads.filter((t) => {
    if (t.id === id) return false;
    return pieces.some((p) => p.frontmatter.threads.includes(t.id));
  });

  return (
    <div className="fade-in">
      <section className="container-wide pt-16 pb-12">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Explore
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="decorative-line" />
          <span className="section-label">Thread</span>
        </div>

        <h1
          className="text-4xl font-medium tracking-tight mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {thread.name}
        </h1>
        <p className="text-[var(--color-fg-muted)] text-[15px] max-w-lg mb-2">
          {thread.description}
        </p>
        <p className="text-[13px] text-[var(--color-fg-faint)]">
          {pieces.length} {pieces.length === 1 ? "piece" : "pieces"} in this thread
        </p>
      </section>

      {/* Pieces */}
      <section className="container-wide pb-12">
        {pieces.length === 0 ? (
          <div className="empty-state">
            <p>No pieces in this thread yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pieces.map((piece) => {
              const fm = piece.frontmatter;
              const lensInfo = LENSES[fm.lens];
              return (
                <Link
                  key={piece.slug}
                  href={`/piece/${piece.slug}`}
                  className="piece-card group flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`badge lens-${fm.lens}`}>{lensInfo?.name ?? fm.lens}</span>
                      <DifficultyDot difficulty={fm.difficulty} />
                      <span className="text-[11px] text-[var(--color-fg-faint)]">{fm.time}</span>
                    </div>
                    <h3
                      className="text-base sm:text-lg font-medium tracking-tight group-hover:text-[var(--color-accent)] transition-colors mb-1.5"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {fm.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-fg-muted)] leading-relaxed line-clamp-2">
                      {fm.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {fm.threads
                        .filter((t) => t !== id)
                        .map((t) => (
                          <span key={t} className="thread-tag">{t}</span>
                        ))}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center text-[var(--color-fg-faint)] group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Related threads */}
      {relatedThreads.length > 0 && (
        <section className="container-wide pb-16">
          <h2 className="section-label mb-4">Related Threads</h2>
          <div className="flex flex-wrap gap-2">
            {relatedThreads.map((t) => (
              <Link
                key={t.id}
                href={`/explore/thread/${t.id}`}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-sm text-[var(--color-fg-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-accent)] transition-all"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
