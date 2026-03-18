import Link from "next/link";
import { getAllPaths, getPiece, LENSES } from "@/lib/content";
import type { Metadata } from "next";
import type { Piece } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reading Paths",
  description: "Curated sequences for guided learning across biology, CS, and mathematics.",
};

export default function PathsPage() {
  const paths = getAllPaths();

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="container-wide pt-16 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="decorative-line" />
          <span className="section-label">Reading Paths</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-medium tracking-tight mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Guided journeys
        </h1>
        <p className="text-[var(--color-fg-muted)] text-[15px] max-w-lg">
          Pick a path based on what you know and where you want to go. Each sequence
          is hand-ordered to build understanding step by step.
        </p>
      </section>

      {/* Paths */}
      <section className="container-wide pb-16">
        <div className="space-y-6">
          {paths.map((path, pathIdx) => {
            const pieces = path.pieces
              .map((slug) => ({ slug, piece: getPiece(slug) }))
              .filter((p): p is { slug: string; piece: Piece } => p.piece !== null);

            // Calculate total read time
            const totalMinutes = pieces.reduce((sum, { piece }) => {
              const match = piece.frontmatter.time.match(/(\d+)/);
              return sum + (match ? parseInt(match[1]) : 0);
            }, 0);

            return (
              <div
                key={path.id}
                className="rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] overflow-hidden"
              >
                {/* Path header */}
                <div className="p-6 sm:p-8 pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <span className="text-[11px] text-[var(--color-fg-faint)] font-medium">
                        Path {String(pathIdx + 1).padStart(2, "0")}
                      </span>
                      <h2
                        className="text-xl sm:text-2xl font-medium tracking-tight mt-1"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {path.title}
                      </h2>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <span className="text-[11px] text-[var(--color-fg-faint)] bg-[var(--color-bg)] rounded-full px-2.5 py-1">
                        {pieces.length} pieces
                      </span>
                      <span className="text-[11px] text-[var(--color-fg-faint)] bg-[var(--color-bg)] rounded-full px-2.5 py-1">
                        ~{totalMinutes} min
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[var(--color-fg-muted)] leading-relaxed max-w-xl mb-6">
                    {path.description}
                  </p>
                </div>

                {/* Steps */}
                <div className="px-4 sm:px-8 pb-6 sm:pb-8">
                  <div className="space-y-0">
                    {pieces.map(({ slug, piece }, i) => {
                      const fm = piece.frontmatter;
                      const lensInfo = LENSES[fm.lens];
                      const isLast = i === pieces.length - 1;

                      return (
                        <Link
                          key={slug}
                          href={`/piece/${slug}`}
                          className="group flex gap-3 sm:gap-4 relative"
                        >
                          {/* Step indicator + line */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] flex items-center justify-center text-[11px] font-semibold text-[var(--color-fg-muted)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors z-10">
                              {i + 1}
                            </div>
                            {!isLast && (
                              <div className="w-[2px] flex-1 bg-[var(--color-border)] my-1" />
                            )}
                          </div>

                          {/* Content */}
                          <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-4"}`}>
                            <div className="p-3 sm:p-4 rounded-xl hover:bg-[var(--color-bg)] transition-colors -ml-1 sm:-ml-2">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className={`badge lens-${fm.lens}`} style={{ fontSize: "10px", padding: "2px 8px" }}>
                                  {lensInfo?.name ?? fm.lens}
                                </span>
                                <span className="text-[11px] text-[var(--color-fg-faint)]">{fm.time}</span>
                              </div>
                              <h3 className="text-[14px] sm:text-[15px] font-medium group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                                {fm.title}
                              </h3>
                              <p className="text-[12px] text-[var(--color-fg-muted)] mt-1 leading-relaxed line-clamp-2">
                                {fm.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
