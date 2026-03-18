import type { PieceResource } from "@/lib/content";

/* ─── Resource Links ─────────────────────────────────
   A row of resource chips that auto-detect their icon
   from the URL. Authors just list label + url in the
   frontmatter and get a nice visual for free.
   ──────────────────────────────────────────────────── */

type ResourceType =
  | "youtube"
  | "github"
  | "drive"
  | "kaggle"
  | "colab"
  | "paper"
  | "dataset"
  | "slides"
  | "notebook"
  | "website"
  | "code"
  | "download";

const TYPE_META: Record<
  ResourceType,
  { icon: React.ReactNode; accent: string; bg: string }
> = {
  youtube: {
    accent: "#ff0000",
    bg: "#fff0f0",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.8 31.8 0 000 12a31.8 31.8 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.8 31.8 0 0024 12a31.8 31.8 0 00-.5-5.81zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z" />
      </svg>
    ),
  },
  github: {
    accent: "#24292f",
    bg: "#f3f4f6",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  drive: {
    accent: "#4285f4",
    bg: "#e8f0fe",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm1.14 0l6.57 11.5H22l-6.57-11.5H8.85zM15.29 16H2.57l3.44 6h12.72l-3.44-6z" />
      </svg>
    ),
  },
  kaggle: {
    accent: "#20beff",
    bg: "#e6f7ff",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 23.859a.882.882 0 01-.632-.28L12.11 17.1l-1.382 1.3v4.742c0 .474-.385.858-.858.858h-1.51a.858.858 0 01-.858-.858V.858C7.502.384 7.886 0 8.36 0h1.51c.473 0 .858.384.858.858v11.088l6.67-6.908a.893.893 0 01.632-.262h2.08c.735 0 1.096.888.57 1.405L14.17 12.7l7.042 7.97c.504.57.13 1.43-.615 1.43h-1.772z" />
      </svg>
    ),
  },
  colab: {
    accent: "#f9ab00",
    bg: "#fef7e0",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.94 2a6.56 6.56 0 00-4.94 2.24A6.56 6.56 0 007.06 2C3.72 2 1 4.72 1 8.06a6.56 6.56 0 002.24 4.94L12 21.76l8.76-8.76A6.56 6.56 0 0023 8.06C23 4.72 20.28 2 16.94 2z" />
      </svg>
    ),
  },
  paper: {
    accent: "#9d174d",
    bg: "#fdf2f8",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  dataset: {
    accent: "#0e7490",
    bg: "#ecfeff",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  slides: {
    accent: "#ea580c",
    bg: "#fff7ed",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  notebook: {
    accent: "#f97316",
    bg: "#fff7ed",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  website: {
    accent: "#6366f1",
    bg: "#eef2ff",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  code: {
    accent: "#7c3aed",
    bg: "#f5f3ff",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  download: {
    accent: "#059669",
    bg: "#ecfdf5",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
};

/** Auto-detect resource type from URL hostname */
function detectType(url: string): ResourceType {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host.includes("github.com")) return "github";
    if (host.includes("drive.google.com") || host.includes("docs.google.com")) return "drive";
    if (host.includes("kaggle.com")) return "kaggle";
    if (host.includes("colab.research.google.com")) return "colab";
    if (host.includes("arxiv.org") || host.includes("doi.org") || host.includes("pubmed")) return "paper";
    if (host.includes("huggingface.co")) return "dataset";

    // Check path-based hints
    const path = new URL(url).pathname.toLowerCase();
    if (path.endsWith(".ipynb")) return "notebook";
    if (path.endsWith(".pdf")) return "paper";
    if (path.endsWith(".pptx") || path.endsWith(".key")) return "slides";
    if (path.endsWith(".zip") || path.endsWith(".tar.gz") || path.endsWith(".csv")) return "download";
  } catch {
    // invalid URL, fall through
  }
  return "website";
}

export default function ResourceLinks({ resources }: { resources: PieceResource[] }) {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="resource-links-strip">
      <span className="resource-links-label">Resources</span>
      <div className="resource-links-scroll">
        {resources.map((r, i) => {
          const type = (r.type as ResourceType) || detectType(r.url);
          const meta = TYPE_META[type] || TYPE_META.website;

          return (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-chip"
              style={
                {
                  "--chip-accent": meta.accent,
                  "--chip-bg": meta.bg,
                } as React.CSSProperties
              }
            >
              <span className="resource-chip-icon">{meta.icon}</span>
              <span className="resource-chip-label">{r.label}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="resource-chip-arrow"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
