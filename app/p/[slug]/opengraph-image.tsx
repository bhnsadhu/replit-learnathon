import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { event } from "@/data/event";
import { ogFonts } from "@/lib/og";
import { projectBySlug, projects } from "@/lib/projects";

export const alt = `A build from the Disruption Lab × Replit Learnathon at ${event.school}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const p = projectBySlug((await params).slug)!;
  const shot = p.screenshot
    ? `data:image/png;base64,${(await readFile(path.join(process.cwd(), "public", p.screenshot))).toString("base64")}`
    : null;
  // the title gets the whole width when there's no screenshot to sit beside
  const titleSize = (p.title.length > 16 ? 64 : 88) * (shot ? 1 : 1.4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#13294b",
          color: "#eef1f5",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#ff5f05",
            color: "#0b1a30",
            borderBottom: "6px solid #0b1a30",
            padding: "14px 56px",
            fontFamily: "Geist Mono",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          BUILT WITH REPLIT | {event.school} LEARNATHON | NOV 2026
        </div>
        <div style={{ display: "flex", flex: 1, padding: "48px 56px", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            {p.award && (
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  background: "#ff5f05",
                  color: "#0b1a30",
                  border: "3px solid #0b1a30",
                  padding: "6px 14px",
                  marginBottom: 24,
                  fontFamily: "Geist Mono",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                WINNER | {p.award.toUpperCase()}
              </div>
            )}
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: -titleSize * 0.05,
                textTransform: "uppercase",
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontFamily: "Geist Mono",
                fontSize: 24,
                lineHeight: 1.35,
                color: "#eef1f5cc",
              }}
            >
              {p.description}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "auto",
                fontFamily: "Geist Mono",
                fontSize: 26,
                fontWeight: 700,
                color: "#ff5f05",
              }}
            >
              BY {p.creator.name.toUpperCase()}
            </div>
          </div>
          {shot && (
            <div
              style={{
                display: "flex",
                width: 520,
                height: 325,
                alignSelf: "center",
                border: "5px solid #0b1a30",
                boxShadow: "12px 12px 0 #ff5f05",
                overflow: "hidden",
              }}
            >
              <img src={shot} width={520} height={325} style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
