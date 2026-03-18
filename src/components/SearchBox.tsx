"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  lens: string;
  threads: string[];
  type: "piece" | "thread" | "lens" | "path";
}

interface SearchBoxProps {
  items: SearchItem[];
  autoFocus?: boolean;
  placeholder?: string;
}

export default function SearchBox({ items, autoFocus, placeholder }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.length > 0
    ? items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.threads.some((t) => t.toLowerCase().includes(q)) ||
          item.lens.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  const showResults = focused && query.length > 0;

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setFocused(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const navigate = useCallback((item: SearchItem) => {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    router.push(item.slug);
  }, [router]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      e.preventDefault();
      navigate(results[selectedIdx]);
    }
  }

  const typeIcons: Record<string, React.ReactNode> = {
    piece: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    thread: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    lens: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    path: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  };

  const typeLabels: Record<string, string> = {
    piece: "Piece",
    thread: "Thread",
    lens: "Lens",
    path: "Path",
  };

  return (
    <div className="relative w-full">
      {/* Search icon */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-fg-faint)] pointer-events-none z-10">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        className="w-full h-13 sm:h-14 pl-13 sm:pl-14 pr-14 bg-[var(--color-bg-elevated)] border-[1.5px] border-[var(--color-border)] rounded-2xl text-base text-[var(--color-fg)] placeholder:text-[var(--color-fg-faint)] outline-none transition-all focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(196,93,62,0.08),0_4px_20px_rgba(0,0,0,0.04)]"
        style={{ fontFamily: "var(--font-sans)" }}
        placeholder={placeholder || "Search pieces, threads, topics..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
      />

      {/* Keyboard hint */}
      {!focused && !query && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-fg-faint)] border border-[var(--color-border)] rounded px-1.5 py-0.5 font-mono">
          /
        </span>
      )}

      {/* Results */}
      {showResults && (
        <div
          className="absolute top-full left-0 right-0 mt-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl overflow-hidden z-50"
          style={{ boxShadow: "0 16px 64px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}
        >
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((item, i) => (
                <button
                  key={`${item.type}-${item.slug}`}
                  className={`w-full text-left px-5 py-3 flex items-center gap-3.5 transition-colors ${
                    i === selectedIdx
                      ? "bg-[var(--color-bg-warm)]"
                      : "hover:bg-[var(--color-bg)]"
                  }`}
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  <span className="text-[var(--color-fg-faint)]">
                    {typeIcons[item.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[var(--color-fg)] truncate">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-[var(--color-fg-muted)] truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-[var(--color-fg-faint)] uppercase tracking-wider flex-shrink-0">
                    {typeLabels[item.type]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-[14px] text-[var(--color-fg-muted)]">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[12px] text-[var(--color-fg-faint)] mt-1">
                Try a different keyword or browse by topic
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
