import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const contentDir = path.join(process.cwd(), "content");
const publicContentDir = path.join(process.cwd(), "public", "content");

function transformCallouts(content: string): string {
  return content.replace(
    /<Callout\s+type="(\w+)">([\s\S]*?)<\/Callout>/g,
    (_, type, inner) => {
      return `<div class="callout callout-${type}">\n\n${inner.trim()}\n\n</div>`;
    }
  );
}

function addCopyButtons(html: string): string {
  // Add copy button + language label to shiki-rendered code blocks
  // rehype-pretty-code wraps in <figure data-rehype-pretty-code-figure>
  return html.replace(
    /<figure data-rehype-pretty-code-figure(?:="")?>[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>[\s\S]*?(<pre[^>]*>[\s\S]*?<\/pre>)[\s\S]*?<\/figure>/g,
    (_, caption, pre) => {
      return `<div class="code-block-wrapper">${pre}</div>`;
    }
  ).replace(
    /<figure data-rehype-pretty-code-figure(?:="")?>[\s]*(<pre[^>]*>[\s\S]*?<\/pre>)[\s]*<\/figure>/g,
    (_, pre) => {
      // Extract language from data-language attribute
      const langMatch = pre.match(/data-language="([^"]+)"/);
      const language = langMatch ? langMatch[1] : "code";

      // Extract plain text for copy button
      const textContent = pre
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      const escapedCode = textContent
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");

      return `<div class="code-block-wrapper" data-code="${escapedCode}">
        <div class="code-block-header">
          <span class="code-block-lang">${language}</span>
          <button class="code-block-copy" onclick="(function(btn){var code=btn.closest('.code-block-wrapper').getAttribute('data-code');navigator.clipboard.writeText(code).then(function(){btn.classList.add('copied');btn.innerHTML='<svg width=\\'12\\' height=\\'12\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><polyline points=\\'20 6 9 17 4 12\\'/></svg> Copied';setTimeout(function(){btn.classList.remove('copied');btn.innerHTML='<svg width=\\'12\\' height=\\'12\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><rect x=\\'9\\' y=\\'9\\' width=\\'13\\' height=\\'13\\' rx=\\'2\\' ry=\\'2\\'/><path d=\\'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\\'/></svg> Copy'},2000)})})(this)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          </button>
        </div>
        ${pre}
      </div>`;
    }
  );
}

function wrapTables(html: string): string {
  return html.replace(
    /<table>([\s\S]*?)<\/table>/g,
    '<div class="table-wrapper"><table>$1</table></div>'
  );
}

/**
 * Copy all images/assets from a piece's directory into public/content/<slug>/
 * so they're servable by Next.js. Only copies if source is newer.
 */
function copyPieceAssets(slug: string) {
  const pieceDir = path.join(contentDir, "pieces", slug);
  const destDir = path.join(publicContentDir, slug);

  // Look in both ./assets/ and ./images/ subdirectories, and root-level images
  const assetDirs = ["assets", "images", "."];
  const imageExts = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"]);

  for (const sub of assetDirs) {
    const srcDir = path.join(pieceDir, sub);
    if (!fs.existsSync(srcDir)) continue;

    const files = fs.readdirSync(srcDir).filter((f) =>
      imageExts.has(path.extname(f).toLowerCase())
    );

    if (files.length === 0) continue;

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);

      // Skip if destination exists and is up to date
      if (fs.existsSync(destPath)) {
        const srcStat = fs.statSync(srcPath);
        const destStat = fs.statSync(destPath);
        if (destStat.mtimeMs >= srcStat.mtimeMs) continue;
      }

      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Rewrite relative image paths in markdown to absolute paths
 * that point to public/content/<slug>/.
 *
 * Handles: ./assets/foo.png, ./images/foo.png, assets/foo.png, images/foo.png, foo.png
 */
function rewriteImagePaths(source: string, slug: string): string {
  // Markdown image syntax: ![alt](path)
  return source.replace(
    /!\[([^\]]*)\]\(\.?\/?(?:assets|images)\/([^)]+)\)/g,
    `![$1](/content/${slug}/$2)`
  ).replace(
    // Bare filename images like ![alt](foo.png) — only if it looks like an image
    /!\[([^\]]*)\]\(([^/):][^)]*\.(?:png|jpg|jpeg|gif|svg|webp|avif))\)/gi,
    `![$1](/content/${slug}/$2)`
  ).replace(
    // HTML img tags with relative src
    /(<img\s[^>]*src=")\.?\/?(?:assets|images)\/([^"]+)(")/g,
    `$1/content/${slug}/$2$3`
  );
}

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract headings (h2, h3) from rendered HTML for table of contents.
 */
export function extractToc(html: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const re = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, "").trim();
    entries.push({ id: match[2], text, level: parseInt(match[1]) });
  }
  return entries;
}

/**
 * Add clickable anchor links to headings for easy sharing.
 */
function addHeadingAnchors(html: string): string {
  return html.replace(
    /<h([2-4])(\s+id="([^"]+)"[^>]*)>([\s\S]*?)<\/h\1>/g,
    (_, level, attrs, id, content) => {
      return `<h${level}${attrs}><a href="#${id}" class="heading-anchor" aria-hidden="true">#</a>${content}</h${level}>`;
    }
  );
}

export async function renderMarkdown(source: string, slug?: string): Promise<string> {
  let content = transformCallouts(source);

  // If a slug is provided, copy assets and rewrite image paths
  if (slug) {
    copyPieceAssets(slug);
    content = rewriteImagePaths(content, slug);
  }

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  let html = result.toString();
  html = addCopyButtons(html);
  html = wrapTables(html);
  html = addHeadingAnchors(html);

  return html;
}
