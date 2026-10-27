import { readFile } from "node:fs/promises";
import path from "node:path";

const FONTS = path.join(process.cwd(), "node_modules/geist/dist/fonts");

/** Fonts for next/og images: Geist Black for headlines, Geist Mono Bold for labels. */
export async function ogFonts() {
  const [black, mono] = await Promise.all([
    readFile(path.join(FONTS, "geist-sans/Geist-Black.ttf")),
    readFile(path.join(FONTS, "geist-mono/GeistMono-Bold.ttf")),
  ]);
  return [
    { name: "Geist", data: black, weight: 900 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 700 as const, style: "normal" as const },
  ];
}
