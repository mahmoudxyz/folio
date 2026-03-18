import { notFound } from "next/navigation";
import Link from "next/link";
import { getPiecesByLens, LENSES } from "@/lib/content";

export function generateStaticParams() {
  return Object.keys(LENSES).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lens = LENSES[id];
  if (!lens) return {};
  return {
    title: `${lens.name} — Explore`,
    description: lens.description,
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

export default async function LensPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lens = LENSES[id];
  if (!lens) notFound();

  const pieces = getPiecesByLens(id);

  // All other lenses for navigation
  const otherLenses = Object.entries(LENSES).filter(([key]) => key !== id);

  return (
    <div className="fade-in">
      <section className="container-wide pt-10 sm:pt-14 pb-12">
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
          <span className="section-label">Lens</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <h1
            className="text-4xl font-medium tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {lens.name}
          </h1>
          <span className={`badge lens-${id}`}>{lens.name}</span>
        </div>
        <p className="text-[var(--color-fg-muted)] text-[15px] max-w-lg mb-2">
          {lens.description}
        </p>
        <p className="text-[13px] text-[var(--color-fg-faint)]">
          {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
        </p>
      </section>

      {/* Pieces */}
      <section className="container-wide pb-12">
        {pieces.length === 0 ? (
          <div className="empty-state">
            <p>No pieces with this lens yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pieces.map((piece) => {
              const fm = piece.frontmatter;
              return (
                <Link
                  key={piece.slug}
                  href={`/piece/${piece.slug}`}
                  className="piece-card group flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <DifficultyDot difficulty={fm.difficulty} />
                      <span className="text-[11px] text-[var(--color-fg-faint)]">{fm.time}</span>
                      <span className="text-[11px] text-[var(--color-fg-faint)]">
                        Issue {String(fm.issue).padStart(3, "0")}
                      </span>
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
                      {fm.threads.map((t) => (
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

      {/* Other lenses */}
      <section className="container-wide pb-16">
        <h2 className="section-label mb-4">Other Lenses</h2>
        <div className="flex flex-wrap gap-2">
          {otherLenses.map(([key, l]) => (
            <Link
              key={key}
              href={`/explore/lens/${key}`}
              className={`badge lens-${key} hover:opacity-80 transition-opacity`}
              style={{ padding: "0.375rem 0.875rem" }}
            >
              {l.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
