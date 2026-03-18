import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPieces, getPiece, getPieceCoverUrl, LENSES } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import ResourceLinks from "@/components/ResourceLinks";
import AiDisclosure from "@/components/AiDisclosure";
import SubscribeForm from "@/components/SubscribeForm";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllPieces().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) return {};
  const fm = piece.frontmatter;
  const coverUrl = getPieceCoverUrl(slug, fm.cover);

  return {
    title: fm.title,
    description: fm.description,
    openGraph: coverUrl
      ? {
          images: [{ url: coverUrl, width: 1200, height: 630, alt: fm.title }],
        }
      : undefined,
    twitter: coverUrl
      ? {
          card: "summary_large_image",
          images: [coverUrl],
        }
      : undefined,
  };
}

export default async function PiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();

  const html = await renderMarkdown(piece.content, slug);
  const fm = piece.frontmatter;
  const lensInfo = LENSES[fm.lens];
  const coverUrl = getPieceCoverUrl(slug, fm.cover);

  const difficultyColors: Record<string, string> = {
    beginner: "#4a9e6e",
    intermediate: "#c49a3c",
    advanced: "#c45d3e",
  };

  // Get adjacent pieces in same issue for next/prev
  const allPieces = getAllPieces();
  const sameLensPieces = allPieces.filter(
    (p) => p.frontmatter.lens === fm.lens && p.slug !== slug
  );

  return (
    <article className="fade-in">
      {/* Breadcrumb */}
      <div className="container-article pt-10 sm:pt-14">
        <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--color-fg-faint)]">
          <Link href="/" className="hover:text-[var(--color-fg-muted)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href={`/issues/${fm.issue}`} className="hover:text-[var(--color-fg-muted)] transition-colors">
            Issue {String(fm.issue).padStart(3, "0")}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-fg-muted)] truncate max-w-[200px] sm:max-w-none">
            {fm.title}
          </span>
        </div>
      </div>

      {/* Cover image */}
      {coverUrl && (
        <div className="container-wide mt-6 mb-8">
          <div className="piece-cover">
            <Image
              src={coverUrl}
              alt={fm.title}
              width={1200}
              height={480}
              className="piece-cover-img"
              priority
            />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="container-article pt-8 pb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
          <Link href={`/explore/lens/${fm.lens}`} className={`badge lens-${fm.lens} hover:opacity-80 transition-opacity`}>
            {lensInfo?.name ?? fm.lens}
          </Link>
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-fg-muted)]">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: difficultyColors[fm.difficulty] ?? "#999" }}
            />
            {fm.difficulty}
          </span>
          <span className="text-[11px] text-[var(--color-fg-faint)]">{fm.time}</span>
        </div>

        <h1
          className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] font-medium tracking-tight leading-[1.12] mb-5"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {fm.title}
        </h1>

        <p className="text-[15px] text-[var(--color-fg-muted)] leading-relaxed mb-6 max-w-xl">
          {fm.description}
        </p>

        {/* Author line */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[var(--color-fg-muted)] pb-6 border-b border-[var(--color-border)]">
          <span className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--color-bg-warm)] flex items-center justify-center text-[11px] font-semibold text-[var(--color-fg-muted)] flex-shrink-0">
              {fm.author[0].toUpperCase()}
            </span>
            {fm.author}
          </span>
          <span className="hidden sm:inline text-[var(--color-fg-faint)]">/</span>
          <span>{fm.date}</span>
          <span className="hidden sm:inline text-[var(--color-fg-faint)]">/</span>
          <Link
            href={`/issues/${fm.issue}`}
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            Issue {String(fm.issue).padStart(3, "0")}
          </Link>
        </div>

        {/* Thread tags + AI disclosure */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {fm.threads.map((t) => (
            <Link key={t} href={`/explore/thread/${t}`} className="thread-tag">
              {t}
            </Link>
          ))}
          {fm.ai && fm.ai.categories.length > 0 && (
            <AiDisclosure ai={fm.ai} />
          )}
        </div>
      </header>

      {/* Resource links */}
      {fm.resources && fm.resources.length > 0 && (
        <div className="container-article">
          <ResourceLinks resources={fm.resources} />
        </div>
      )}

      {/* Body */}
      <div className="container-article pb-12">
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {/* YouTube */}
      {fm.youtube && (
        <div className="container-article pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="decorative-line" />
            <span className="section-label">Companion Video</span>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-[var(--color-border)]">
            <iframe
              src={fm.youtube.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* More from this lens */}
      {sameLensPieces.length > 0 && (
        <div className="container-article pb-8">
          <div className="pt-8 border-t border-[var(--color-border)]">
            <h3 className="section-label mb-4">
              More {lensInfo?.name ?? fm.lens}
            </h3>
            <div className="space-y-2">
              {sameLensPieces.slice(0, 3).map((p) => (
                <Link
                  key={p.slug}
                  href={`/piece/${p.slug}`}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-warm)] transition-colors -mx-3"
                >
                  <span className={`badge lens-${p.frontmatter.lens} flex-shrink-0 mt-0.5`} style={{ fontSize: "10px", padding: "2px 8px" }}>
                    {LENSES[p.frontmatter.lens]?.name}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:text-[var(--color-accent)] transition-colors truncate">
                      {p.frontmatter.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-fg-muted)] mt-0.5">{p.frontmatter.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscribe CTA */}
      <div className="container-article pb-10">
        <SubscribeForm variant="card" />
      </div>

      {/* Footer nav */}
      <div className="container-article pb-16">
        <div className="pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Latest issue
          </Link>
          <Link
            href={`/issues/${fm.issue}`}
            className="text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            All from Issue {String(fm.issue).padStart(3, "0")} &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
