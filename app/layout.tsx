import type { Metadata } from "next";
import localFont from "next/font/local";
import { event } from "@/data/event";
import { projects } from "@/lib/projects";
import "./globals.css";

const SITE = event.siteUrl;
const live = projects.length > 0;

// Headline font, same one the link-preview image uses
const display = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Black.woff2",
  weight: "900",
  variable: "--font-display",
  display: "swap",
});

// Text font: same family as the headline, so the heavy titles read as one system with it
const sans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

// Terminal font. The system `monospace` centers narrow glyphs like "i" in their cell,
// so wrapped lines starting with one sit visibly off the left edge; Geist Mono's slab "i" doesn't.
const mono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-mono",
  display: "swap",
});

// Before the event the link gets texted around to hype it; after, it shows off the builds.
// Shared text uses | as the separator (no dashes).
const title = live
  ? `Built with Replit | ${projects.length} builds from the ${event.school} Learnathon`
  : `${event.name} | Nov 7 @ ${event.school}`;
const description = live
  ? `${projects.length} live apps built at the ${event.name} at ${event.school}. Click through and try them.`
  : `Free build day, no coding experience needed | Sat Nov 7, 12 to 2:45 PM | ${event.location} | Every app built lands on the wall.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: SITE,
    siteName: `${event.school} Learnathon`,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
