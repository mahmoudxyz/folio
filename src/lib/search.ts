import { getAllPieces, getAllThreads, getAllPaths, LENSES } from "./content";

export interface SearchItem {
  slug: string;
  title: string;
  description: string;
  lens: string;
  threads: string[];
  type: "piece" | "thread" | "lens" | "path";
}

export function getAllSearchItems(): SearchItem[] {
  const items: SearchItem[] = [];

  // Pieces
  for (const piece of getAllPieces()) {
    items.push({
      slug: `/piece/${piece.slug}`,
      title: piece.frontmatter.title,
      description: piece.frontmatter.description,
      lens: piece.frontmatter.lens,
      threads: piece.frontmatter.threads,
      type: "piece",
    });
  }

  // Threads
  for (const thread of getAllThreads()) {
    items.push({
      slug: `/explore/thread/${thread.id}`,
      title: thread.name,
      description: thread.description,
      lens: "",
      threads: [thread.id],
      type: "thread",
    });
  }

  // Lenses
  for (const [id, lens] of Object.entries(LENSES)) {
    items.push({
      slug: `/explore/lens/${id}`,
      title: lens.name,
      description: lens.description,
      lens: id,
      threads: [],
      type: "lens",
    });
  }

  // Paths
  for (const path of getAllPaths()) {
    items.push({
      slug: `/paths`,
      title: path.title,
      description: path.description,
      lens: "",
      threads: [],
      type: "path",
    });
  }

  return items;
}
