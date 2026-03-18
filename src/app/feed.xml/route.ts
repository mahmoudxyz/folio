import { getAllPieces } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thefolio.dev";

export function GET() {
  const pieces = getAllPieces();

  const items = pieces
    .map((piece) => {
      const fm = piece.frontmatter;
      const url = `${SITE_URL}/piece/${piece.slug}`;
      const pubDate = new Date(fm.date).toUTCString();

      return `    <item>
      <title><![CDATA[${fm.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${fm.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${fm.author}</author>
      <category>${fm.lens}</category>
${fm.threads.map((t) => `      <category>${t}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Folio — Biology, CS, and Math</title>
    <link>${SITE_URL}</link>
    <description>A human-curated magazine at the intersection of biology, computer science, and mathematics.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
