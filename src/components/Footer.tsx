import Link from "next/link";
import Image from "next/image";

/* ─── Footer ─────────────────────────────────────────
   A bundle of discipline strands braid together at the
   top and fan back out at the bottom — like a cable of
   ideas being woven and unwoven.
   ──────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "/", label: "Issues" },
  { href: "/explore", label: "Explore" },
  { href: "/paths", label: "Paths" },
  { href: "/about", label: "About" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/about", label: "About" },
] as const;

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    "text-[13px] text-white/60 hover:text-white transition-colors duration-300";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* Strand data — multiple lines per discipline that weave and converge.
   Each strand: [startY, cp1x, cp1y, cp2x, cp2y, ... endY at x=1200]
   They start spread out and converge toward the right. */
const STRANDS = {
  bio: {
    color: "#34d399",
    id: "strand-bio",
    paths: [
      "M0,8  C200,12 350,55 500,48  C650,41 800,72 1000,78  L1200,82",
      "M0,18 C180,22 300,62 480,52  C660,42 820,68 1000,76  L1200,82",
      "M0,28 C160,30 280,58 460,50  C640,42 780,66 980,76   L1200,82",
      "M0,14 C220,20 370,48 520,45  C670,42 830,70 1020,78  L1200,82",
      "M0,22 C190,26 340,60 500,50  C660,40 800,65 990,76   L1200,82",
      "M0,5  C210,15 360,52 510,47  C660,42 810,71 1010,78  L1200,82",
    ],
  },
  cs: {
    color: "#60a5fa",
    id: "strand-cs",
    paths: [
      "M0,48 C200,55 320,28 500,42  C680,56 830,38 1000,72  L1200,82",
      "M0,55 C180,60 300,32 480,44  C660,56 800,40 980,74   L1200,82",
      "M0,62 C160,64 280,35 460,46  C640,57 780,42 960,74   L1200,82",
      "M0,52 C220,58 340,30 520,43  C700,56 840,36 1010,73  L1200,82",
      "M0,58 C190,62 310,34 490,45  C670,56 810,39 990,74   L1200,82",
      "M0,45 C210,52 330,26 510,41  C690,56 835,37 1005,73  L1200,82",
    ],
  },
  math: {
    color: "#fbbf24",
    id: "strand-math",
    paths: [
      "M0,88 C150,84 270,48 440,56  C610,64 760,34 950,68   L1200,82",
      "M0,95 C170,90 290,52 460,58  C630,64 780,38 960,70   L1200,82",
      "M0,102 C190,96 310,56 480,60 C650,64 800,42 970,72   L1200,82",
      "M0,92 C160,88 280,50 450,57  C620,64 770,36 955,69   L1200,82",
      "M0,98 C180,94 300,54 470,59  C640,64 790,40 965,71   L1200,82",
      "M0,85 C140,82 260,46 430,55  C600,64 750,32 945,67   L1200,82",
    ],
  },
} as const;

/* Mirror strands for the bottom — they fan back out.
   Flip Y and reverse the convergence. */
const STRANDS_BOTTOM = {
  bio: {
    color: "#34d399",
    id: "strand-bio-b",
    paths: [
      "M0,8  C200,12 400,18 600,30  C800,42 950,70 1200,82",
      "M0,8  C200,14 400,22 600,35  C800,48 950,65 1200,72",
      "M0,8  C200,12 400,16 600,25  C800,34 950,55 1200,60",
      "M0,8  C200,13 400,20 600,32  C800,44 950,68 1200,78",
      "M0,8  C200,11 400,15 600,22  C800,30 950,48 1200,52",
      "M0,8  C200,14 400,24 600,38  C800,52 950,75 1200,90",
    ],
  },
  cs: {
    color: "#60a5fa",
    id: "strand-cs-b",
    paths: [
      "M0,8  C200,15 400,30 600,42  C800,54 950,48 1200,45",
      "M0,8  C200,16 400,32 600,45  C800,58 950,52 1200,50",
      "M0,8  C200,14 400,28 600,38  C800,48 950,44 1200,40",
      "M0,8  C200,16 400,34 600,48  C800,62 950,56 1200,55",
      "M0,8  C200,13 400,26 600,35  C800,44 950,40 1200,36",
      "M0,8  C200,17 400,36 600,50  C800,64 950,60 1200,58",
    ],
  },
  math: {
    color: "#fbbf24",
    id: "strand-math-b",
    paths: [
      "M0,8  C200,14 400,26 600,48  C800,70 950,88 1200,98",
      "M0,8  C200,12 400,22 600,42  C800,62 950,82 1200,92",
      "M0,8  C200,16 400,30 600,54  C800,78 950,95 1200,105",
      "M0,8  C200,13 400,24 600,45  C800,66 950,85 1200,95",
      "M0,8  C200,11 400,20 600,38  C800,56 950,78 1200,88",
      "M0,8  C200,15 400,28 600,52  C800,76 950,92 1200,102",
    ],
  },
} as const;

type StrandGroup = Record<string, { color: string; id: string; paths: readonly string[] }>;

