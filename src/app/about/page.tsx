import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about The Folio — a human-curated magazine at the intersection of biology, computer science, and mathematics.",
};

export default function AboutPage() {
  return (
    <div className="fade-in">
      <section className="container-narrow pt-24 sm:pt-32 pb-20">
        <h1
          className="text-[2rem] sm:text-4xl font-medium tracking-tight mb-8"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          About The Folio
        </h1>

        <div className="prose">
          <p>
            The Folio is a human-curated magazine that lives at the intersection
            of biology, computer science, and mathematics. We believe the most
            interesting ideas emerge when disciplines collide.
          </p>

          <h2>Why this exists</h2>
          <p>
            The internet is drowning in AI-generated content. Tutorials are
            rewritten by bots, blog posts are stitched together from LLM output,
            and genuine insight is harder to find than ever. The Folio exists as
            an antidote to that.
          </p>
          <p>
            Every piece published here is written or carefully selected by a
            human. We don&apos;t accept AI-generated submissions. We care about
            getting the explanation right — about building real intuition, not
            just surface-level understanding.
          </p>

          <h2>How it works</h2>
          <p>
            Content is organized into <strong>issues</strong> (curated
            collections released biweekly), <strong>threads</strong> (topic
            streams like &quot;sequence analysis&quot; or &quot;graph
            theory&quot;), and <strong>lenses</strong> (the type of piece —
            foundations, deep dives, connections, and more).
          </p>
          <p>
            You can explore content through{" "}
            <strong>reading paths</strong> — guided sequences that take you
            through a topic in a deliberate order, building understanding
            layer by layer.
          </p>

          <h2>Who&apos;s behind this</h2>
          <p>
            The Folio is maintained by{" "}
            <a
              href="https://github.com/mahmoudxyz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mahmoud
            </a>
            , a developer and writer who thinks across disciplines. The project
            is fully open source — contributions are welcome.
          </p>

          <h2>Open source</h2>
          <p>
            The entire codebase and all content are available on{" "}
            <a
              href="https://github.com/mahmoudxyz/folio"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . If you want to write a piece, fix a typo, or suggest a new reading
            path, open a pull request.
          </p>
        </div>
      </section>
    </div>
  );
}
