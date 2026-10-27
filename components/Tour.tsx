"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import { CopyLink } from "./CopyLink";
import { buildLabel } from "./ProjectCard";

const SECONDS = 8;

/**
 * One build at a time, auto-advancing. Made for a projector at demos and awards.
 * The progress bar's CSS animation is the timer: pausing it pauses the tour, and its end advances it.
 */
export function Tour({
  projects,
  index,
  onIndex,
  buildIndex,
}: {
  projects: Project[];
  index: number;
  onIndex: (i: number) => void;
  /** Position on the full wall, so BUILD_07 stays BUILD_07 while searching */
  buildIndex: Map<string, number>;
}) {
  const [playing, setPlaying] = useState(true);
  const n = projects.length;
  const p = projects[index];
  const go = (i: number) => onIndex((i + n) % n);

  // reduced-motion users get a manual slideshow (and the global rule kills the timer animation anyway)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="tour" aria-roledescription="carousel" aria-label="Project tour">
      <div className="tourStage" key={p.slug} aria-live={playing ? "off" : "polite"}>
        <a
          className="screen tourScreen"
          href={p.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${p.title}`}
        >
          {p.screenshot ? (
            <img src={p.screenshot} alt={`Screenshot of ${p.title}`} />
          ) : (
            <div className="screenFallback" aria-hidden="true">
              {p.title}
            </div>
          )}
        </a>
        <div className="tourInfo">
          <p className="tourMeta">
            {buildLabel(buildIndex.get(p.slug) ?? index)}
            <span>
              {" "}
              · {index + 1} OF {n}
            </span>
          </p>
          {p.award && <span className="tourAward">🏆 {p.award.toUpperCase()}</span>}
          <h2>{p.title}</h2>
          <p className="tourDesc">{p.description}</p>
          <p className="tourBy">
            BY{" "}
            {p.creator.linkedin ? (
              <a href={p.creator.linkedin} target="_blank" rel="noreferrer">
                {p.creator.name} <b>in ↗</b>
              </a>
            ) : (
              p.creator.name
            )}
          </p>
          <div className="tourActions">
            <a className="cta" href={p.url} target="_blank" rel="noreferrer">
              <span>RUN</span>
              LAUNCH PROJECT
              <b>↗</b>
            </a>
            <CopyLink slug={p.slug} className="ctaGhost" />
          </div>
        </div>
      </div>

      <div className="tourControls">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous build">
          ←
        </button>
        <button
          type="button"
          className="tourPlay"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause tour" : "Play tour"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next build">
          →
        </button>
        <div className="tourProgress" aria-hidden="true">
          <i
            key={p.slug}
            style={{ animationDuration: `${SECONDS}s`, animationPlayState: playing ? "running" : "paused" }}
            onAnimationEnd={() => go(index + 1)}
          />
        </div>
        <span className="tourStatus">{playing ? `TOURING · ${SECONDS}S EACH` : "PAUSED · ← → TO BROWSE"}</span>
      </div>

      {n > 1 && (
        <div className="tourDots">
          {projects.map((q, i) => (
            <button
              key={q.slug}
              type="button"
              aria-label={`Go to ${q.title}`}
              aria-current={i === index || undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
