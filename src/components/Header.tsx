import Link from "next/link";
import Image from "next/image";

/* ─── Header ─────────────────────────────────────────
   Sticky glass header with the logo.jpg image, italic
   serif title, three discipline dots as a visual
   signature, and clean navigation.
   ──────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { href: "/", label: "Issues" },
  { href: "/explore", label: "Explore" },
  { href: "/paths", label: "Paths" },
  { href: "/about", label: "About" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative px-3 sm:px-4 py-2 rounded-xl text-[13px] font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-warm)] transition-all"
    >
      {label}
    </Link>
  );
}

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Glass background */}
        <div className="absolute inset-0 backdrop-blur-xl bg-[var(--color-bg)]/80" />

        <div className="relative container-wide">
          <div className="flex items-center justify-between py-3.5 sm:py-4">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
              {/* Logo image */}
              <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-[var(--color-border)] group-hover:ring-[var(--color-border-strong)] transition-all">
                <Image
                  src="/logo.jpg"
                  alt="The Folio"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title + discipline dots */}
              <div className="flex items-center gap-3">
                <span
                  className="text-[19px] sm:text-[20px] text-[var(--color-fg)] leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                  }}
                >
                  The Folio
                </span>

                {/* Three discipline dots — the visual signature */}
                <div className="hidden sm:flex items-center gap-[5px] ml-0.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-emerald-500/70" />
                  <span className="w-[5px] h-[5px] rounded-full bg-blue-500/70" />
                  <span className="w-[5px] h-[5px] rounded-full bg-amber-500/70" />
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.href + item.label} href={item.href} label={item.label} />
              ))}

              <div className="w-px h-5 bg-[var(--color-border)] mx-3" />

              <a
                href="https://github.com/mahmoudxyz/folio"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-[var(--color-fg-faint)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-warm)] transition-all"
                aria-label="View on GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </nav>

            {/* Mobile menu button */}
            <MobileMenu />
          </div>

          {/* Bottom border — three discipline colors fading out */}
          <div className="h-px relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px flex">
              <div className="flex-1 bg-gradient-to-r from-transparent to-emerald-500/20" />
              <div className="flex-1 bg-blue-500/20" />
              <div className="flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so sticky header doesn't eat content */}
      <div className="h-0" />
    </>
  );
}

/* ─── Mobile Menu ────────────────────────────────────
   Details/summary based — no JS needed, fully accessible,
   works without client components.
   ──────────────────────────────────────────────────── */
function MobileMenu() {
  return (
    <details className="sm:hidden group relative">
      <summary className="list-none p-2 rounded-xl text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-warm)] transition-all cursor-pointer">
        {/* Hamburger icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-open:hidden"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        {/* Close icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hidden group-open:block"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </summary>

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] shadow-lg overflow-hidden z-50">
        <nav className="py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="block px-4 py-2.5 text-[13px] font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-warm)] transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="h-px bg-[var(--color-border)] mx-3 my-1.5" />

          <a
            href="https://github.com/mahmoudxyz/folio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-warm)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </nav>
      </div>
    </details>
  );
}
