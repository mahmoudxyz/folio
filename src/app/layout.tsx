import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thefolio.dev";

export const metadata: Metadata = {
  title: {
    default: "The Folio — Biology, CS, and Math",
    template: "%s — The Folio",
  },
  description:
    "A human-curated magazine at the intersection of biology, computer science, and mathematics. No AI-generated content — every piece is written by hand.",
  keywords: [
    "biology",
    "computer science",
    "mathematics",
    "bioinformatics",
    "interdisciplinary",
    "magazine",
    "human-curated",
  ],
  authors: [{ name: "Mahmoud", url: "https://github.com/mahmoudxyz" }],
  creator: "Mahmoud",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "The Folio",
    title: "The Folio — Biology, CS, and Math",
    description:
      "A human-curated magazine at the intersection of biology, computer science, and mathematics.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Folio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Folio — Biology, CS, and Math",
    description:
      "A human-curated magazine at the intersection of biology, computer science, and mathematics.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="The Folio — RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className={`${inter.variable} ${sourceSerif.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-6 sm:pt-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
