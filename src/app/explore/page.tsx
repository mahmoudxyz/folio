import Link from "next/link";
import { getAllThreads, LENSES, getPiecesByThread, getPiecesByLens } from "@/lib/content";
import { getAllSearchItems } from "@/lib/search";
import SearchBox from "@/components/SearchBox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse content by thread, lens, or search for anything.",
};

export default function ExplorePage() {
  const threads = getAllThreads();
  const lensEntries = Object.entries(LENSES);
  const searchItems = getAllSearchItems();

  // Sort threads: ones with content first, then alphabetical
  const sortedThreads = [...threads].sort((a, b) => {
    const aCount = getPiecesByThread(a.id).length;
    const bCount = getPiecesByThread(b.id).length;
    if (aCount !== bCount) return bCount - aCount;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="fade-in">
      {/* Header + Search */}
      <section className="container-wide pt-16 pb-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="decorative-line" />
          <span className="section-label">Explore</span>
        </div>
        <h1
          className="text-4xl font-medium tracking-tight mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Find your way in
        </h1>
        <p className="text-[var(--color-fg-muted)] text-[15px] max-w-lg mb-8">
          Search for anything, or browse by how a piece teaches (lens) or
          what it covers (thread).
        </p>

        <SearchBox items={searchItems} placeholder="Search pieces, threads, topics..." />
      </section>

      {/* Lenses */}
      <section className="container-wide pt-12 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-label">By Lens — how the piece teaches</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {lensEntries.map(([id, lens]) => {
            const pieces = getPiecesByLens(id);
            const hasPieces = pieces.length > 0;

            return (
              <Link
                key={id}
                href={`/explore/lens/${id}`}
                className={`group p-5 rounded-xl border transition-all ${
                  hasPieces
                    ? "bg-[var(--color-bg-elevated)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-sm"
                    : "bg-[var(--color-bg)] border-dashed border-[var(--color-border)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`badge lens-${id}`}>{lens.name}</span>
                  <span className="text-[10px] text-[var(--color-fg-faint)]">
                    {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed line-clamp-2">
                  {lens.description}
                </p>
                {hasPieces && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                    <p className="text-[11px] text-[var(--color-fg-muted)] line-clamp-2">
                      {pieces.map((p) => p.frontmatter.title).join(" · ")}
                    </p>
                  </div>
                )}
                <span className="text-[11px] text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">
                  View all &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Threads */}
      <section className="container-wide pt-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-label">By Thread — what the piece covers</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedThreads.map((thread) => {
            const pieces = getPiecesByThread(thread.id);
            const hasPieces = pieces.length > 0;

            return (
              <Link
                key={thread.id}
                href={`/explore/thread/${thread.id}`}
                className={`group relative p-4 rounded-xl border transition-all ${
                  hasPieces
                    ? "bg-[var(--color-bg-elevated)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-sm"
                    : "bg-[var(--color-bg)] border-dashed border-[var(--color-border)] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-sm font-medium group-hover:text-[var(--color-accent)] transition-colors truncate mr-2">
                    {thread.name}
                  </h3>
                  {hasPieces && (
                    <span className="text-[10px] text-[var(--color-fg-faint)] bg-[var(--color-bg)] rounded-full px-1.5 py-0.5 flex-shrink-0">
                      {pieces.length}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--color-fg-muted)] leading-relaxed line-clamp-2">
                  {thread.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