function StrandsSvg({
  strands,
  className,
}: {
  strands: StrandGroup;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 110"
      preserveAspectRatio="none"
      className={`absolute inset-0 w-full h-full ${className ?? ""}`}
    >
      <defs>
        {Object.values(strands).map((group) => (
          <linearGradient key={group.id} id={group.id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={group.color} stopOpacity="0" />
            <stop offset="15%" stopColor={group.color} stopOpacity="0.5" />
            <stop offset="50%" stopColor={group.color} stopOpacity="0.7" />
            <stop offset="85%" stopColor={group.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={group.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {Object.values(strands).map((group) =>
        group.paths.map((d, i) => (
          <path
            key={`${group.id}-${i}`}
            d={d}
            fill="none"
            stroke={`url(#${group.id})`}
            strokeWidth="1.2"
            opacity={0.4 + (i % 3) * 0.15}
          />
        ))
      )}
    </svg>
  );
}

function ConvergenceStrands() {
  return (
    <div className="relative h-24 sm:h-36 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#111]" />
      <StrandsSvg strands={STRANDS} />
      {/* Bottom fill */}
      <svg
        viewBox="0 0 1200 110"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path d="M0,100 L1200,100 L1200,110 L0,110 Z" fill="#111" />
      </svg>
    </div>
  );
}

function DivergenceStrands() {
  return (
    <div className="relative h-24 sm:h-36 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1/3 bg-[#111]" />
      <StrandsSvg strands={STRANDS_BOTTOM} />
      {/* Top fill */}
      <svg
        viewBox="0 0 1200 110"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path d="M0,0 L1200,0 L1200,10 L0,10 Z" fill="#111" />
      </svg>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-36 sm:mt-44 relative">
      {/* Pre-footer — warm CTA band */}
      <div className="bg-[var(--color-bg-warm)] border-t border-[var(--color-border)]">
        <div className="container-wide py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h3
                className="text-xl sm:text-2xl font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Stay curious across disciplines
              </h3>
              <p className="text-[14px] text-[var(--color-fg-muted)] mt-3 max-w-md leading-[1.7]">
                New issues drop biweekly. Each one is a deliberate mix of
                biology, computer science, and mathematics — because the best
                ideas live at the edges.
              </p>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[13px] font-medium text-[var(--color-fg-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all flex-shrink-0 shadow-sm"
            >
              Explore all content
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Strands converge into the footer */}
      <ConvergenceStrands />

      {/* Main footer — dark-selection for readable text selection */}
      <div className="dark-selection bg-[#111] text-white relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="mx-2 sm:mx-6 lg:mx-10 pt-14 sm:pt-18 pb-10 sm:pb-14">

            {/* Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-14 sm:gap-8">

              {/* Brand */}
              <div className="sm:col-span-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-xl overflow-hidden ring-1 ring-white/15">
                    <Image
                      src="/logo.jpg"
                      alt="The Folio"
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="text-[22px] text-white"
                    style={{
                      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                      fontStyle: "italic",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                    }}
                  >
                    The Folio
                  </span>
                </div>

                <p className="text-[13px] text-white/50 leading-[1.9] max-w-[300px]">
                  A human-curated magazine at the intersection of biology,
                  computer science, and mathematics. Written by humans, for
                  humans.
                </p>

                {/* Discipline indicators */}
                <div className="flex items-center gap-5 mt-8">
                  {[
                    { color: "bg-emerald-400", label: "Biology" },
                    { color: "bg-blue-400", label: "CS" },
                    { color: "bg-amber-400", label: "Math" },
                  ].map((d) => (
                    <span key={d.label} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${d.color}`} />
                      <span className="text-[10px] text-white/40 uppercase tracking-[0.15em]">
                        {d.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigate */}
              <div className="sm:col-span-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-6">
                  Navigate
                </p>
                <div className="flex flex-col gap-3.5">
                  {NAV_LINKS.map((link) => (
                    <FooterLink key={link.href + link.label} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </div>
              </div>

              {/* Contribute */}
              <div className="sm:col-span-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-6">
                  Contribute
                </p>
                <p className="text-[13px] text-white/50 leading-[1.85] mb-6">
                  Every piece is written or curated by humans. No AI-generated
                  content. Want to write something?
                </p>
                <a
                  href="https://github.com/mahmoudxyz/folio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-white/12 bg-white/[0.04] text-[13px] text-white/60 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Divider — three discipline dots */}
            <div className="relative my-12 sm:my-14">
              <div className="h-px bg-white/[0.08]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#111] px-3">
                <span className="w-1 h-1 rounded-full bg-emerald-400/50" />
                <span className="w-1 h-1 rounded-full bg-blue-400/50" />
                <span className="w-1 h-1 rounded-full bg-amber-400/50" />
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-white/30">
                &copy; {year} The Folio. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <p
                className="text-[11px] text-white/20"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontStyle: "italic",
                  letterSpacing: "0.03em",
                }}
              >
                Made with care, not with prompts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strands diverge out of the footer — the mirror */}
      <DivergenceStrands />
    </footer>
  );
}
