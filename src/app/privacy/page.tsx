import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "The Folio privacy policy. No cookies, no trackers, no third-party scripts. Fully open source.",
};

export default function PrivacyPage() {
  return (
    <div className="fade-in">
      <section className="container-narrow pt-24 sm:pt-32 pb-20">
        <h1
          className="text-[2rem] sm:text-4xl font-medium tracking-tight mb-8"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Privacy Policy
        </h1>

        <div className="prose">
          <p>
            <em>Last updated: March 2026</em>
          </p>

          <p>
            The Folio is a static, open-source website. We respect your privacy
            and keep things simple.
          </p>

          <h2>What we collect</h2>
          <p>
            <strong>Nothing.</strong> The Folio does not use cookies, analytics
            trackers, or any third-party scripts that collect personal data. We
            don&apos;t track your reading habits, store your IP address, or
            build user profiles.
          </p>

          <h2>Hosting</h2>
          <p>
            This site is hosted on Vercel. Vercel may collect standard server
            logs (IP addresses, request timestamps) as part of their
            infrastructure. These logs are subject to{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel&apos;s Privacy Policy
            </a>
            .
          </p>

          <h2>External links</h2>
          <p>
            The Folio contains links to external websites (GitHub, academic
            papers, etc.). We are not responsible for the privacy practices of
            those sites.
          </p>

          <h2>Open source</h2>
          <p>
            You can inspect every line of code that runs this website on{" "}
            <a
              href="https://github.com/mahmoudxyz/folio"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . What you see is what you get.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes, the update will be reflected in the git
            history of this project. No dark patterns, no buried notices.
          </p>

          <h2>Contact</h2>
          <p>
            Questions? Open an issue on{" "}
            <a
              href="https://github.com/mahmoudxyz/folio/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
