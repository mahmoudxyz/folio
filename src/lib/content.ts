import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const contentDir = path.join(process.cwd(), "content");

export interface PieceResource {
  label: string;
  url: string;
  type?: string; // auto-detected from URL if omitted
}

export type AiContributionCategory =
  | "proofreading"
  | "grammar-fixes"
  | "code-generation"
  | "code-review"
  | "content-drafting"
  | "content-restructuring"
  | "research-assistance"
  | "diagram-generation"
  | "translation"
  | "math-verification";

export interface AiContribution {
  categories: AiContributionCategory[];
  description?: string; // optional free-text note, e.g. "AI drafted the BWT section, human rewrote the intro"
}

export interface QuickTakeawayItem {
  fact: string; // the main fact/news
  source?: string; // optional link to source
  field: "bio" | "cs" | "math" | "cross"; // which discipline
}

export interface PieceFrontmatter {
  title: string;
  author: string;
  lens: string;
  threads: string[];
  issue: number;
  date: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  time: string;
  description: string;
  takeaway?: string; // single-sentence key takeaway for cards, RSS, social
  format?: "long" | "short"; // controls layout — short pieces get a lighter treatment
  items?: QuickTakeawayItem[]; // structured items for quick-takeaways lens
  cover?: string; // path to cover image (relative to piece folder, e.g. "assets/cover.jpg")
  youtube?: string;
  source_url?: string;
  resources?: PieceResource[];
  ai?: AiContribution; // AI transparency disclosure
}

export interface Piece {
  slug: string;
  frontmatter: PieceFrontmatter;
  content: string;
}

export interface IssueSection {
  label: string;
  pieces: string[];
}

export interface Issue {
  number: number;
  title: string;
  date: string;
  editorial: string;
  cover?: string; // path relative to content/issues/, e.g. "covers/001.jpg"
  pieces: string[]; // flat list (legacy / simple issues)
  sections?: IssueSection[]; // grouped pieces for magazine-style layout
}

export interface Thread {
  id: string;
  name: string;
  description: string;
}

export interface ReadingPath {
  id: string;
  title: string;
  description: string;
  pieces: string[];
}

export function getAllPieces(): Piece[] {
  const piecesDir = path.join(contentDir, "pieces");
  if (!fs.existsSync(piecesDir)) return [];

  const slugs = fs.readdirSync(piecesDir).filter((f) => {
    const fullPath = path.join(piecesDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  return slugs
    .map((slug) => getPiece(slug))
    .filter((p): p is Piece => p !== null)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function getPiece(slug: string): Piece | null {
  const filePath = path.join(contentDir, "pieces", slug, "index.md");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as PieceFrontmatter,
    content,
  };
}

export function getAllIssues(): Issue[] {
  const issuesDir = path.join(contentDir, "issues");
  if (!fs.existsSync(issuesDir)) return [];

  const files = fs.readdirSync(issuesDir).filter((f) => f.endsWith(".yaml"));

  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(issuesDir, f), "utf-8");
      return yaml.load(raw) as Issue;
    })
    .sort((a, b) => b.number - a.number);
}

export function getIssue(number: number): Issue | null {
  const issues = getAllIssues();
  return issues.find((i) => i.number === number) ?? null;
}

/**
 * Get all piece slugs for an issue, whether from flat `pieces` or `sections`.
 */
export function getIssuePieceSlugs(issue: Issue): string[] {
  if (issue.sections && issue.sections.length > 0) {
    return issue.sections.flatMap((s) => s.pieces);
  }
  return issue.pieces ?? [];
}

export function getLatestIssue(): Issue | null {
  const issues = getAllIssues();
  return issues[0] ?? null;
}

export function getAllThreads(): Thread[] {
  const filePath = path.join(contentDir, "threads.yaml");
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = yaml.load(raw) as { threads: Thread[] };
  return data.threads;
}

export function getAllPaths(): ReadingPath[] {
  const filePath = path.join(contentDir, "paths.yaml");
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = yaml.load(raw) as { paths: ReadingPath[] };
  return data.paths;
}

export function getPiecesByThread(threadId: string): Piece[] {
  return getAllPieces().filter((p) =>
    p.frontmatter.threads.includes(threadId)
  );
}

export function getPiecesByLens(lens: string): Piece[] {
  return getAllPieces().filter((p) => p.frontmatter.lens === lens);
}

export const LENSES: Record<string, { name: string; description: string }> = {
  foundations: {
    name: "Foundations",
    description:
      "The building blocks, explained well — the explanation that finally made it click",
  },
  "deep-dive": {
    name: "Deep Dives",
    description: "Long-form explorations of a single topic",
  },
  connections: {
    name: "Connections",
    description: "Pieces that bridge two or more fields",
  },
  "tools-craft": {
    name: "Tools & Craft",
    description: "Practical walkthroughs, workflows, real usage",
  },
  "papers-classics": {
    name: "Papers & Classics",
    description:
      "Annotated readings of important papers, with commentary on why they matter",
  },
  "visual-explainers": {
    name: "Visual Explainers",
    description:
      "Diagram-heavy or interactive pieces where the visual is the explanation",
  },
  essay: {
    name: "Essays",
    description:
      "Arguments, reflections, and perspectives — no code required",
  },
  "field-notes": {
    name: "Field Notes",
    description:
      "Short observations, quick takes, and things we noticed",
  },
  review: {
    name: "Reviews",
    description:
      "Tools, books, and papers — evaluated honestly",
  },
  "quick-takeaways": {
    name: "Quick Takeaways",
    description:
      "Fast facts and news from across biology, CS, and math — all in one place",
  },
};

/**
 * Resolve a piece's cover image to a public URL.
 * Cover path in frontmatter is relative to the piece folder
 * (e.g. "assets/cover.jpg" or just "cover.jpg").
 * The image copy pipeline puts them in /content/<slug>/.
 */
export function getPieceCoverUrl(slug: string, cover?: string): string | null {
  if (!cover) return null;
  // Strip leading ./ if present
  const filename = cover.replace(/^\.\//, "").replace(/^(assets|images)\//, "");
  return `/content/${slug}/${filename}`;
}

/**
 * Resolve an issue's cover image to a public URL.
 * Cover path in YAML is relative to content/issues/
 * (e.g. "covers/001.jpg"). Copies to public/content/issues/.
 */
export function getIssueCoverUrl(issueNumber: number, cover?: string): string | null {
  if (!cover) return null;

  const srcPath = path.join(contentDir, "issues", cover);
  if (!fs.existsSync(srcPath)) return null;

  const filename = path.basename(cover);
  const destDir = path.join(process.cwd(), "public", "content", "issues");
  const destPath = path.join(destDir, filename);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy if needed
  if (!fs.existsSync(destPath) || fs.statSync(srcPath).mtimeMs > fs.statSync(destPath).mtimeMs) {
    fs.copyFileSync(srcPath, destPath);
  }

  return `/content/issues/${filename}`;
}
