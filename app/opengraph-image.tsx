import { ImageResponse } from "next/og";
import { event } from "@/data/event";
import { ogFonts } from "@/lib/og";
import { projects } from "@/lib/projects";

export const alt = `Built with Replit | Disruption Lab × Replit Learnathon at ${event.school}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const count = projects.length;

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
            // 62 not 64: Geist Mono's B has a 2px side-bearing
            padding: "14px 64px 14px 62px",
            fontFamily: "Geist Mono",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          BUILT TO LEARN | BUILT TO SHARE | BUILT WITH REPLIT
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "48px 64px", flex: 1 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                display: "flex",
                background: "#0b1a30",
                color: "#eef1f5",
                boxShadow: "6px 6px 0 #ff5f05",
                padding: "10px 18px",
                fontFamily: "Geist Mono",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              DISRUPTION LAB × REPLIT LEARNATHON
            </div>
            {count === 0 && (
              <div
                style={{
                  display: "flex",
                  background: "#ff5f05",
                  color: "#0b1a30",
                  border: "3px solid #0b1a30",
                  padding: "7px 16px",
                  fontFamily: "Geist Mono",
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                FREE | NO EXPERIENCE NEEDED
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 150,
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: -10,
              marginTop: 40,
              // cancel Geist's left side-bearing (0.062em) so the ink lines up with the chips
              marginLeft: -9,
            }}
          >
            <span>BUILT WITH</span>
            {/* REPLIT's L→I pulled together like the site headline (Geist side-bearing at 150px) */}
            <div style={{ display: "flex", color: "#ff5f05", textShadow: "8px 8px 0 #0b1a30" }}>
              <span>REP</span>
              <span style={{ marginRight: -6 }}>L</span>
              <span>IT</span>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: "auto", marginLeft: -2, fontSize: 32, fontWeight: 800 }}>
            {count > 0
              ? `${count} live builds | ${event.school} | Nov 2026`
              : `Build day | Nov 7 2026 | CIF Monumental Steps, ${event.school}`}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
